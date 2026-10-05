"use client";

import { marks } from "@/components/inline-marks";

import { BRAND } from "@/lib/brand";
import Link from "next/link";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** The one official $INTERN contract. Clones with the same name exist on Robinhood Chain; this is the only real one. */
export const INTERN_CA = BRAND.token;

const LINKS = [
  ...(BRAND.buyUrl ? [{ href: BRAND.buyUrl, label: `Buy $${BRAND.ticker}` }] : []),
  ...(BRAND.chartUrl ? [{ href: BRAND.chartUrl, label: "Chart" }] : []),
  { href: `https://robinhoodchain.blockscout.com/token/${INTERN_CA}`, label: "Explorer" },
  ...(BRAND.social.x ? [{ href: BRAND.social.x, label: "X" }] : []),
];

export function TokenCA() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(INTERN_CA); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {}
  };
  return (
    <section id="token" className="mx-auto max-w-[1120px] scroll-mt-24 px-4 pb-16 sm:px-6">
      <div className="card-shadow rounded-card bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="eyebrow">${BRAND.ticker} · official contract · {marks("Robinhood Chain", 12)}</p>
          <p className="text-[13px] text-ink-faint">{INTERN_CA ? BRAND.market : "Launching soon on Pons"}</p>
        </div>

        <button
          type="button"
          onClick={copy}
          disabled={!INTERN_CA}
          aria-label={`Copy the $${BRAND.ticker} contract address`}
          className="group mt-4 flex w-full items-center gap-3 rounded-[12px] border border-line bg-bg-2 px-4 py-3.5 text-left transition-[border-color,box-shadow] hover:border-ink/25 focus-visible:shadow-[0_0_0_3px_rgba(142,182,155,0.35)] focus-visible:outline-none"
        >
          <code className="min-w-0 flex-1 break-all font-mono text-[14px] leading-[1.5] text-ink sm:text-[16px]">{INTERN_CA || "0x… posted here at launch"}</code>
          <span className="flex shrink-0 items-center gap-1.5 btn-grad rounded-[6px] px-2.5 py-1.5 text-[12.5px] font-medium text-white">
            {copied ? <Check size={14} strokeWidth={2.2} /> : <Copy size={14} strokeWidth={2} />}
            {copied ? "Copied" : "Copy"}
          </span>
        </button>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[34rem] text-[13.5px] leading-[1.55] text-ink-soft">
            Other tokens named {BRAND.name} may exist. This address is the only official one; check it before you buy.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-[13.5px]">
            {INTERN_CA && LINKS.map((l) => (
              <Link key={l.label} href={l.href} target="_blank" rel="noreferrer" className="text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-ink">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
