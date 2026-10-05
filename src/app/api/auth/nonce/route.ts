import { NextResponse } from "next/server";
import { newNonce, siweMessage } from "@/intern/session";
import { bad, publicOrigin } from "@/intern/http";
import * as store from "@/intern/store";

export async function POST(req: Request) {
  const { address } = (await req.json().catch(() => ({}))) as { address?: string };
  if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) return bad("address required");
  const nonce = newNonce();
  const u = publicOrigin(req);
  const message = siweMessage({ domain: u.host, uri: u.origin, address, nonce, issuedAt: new Date().toISOString() });
  await store.saveNonce(nonce, address, message);
  return NextResponse.json({ nonce, message });
}
