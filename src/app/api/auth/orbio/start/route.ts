import { NextResponse } from "next/server";
import { beginLogin, oauthConfig } from "@/intern/orbio-oauth";
import { bad } from "@/intern/http";

/** Send the person to Orbio's consent screen (email, Google or wallet). */
export async function GET(req: Request) {
  const c = oauthConfig();
  if (!c) return bad("Sign in with Orbio isn't configured", 503);
  const next = new URL(req.url).searchParams.get("next");
  return NextResponse.redirect(await beginLogin(c, next ?? "/app"));
}
