import { NextResponse } from "next/server";
import { isSolAddress, newNonce, siweMessage, solMessage } from "@/intern/session";
import { bad, publicOrigin } from "@/intern/http";
import * as store from "@/intern/store";

export async function POST(req: Request) {
  const { address } = (await req.json().catch(() => ({}))) as { address?: string };
  const sol = isSolAddress(address);
  if (!address || (!sol && !/^0x[0-9a-fA-F]{40}$/.test(address))) return bad("address required");
  const nonce = newNonce();
  const u = publicOrigin(req);
  const issuedAt = new Date().toISOString();
  const message = sol ? solMessage({ domain: u.host, address, nonce, issuedAt }) : siweMessage({ domain: u.host, uri: u.origin, address, nonce, issuedAt });
  await store.saveNonce(nonce, address, message);
  return NextResponse.json({ nonce, message });
}
