// Profile picture: the mascot from the waist up on the mint haze, 800×800 (X and Telegram crop to a circle).
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const board = readFileSync("design/mascot-poses.svg", "utf8");
const inner = board.match(/<svg x="25" y="20" width="220" height="330" viewBox="150 50 300 500">([\s\S]*?)<\/svg><text[^>]*>float/)[1];
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
  <defs><radialGradient id="h" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#ebfcef"/><stop offset=".6" stop-color="#daf1de"/><stop offset="1" stop-color="#8eb69b"/></radialGradient></defs>
  <rect width="800" height="800" fill="url(#h)"/>
  <svg x="60" y="60" width="680" height="740" viewBox="130 40 340 470" preserveAspectRatio="xMidYMin meet">${inner}</svg></svg>`;
await req(process.env.SHARP)(Buffer.from(svg)).png().toFile(process.argv[2]);
console.log("ok");
