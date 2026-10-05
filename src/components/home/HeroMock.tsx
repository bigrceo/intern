"use client";

import { marks } from "@/components/inline-marks";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HazePanel } from "../nova/ui/Card";
import { Chip } from "../nova/ui/Button";
import { Face } from "../logo";
import { BRAND } from "@/lib/brand";

/**
 * The template's app mock on the haze, here a live-looking run: the sentence, the plan it compiled to, the tool
 * calls ticking in, then the receipt. Loops every nine seconds; static under reduced motion (motion handles it).
 */
const TOOLS = [
  { name: "Checked the market", detail: "$ORBIO price, liquidity, volume" },
  { name: "Read the chain", detail: "big transfers in the last 12h" },
  { name: "Searched the web", detail: "Orbio staking news" },
  { name: "Sent the report", detail: "to your Telegram" },
];

export function HeroMock() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % 7), 1300);
    return () => clearInterval(id);
  }, []);
  const tools = Math.min(step, TOOLS.length);
  const done = step >= 5;
  return (
    <HazePanel className="mx-auto w-full max-w-[540px]" inner="!p-0 overflow-hidden flex min-h-[530px] flex-col sm:min-h-[470px]">
      <div className="flex items-center gap-3 border-b border-line-soft px-4 py-3">
        <Face n={4} size={30} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-medium text-ink">Sentry · ORBIO watch</p>
          <p className="truncate text-[11.5px] text-muted">every 12 hours · max 5¢ a job</p>
        </div>
        <Chip tone={done ? "green" : "mint"}>{done ? "done" : "working"}</Chip>
      </div>
      <div className="flex-1 px-4 py-4">
        <p className="rounded-[10px] bg-mint-2 px-3 py-2.5 text-[12.5px] leading-snug text-pine">{marks("“Watch $ORBIO price and liquidity, big transfers, and tell me only what moved.”", 13)}</p>
        <ul className="mt-3 space-y-1.5">
          <AnimatePresence initial={false}>
            {TOOLS.slice(0, tools).map((t) => (
              <motion.li key={t.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-[12px]">
                <span className="grid h-4 w-4 place-items-center rounded-full bg-mint text-[9px] text-ink">✓</span>
                <span className="font-medium text-ink">{t.name}</span>
                <span className="truncate text-muted">{marks(t.detail, 12)}</span>
              </motion.li>
            ))}
          </AnimatePresence>
          {!done && (
            <li className="flex items-center gap-2 text-[12px] text-muted">
              <span className="h-3 w-3 animate-spin rounded-full border-[1.5px] border-sage border-t-transparent" />
              {tools === 0 ? "reading the job…" : "working…"}
            </li>
          )}
        </ul>
        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: "spring", bounce: 0, duration: 0.5 }} className="mt-4 rounded-[12px] ring-1 ring-line">
              <div className="px-3.5 py-3">
                <p className="text-[13.5px] font-medium text-ink">Liquidity up 11.4% after a 220k ORBIO add</p>
                <p className="mt-1 text-[12px] leading-snug text-text">Price flat at $0.0412; one wallet added liquidity on both sides. Its guess for next time: liquidity stays above $1.2M.</p>
              </div>
              <div className="grid grid-cols-4 gap-2 border-t border-line-soft px-3.5 py-2.5 text-[10.5px] text-muted">
                <span>cost <b className="block text-[12px] font-medium text-ink">$0.018</b></span>
                <span>AI <b className="block truncate text-[12px] font-medium text-ink">gemini flash</b></span>
                <span>time <b className="block text-[12px] font-medium text-ink">41s</b></span>
                <span>receipt <b className="block truncate text-[12px] font-medium text-green">on-chain ✓</b></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between border-t border-line-soft bg-bg-2 px-4 py-2.5 text-[11.5px] text-muted">
        <span>Paid by your bag · no card</span>
        <span className="font-medium text-pine">{BRAND.domain}/s/sentry</span>
      </div>
    </HazePanel>
  );
}
