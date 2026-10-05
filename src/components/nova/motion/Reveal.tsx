"use client";

import { motion, type Transition } from "motion/react";
import type { ReactNode } from "react";

/**
 * L'apparition du template NovaWrite : fondu + montée de 20px, spring sans
 * rebond (bounce 0), délais échelonnés de 0.1s.
 */
export const spring = (duration: number, delay: number): Transition => ({ type: "spring", bounce: 0, duration, delay });

export function Reveal({ children, y = 20, delay = 0, duration = 0.7, className, onLoad = false, as = "div", once = true }: { children: ReactNode; y?: number; delay?: number; duration?: number; className?: string; onLoad?: boolean; as?: "div" | "span" | "section" | "li"; once?: boolean }) {
  const Tag = motion[as];
  const initial = { opacity: 0.001, y };
  const target = { opacity: 1, y: 0 };
  if (onLoad) {
    return (
      <Tag className={className} initial={initial} animate={target} transition={spring(duration, delay)}>
        {children}
      </Tag>
    );
  }
  return (
    <Tag className={className} initial={initial} whileInView={target} viewport={{ once, amount: 0.15, margin: "0px 0px -60px 0px" }} transition={spring(duration, delay)}>
      {children}
    </Tag>
  );
}

export function RevealStack({ children, start = 0, step = 0.1, y = 20, className, onLoad = false }: { children: ReactNode[]; start?: number; step?: number; y?: number; className?: string; onLoad?: boolean }) {
  return (
    <>
      {children.map((child, i) => (
        <Reveal key={i} y={y} delay={start + i * step} className={className} onLoad={onLoad}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
