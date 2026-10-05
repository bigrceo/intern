import { Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { CSSProperties, ReactNode } from "react";

export const C = { bg: "#fcfffd", text: "#163b32", muted: "#5c876a", line: "rgba(5,31,32,.08)", ink: "#051f20", pine: "#163b32", forest: "#235347", sage: "#8eb69b", mint: "#daf1de", white: "#ffffff" };
export const out = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);
export const anticip = Easing.bezier(0.36, -0.4, 0.4, 1.4);
export const ease = (f: number, a: number, b: number, from = 0, to = 1, e = out) => interpolate(f, [a, b], [from, to], { easing: e, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
export const useSpring = (delay = 0, damping = 12, mass = 0.8) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass, stiffness: 140 } }); };

export const FONT = `
@font-face{font-family:MR;src:url(${staticFile("manrope.ttf")});font-weight:200 800}
@font-face{font-family:ST;src:url(${staticFile("satoshi-1.woff2")});font-weight:700}
@font-face{font-family:ST;src:url(${staticFile("satoshi-2.woff2")});font-weight:900}`;

/** Gros titre cinétique : chaque mot sort d'un masque avec un léger dépassement. */
export function Kinetic({ words, at, size = 150, color = C.ink, accent, stagger = 5, style }: { words: string[]; at: number; size?: number; color?: string; accent?: number[]; stagger?: number; style?: CSSProperties }) {
  const f = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: `0 ${size * 0.22}px`, font: `400 ${size}px/0.95 MR`, letterSpacing: "-0.055em", ...style }}>
      {words.map((w, i) => {
        const t = ease(f, at + i * stagger, at + i * stagger + 22, 0, 1, Easing.bezier(0.2, 1.4, 0.4, 1));
        const blur = ease(f, at + i * stagger, at + i * stagger + 10, 10, 0);
        return (
          <span key={i} style={{ overflow: "hidden", display: "inline-block", paddingBottom: size * 0.24, marginBottom: -size * 0.16 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - t) * 110}%) rotate(${(1 - t) * 6}deg)`, filter: `blur(${blur}px)`, color: accent?.includes(i) ? C.forest : color }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
}

export function Label({ children, at, style }: { children: ReactNode; at: number; style?: CSSProperties }) {
  const f = useCurrentFrame();
  const t = ease(f, at, at + 18);
  return <div style={{ font: "700 26px ST", letterSpacing: ".22em", textTransform: "uppercase", color: C.forest, clipPath: `inset(0 ${(1 - t) * 100}% 0 0)`, ...style }}>{children}</div>;
}

export function Logo({ size = 64 }: { size?: number }) {
  return <img src={staticFile("mark.svg")} style={{ width: size, height: size, display: "block" }} />;
}

export function Img({ src, size, style }: { src: string; size: number; style?: CSSProperties }) {
  return <img src={staticFile(src)} style={{ width: size, height: size, display: "inline-block", objectFit: "contain", ...style }} />;
}

/** The mascot in a pose, drawn from the site's SVG. Height drives the size. */
export function Mascot({ pose = "float", h = 400, style }: { pose?: string; h?: number; style?: CSSProperties }) {
  return <img src={staticFile(`m-${pose}.svg`)} style={{ height: h, width: (h * 300) / 510, display: "block", ...style }} />;
}

/** Backdrop: the site's off-white with drifting mint haze and fine grain. */
export function Backdrop({ glow = 1 }: { glow?: number }) {
  const f = useCurrentFrame();
  const x = 70 + Math.sin(f / 90) * 12, y = 30 + Math.cos(f / 110) * 10;
  return (
    <>
      <div style={{ position: "absolute", inset: 0, background: C.bg }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(55% 50% at ${x}% ${y}%, rgba(130,191,149,${0.55 * glow}), rgba(218,241,222,${0.45 * glow}) 45%, rgba(252,255,253,0) 78%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(45% 40% at ${100 - x}% ${110 - y}%, rgba(142,182,155,${0.35 * glow}), transparent 70%)` }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06, mixBlendMode: "multiply" }}>
        <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 30} /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>
    </>
  );
}
