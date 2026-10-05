import { BRAND } from "@/lib/brand";

type MarkProps = {
  size?: number;
  className?: string;
  /** Badge colour. */
  ink?: string;
  /** Face colour (inside the badge). */
  face?: string;
  /** The clip on top; sage by default, the one spot of colour in the mark. */
  tip?: string;
  title?: string;
};

/**
 * The mark: an ID badge on its clip, with a face. The intern you hire with your bag.
 * Drawn on a 100×100 grid; heavier strokes under 28px so it holds in a favicon.
 */
export function BrandMark({ size = 32, className, ink = "var(--ink)", face = "#fff", tip = "#8eb69b", title = BRAND.name }: MarkProps) {
  const small = size < 28;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={title} className={className}>
      <rect x="40" y="4" width="20" height="16" rx="5" fill={tip} />
      <rect x="16" y="14" width="68" height="82" rx="18" fill={ink} />
      <rect x="38" y="20" width="24" height="6" rx="3" fill={face} opacity="0.35" />
      <rect x="26" y="34" width="48" height="40" rx="12" fill={face} />
      <circle cx="41" cy="52" r={small ? 5 : 4.2} fill={ink} />
      <circle cx="59" cy="52" r={small ? 5 : 4.2} fill={ink} />
      <path d="M43 63Q50 68 57 63" fill="none" stroke={ink} strokeWidth={small ? 5 : 3.6} strokeLinecap="round" />
      {!small && <rect x="30" y="81" width="40" height="5" rx="2.5" fill={face} opacity="0.35" />}
    </svg>
  );
}

/** The wordmark: Nippo 500, as the template sets its own name. */
export function Wordmark({ className }: { className?: string }) {
  return <span className={`wordmark leading-none ${className ?? ""}`}>{BRAND.name.toLowerCase()}</span>;
}

/** Mark + wordmark, the lockup used in every header. */
export function Logo({ size = 30, className = "", text = "text-[22px]" }: { size?: number; className?: string; text?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-ink ${className}`}>
      <BrandMark size={size} />
      <Wordmark className={text} />
    </span>
  );
}

/**
 * An agent's face: the badge on a tinted disc. `n` (1–10) picks the tint, so each agent keeps its colour
 * (replaces the old per-agent PNG portraits).
 */
const TINTS: [string, string][] = [
  ["#daf1de", "#051f20"], ["#c9ead0", "#163b32"], ["#ebfcef", "#235347"], ["#8eb69b", "#051f20"], ["#235347", "#daf1de"],
  ["#e4f4e7", "#163b32"], ["#b8dcc2", "#051f20"], ["#cfe9d5", "#235347"], ["#163b32", "#8eb69b"], ["#eef9f0", "#051f20"],
];
const tint = (n: number) => TINTS[((((n | 0) - 1) % 10) + 10) % 10];

export function Face({ n = 1, size = 34, className = "", title }: { n?: number; size?: number; className?: string; title?: string }) {
  const [bg, ink] = tint(n);
  return (
    <span title={title} className={`inline-grid shrink-0 place-items-center rounded-full ${className}`} style={{ width: size, height: size, background: bg }}>
      <BrandMark size={Math.max(14, Math.round(size * 0.62))} ink={ink} face={bg} tip={bg === "#8eb69b" ? "#235347" : "#8eb69b"} title={title ?? ""} />
    </span>
  );
}

/** Owner profile picture: a soft two-tone disc, one of ten. */
export function ProfileFace({ n = 1, size = 28 }: { n?: number; size?: number }) {
  const [bg, ink] = tint(n + 4);
  return <span className="inline-block shrink-0 rounded-full ring-1 ring-ink/[0.08]" style={{ width: size, height: size, background: `radial-gradient(circle at 30% 30%, ${bg}, ${ink})` }} />;
}
