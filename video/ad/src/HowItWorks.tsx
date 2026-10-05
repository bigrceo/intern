import { AbsoluteFill, Easing, Sequence, interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties, ReactNode } from "react";
import { Backdrop, C, FONT, Img, Kinetic, Label, Logo, Mascot, anticip, ease, inOut, out, useSpring } from "./kit";

/*
 * Intern · how it works · 15 s @ 60 fps (900 frames)
 *   0–120   HOOK      "Your bag runs an agent." — kinetic type, the mascot pops up under it
 *   120–300 SETUP     one sentence typed in the input, Launch pressed; the intern listens
 *   300–420 BEAT 1    "Your bag pays." — the $ORBIO bag pours CREDIT into the AI balance
 *   420–540 BEAT 2    "It works 24/7." — the intern types, tool checks tick in, a clock sweeps
 *   540–660 BEAT 3    "It asks first." — Telegram card, cursor taps Approve, verified
 *   660–780 PAYOFF    the receipt slams down: saved on Robinhood Chain ✓
 *   780–900 END CARD  mark, intern, $INTERN, tagline; still for the last second
 */

const card: CSSProperties = { background: "#fff", borderRadius: 28, boxShadow: "0 30px 80px -20px rgba(19,33,58,.28), 0 0 0 1px rgba(5,31,32,.05)" };
const T = (size: number, weight = 400): CSSProperties => ({ font: `${weight} ${size}px/1.15 MR`, letterSpacing: "-0.03em", color: C.ink });

/** Exit wipe shared by every scene: the frame slides up and clips away, so scenes hand over instead of fading. */
function Scene({ len, children, exit = 14 }: { len: number; children: ReactNode; exit?: number }) {
  const f = useCurrentFrame();
  const t = ease(f, len - exit, len, 0, 1, inOut);
  return <AbsoluteFill style={{ transform: `translateY(${-t * 60}px) scale(${1 - t * 0.04})`, clipPath: `inset(0 0 ${t * 100}% 0)` }}>{children}</AbsoluteFill>;
}

function Hook() {
  const f = useCurrentFrame();
  const pop = useSpring(62, 10);
  const cam = interpolate(f, [0, 120], [1.06, 1], { easing: out });
  return (
    <Scene len={120}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, alignItems: "center", justifyContent: "center" }}>
        <Kinetic words={["Your", "bag", "runs"]} at={4} size={150} stagger={6} style={{ marginTop: -200 }} />
        <Kinetic words={["an", "agent."]} at={22} size={150} stagger={6} accent={[0, 1]} />
        <div style={{ position: "absolute", bottom: -40, transform: `translateY(${(1 - pop) * 380}px) rotate(${(1 - pop) * -12}deg)` }}>
          <Mascot pose="float" h={360} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
}

const SENTENCE = "Ping me if $ORBIO liquidity moves 10%.";
function Setup() {
  const f = useCurrentFrame();
  const n = Math.round(interpolate(f, [26, 120], [0, SENTENCE.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const typed = SENTENCE.slice(0, n);
  const inT = useSpring(6, 13);
  const press = f > 134 && f < 146 ? 0.92 : 1;
  const launched = f >= 146;
  const lift = ease(f, 148, 176, 0, 1, anticip);
  const ml = useSpring(18, 12);
  const parts = typed.split("$ORBIO");
  return (
    <Scene len={180}>
      <Label at={8} style={{ position: "absolute", top: 150, width: "100%", textAlign: "center" }}>Step 1 · say the job</Label>
      <Kinetic words={["One", "sentence", "in."]} at={10} size={96} stagger={5} accent={[2]} style={{ position: "absolute", top: 210, width: "100%" }} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 470, transform: `translateY(${(1 - inT) * 120 - lift * 40}px) scale(${0.96 + inT * 0.04 - lift * 0.05})`, opacity: inT }}>
        <div style={{ ...card, display: "flex", alignItems: "center", gap: 18, padding: "22px 22px 22px 34px" }}>
          <div style={{ ...T(36), flex: 1, color: C.text, whiteSpace: "nowrap", overflow: "hidden" }}>
            {parts[0]}
            {parts.length > 1 && (
              <>
                <Img src="orbio.png" size={34} style={{ verticalAlign: "-5px", margin: "0 6px 0 2px" }} />
                $ORBIO{parts[1]}
              </>
            )}
            {!launched && <span style={{ display: "inline-block", width: 3, height: 40, background: C.forest, marginLeft: 3, verticalAlign: "-8px", opacity: Math.floor(f / 18) % 2 ? 1 : 0.2 }} />}
          </div>
          <div style={{ background: launched ? C.mint : `linear-gradient(293deg, #051f20, #163b32 50%, #235347)`, ...T(32, 500), color: launched ? C.pine : "#fff", padding: "18px 30px", borderRadius: 14, transform: `scale(${press})`, transition: "none" }}>
            {launched ? "✓ Launched" : "Launch"}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, bottom: -30, transform: `translateY(${(1 - ml) * 300}px)` }}>
        <Mascot pose="listen" h={330} />
      </div>
      <div style={{ position: "absolute", right: 90, bottom: 110, ...T(30), color: C.muted, opacity: ease(f, 150, 166), transform: `translateY(${(1 - ease(f, 150, 172)) * 20}px)` }}>
        Your intern turns it into a plan.
      </div>
    </Scene>
  );
}

function Pays() {
  const f = useCurrentFrame();
  const bag = useSpring(4, 11);
  const amount = interpolate(f, [40, 100], [0, 2], { easing: inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pill = useSpring(20, 12);
  return (
    <Scene len={120}>
      <Label at={2} style={{ position: "absolute", top: 120, width: "100%", textAlign: "center" }}>Step 2 · who pays</Label>
      <Kinetic words={["Your", "bag", "pays."]} at={4} size={120} stagger={5} accent={[2]} style={{ position: "absolute", top: 180, width: "100%" }} />
      {/* the bag */}
      <div style={{ position: "absolute", left: 120, top: 470, transform: `scale(${bag}) rotate(${Math.sin(f / 7) * 3}deg)`, transformOrigin: "50% 100%" }}>
        <svg width="250" height="250" viewBox="-60 -60 120 120">
          <path d="M-46 -26 q-22 64 10 82 h72 q32 -18 10 -82 z" fill="#d9b779" stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
          <path d="M-40 -30 q40 -22 80 0 l-9 12 q-31 -12 -62 0 z" fill="#b8924f" stroke={C.ink} strokeWidth="5" strokeLinejoin="round" />
        </svg>
        <Img src="orbio.png" size={74} style={{ position: "absolute", left: 88, top: 120 }} />
        <div style={{ ...T(30, 500), textAlign: "center", marginTop: 6 }}>staked $ORBIO</div>
      </div>
      {/* CREDIT coins flying along an arc */}
      {Array.from({ length: 7 }, (_, i) => {
        const t = ease(f, 26 + i * 9, 62 + i * 9, 0, 1, inOut);
        if (t <= 0 || t >= 1) return null;
        const x = 330 + t * 380, y = 560 - Math.sin(t * Math.PI) * 220;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 56, height: 56, borderRadius: "50%", background: C.mint, border: `4px solid ${C.forest}`, display: "grid", placeItems: "center", ...T(26, 700), color: C.forest, transform: `scale(${0.7 + Math.sin(t * Math.PI) * 0.5}) rotate(${t * 360}deg)`, filter: `blur(${Math.sin(t * Math.PI) * 1.2}px)` }}>C</div>;
      })}
      {/* AI balance */}
      <div style={{ position: "absolute", right: 90, top: 500, width: 330, ...card, padding: "30px 34px", transform: `translateX(${(1 - pill) * 200}px)`, opacity: pill }}>
        <div style={{ font: "700 20px ST", letterSpacing: ".18em", color: C.muted }}>AI BALANCE</div>
        <div style={{ ...T(84, 500), marginTop: 8, letterSpacing: "-0.05em" }}>${amount.toFixed(2)}</div>
        <div style={{ ...T(26), color: C.forest, marginTop: 6 }}>+ CREDIT every hour</div>
      </div>
      <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", ...T(32), color: C.muted, opacity: ease(f, 70, 90) }}>No card. No subscription.</div>
    </Scene>
  );
}

const TOOLS: Array<[string, string | null]> = [["Checked the market", "orbio.png"], ["Read the chain", "robinhood.svg"], ["Searched the web", null], ["Sent to Telegram", "telegram.svg"]];
function Works() {
  const f = useCurrentFrame();
  const m = useSpring(2, 12);
  const sweep = ease(f, 0, 120, 0, 360, Easing.linear);
  return (
    <Scene len={120}>
      <Label at={2} style={{ position: "absolute", top: 120, width: "100%", textAlign: "center" }}>Step 3 · it works</Label>
      <Kinetic words={["It", "works", "24/7."]} at={4} size={120} stagger={5} accent={[2]} style={{ position: "absolute", top: 180, width: "100%" }} />
      <div style={{ position: "absolute", left: 60, top: 400, transform: `scale(${0.8 + m * 0.2})`, opacity: m }}>
        <svg width="400" height="400" viewBox="-200 -200 400 400" style={{ position: "absolute", left: -10, top: 30 }}>
          <circle r="180" fill="none" stroke={C.mint} strokeWidth="14" />
          <circle r="180" fill="none" stroke={C.forest} strokeWidth="14" strokeLinecap="round" strokeDasharray={`${(sweep / 360) * 1131} 1131`} transform="rotate(-90)" />
        </svg>
        <div style={{ position: "relative", left: 80, top: 40 }}><Mascot pose="work" h={360} /></div>
      </div>
      <div style={{ position: "absolute", right: 80, top: 440, width: 470, ...card, padding: "26px 30px" }}>
        {TOOLS.map(([t, logo], i) => {
          const on = ease(f, 14 + i * 18, 30 + i * 18);
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderTop: i ? `1px solid ${C.line}` : "none", opacity: 0.25 + on * 0.75, transform: `translateX(${(1 - on) * 30}px)` }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: on > 0.9 ? C.mint : "#eef3ef", display: "grid", placeItems: "center", ...T(22, 700), color: C.forest, transform: `scale(${0.6 + useSpringLike(f, 26 + i * 18) * 0.4})` }}>✓</div>
              {logo && <Img src={logo} size={28} />}
              <div style={{ ...T(30, 500) }}>{t}</div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
}
const useSpringLike = (f: number, at: number) => interpolate(f, [at, at + 12], [0, 1], { easing: Easing.bezier(0.2, 1.6, 0.4, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" });

function Asks() {
  const f = useCurrentFrame();
  const c = useSpring(4, 12);
  const cx = interpolate(f, [30, 66], [980, 330], { easing: Easing.bezier(0.3, 0, 0.1, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cy = interpolate(f, [30, 66], [1000, 720], { easing: Easing.bezier(0.3, 0, 0.1, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tap = f >= 66 && f < 76 ? 0.9 : 1;
  const ok = f >= 74;
  const ver = useSpring(84, 11);
  return (
    <Scene len={120}>
      <Label at={2} style={{ position: "absolute", top: 120, width: "100%", textAlign: "center" }}>Step 4 · it asks first</Label>
      <Kinetic words={["You", "approve."]} at={4} size={120} stagger={6} accent={[1]} style={{ position: "absolute", top: 180, width: "100%" }} />
      <div style={{ position: "absolute", left: 130, right: 130, top: 400, ...card, padding: "34px 40px", transform: `translateY(${(1 - c) * 160}px) rotate(${(1 - c) * 3}deg)`, opacity: c }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}><Img src="telegram.svg" size={44} /><div style={{ ...T(32, 500) }}>Intern</div><div style={{ ...T(24), color: C.muted, marginLeft: "auto" }}>now</div></div>
        <div style={{ font: "700 20px ST", letterSpacing: ".18em", color: C.muted, marginTop: 26 }}>WAITING FOR YOUR OK</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}><Img src="github.svg" size={38} /><div style={{ ...T(38, 500) }}>Open a pull request</div></div>
        <div style={{ ...T(28), color: C.text, marginTop: 8 }}>“Add today's changelog entry”</div>
        <div style={{ display: "flex", gap: 14, marginTop: 28 }}>
          <div style={{ background: ok ? C.mint : "linear-gradient(293deg, #051f20, #163b32 50%, #235347)", ...T(30, 600), color: ok ? C.forest : "#fff", padding: "18px 38px", borderRadius: 14, transform: `scale(${tap})` }}>{ok ? "✓ Approved" : "Approve"}</div>
          <div style={{ background: C.mint, ...T(30, 500), color: C.pine, padding: "18px 38px", borderRadius: 14, opacity: ok ? 0.3 : 1 }}>Reject</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 130, right: 130, top: 800, ...card, background: "#e6f5ea", padding: "24px 40px", display: "flex", alignItems: "center", gap: 14, transform: `translateY(${(1 - ver) * 60}px) scale(${0.9 + ver * 0.1})`, opacity: ver }}>
        <div style={{ ...T(34, 700), color: "#1f9d55" }}>✓ Verified</div>
        <div style={{ ...T(26), color: C.text }}>read back from</div><Img src="github.svg" size={28} /><div style={{ ...T(26), color: C.text }}>GitHub</div>
      </div>
      {/* cursor */}
      <svg width="54" height="54" viewBox="0 0 24 24" style={{ position: "absolute", left: cx, top: cy, transform: `scale(${tap})`, filter: "drop-shadow(0 6px 10px rgba(5,31,32,.3))", opacity: f > 100 ? 1 - ease(f, 100, 110) : 1 }}>
        <path d="M4 2l16 10-7 1.5L9.5 21z" fill="#fff" stroke={C.ink} strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    </Scene>
  );
}

const RECEIPT: Array<[string, string]> = [["Cost", "$0.018"], ["AI", "Gemini Flash"], ["Time", "41 s"], ["Fingerprint", "0x9f3a…c21e"]];
function Payoff() {
  const f = useCurrentFrame();
  const drop = useSpring(2, 9, 1);
  const slam = f >= 58;
  const shake = slam ? Math.sin((f - 58) * 2.2) * Math.max(0, 1 - (f - 58) / 14) * 10 : 0;
  const badge = useSpring(60, 8);
  const glow = slam ? ease(f, 58, 70) * (1 - ease(f, 90, 120) * 0.5) : 0;
  const stamp = interpolate(f, [30, 54, 58, 70], [-160, -200, 20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.2, 1) });
  return (
    <Scene len={120}>
      <AbsoluteFill style={{ transform: `scale(${1 + ease(f, 0, 120) * 0.05}) translateX(${shake}px)` }}>
        <Kinetic words={["A", "receipt", "out."]} at={2} size={120} stagger={5} accent={[1, 2]} style={{ position: "absolute", top: 110, width: "100%" }} />
        <div style={{ position: "absolute", left: 110, top: 330, width: 560, ...card, padding: "30px 40px", transform: `translateY(${(1 - drop) * -500}px) rotate(${(1 - drop) * -8}deg)` }}>
          <div style={{ font: "700 20px ST", letterSpacing: ".18em", color: C.muted }}>RECEIPT · RUN #128</div>
          {RECEIPT.map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderTop: `1px solid ${C.line}`, marginTop: i ? 0 : 14, opacity: ease(f, 10 + i * 6, 24 + i * 6) }}>
              <span style={{ ...T(30), color: C.muted }}>{k}</span><span style={{ ...T(30, 500) }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, borderRadius: 18, background: slam ? "#e6f5ea" : C.mint, padding: "18px 22px", display: "flex", alignItems: "center", gap: 12, transform: `scale(${slam ? 0.9 + badge * 0.1 : 1})`, boxShadow: `0 0 ${glow * 60}px rgba(31,157,85,${glow * 0.55})` }}>
            <Img src="robinhood.svg" size={36} />
            <span style={{ ...T(30, 500) }}>Saved on Robinhood Chain</span>
            <span style={{ ...T(38, 700), color: "#1f9d55", marginLeft: "auto", opacity: slam ? 1 : 0, transform: `scale(${badge})` }}>✓</span>
          </div>
        </div>
        <div style={{ position: "absolute", right: 70, top: 420, transform: `translateY(${stamp}px)` }}><Mascot pose="stamp" h={440} /></div>
        <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", ...T(34), color: C.muted, opacity: ease(f, 74, 92) }}>Public. Anyone can check it.</div>
      </AbsoluteFill>
    </Scene>
  );
}

function EndCard() {
  const f = useCurrentFrame();
  const m = useSpring(2, 11);
  const logo = useSpring(10, 12);
  const tick = useSpring(22, 12);
  const line = ease(f, 30, 50);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", left: 90, bottom: 150, transform: `translateY(${(1 - m) * 300}px) rotate(${(1 - m) * -10}deg)` }}><Mascot pose="float" h={420} /></div>
      <div style={{ position: "absolute", left: 420, top: 330 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20, transform: `scale(${logo})`, transformOrigin: "0% 50%" }}>
          <Logo size={110} />
          <div style={{ font: "500 124px/1 MR", letterSpacing: "-0.04em", color: C.ink }}>intern</div>
        </div>
        <div style={{ marginTop: 34, display: "inline-flex", ...T(56, 600), color: "#fff", background: "linear-gradient(293deg, #051f20, #163b32 50%, #235347)", padding: "16px 30px", borderRadius: 18, transform: `translateY(${(1 - tick) * 40}px)`, opacity: tick }}>$INTERN</div>
        <div style={{ ...T(46), marginTop: 34, clipPath: `inset(0 ${(1 - line) * 100}% 0 0)` }}>Your bag runs an agent.</div>
        <div style={{ ...T(32), color: C.muted, marginTop: 18, display: "flex", alignItems: "center", gap: 10, opacity: ease(f, 44, 60) }}>
          intern.money · on <Img src="robinhood.svg" size={30} /> Robinhood Chain
        </div>
      </div>
    </AbsoluteFill>
  );
}

export function HowItWorks() {
  return (
    <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
      <style>{FONT}</style>
      <Backdrop />
      <Sequence from={0} durationInFrames={120}><Hook /></Sequence>
      <Sequence from={120} durationInFrames={180}><Setup /></Sequence>
      <Sequence from={300} durationInFrames={120}><Pays /></Sequence>
      <Sequence from={420} durationInFrames={120}><Works /></Sequence>
      <Sequence from={540} durationInFrames={120}><Asks /></Sequence>
      <Sequence from={660} durationInFrames={120}><Payoff /></Sequence>
      <Sequence from={780} durationInFrames={120}><EndCard /></Sequence>
    </AbsoluteFill>
  );
}
