import { marks } from "@/components/inline-marks";
import Link from "next/link";
import { Face } from "./logo";
import { StatusDot, fuelTone } from "@/components/fuel-gauge";
import { CADENCE_LABEL, TEMPLATE_LABEL } from "@/components/labels";
import type { Cadence } from "@/intern/spec";
import type * as store from "@/intern/store";
import { fmtBag, shortAddr, shortenHexes, timeAgo } from "@/lib/api";

export type SkyItem = { id: string; name: string; status: store.InternRow["status"]; objective: string; template: store.InternRow["spec"]["template"]; cadence: string; owner: string; bag: number; earn: number; burn: number; avatar: number; runs: number; lastRunAt: number | null; private?: boolean; headline?: { title: string; at: number; signal: string } | null };

export function SkyCard({ m }: { m: SkyItem }) {
  const quiet = m.status === "quiet" || m.status === "paused";
  const tone = fuelTone(m.earn, m.burn, quiet);
  return (
    <div className="group relative h-full rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-[0_1px_2px_rgba(5,31,32,0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-ink/20 hover:shadow-[0_12px_28px_-16px_rgba(5,31,32,0.25)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="relative shrink-0"><Face n={m.avatar} size={34} /><span className="absolute -bottom-px -right-px"><StatusDot tone={tone} pulse={m.status === "running"} /></span></span>
          <span className="min-w-0">
            <Link href={`/s/${m.id}`} className="block truncate text-[16px] font-semibold tracking-[-0.01em] text-ink after:absolute after:inset-0 after:content-['']">{m.name}</Link>
            <span className="block font-mono text-[10.5px] text-ink-faint">{m.id}</span>
          </span>
        </div>
        <span className="shrink-0 rounded-full bg-ink/[0.05] px-2 py-0.5 text-[11px] font-medium text-ink-soft">{TEMPLATE_LABEL[m.template]}</span>
      </div>
      <p className="mt-3 line-clamp-2 min-h-[2.9em] text-[13.5px] leading-[1.5] text-ink-soft">“{m.objective}”</p>
      {m.headline && !m.private && (
        <p className="mt-2.5 border-l-2 border-gold/70 pl-2.5 text-[12.5px] leading-[1.45] text-ink">
          <span className="line-clamp-2 font-medium">{shortenHexes(m.headline.title)}</span>
          <span className="block font-mono text-[10.5px] text-ink-faint">{timeAgo(m.headline.at)}{m.headline.signal === "high" ? " · high signal" : ""}</span>
        </p>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-ink/[0.06] pt-3">
        <span className="flex items-center gap-2 text-[12px] text-ink-soft">
          <span className="font-mono">{shortAddr(m.owner)}</span>
          <span className="text-ink-faint">·</span>
          <span className="font-mono tabular-nums">{marks(`${fmtBag(m.bag)} $ORBIO`, 11)}</span>
        </span>
        <span className="flex items-center gap-2 text-[12px] text-ink-faint">
          <span className={m.private ? "" : "transition-opacity group-hover:opacity-0"}>{CADENCE_LABEL[m.cadence as Cadence] ?? m.cadence} · {m.runs} run{m.runs === 1 ? "" : "s"}</span>
          {!m.private && <Link href={`/app/new?fork=${m.id}`} className="ui-btn ui-btn-sm absolute bottom-4 right-4 z-10 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100">Use this job</Link>}
        </span>
      </div>
    </div>
  );
}
