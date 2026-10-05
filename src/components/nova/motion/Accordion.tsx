"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

export type AccordionItem = { q: string; a: ReactNode };

/** Les pilules FAQ du template : blanches, radius 25, « + » qui tourne en « × ». */
export function Accordion({ items, defaultOpen = null }: { items: AccordionItem[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="card-shadow overflow-hidden rounded-pill bg-white">
            <button type="button" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left">
              <span className="text-[15.5px] font-medium tracking-[-0.01em] text-ink">{it.q}</span>
              <motion.span className="relative h-4 w-4 shrink-0 text-muted" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} aria-hidden>
                <span className="absolute left-1/2 top-1/2 h-[1.5px] w-4 -translate-x-1/2 -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-1/2 h-4 w-[1.5px] -translate-x-1/2 -translate-y-1/2 bg-current" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
                  <div className="px-6 pb-6 text-[14px] leading-relaxed text-text">{it.a}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
