import { NextResponse } from "next/server";
import { bad, ownerFrom } from "@/intern/http";
import { extractAnswer, listSubmissions } from "@/intern/hunt";
import { grantOf } from "@/intern/hunt-grants";
import * as store from "@/intern/store";

export const dynamic = "force-dynamic";

/** Your finished runs that carry an ANSWER line, newest first, with whether each is anchored and already entered. */
export async function GET(req: Request) {
  const owner = ownerFrom(req);
  if (!owner) return bad("sign in with your wallet first", 401);
  const entered = new Set((await listSubmissions()).filter((s) => s.owner === owner).map((s) => s.runId));
  const out: Array<{ runId: string; internId: string; intern: string; at: number; answer: string; anchored: boolean; txHash: string | null; entered: boolean }> = [];
  for (const m of await store.listInterns(owner)) {
    for (const r of await store.listRuns(m.id, 30)) {
      if (r.status !== "done") continue;
      const answer = extractAnswer(r);
      if (!answer) continue;
      out.push({ runId: r.id, internId: m.id, intern: m.spec.name, at: r.at, answer, anchored: !!r.txHash, txHash: r.txHash, entered: entered.has(r.id) });
    }
  }
  out.sort((a, b) => b.at - a.at);
  const grant = await grantOf(owner);
  return NextResponse.json({ runs: out.slice(0, 20), grant });
}
