import type { ReactNode, CSSProperties } from "react";

/** La carte blanche du template : radius 16, ombre douce et large. */
export function Card({ children, className = "", style, as: Tag = "div" }: { children: ReactNode; className?: string; style?: CSSProperties; as?: "div" | "section" | "article" | "li" }) {
  return (
    <Tag className={`card-shadow rounded-card bg-white ${className}`} style={style}>
      {children}
    </Tag>
  );
}

/** La carte menthe avec la brume à l'intérieur (les six cartes bento). */
export function HazeCard({ children, illustration, className = "", pad = "p-3" }: { children: ReactNode; illustration: ReactNode; className?: string; pad?: string }) {
  return (
    <Card className={`flex flex-col overflow-hidden ${pad} ${className}`}>
      <div className="haze relative flex min-h-[210px] flex-1 items-center justify-center overflow-hidden rounded-[12px]">{illustration}</div>
      <div className="px-2 pb-2 pt-4">{children}</div>
    </Card>
  );
}

/** Le panneau posé sur la brume (mock de l'app du hero). */
export function HazePanel({ children, className = "", inner = "" }: { children: ReactNode; className?: string; inner?: string }) {
  return (
    <div className={`haze card-shadow relative overflow-hidden rounded-[12px] p-5 sm:p-8 ${className}`}>
      <div className={`relative rounded-[12px] bg-white p-4 shadow-[0_10px_30px_rgba(5,31,32,.12)] sm:p-5 ${inner}`}>{children}</div>
    </div>
  );
}

/** Une tuile de statistique. */
export function Stat({ label, children, hint, className = "" }: { label: string; children: ReactNode; hint?: ReactNode; className?: string }) {
  return (
    <div className={`rounded-card bg-white p-4 ring-1 ring-line-soft sm:p-5 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      <div className="mt-1.5 text-[24px] leading-none tracking-[-0.03em] text-ink sm:text-[28px]">{children}</div>
      {hint && <p className="mt-1.5 text-[12px] text-muted-2">{hint}</p>}
    </div>
  );
}
