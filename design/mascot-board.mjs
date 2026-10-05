// Mascot board: three directions for "the intern", drawn in SVG, rendered to PNG.
import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";
const sharp = createRequire(import.meta.url)(process.env.SHARP ?? "sharp");

const INK = "#051f20", PINE = "#163b32", FOREST = "#235347", SAGE = "#8eb69b", MINT = "#daf1de", CREAM = "#fcfffd", BLUSH = "#f4b6a8", TAN = "#d9b779", TAN2 = "#b8924f";

const coffee = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-4 -34 q6 -8 0 -16 M8 -34 q6 -8 0 -16" stroke="${SAGE}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
  <path d="M-16 -26 h40 l-5 44 a6 6 0 0 1 -6 5 h-18 a6 6 0 0 1 -6 -5 z" fill="${CREAM}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <rect x="-14" y="-6" width="36" height="13" fill="${FOREST}"/>
  <rect x="-19" y="-32" width="46" height="9" rx="4" fill="${INK}"/></g>`;
const bag = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-30 -20 q-14 40 6 52 h48 q20 -12 6 -52 z" fill="${TAN}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M-26 -22 q26 -14 52 0 l-6 8 q-20 -8 -40 0 z" fill="${TAN2}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
  <circle cx="0" cy="12" r="14" fill="${CREAM}" stroke="${INK}" stroke-width="3.5"/>
  <text x="0" y="18" text-anchor="middle" font-family="Helvetica, Arial" font-weight="700" font-size="16" fill="${INK}">O</text></g>`;
const eyes = (cx, cy, gap, r = 7) => `<circle cx="${cx - gap}" cy="${cy}" r="${r}" fill="${INK}"/><circle cx="${cx + gap}" cy="${cy}" r="${r}" fill="${INK}"/>
  <circle cx="${cx - gap + 2.5}" cy="${cy - 2.5}" r="${r * 0.32}" fill="#fff"/><circle cx="${cx + gap + 2.5}" cy="${cy - 2.5}" r="${r * 0.32}" fill="#fff"/>`;
const blush = (cx, cy, gap) => `<ellipse cx="${cx - gap}" cy="${cy}" rx="9" ry="5" fill="${BLUSH}" opacity=".8"/><ellipse cx="${cx + gap}" cy="${cy}" rx="9" ry="5" fill="${BLUSH}" opacity=".8"/>`;

// A — Badge Buddy: the logo come alive. Head = the ID badge, little body, coffee + bag.
const A = `
  <ellipse cx="300" cy="520" rx="120" ry="16" fill="${INK}" opacity=".12"/>
  <rect x="250" y="440" width="34" height="62" rx="16" fill="${INK}"/><rect x="316" y="440" width="34" height="62" rx="16" fill="${INK}"/>
  <rect x="236" y="340" width="128" height="120" rx="44" fill="${FOREST}" stroke="${INK}" stroke-width="5"/>
  <path d="M300 344 v40" stroke="${MINT}" stroke-width="5" stroke-linecap="round"/>
  <path d="M244 380 q-50 10 -46 60" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M356 380 q50 10 46 60" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
  ${coffee(200, 448, 1.15)}${bag(404, 462, 1.0)}
  <path d="M270 92 q30 -46 60 0" stroke="${SAGE}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <rect x="276" y="92" width="48" height="34" rx="11" fill="${SAGE}" stroke="${INK}" stroke-width="5"/>
  <rect x="196" y="116" width="208" height="236" rx="54" fill="${INK}"/>
  <rect x="266" y="134" width="68" height="14" rx="7" fill="${CREAM}" opacity=".3"/>
  <rect x="222" y="166" width="156" height="128" rx="34" fill="${CREAM}"/>
  ${eyes(300, 222, 34, 13)}${blush(300, 252, 52)}
  <path d="M282 258 q18 16 36 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <rect x="240" y="314" width="120" height="12" rx="6" fill="${CREAM}" opacity=".3"/>`;

// B — The Intern: round head, backwards cap, lanyard + INTERN badge on a green hoodie, coffee in hand.
const B = `
  <ellipse cx="300" cy="520" rx="120" ry="16" fill="${INK}" opacity=".12"/>
  <rect x="252" y="446" width="34" height="58" rx="16" fill="${INK}"/><rect x="314" y="446" width="34" height="58" rx="16" fill="${INK}"/>
  <path d="M220 470 q0 -130 80 -130 q80 0 80 130 z" fill="${FOREST}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M262 346 l38 64 l38 -64" stroke="${SAGE}" stroke-width="8" fill="none" stroke-linejoin="round"/>
  <rect x="272" y="404" width="56" height="44" rx="9" fill="${CREAM}" stroke="${INK}" stroke-width="4"/>
  <text x="300" y="432" text-anchor="middle" font-family="Helvetica, Arial" font-weight="800" font-size="11" fill="${INK}">INTERN</text>
  <path d="M232 400 q-40 20 -24 60" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M368 400 q34 10 30 56" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
  ${coffee(212, 466, 1.1)}${bag(408, 476, 0.9)}
  <circle cx="300" cy="230" r="118" fill="${CREAM}" stroke="${INK}" stroke-width="6"/>
  <path d="M190 210 q10 -118 110 -118 q100 0 110 118 q-110 -30 -220 0 z" fill="${MINT}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M360 122 q60 -6 84 22 q-30 18 -64 6" fill="${SAGE}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <circle cx="300" cy="104" r="9" fill="${FOREST}" stroke="${INK}" stroke-width="4"/>
  ${eyes(300, 250, 40, 14)}${blush(300, 282, 62)}
  <path d="M280 288 q20 18 40 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>`;

// C — Overtime: a soft mint blob, sleepy eyes, tie, glasses pushed up, coffee — the tired-but-working intern meme.
const C = `
  <ellipse cx="300" cy="520" rx="130" ry="16" fill="${INK}" opacity=".12"/>
  <path d="M170 470 q-20 -250 130 -280 q150 30 130 280 q-130 40 -260 0 z" fill="${MINT}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
  <path d="M300 352 l-18 18 l18 80 l18 -80 z" fill="${FOREST}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M282 344 h36 l-18 14 z" fill="${PINE}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M232 214 h56 M312 214 h56" stroke="${INK}" stroke-width="5"/>
  <circle cx="260" cy="210" r="26" fill="none" stroke="${INK}" stroke-width="6"/><circle cx="340" cy="210" r="26" fill="none" stroke="${INK}" stroke-width="6"/>
  <path d="M286 210 h28" stroke="${INK}" stroke-width="6"/>
  <path d="M244 278 q16 10 32 0 M324 278 q16 10 32 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M244 296 q16 6 32 0 M324 296 q16 6 32 0" stroke="${SAGE}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".9"/>
  <path d="M284 322 q16 8 32 0" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M176 380 q-36 20 -20 64" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
  <path d="M424 380 q36 20 20 64" stroke="${INK}" stroke-width="22" fill="none" stroke-linecap="round"/>
  ${coffee(160, 462, 1.15)}${bag(444, 470, 0.95)}
  <text x="400" y="150" font-family="Helvetica, Arial" font-weight="700" font-size="30" fill="${SAGE}">z</text><text x="424" y="122" font-family="Helvetica, Arial" font-weight="700" font-size="22" fill="${SAGE}">z</text>`;

const panel = (x, art, letter, name, line) => `<g transform="translate(${x} 0)">
  <rect x="20" y="20" width="560" height="760" rx="36" fill="#ffffff"/>
  <rect x="40" y="40" width="520" height="560" rx="26" fill="url(#haze)"/>
  <g transform="translate(0 30)">${art}</g>
  <text x="56" y="660" font-family="Helvetica, Arial" font-weight="700" font-size="20" fill="${SAGE}" letter-spacing="3">${letter}</text>
  <text x="56" y="700" font-family="Helvetica, Arial" font-size="38" fill="${INK}" letter-spacing="-1">${name}</text>
  <text x="56" y="740" font-family="Helvetica, Arial" font-size="20" fill="${PINE}">${line}</text></g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="800">
  <defs><radialGradient id="haze" cx="50%" cy="20%" r="85%"><stop offset="0" stop-color="#ebfcef"/><stop offset=".55" stop-color="${MINT}"/><stop offset="1" stop-color="#9ecaa9"/></radialGradient></defs>
  <rect width="1800" height="800" fill="#f3faf5"/>
  ${panel(0, A, "A", "Badge Buddy", "Our logo, alive. Badge head, coffee, $ORBIO bag.")}
  ${panel(600, B, "B", "The Intern", "Backwards cap, lanyard, INTERN badge.")}
  ${panel(1200, C, "C", "Overtime", "Sleepy, glasses, tie. Works while you don't.")}
</svg>`;
writeFileSync("design/mascot-board.svg", svg);
await sharp(Buffer.from(svg)).png().toFile(process.argv[2] ?? "design/mascot-board.png");
console.log("ok");
