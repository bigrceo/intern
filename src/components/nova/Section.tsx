import type { ReactNode } from "react";
import { Reveal } from "@/components/nova/motion/Reveal";

/** L'entête de section du template : eyebrow Satoshi, titre Manrope 400 centré. */
export function SectionHead({ eyebrow, title, text, className = "" }: { eyebrow?: string; title: ReactNode; text?: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto max-w-[680px] text-center ${className}`}>
      {eyebrow && (
        <Reveal y={10}>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal y={16} delay={0.08}>
        <h2 className={`${eyebrow ? "mt-3" : ""} text-[32px] sm:text-[38px] lg:text-[42px]`}>{title}</h2>
      </Reveal>
      {text && (
        <Reveal y={16} delay={0.16}>
          <p className="mx-auto mt-4 max-w-[520px] text-[15px] leading-relaxed text-text">{text}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Section({ id, children, className = "", inner = "" }: { id?: string; children: ReactNode; className?: string; inner?: string }) {
  return (
    <section id={id} className={`relative scroll-mt-24 px-4 py-20 sm:px-6 lg:py-28 ${className}`}>
      <div className={`mx-auto w-full max-w-[1088px] ${inner}`}>{children}</div>
    </section>
  );
}
