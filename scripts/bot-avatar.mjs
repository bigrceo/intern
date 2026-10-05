// The Telegram bot's profile picture: the badge mark on the template's mint, 640×640 (Telegram crops it to a circle).
import { createRequire } from "node:module";
const sharp = createRequire(import.meta.url)(process.env.SHARP ?? "sharp");
const mark = `
  <rect x="40" y="4" width="20" height="16" rx="5" fill="#8eb69b"/>
  <rect x="16" y="14" width="68" height="82" rx="18" fill="#051f20"/>
  <rect x="38" y="20" width="24" height="6" rx="3" fill="#fff" opacity="0.35"/>
  <rect x="26" y="34" width="48" height="40" rx="12" fill="#fff"/>
  <circle cx="41" cy="52" r="4.6" fill="#051f20"/><circle cx="59" cy="52" r="4.6" fill="#051f20"/>
  <path d="M43 63Q50 68 57 63" fill="none" stroke="#051f20" stroke-width="4" stroke-linecap="round"/>
  <rect x="30" y="81" width="40" height="5" rx="2.5" fill="#fff" opacity="0.35"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640">
  <defs><radialGradient id="h" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#ebfcef"/><stop offset=".6" stop-color="#daf1de"/><stop offset="1" stop-color="#8eb69b"/></radialGradient></defs>
  <rect width="640" height="640" fill="url(#h)"/>
  <g transform="translate(110 95) scale(4.2)">${mark}</g></svg>`;
await sharp(Buffer.from(svg)).png().toFile(process.argv[2] ?? "public/bot-avatar.png");
console.log("written");
