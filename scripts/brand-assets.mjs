// Renders every raster brand asset from the SVG mark: physics tile, favicon, apple icon, OG image.
// Run: node scripts/brand-assets.mjs   (re-run after changing the mark or the name)
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)(process.env.SHARP ?? "sharp");
import { writeFileSync } from "node:fs";

const NAME = process.argv[2] ?? "intern";
const TAG = process.argv[3] ?? "Your bag hires an intern.";
const mark = (ink = "#051f20", face = "#ffffff", tip = "#8eb69b") => `
  <rect x="40" y="4" width="20" height="16" rx="5" fill="${tip}"/>
  <rect x="16" y="14" width="68" height="82" rx="18" fill="${ink}"/>
  <rect x="38" y="20" width="24" height="6" rx="3" fill="${face}" opacity="0.35"/>
  <rect x="26" y="34" width="48" height="40" rx="12" fill="${face}"/>
  <circle cx="41" cy="52" r="4.6" fill="${ink}"/><circle cx="59" cy="52" r="4.6" fill="${ink}"/>
  <path d="M43 63Q50 68 57 63" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
  <rect x="30" y="81" width="40" height="5" rx="2.5" fill="${face}" opacity="0.35"/>`;

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="#daf1de"/><g transform="translate(14 12) scale(.72)">${mark()}</g></svg>`;
writeFileSync("src/app/icon.svg", icon);
await sharp(Buffer.from(icon)).resize(180, 180).png().toFile("src/app/apple-icon.png");
await sharp(Buffer.from(icon)).resize(48, 48).png().toFile("public/favicon-48.png");

const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="340"><defs><linearGradient id="g" gradientTransform="rotate(-67 .5 .5)"><stop offset="0" stop-color="#051f20"/><stop offset=".5" stop-color="#163b32"/><stop offset="1" stop-color="#235347"/></linearGradient></defs><rect x="12" y="12" width="316" height="316" rx="56" fill="url(#g)"/><g transform="translate(80 74) scale(1.8)">${mark("#daf1de", "#163b32", "#8eb69b")}</g></svg>`;
await sharp(Buffer.from(tile)).png().toFile("public/physics/brand.png");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><radialGradient id="h" cx="80%" cy="20%" r="80%"><stop offset="0" stop-color="#82bf95" stop-opacity=".75"/><stop offset=".55" stop-color="#daf1de" stop-opacity=".6"/><stop offset="1" stop-color="#fcfffd"/></radialGradient></defs>
  <rect width="1200" height="630" fill="#fcfffd"/><rect width="1200" height="630" fill="url(#h)"/>
  <g transform="translate(90 90) scale(1.1)">${mark()}</g>
  <text x="220" y="168" font-family="Manrope, Helvetica, Arial" font-size="64" font-weight="500" fill="#051f20" letter-spacing="-1">${NAME}</text>
  <text x="90" y="380" font-family="Manrope, Helvetica, Arial" font-size="84" fill="#051f20" letter-spacing="-3.4">${TAG}</text>
  <text x="90" y="470" font-family="Manrope, Helvetica, Arial" font-size="30" fill="#163b32">AI agents paid by your staked $ORBIO. No card, nothing to set up.</text>
</svg>`;
await sharp(Buffer.from(og)).png().toFile("public/og.png");
console.log("brand assets written");
