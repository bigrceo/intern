import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Les boutons du template NovaWrite.
 *  - primary : dégradé vert sapin 293°, radius 8, texte blanc.
 *  - outline : blanc, filet vert, texte sapin (« Try Demo »).
 *  - mint    : fond menthe, texte encre.
 *  - ghost   : transparent.
 *  - danger  : rouge (vente).
 */
type Variant = "primary" | "outline" | "mint" | "ghost" | "danger" | "dark";

const BASE: Record<Variant, string> = {
  primary: "btn-grad text-white shadow-[0_8px_20px_-10px_rgba(5,31,32,.6)] hover:brightness-110",
  dark: "bg-ink text-white hover:bg-pine",
  outline: "bg-white text-pine ring-1 ring-inset ring-sage/60 hover:bg-mint-2",
  mint: "bg-mint text-ink hover:bg-mint-3",
  ghost: "bg-transparent text-text hover:bg-mint-2",
  danger: "bg-white text-red ring-1 ring-inset ring-red/30 hover:bg-red-soft",
};

const SIZE = {
  xs: "h-8 px-3 text-[12px]",
  sm: "h-9 px-4 text-[13px]",
  md: "h-11 px-5 text-[14px]",
  lg: "h-12 px-6 text-[15px]",
};

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: keyof typeof SIZE;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  full?: boolean;
  title?: string;
};

export function Button({ children, variant = "primary", size = "md", className = "", href, onClick, type = "button", disabled, full, title }: Props) {
  const cls = `inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-btn font-medium transition-[transform,filter,background-color] duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${BASE[variant]} ${SIZE[size]} ${full ? "w-full" : ""} ${className}`;
  if (href && !disabled) {
    const external = href.startsWith("http");
    return (
      <Link href={href} className={cls} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls} title={title}>
      {children}
    </button>
  );
}

/** Le petit libellé Satoshi en capitales qui coiffe une section. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

/** La puce menthe du template (« Clarity », « Metrics »). */
export function Chip({ children, tone = "mint", className = "", icon }: { children: ReactNode; tone?: "mint" | "white" | "green" | "amber" | "red" | "ink" | "outline"; className?: string; icon?: ReactNode }) {
  const t = {
    mint: "bg-mint text-pine",
    white: "bg-white text-pine ring-1 ring-inset ring-line",
    green: "bg-green-soft text-green",
    amber: "bg-amber-soft text-amber",
    red: "bg-red-soft text-red",
    ink: "bg-ink text-white",
    outline: "bg-transparent text-text ring-1 ring-inset ring-line",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-chip px-2.5 py-1 text-[11.5px] font-medium leading-[1.4] ${t} ${className}`}>
      {icon}
      {children}
    </span>
  );
}

/** Une coche verte + texte, comme les puces du hero. */
export function Check({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-start gap-2.5 text-[13.5px] text-text ${className}`}>
      <span className="mt-[2px] grid h-4 w-4 shrink-0 place-items-center rounded-full bg-mint text-ink">
        <svg width="9" height="7" viewBox="0 0 10 8" fill="none" aria-hidden>
          <path d="M1 4l2.6 2.6L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {children}
    </span>
  );
}
