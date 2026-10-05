import { NextResponse } from "next/server";
import { bad, ownerFrom } from "@/intern/http";
import * as store from "@/intern/store";
import { MAX_AUDIO_BYTES, transcribe } from "@/intern/transcribe";

/** Owner sends a voice note for this intern's composer; the words come back as text, billed to the intern's key. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const owner = ownerFrom(req, { write: true });
  if (!owner) return bad("sign in with your wallet first", 401);
  const { id } = await params;
  const m = await store.getIntern(id);
  if (!m || m.owner !== owner) return bad("not found", 404);
  const key = m.key?.key ?? (await store.listInterns(owner)).find((x) => x.key?.key)?.key?.key ?? process.env.COMPILE_API_KEY;
  if (!key) return bad(`${m.name} hasn't claimed a key yet; voice notes work after its first run`, 409);
  const mime = req.headers.get("content-type") ?? "";
  const bytes = new Uint8Array(await req.arrayBuffer());
  if (!bytes.byteLength) return bad("no audio");
  if (bytes.byteLength > MAX_AUDIO_BYTES) return bad("recording too long; keep it under a minute", 413);
  try {
    return NextResponse.json(await transcribe(key, { bytes, mime }));
  } catch (e) {
    return bad((e as Error).message.slice(0, 200));
  }
}
