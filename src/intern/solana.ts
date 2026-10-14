import { Connection, PublicKey } from "@solana/web3.js";
import * as store from "./store";
import { trialConfig, trialOf } from "./trial";

/**
 * Solana side of Intern. Paying for AI: burn $INTERN from your own wallet; the burn is read back from the chain (once per
 * transaction), valued at the token's market price at that moment, and added to the account's AI credit. Runs are then
 * billed to the platform's model key and metered per account, the same ledger the free trial uses (`trials` table), with
 * no expiry. Accounts are wallet addresses, lowercased like every owner id in the store.
 */

export const SOL = {
  rpc: process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com",
  mint: process.env.NEXT_PUBLIC_TOKEN_ADDRESS || "",
  explorerTx: (sig: string) => `https://solscan.io/tx/${sig}`,
  explorerAccount: (a: string) => `https://solscan.io/account/${a}`,
};

let conn: Connection | null = null;
export const solConn = () => (conn ??= new Connection(SOL.rpc, "confirmed"));

export const isSolOwner = (owner: string) => /^[1-9a-z]{32,44}$/.test(owner) && !owner.startsWith("orbio-");
const isSig = (s: string) => /^[1-9A-HJ-NP-Za-km-z]{64,90}$/.test(s);

/** Whole tokens of `mint` that `ownerLower` burned (burn / burnChecked, as the authority) in transaction `sig`. */
export async function burnedIn(sig: string, ownerLower: string, mint: string, c = solConn()) {
  let t = null;
  for (let i = 0; i < 10 && !t; i++) {
    t = await c.getParsedTransaction(sig, { maxSupportedTransactionVersion: 0, commitment: "confirmed" });
    if (!t) await new Promise((r) => setTimeout(r, 2500));
  }
  if (!t || t.meta?.err) return 0;
  const decimals = [...(t.meta?.preTokenBalances ?? []), ...(t.meta?.postTokenBalances ?? [])].find((b) => b.mint === mint)?.uiTokenAmount.decimals ?? 6;
  const ixs = [...t.transaction.message.instructions, ...(t.meta?.innerInstructions ?? []).flatMap((x) => x.instructions)];
  let raw = 0n;
  for (const ix of ixs as Array<{ program?: string; parsed?: { type: string; info: Record<string, unknown> } }>) {
    if (!String(ix.program).startsWith("spl-token") || !ix.parsed) continue;
    const { type, info } = ix.parsed;
    if ((type !== "burn" && type !== "burnChecked") || info.mint !== mint) continue;
    const auth = String(info.authority ?? info.multisigAuthority ?? "");
    if (auth.toLowerCase() !== ownerLower) continue;
    const amt = (info.amount ?? (info.tokenAmount as { amount?: string } | undefined)?.amount ?? 0) as string | number;
    raw += BigInt(amt);
  }
  return Number(raw) / 10 ** decimals;
}

/** USD price of a token from DexScreener (deepest Solana pair). */
export async function priceUsd(mint: string, f: typeof fetch = fetch): Promise<number> {
  const r = await f(`https://api.dexscreener.com/latest/dex/tokens/${mint}`, { signal: AbortSignal.timeout(8000) });
  const j = (await r.json()) as { pairs?: Array<{ chainId: string; priceUsd?: string; liquidity?: { usd?: number } }> };
  const p = (j.pairs ?? []).filter((x) => x.chainId === "solana" && Number(x.priceUsd) > 0).sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
  return p ? Number(p.priceUsd) : 0;
}

async function ensureTables() {
  await trialOf("_").catch(() => null); // creates `trials`
  await store.db().execute(`CREATE TABLE IF NOT EXISTS burns (sig TEXT PRIMARY KEY, owner TEXT NOT NULL, tokens REAL NOT NULL, price_usd REAL NOT NULL, credit_usd REAL NOT NULL, at INTEGER NOT NULL)`);
}

const FOREVER = 100 * 365 * 86_400_000;

/**
 * Credit a burn once. Returns the credit added (0 if already counted, not a burn of the token by this wallet, or unpriced).
 * The `burns` row is the claim: a second call with the same signature finds it and adds nothing.
 */
export async function creditBurn(owner: string, sig: string, opts: { fetch?: typeof fetch; conn?: Connection } = {}) {
  if (!SOL.mint) throw new Error("the token isn't live yet");
  if (!isSig(sig)) throw new Error("that isn't a Solana transaction signature");
  await ensureTables();
  const o = owner.toLowerCase();
  const seen = await store.db().execute({ sql: `SELECT owner, credit_usd FROM burns WHERE sig=?`, args: [sig] });
  if (seen.rows[0]) return { creditUsd: 0, already: true, tokens: 0 };
  const tokens = await burnedIn(sig, o, SOL.mint, opts.conn);
  if (!(tokens > 0)) throw new Error("no burn of the token by this wallet in that transaction");
  const price = await priceUsd(SOL.mint, opts.fetch);
  if (!(price > 0)) throw new Error("no market price for the token yet; try again in a minute");
  const credit = Math.round(tokens * price * 1e6) / 1e6;
  const ins = await store.db().execute({ sql: `INSERT INTO burns(sig,owner,tokens,price_usd,credit_usd,at) VALUES(?,?,?,?,?,?) ON CONFLICT DO NOTHING`, args: [sig, o, tokens, price, credit, Date.now()] });
  if (ins.rowsAffected !== 1) return { creditUsd: 0, already: true, tokens };
  const now = Date.now();
  const up = await store.db().execute({ sql: `UPDATE trials SET credit_usd = credit_usd + ?, expires_at = ? WHERE owner=?`, args: [credit, now + FOREVER, o] });
  if (up.rowsAffected !== 1) {
    await store.db().execute({ sql: `INSERT INTO trials(owner,granted_at,expires_at,credit_usd,spent_usd,device,ip_hash) VALUES(?,?,?,?,0,?,NULL) ON CONFLICT DO NOTHING`, args: [o, now, now + FOREVER, credit, `burn:${sig}`] });
  }
  await store.upsertOwner(o);
  return { creditUsd: credit, already: false, tokens, priceUsd: price };
}

export async function burnsOf(owner: string) {
  await ensureTables();
  const r = await store.db().execute({ sql: `SELECT sig, tokens, credit_usd, at FROM burns WHERE owner=? ORDER BY at DESC LIMIT 20`, args: [owner.toLowerCase()] });
  return r.rows.map((x) => ({ sig: String(x.sig), tokens: Number(x.tokens), creditUsd: Number(x.credit_usd), at: Number(x.at), url: SOL.explorerTx(String(x.sig)) }));
}

/** Is the platform model key configured, so burn credit can actually pay for runs? */
export const solBillingReady = () => !!trialConfig().key;
