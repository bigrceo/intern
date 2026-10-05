import { NextResponse } from "next/server";
import { bad } from "@/intern/http";
import { readActivations } from "@/intern/orbio";
import * as store from "@/intern/store";

/**
 * Fuel: anyone can burn their own CREDIT into a intern's owner's AI balance with `activate(amount, beneficiary)`.
 * GET lists the fuel this intern's owner has received from other wallets. POST takes the transaction hash the giver's
 * wallet produced, reads the receipt from the chain, and credits the owner once per activation id. No session needed:
 * the chain's record is the authority, and only activations whose beneficiary is this intern's owner count.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await store.getIntern(id);
  if (!m || m.status === "deleted") return NextResponse.json({ fuel: [] });
  const fuel = (await store.listFuel(m.owner, 50)).filter((f) => !f.internId || f.internId === id);
  return NextResponse.json({ fuel: fuel.map((f) => ({ ...f, url: `https://robinhoodchain.blockscout.com/tx/${f.txHash}` })), totalUsd: fuel.reduce((a, f) => a + f.amountUsd, 0) });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await store.getIntern(id);
  if (!m || m.status === "deleted") return bad("no such intern", 404);
  const { txHash } = (await req.json().catch(() => ({}))) as { txHash?: string };
  if (!txHash || !/^0x[0-9a-fA-F]{64}$/.test(txHash)) return bad("txHash missing or malformed");
  let receipts;
  try {
    receipts = (await readActivations(txHash)).filter((r) => r.beneficiary === m.owner);
  } catch (e) {
    return bad((e as Error).message, 400);
  }
  if (!receipts.length) return NextResponse.json({ ok: false, error: "no activation for this intern's owner in that transaction yet" }, { status: 202 });
  let credited = 0;
  for (const r of receipts) if (await store.addActivation({ ...r, owner: m.owner, proposalId: id })) credited += r.amountUsd;
  if (credited > 0) await store.wakeQuietInterns(m.owner);
  return NextResponse.json({ ok: true, credited, total: receipts.reduce((a, r) => a + r.amountUsd, 0), from: receipts[0].from });
}
