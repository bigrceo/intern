"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { marks } from "./inline-marks";

/** The hero's one-line token bar for traders: ticker, CA with copy, Chart, Buy. Renders only once the CA is set. */
export function TokenStrip() {
  const [copied, setCopied] = useState(false);
  if (!BRAND.token) return null;
  const ca = BRAND.token;
  const copy = async () => {
    try { await navigator.clipboard.writeText(ca); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch {}
  };
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-[12px] bg-white/80 p-1.5 pl-3 ring-1 ring-line backdrop-blur">
      <span className="text-[13px] font-semibold text-ink">${BRAND.ticker}</span>
      <button type="button" onClick={copy} aria-label={`Copy the $${BRAND.ticker} contract address`} className="inline-flex items-center gap-1.5 rounded-[8px] bg-mint-2 px-2.5 py-1.5 font-code text-[12px] text-pine transition-colors hover:bg-mint">
        {ca.slice(0, 6)}…{ca.slice(-4)} {copied ? <Check size={13} strokeWidth={2.2} /> : <Copy size={13} strokeWidth={2} />}
      </button>
      <span className="hidden text-[11.5px] text-muted xl:inline">{marks("on Robinhood Chain", 12)}</span>
      <span className="ml-auto flex gap-1.5">
        {BRAND.chartUrl && <Link href={BRAND.chartUrl} target="_blank" rel="noreferrer" className="rounded-[8px] px-3 py-1.5 text-[12.5px] font-medium text-pine ring-1 ring-inset ring-sage/60 transition-colors hover:bg-mint-2">Chart</Link>}
        {BRAND.buyUrl && <Link href={BRAND.buyUrl} target="_blank" rel="noreferrer" className="btn-grad rounded-[8px] px-3.5 py-1.5 text-[12.5px] font-medium text-white">Buy ${BRAND.ticker}</Link>}
      </span>
    </div>
  );
}
