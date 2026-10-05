import { NextResponse } from "next/server";
export const maxDuration = 300;
import { z } from "zod";
import { bad, ownerFrom } from "@/intern/http";
import { launchIntern } from "@/intern/launch";
import { JobSpec } from "@/intern/spec";
import * as store from "@/intern/store";

export async function GET(req: Request) {
  const owner = ownerFrom(req);
  if (!owner) return bad("sign in with your wallet first", 401);
  const rows = await store.listInterns(owner);
  return NextResponse.json({ interns: rows.map(publicIntern) });
}

const Launch = z.object({
  spec: JobSpec,
  delivery: z.object({ telegram: z.string().max(64).optional(), x: z.string().max(64).optional() }).default({}),
  autopilot: z.boolean().default(false),
  runNow: z.boolean().default(true),
});

/** Launch. Plans against the live bag, stores, and (by default) fires the first run immediately. */
export async function POST(req: Request) {
  const owner = ownerFrom(req, { write: true });
  if (!owner) return bad("sign in with your wallet first", 401);
  const body = Launch.safeParse(await req.json().catch(() => null));
  if (!body.success) return bad(body.error.message);
  const { spec, delivery, autopilot, runNow } = body.data;

  const r = await launchIntern(owner, spec, { autopilot, runNow, delivery });
  if (!r.ok) return bad(r.error);
  return NextResponse.json({ intern: publicIntern(r.intern), plan: r.plan, firstRunStarted: r.firstRunStarted, familyNote: r.familyNote }, { status: 201 });
}

export function publicIntern(m: store.InternRow) {
  return {
    id: m.id,
    owner: m.owner,
    name: m.name,
    spec: m.spec,
    status: m.status,
    delivery: m.delivery,
    autopilot: m.autopilot,
    cadence: m.spec.cadence,
    perRunCapUsd: m.perRunCapUsd,
    earnPerDayUsd: m.earnPerDayUsd,
    burnPerDayUsd: m.burnPerDayUsd,
    keyLimitUsd: m.key?.limitUsd ?? 0,
    keySpentUsd: m.key?.spentUsd ?? 0,
    keyRemainingUsd: m.key ? Math.max(0, m.key.limitUsd - m.key.spentUsd) : 0,
    nextRunAt: m.nextRunAt,
    lastRunAt: m.lastRunAt,
    createdAt: m.createdAt,
    parentId: m.parentId,
    keysRotated: m.keysRotated,
    runsTotal: m.runsTotal,
    runsFailed: m.runsFailed,
    spentTotalUsd: m.spentTotalUsd,
    openCalls: m.openCalls,
    avatar: m.avatar,
    hits: m.hits,
    misses: m.misses,
  };
}
