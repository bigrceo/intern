"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { BrandMark } from "./logo";

const CYCLE_MS = 6000;

const INK = "#051f20";
const GOLD = "#8eb69b";

export function ThinkingMark({ size = 40, color = INK, className }: { size?: number; color?: string; className?: string }) {
  // The badge bobs and its clip pulses while the intern thinks; reduced motion keeps it still.
  return (
    <span className={`thinking-mark inline-grid place-items-center ${className ?? ""}`} style={{ width: size, height: size }}>
      <BrandMark size={size} ink={color} tip={GOLD} />
    </span>
  );
}

/** The three gold dots beside the status word: a two-second wave, static under reduced motion. */
export function ThinkingDots({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const refs = useRef<Array<SVGCircleElement | null>>([null, null, null]);
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / CYCLE_MS;
      refs.current.forEach((c, i) => {
        if (!c) return;
        const a = (1 + Math.cos(2 * Math.PI * (t * 3 - i * 0.17))) / 2;
        c.setAttribute("cy", (4 - 1.7 * a).toFixed(3));
        c.setAttribute("opacity", (0.28 + 0.72 * a).toFixed(3));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);
  return (
    <svg aria-hidden width="18" height="8" viewBox="0 0 18 8" className={className}>
      {[0, 1, 2].map((i) => <circle key={i} ref={(el) => { refs.current[i] = el; }} cx={2 + i * 6.7} cy="4" r="1.6" fill={GOLD} opacity="0.6" />)}
    </svg>
  );
}
