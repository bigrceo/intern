import { NextResponse } from "next/server";
import { bad, ownerFrom } from "@/intern/http";
import { burnsOf, creditBurn, isSolOwner } from "@/intern/solana";
import * as store from "@/intern/store";

export const maxDuration = 60;

/** POST { sig }: credit a burn of $INTERN made by the signed-in wallet. GET: this wallet's burns. */
export async function POST(req: Request) {
  const owner = ownerFrom(req, { write: true });
  if (!owner) return bad("sign in with your wallet first", 401);
  if (!isSolOwner(owner)) return bad("burns are for Solana wallets");
  const { sig } = (await req.json().catch(() => ({}))) as { sig?: string };
  try {
    const r = await creditBurn(owner, String(sig ?? ""));
    if (r.creditUsd > 0) await store.wakeQuietInterns(owner).catch(() => undefined);
    return NextResponse.json(r);
  } catch (e) {
    return bad((e as Error).message);
  }
}

export async function GET(req: Request) {
  const owner = ownerFrom(req);
  if (!owner) return bad("sign in first", 401);
  return NextResponse.json({ burns: await burnsOf(owner) });
}
