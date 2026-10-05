// Coin logo, 1000×1000 square (launchpads crop it to a circle): the mascot's badge head, big, on the mint gradient.
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const sharp = req(process.env.SHARP ?? "sharp");
const head = `
  <path d="M270 92 q30 -46 60 0" stroke="#8eb69b" stroke-width="10" fill="none" stroke-linecap="round"/>
  <rect x="276" y="92" width="48" height="34" rx="11" fill="#8eb69b" stroke="#051f20" stroke-width="5"/>
  <rect x="196" y="116" width="208" height="236" rx="54" fill="#051f20"/>
  <rect x="266" y="134" width="68" height="14" rx="7" fill="#fcfffd" opacity=".3"/>
  <rect x="222" y="166" width="156" height="128" rx="34" fill="#fcfffd"/>
  <circle cx="266" cy="222" r="13" fill="#051f20"/><circle cx="334" cy="222" r="13" fill="#051f20"/>
  <circle cx="270" cy="218" r="4.2" fill="#fff"/><circle cx="338" cy="218" r="4.2" fill="#fff"/>
  <ellipse cx="248" cy="252" rx="9" ry="5" fill="#f4b6a8" opacity=".85"/><ellipse cx="352" cy="252" rx="9" ry="5" fill="#f4b6a8" opacity=".85"/>
  <path d="M282 258 q18 16 36 0" stroke="#051f20" stroke-width="7" fill="none" stroke-linecap="round"/>
  <rect x="240" y="314" width="120" height="12" rx="6" fill="#fcfffd" opacity=".3"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000">
  <defs><radialGradient id="g" cx="50%" cy="35%" r="70%"><stop offset="0" stop-color="#ebfcef"/><stop offset=".55" stop-color="#daf1de"/><stop offset="1" stop-color="#8eb69b"/></radialGradient></defs>
  <rect width="1000" height="1000" fill="url(#g)"/>
  <svg x="190" y="150" width="620" height="760" viewBox="185 40 230 320">${head}</svg></svg>`;
await sharp(Buffer.from(svg)).png().toFile("x-launch-pack/img/coin-logo.png");
console.log("ok");
