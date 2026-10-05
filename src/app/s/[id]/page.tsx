import { marks } from "@/components/inline-marks";
import type { Metadata } from "next";
import { Face } from "@/components/logo";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Copy } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { PoweredBy, PublicMobileTabs } from "@/components/app-shell";
import { FuelGauge, StatusDot, fuelTone } from "@/components/fuel-gauge";
import { FuelButton } from "@/components/fuel-button";
import { MetricsStrip, RunCard } from "@/components/run-card";
import { Receipts } from "@/components/receipts";
import { CADENCE_LABEL, TEMPLATE_LABEL, TOOL_LABEL } from "@/components/labels";
import { explorerTx } from "@/intern/anchor";
import type { Cadence } from "@/intern/spec";
import * as store from "@/intern/store";
import { bagOf, stakedOf } from "@/intern/bag";
import { isPrivateSpec, redactIntern, redactRun } from "@/intern/privacy";
import { COOKIE, openSession } from "@/intern/session";
import { fmtBag, fmtUsd, shortAddr, shortenHexes, timeAgo, timeUntil } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/s/[id]">): Promise<Metadata> {
  const { id } = await params;
  const m = (await store.getIntern(id).then((x) => x && redactIntern(x)));
  return {
    title: m ? m.name : "Intern",
    description: m ? `“${m.spec.objective}” — running on ${shortAddr(m.owner)}'s bag, every run hashed and public.` : undefined,
  };
}

export default async function PublicInternPage({ params }: PageProps<"/s/[id]">) {
  const { id } = await params;
  const stored = await store.getIntern(id);
  if (!stored) notFound();
  // The owner sees their own inbox intern in full here; everyone else gets the receipts.
  const mine = openSession((await cookies()).get(COOKIE)?.value) === stored.owner;
  const hidden = !mine && isPrivateSpec(stored.spec);
  const m = hidden ? redactIntern(stored) : stored;
  const runs = (await store.listRuns(m.id)).map((r) => ({ ...(!mine && r.private ? redactRun(r) : r), explorerUrl: r.txHash ? explorerTx(r.txHash) : null }));
  const owner = await store.getOwner(m.owner);
  const bagNow = await bagOf(m.owner).catch(() => owner?.bag ?? 0);
  const quiet = m.status === "quiet" || m.status === "paused";
  const tone = fuelTone(m.earnPerDayUsd, m.burnPerDayUsd, quiet);
  const anchored = runs.filter((r) => r.txHash).length;
  const anchoring = !!process.env.ANCHOR_PRIVATE_KEY;
  const keyRemaining = m.key ? Math.max(0, m.key.limitUsd - m.key.spentUsd) : 0;
  // The feed shows what it did; failed and quiet runs count in the stats but are noise on a public page.
  const feed = runs.filter((r) => r.status === "done");
  const latest = feed.find((r) => !r.nothingHappened) ?? feed[0];
  const staked = await stakedOf(m.owner).catch(() => 0);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <PublicHeader />
      <main className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        <section className="haze card-shadow relative overflow-hidden rounded-card p-2 sm:p-3">
          <div className="relative rounded-[12px] bg-white/90 p-6 backdrop-blur sm:p-8">
          <div className="relative grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11.5px] text-ink-soft">
                <StatusDot tone={tone} pulse={m.status === "running"} />
                <span>{m.status === "running" ? "working right now" : m.status === "idle" ? `idle · next run ${timeUntil(m.nextRunAt)}` : m.status}</span>
                <span>·</span>
                <span>launched {timeAgo(m.createdAt)}</span>
              </div>
              <h1 className="mt-2 text-[44px] leading-[1] tracking-[-0.04em] text-ink sm:text-[56px]">{m.name}</h1>
              <p className="mt-3 max-w-[34rem] text-[18px] leading-[1.45] tracking-[-0.01em] text-ink [overflow-wrap:anywhere]">“{shortenHexes(m.spec.objective)}”</p>
              <p className="mt-3 font-mono text-[12px] text-ink-soft">
                {m.id} · {TEMPLATE_LABEL[m.spec.template]} · works for {shortAddr(m.owner)} · {owner ? marks(`${fmtBag(bagNow)} $ORBIO`, 12) : ""}
              </p>
              <p className="mt-1 font-mono text-[12px] text-ink-faint">tools: {m.spec.tools.map((t) => TOOL_LABEL[t]).join(", ")}</p>
              {latest && !hidden && (
                <div className="mt-4 rounded-[12px] bg-mint-2 px-4 py-3">
                  <p className="eyebrow !text-[10.5px] !text-pine">latest · {timeAgo(latest.at)}{latest.signal === "high" ? " · high signal" : ""}</p>
                  <p className="mt-1 text-[15px] font-semibold leading-[1.3] text-ink [overflow-wrap:anywhere]">{shortenHexes(latest.title)}</p>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-[1.55] text-ink-soft [overflow-wrap:anywhere]">{shortenHexes(latest.summary)}</p>
                  {(latest.metrics?.length ?? 0) > 0 && <div className="mt-3"><MetricsStrip metrics={latest.metrics!} /></div>}
                </div>
              )}
              {hidden && (
                <p className="mt-4 rounded-[12px] bg-mint-2 px-4 py-3 text-[13px] leading-[1.55] text-ink-soft">Private job: this intern works inside its owner&apos;s own accounts, so its reports stay with the owner. The receipts below are public: when it ran, what it cost, and the hash of what it wrote.</p>
              )}
              {!hidden && (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <Link href={`/app/new?fork=${m.id}`} className="btn-grad inline-flex h-11 items-center gap-2 rounded-btn px-5 text-[14px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(5,31,32,.6)] transition hover:brightness-110">
                    <Copy size={14} strokeWidth={2} /> Use this job for my bag
                  </Link>
                  <span className="text-[12px] text-ink-faint">Same checks and tools, on your own key.</span>
                </div>
              )}
            </div>
            <Face n={m.avatar} size={168} className={`pointer-events-none mx-auto h-[168px] w-[168px] select-none rounded-full shadow-[0_18px_40px_-20px_rgba(5,31,32,0.45)] ${m.status === "running" ? "animate-drift" : ""}`} />
          </div>
          </div>
        </section>

        <section className="mt-4 grid gap-3 lg:grid-cols-[auto_1fr]">
          <div className="rounded-card bg-white p-5 card-shadow">
            <FuelGauge earnPerDay={m.earnPerDayUsd} burnPerDay={m.burnPerDayUsd} balance={keyRemaining} quiet={quiet} size="lg" />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="runs" value={String(m.runsTotal)} hint={m.runsFailed ? `${m.runsFailed} failed` : "none failed"} />
            <Stat label={anchoring ? "anchored" : "hashed"} value={String(anchoring ? anchored : runs.filter((r) => r.outputHash).length)} hint={anchoring ? "Robinhood Chain" : "anchoring soon"} />
            <Stat label="calls" value={`${m.hits} · ${m.misses}`} hint={m.openCalls.length ? `hits · misses, ${m.openCalls.length} open` : "hits · misses"} />
            <Stat label="cadence" value={CADENCE_LABEL[m.cadence as Cadence] ?? m.cadence} />
            <Stat label="earns" value={staked > 0 ? fmtUsd(m.earnPerDayUsd) : "—"} hint={staked > 0 ? "per day, estimate" : "owner isn't staking"} />
            <Stat label="burns" value={fmtUsd(m.burnPerDayUsd)} hint="per day" />
            <Stat label="balance" value={fmtUsd(keyRemaining)} hint="activated, unspent" />
            <Stat label="spent" value={fmtUsd(m.spentTotalUsd, 3)} hint="all time" />
          </div>
        </section>

        {/* Fuel activates CREDIT to the owner's wallet on chain; an Orbio email account has none. */}
        {!hidden && /^0x[0-9a-f]{40}$/.test(m.owner) && <FuelButton internId={m.id} internName={m.name} owner={m.owner} />}

        <Receipts internId={m.id} />

        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-soft">What it did</h2>
            <a href={`/api/interns/${m.id}/runs`} className="font-mono text-[11px] text-ink-faint hover:text-ink">JSON ↗</a>
          </div>
          {feed.length ? (
            <div className="space-y-2.5">{feed.map((r) => <RunCard key={r.id} run={r} anchoring={anchoring} />)}</div>
          ) : (
            <p className="rounded-lg border border-dashed border-ink/20 p-6 text-center font-mono text-[13px] text-ink-soft">
              {quiet ? "Gone quiet. Waiting for CREDIT; fuel it above and it runs on the next tick." : "No finished runs yet."}
            </p>
          )}
          {runs.length > feed.length && <p className="mt-2 text-right font-mono text-[11px] text-ink-faint">{runs.length - feed.length} quiet or failed run{runs.length - feed.length === 1 ? "" : "s"} not shown · all in the <a className="underline" href={`/api/interns/${m.id}/runs`}>JSON</a></p>}
        </section>

        <footer className="mt-10 border-t border-ink/10 pt-5 text-center font-mono text-[11.5px] text-ink-faint">
          This page is public. The intern bills its owner&apos;s signed Orbio key and never touches the owner&apos;s tokens.
        </footer>
      </main>
      <PoweredBy />
      <PublicMobileTabs />
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-ink/10 bg-white px-3.5 py-3">
      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-soft">{label}</p>
      <p className="mt-1 truncate font-display text-[1.6rem] leading-none text-ink">{value}</p>
      {hint && <p className="mt-1 truncate font-mono text-[11px] text-ink-faint">{hint}</p>}
    </div>
  );
}
