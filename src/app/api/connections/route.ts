import { NextResponse } from "next/server";
import { bad, ownerFrom } from "@/intern/http";
import * as store from "@/intern/store";
import { botUsername, telegramConfigured } from "@/intern/connections/telegram";
import { githubOAuthConfigured } from "@/intern/connections/github";
import { gmailOAuthConfigured } from "@/intern/connections/gmail";

/** What this wallet has connected, and what the platform supports. */
export async function GET(req: Request) {
  const owner = ownerFrom(req);
  if (!owner) return bad("sign in with your wallet first", 401);
  const list = await store.listConnections(owner);
  return NextResponse.json({
    connections: list,
    available: { telegram: telegramConfigured(), telegramBot: botUsername(), github: true, githubOAuth: githubOAuthConfigured(), x: true, discord: true, gmailOAuth: gmailOAuthConfigured() },
  });
}

export async function DELETE(req: Request) {
  const owner = ownerFrom(req, { write: true });
  if (!owner) return bad("sign in with your wallet first", 401);
  const { kind } = (await req.json().catch(() => ({}))) as { kind?: store.ConnectionKind };
  if (!kind || !["telegram", "github", "x", "discord", "gmail"].includes(kind)) return bad("kind required");
  await store.deleteConnection(owner, kind);
  return NextResponse.json({ ok: true });
}
