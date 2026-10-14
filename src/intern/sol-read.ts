/**
 * Read Solana straight from the RPC for the agents' chain_read tool: token info, a wallet's balance of a token, the largest
 * recent transfers of a token, and a wallet's recent activity. Read-only, bounded (a few dozen transactions per call).
 */
const RPC = () => process.env.RPC_URL || process.env.NEXT_PUBLIC_RPC_URL || "https://api.mainnet-beta.solana.com";

async function rpc<T>(f: typeof fetch, method: string, params: unknown[]): Promise<T> {
  let last = "";
  for (const wait of [0, 700, 1500, 3000]) {
    if (wait) await new Promise((r) => setTimeout(r, wait));
    const r = await f(RPC(), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }), signal: AbortSignal.timeout(12000) });
    const j = (await r.json().catch(() => ({ error: { message: `HTTP ${r.status}` } }))) as { result?: T; error?: { message?: string } };
    if (!j.error) return j.result as T;
    last = j.error.message ?? "rpc error";
    if (!/429|Too Many|timeout|HTTP 5/i.test(last)) break;
  }
  throw new Error(last);
}

type Parsed = { meta?: { err?: unknown; preTokenBalances?: Bal[]; postTokenBalances?: Bal[]; preBalances?: number[]; postBalances?: number[] }; transaction?: { message?: { accountKeys?: Array<{ pubkey: string } | string> } }; blockTime?: number };
type Bal = { accountIndex: number; mint: string; owner?: string; uiTokenAmount: { uiAmount: number | null; decimals: number } };

async function txs(f: typeof fetch, address: string, limit: number) {
  const sigs = await rpc<Array<{ signature: string; err: unknown; blockTime?: number }>>(f, "getSignaturesForAddress", [address, { limit }]);
  const out: Array<{ sig: string; t: Parsed }> = [];
  for (const s of sigs.filter((x) => !x.err).slice(0, limit)) {
    const t = await rpc<Parsed | null>(f, "getTransaction", [s.signature, { encoding: "jsonParsed", maxSupportedTransactionVersion: 0 }]).catch(() => null);
    if (t) out.push({ sig: s.signature, t });
  }
  return out;
}

/** Per-owner change of `mint` in one transaction (post − pre), from the token balance records. */
function deltas(t: Parsed, mint?: string) {
  const m = new Map<string, { mint: string; owner: string; delta: number }>();
  const key = (b: Bal) => `${b.owner}:${b.mint}`;
  for (const b of t.meta?.preTokenBalances ?? []) if (!mint || b.mint === mint) m.set(key(b), { mint: b.mint, owner: b.owner ?? "", delta: -(b.uiTokenAmount.uiAmount ?? 0) });
  for (const b of t.meta?.postTokenBalances ?? []) if (!mint || b.mint === mint) {
    const x = m.get(key(b)) ?? { mint: b.mint, owner: b.owner ?? "", delta: 0 };
    x.delta += b.uiTokenAmount.uiAmount ?? 0;
    m.set(key(b), x);
  }
  return [...m.values()].filter((x) => Math.abs(x.delta) > 0);
}

export async function solChainRead(f: typeof fetch, a: { action: string; token?: string; wallet?: string; limit?: number }) {
  const lim = Math.min(a.limit ?? 15, 25);
  if (a.action === "wallet_activity") {
    if (!a.wallet) return { error: "wallet required" };
    const [bal, list] = await Promise.all([rpc<{ value: number }>(f, "getBalance", [a.wallet]), txs(f, a.wallet, lim)]);
    const moves = list.flatMap(({ sig, t }) => deltas(t).filter((d) => d.owner === a.wallet).map((d) => ({ tx: sig, mint: d.mint, change: d.delta, at: t.blockTime ? new Date(t.blockTime * 1000).toISOString() : null })));
    return { wallet: a.wallet, solBalance: bal.value / 1e9, transactionsScanned: list.length, tokenMoves: moves.slice(0, lim * 2), note: "Covers the wallet's most recent transactions; remember the newest tx and report only what is new next run." };
  }
  if (!a.token) return { error: "token required" };
  if (a.action === "balance_of") {
    if (!a.wallet) return { error: "wallet required" };
    const r = await rpc<{ value: Array<{ account: { data: { parsed: { info: { tokenAmount: { uiAmount: number } } } } } }> }>(f, "getTokenAccountsByOwner", [a.wallet, { mint: a.token }, { encoding: "jsonParsed" }]);
    return { wallet: a.wallet, token: a.token, balance: r.value.reduce((s, v) => s + (v.account.data.parsed.info.tokenAmount.uiAmount ?? 0), 0) };
  }
  if (a.action === "token_info") {
    const r = await rpc<{ value: { owner: string; data: { parsed?: { info: { supply: string; decimals: number; mintAuthority?: string | null; freezeAuthority?: string | null } } } } | null }>(f, "getAccountInfo", [a.token, { encoding: "jsonParsed" }]);
    const info = r.value?.data.parsed?.info;
    if (!info) return { error: "not a token mint" };
    return { token: a.token, decimals: info.decimals, totalSupply: Number(info.supply) / 10 ** info.decimals, mintAuthority: info.mintAuthority ?? null, freezeAuthority: info.freezeAuthority ?? null, program: r.value?.owner };
  }
  // token_transfers: the largest balance changes of this token over its most recent transactions.
  const list = await txs(f, a.token, lim);
  const moves = list.flatMap(({ sig, t }) => deltas(t, a.token).map((d) => ({ tx: sig, owner: d.owner, change: d.delta, at: t.blockTime ? new Date(t.blockTime * 1000).toISOString() : null })));
  moves.sort((x, y) => Math.abs(y.change) - Math.abs(x.change));
  return { token: a.token, transactionsScanned: list.length, largest: moves.slice(0, lim) };
}
