import { NextResponse } from "next/server";
import { bad, ownerFrom } from "@/intern/http";
import * as store from "@/intern/store";

/** Owner only: every file this intern has written, newest first. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const owner = ownerFrom(req);
  if (!owner) return bad("sign in with your wallet first", 401);
  const { id } = await params;
  const m = await store.getIntern(id);
  if (!m || m.owner !== owner) return bad("not found", 404);
  const files = await store.filesForIntern(id);
  return NextResponse.json({ files: files.map((f) => ({ id: f.id, name: f.name, mime: f.mime, size: f.size, createdAt: f.createdAt, runId: f.runId, runTitle: f.runTitle, url: `/api/files/${f.id}` })) });
}
