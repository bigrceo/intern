import { NextResponse } from "next/server";

/**
 * The browser's Solana RPC: a narrow proxy to the server's paid RPC so its key never ships to the page. Only the reads a
 * burn needs (blockhash, account, token balances, signature status) pass; anything else is refused.
 */
const ALLOWED = new Set(["getLatestBlockhash", "getAccountInfo", "getTokenAccountsByOwner", "getSignatureStatuses", "getBlockHeight", "getMinimumBalanceForRentExemption", "getBalance", "isBlockhashValid"]);

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { method?: string } | Array<{ method?: string }> | null;
  const calls = Array.isArray(body) ? body : body ? [body] : [];
  if (!calls.length || calls.length > 5 || calls.some((c) => !c?.method || !ALLOWED.has(c.method))) return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: -32601, message: "method not allowed here" } }, { status: 400 });
  const r = await fetch(process.env.RPC_URL || "https://api.mainnet-beta.solana.com", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(15000) });
  return new NextResponse(await r.text(), { status: r.status, headers: { "content-type": "application/json" } });
}
