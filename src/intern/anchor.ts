import { createPublicClient, createWalletClient, decodeAbiParameters, defineChain, encodeAbiParameters, http, keccak256, stringToHex, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { RH_RPC } from "./tools";

/**
 * Anchoring. Every completed run becomes a zero-value transaction on
 * Robinhood Chain whose calldata is abi(internId, runId, outputHash, costMicroUsd, timestamp).
 * Anyone can decode it from the explorer. Gas is ~$0.03; we pay it from a
 * platform wallet so holders never need ETH.
 *
 * The recipient is a fixed "anchor" address with no code; sending calldata to
 * an EOA is the cheapest way to leave a permanent, indexable record.
 */

export const robinhoodChain = defineChain({
  id: 4663,
  name: "Robinhood Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [RH_RPC] } },
  blockExplorers: { default: { name: "Blockscout", url: "https://robinhoodchain.blockscout.com" } },
});

/** keccak("intern.anchor.v1") truncated to an address. Deterministic, code-free, recognisable. */
export const ANCHOR_TO = `0x${keccak256(stringToHex("intern.anchor.v1")).slice(26)}` as Hex;

export type AnchorPayload = { internId: string; runId: string; outputHash: Hex; costUsd: number; at: number };

const ANCHOR_ABI = [
  { type: "string" },
  { type: "string" },
  { type: "bytes32" },
  { type: "uint64" },
  { type: "uint64" },
] as const;

export function encodeAnchor(p: AnchorPayload): Hex {
  return encodeAbiParameters(ANCHOR_ABI, [
    p.internId,
    p.runId,
    p.outputHash,
    BigInt(Math.round(p.costUsd * 1_000_000)),
    BigInt(Math.floor(p.at / 1000)),
  ]);
}

export function decodeAnchor(data: Hex): AnchorPayload {
  const [internId, runId, outputHash, costMicro, at] = decodeAbiParameters(ANCHOR_ABI, data);
  return { internId, runId, outputHash, costUsd: Number(costMicro) / 1_000_000, at: Number(at) * 1000 };
}

export type Anchorer = (p: AnchorPayload) => Promise<{ txHash: Hex }>;

export function makeAnchorer(privateKey?: Hex): Anchorer | null {
  if (!privateKey && process.env.SOLANA_ANCHOR_SECRET) return makeSolanaAnchorer(process.env.SOLANA_ANCHOR_SECRET);
  const pk = privateKey ?? (process.env.ANCHOR_PRIVATE_KEY as Hex | undefined);
  if (!pk) return null;
  const account = privateKeyToAccount(pk);
  const wallet = createWalletClient({ account, chain: robinhoodChain, transport: http(RH_RPC) });
  const pub = createPublicClient({ chain: robinhoodChain, transport: http(RH_RPC) });
  return async (p) => {
    const txHash = await wallet.sendTransaction({ to: ANCHOR_TO, value: BigInt(0), data: encodeAnchor(p) });
    // A hash alone is only "submitted". The run is recorded as anchored only once the chain confirms it; otherwise the next
    // tick's anchorPending() sends it again.
    const receipt = await pub.waitForTransactionReceipt({ hash: txHash, timeout: 90_000 });
    if (receipt.status !== "success") throw new Error(`anchor tx ${txHash} reverted`);
    return { txHash };
  };
}

export const explorerTx = (hash: string) => (/^0x/.test(hash) ? `https://robinhoodchain.blockscout.com/tx/${hash}` : `https://solscan.io/tx/${hash}`);

/**
 * Solana receipts: a Memo program transaction from the receipts wallet whose memo is
 * `intern:v1:<internId>:<runId>:<sha256>:<costMicroUsd>:<unixSeconds>`, readable on any explorer. The memo is the receipt;
 * nothing else moves. SOLANA_ANCHOR_SECRET is the wallet's secret key (base58 or a JSON byte array).
 */
const MEMO_PROGRAM = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
export const solanaMemo = (p: AnchorPayload) => `intern:v1:${p.internId}:${p.runId}:${p.outputHash.replace(/^0x/, "")}:${Math.round(p.costUsd * 1e6)}:${Math.floor(p.at / 1000)}`;

export function makeSolanaAnchorer(secret: string): Anchorer {
  return async (p) => {
    const web3 = await import("@solana/web3.js");
    const bs58 = (await import("bs58")).default;
    const key = secret.trim().startsWith("[") ? Uint8Array.from(JSON.parse(secret)) : bs58.decode(secret.trim());
    const payer = web3.Keypair.fromSecretKey(key);
    const conn = new web3.Connection(process.env.RPC_URL || "https://api.mainnet-beta.solana.com", "confirmed");
    const ix = new web3.TransactionInstruction({ programId: new web3.PublicKey(MEMO_PROGRAM), keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: false }], data: Buffer.from(solanaMemo(p), "utf8") });
    const sig = await web3.sendAndConfirmTransaction(conn, new web3.Transaction().add(ix), [payer], { commitment: "confirmed" });
    return { txHash: sig as unknown as Hex };
  };
}
