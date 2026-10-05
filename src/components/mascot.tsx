/**
 * The intern, the mascot: our badge mark come alive (badge head with a screen face, sage clip and loop, green
 * hoodie), coffee in one hand, a bag of $ORBIO in the other. Pure SVG + CSS animation (globals.css, `.mascot-*`),
 * static under reduced motion.
 *
 * Poses: float (hero), rest (footer, 404: eyes closed), think (working: blinks, steam rises, head tilts),
 * and the four "How it works" gestures: listen, sign, work, stamp.
 */
export type MascotPose = "float" | "rest" | "think" | "listen" | "sign" | "work" | "stamp";

const INK = "#051f20", FOREST = "#235347", SAGE = "#8eb69b", MINT = "#daf1de", CREAM = "#fcfffd", BLUSH = "#f4b6a8", TAN = "#d9b779", TAN2 = "#b8924f";

export function Mascot({ size = 240, pose = "float", className = "", title = "The intern" }: { size?: number; pose?: MascotPose; className?: string; title?: string }) {
  const closed = pose === "rest";
  return (
    <svg viewBox="150 70 300 470" width={(size * 300) / 470} height={size} role="img" aria-label={title} className={`mascot mascot-${pose} ${className}`} style={{ overflow: "visible" }}>
      <ellipse className="mascot-shadow" cx="300" cy="520" rx="110" ry="14" fill={INK} opacity=".12" />
      <g className="mascot-body">
        {/* legs */}
        <rect x="250" y="440" width="34" height="62" rx="16" fill={INK} />
        <rect x="316" y="440" width="34" height="62" rx="16" fill={INK} />
        {/* hoodie */}
        <rect x="236" y="340" width="128" height="120" rx="44" fill={FOREST} stroke={INK} strokeWidth="5" />
        <path d="M300 344 v40" stroke={MINT} strokeWidth="5" strokeLinecap="round" />
        {/* left arm + coffee */}
        <g className="mascot-arm-l">
          <path d="M244 380 q-50 10 -46 60" stroke={INK} strokeWidth="22" fill="none" strokeLinecap="round" />
          <g transform="translate(200 448) scale(1.15)">
            <path className="mascot-steam" d="M-4 -34 q6 -8 0 -16 M8 -34 q6 -8 0 -16" stroke={SAGE} strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M-16 -26 h40 l-5 44 a6 6 0 0 1 -6 5 h-18 a6 6 0 0 1 -6 -5 z" fill={CREAM} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <rect x="-14" y="-6" width="36" height="13" fill={FOREST} />
            <rect x="-19" y="-32" width="46" height="9" rx="4" fill={INK} />
          </g>
        </g>
        {/* right arm + $ORBIO bag (or the gesture prop) */}
        <g className="mascot-arm-r">
          <path d="M356 380 q50 10 46 60" stroke={INK} strokeWidth="22" fill="none" strokeLinecap="round" />
          {pose === "sign" ? (
            <g transform="translate(404 440)">
              <rect x="-26" y="-34" width="52" height="64" rx="8" fill={CREAM} stroke={INK} strokeWidth="4" />
              <path d="M-14 -16 h28 M-14 -4 h28 M-14 8 h16" stroke={SAGE} strokeWidth="4" strokeLinecap="round" />
              <path className="mascot-pen" d="M6 16 l18 -26" stroke={INK} strokeWidth="5" strokeLinecap="round" />
            </g>
          ) : pose === "stamp" ? (
            <g className="mascot-stamp" transform="translate(406 432)">
              <rect x="-20" y="-30" width="40" height="22" rx="8" fill={FOREST} stroke={INK} strokeWidth="4" />
              <rect x="-6" y="-44" width="12" height="16" rx="5" fill={INK} />
              <rect x="-26" y="-10" width="52" height="12" rx="4" fill={SAGE} stroke={INK} strokeWidth="4" />
            </g>
          ) : pose === "work" ? (
            <g transform="translate(406 440)">
              <rect x="-34" y="-28" width="68" height="46" rx="8" fill={INK} />
              <rect x="-28" y="-22" width="56" height="34" rx="5" fill={MINT} />
              <path className="mascot-typing" d="M-20 -12 h22 M-20 -2 h34 M-20 8 h14" stroke={FOREST} strokeWidth="4" strokeLinecap="round" />
            </g>
          ) : (
            <g transform="translate(404 462)">
              <path d="M-30 -20 q-14 40 6 52 h48 q20 -12 6 -52 z" fill={TAN} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
              <path d="M-26 -22 q26 -14 52 0 l-6 8 q-20 -8 -40 0 z" fill={TAN2} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
              <circle cx="0" cy="12" r="14" fill={CREAM} stroke={INK} strokeWidth="3.5" />
              <text x="0" y="18" textAnchor="middle" fontFamily="Helvetica, Arial" fontWeight="700" fontSize="16" fill={INK}>O</text>
            </g>
          )}
        </g>
        {/* head: the badge */}
        <g className="mascot-head">
          <path className="mascot-loop" d="M270 92 q30 -46 60 0" stroke={SAGE} strokeWidth="10" fill="none" strokeLinecap="round" />
          <rect x="276" y="92" width="48" height="34" rx="11" fill={SAGE} stroke={INK} strokeWidth="5" />
          <rect x="196" y="116" width="208" height="236" rx="54" fill={INK} />
          <rect x="266" y="134" width="68" height="14" rx="7" fill={CREAM} opacity=".3" />
          <rect x="222" y="166" width="156" height="128" rx="34" fill={CREAM} />
          {closed ? (
            <path d="M254 224 q12 10 24 0 M322 224 q12 10 24 0" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />
          ) : (
            <g className="mascot-eyes">
              <circle cx="266" cy="222" r="13" fill={INK} />
              <circle cx="334" cy="222" r="13" fill={INK} />
              <circle cx="270" cy="218" r="4.2" fill="#fff" />
              <circle cx="338" cy="218" r="4.2" fill="#fff" />
            </g>
          )}
          <ellipse cx="248" cy="252" rx="9" ry="5" fill={BLUSH} opacity=".8" />
          <ellipse cx="352" cy="252" rx="9" ry="5" fill={BLUSH} opacity=".8" />
          {pose === "listen" ? <ellipse cx="300" cy="264" rx="9" ry="10" fill={INK} /> : <path d="M282 258 q18 16 36 0" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />}
          <rect x="240" y="314" width="120" height="12" rx="6" fill={CREAM} opacity=".3" />
        </g>
        {pose === "rest" && (
          <g className="mascot-zz" fill={SAGE} fontFamily="Helvetica, Arial" fontWeight="700">
            <text x="400" y="120" fontSize="34">z</text>
            <text x="428" y="88" fontSize="24">z</text>
          </g>
        )}
        {pose === "listen" && (
          <g className="mascot-bubble">
            <rect x="380" y="70" width="70" height="44" rx="14" fill="#fff" stroke={INK} strokeWidth="4" />
            <circle cx="400" cy="92" r="4.5" fill={INK} /><circle cx="415" cy="92" r="4.5" fill={INK} /><circle cx="430" cy="92" r="4.5" fill={INK} />
          </g>
        )}
      </g>
    </svg>
  );
}
