import type { ReactNode } from "react";

/** Défilement horizontal infini (la bande de logos). */
export function Marquee({ children, speed = 40, className = "", reverse = false }: { children: ReactNode; speed?: number; className?: string; reverse?: boolean }) {
  return (
    <div className={`relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)] ${className}`}>
      <div className="flex w-max items-center gap-14 pr-14" style={{ animation: `marquee ${speed}s linear infinite ${reverse ? "reverse" : ""}` }}>
        <div className="flex items-center gap-14">{children}</div>
        <div className="flex items-center gap-14" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
