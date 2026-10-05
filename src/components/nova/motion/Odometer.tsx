"use client";

import { useInView } from "motion/react";
import { useMemo, useRef } from "react";

const DIGIT_H = 1;

function Column({ digit, delay }: { digit: string; delay: number }) {
  if (!/\d/.test(digit)) return <span className="inline-block">{digit}</span>;
  const n = Number(digit);
  return (
    <span className="relative inline-block overflow-hidden align-bottom" style={{ height: `${DIGIT_H}em`, lineHeight: `${DIGIT_H}em` }}>
      <span className="flex flex-col will-change-transform" style={{ transform: `translateY(-${n * DIGIT_H}em)`, transition: `transform 1.4s cubic-bezier(0.16,1,0.3,1) ${delay}ms` }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} style={{ height: `${DIGIT_H}em`, lineHeight: `${DIGIT_H}em` }} className="block tabular-nums">
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Compteur à chiffres roulants : chaque chiffre est une roue qui tourne à l'entrée dans l'écran. */
export function Odometer({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shown = useMemo(() => (inView ? text : text.replace(/\d/g, "0")), [inView, text]);
  const chars = Array.from(shown);
  return (
    <span ref={ref} className={`inline-flex items-baseline tabular-nums ${className}`} aria-label={text}>
      {chars.map((c, i) => (
        <Column key={`${i}-${chars.length}`} digit={c} delay={i * 60} />
      ))}
    </span>
  );
}
