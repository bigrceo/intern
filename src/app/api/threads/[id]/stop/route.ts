import { NextResponse } from "next/server";
import * as ts from "@/intern/threads-store";
import { ownThread } from "@/intern/threads-http";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const r = await ownThread(req, (await params).id);
  if ("error" in r) return r.error;
  if (r.t.status === "working") await ts.updateThread(r.t.id, { status: "stopping" });
  return NextResponse.json({ ok: true });
}
