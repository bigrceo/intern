import { NextResponse } from "next/server";
import { bad, ownerFrom } from "@/intern/http";
import * as store from "@/intern/store";
import { describe } from "@/intern/proposals";

export async function GET(req: Request) {
  const owner = ownerFrom(req);
  if (!owner) return bad("sign in with your wallet first", 401);
  const status = new URL(req.url).searchParams.get("status") as store.ProposalStatus | null;
  const rows = await store.listProposals(owner, status ?? undefined);
  return NextResponse.json({ proposals: rows.map((p) => ({ ...p, ...describe(p.kind, p.payload) })) });
}
