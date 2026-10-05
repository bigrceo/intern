import { NextResponse } from "next/server";
import * as ts from "@/intern/threads-store";
import { ownThread } from "@/intern/threads-http";
import { regenerateTitle } from "@/intern/thread-agent";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const r = await ownThread(req, (await params).id);
  if ("error" in r) return r.error;
  await regenerateTitle(r.t.id);
  return NextResponse.json({ title: (await ts.getThread(r.t.id))?.title });
}
