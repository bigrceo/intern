// LIVE image (1600×900): "we are live", no ticker, the mascot, the site's palette and font.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const sharp = req(process.env.SHARP ?? "sharp");
const poses = readFileSync("design/mascot-poses.svg", "utf8");
const pose = (n) => poses.split(/<g transform="translate\(\d+ 40\)">/).find((c) => c.includes(`>${n}</text>`)).match(/viewBox="150 50 300 500">([\s\S]*)<\/svg><text/)[1];
const rh = readFileSync("public/brands/robinhood.svg", "utf8");
const rhV = (rh.match(/viewBox="([^"]+)"/) || [, "0 0 24 24"])[1];
const rhIn = rh.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/fill="[^"]*"/g, "").replace(/<path/g, '<path fill="#00C805"');
const RH = (x, y, s) => `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="${rhV}">${rhIn}</svg>`;
const F = "Manrope, Helvetica, Arial";
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
  <defs>
    <radialGradient id="g1" cx="76%" cy="42%" r="62%"><stop offset="0" stop-color="#82bf95" stop-opacity=".9"/><stop offset=".55" stop-color="#daf1de" stop-opacity=".6"/><stop offset="1" stop-color="#fcfffd" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="8%" cy="110%" r="55%"><stop offset="0" stop-color="#8eb69b" stop-opacity=".5"/><stop offset="1" stop-color="#fcfffd" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1600" height="900" fill="#fcfffd"/><rect width="1600" height="900" fill="url(#g1)"/><rect width="1600" height="900" fill="url(#g2)"/>
  <rect x="80" y="150" width="190" height="52" rx="26" fill="#e6f5ea"/>
  <circle cx="110" cy="176" r="9" fill="#1f9d55"/><circle cx="110" cy="176" r="17" fill="#1f9d55" opacity=".2"/>
  <text x="132" y="184" font-family="${F}" font-weight="600" font-size="22" fill="#1f9d55" letter-spacing="3">LIVE NOW</text>
  <text x="74" y="350" font-family="${F}" font-size="150" fill="#051f20" letter-spacing="-6">We are</text>
  <text x="74" y="500" font-family="${F}" font-size="150" fill="#235347" letter-spacing="-6">live.</text>
  <text x="80" y="590" font-family="${F}" font-size="32" fill="#163b32">Intern is open. Write one sentence,</text>
  <text x="80" y="636" font-family="${F}" font-size="32" fill="#163b32">your intern gets to work.</text>
  <line x1="80" x2="1520" y1="780" y2="780" stroke="#051f20" stroke-opacity=".1"/>
  <text x="80" y="830" font-family="${F}" font-weight="600" font-size="22" fill="#163b32" letter-spacing="2">INTERN.MONEY</text>
  ${RH(1196, 810, 24)}<text x="1228" y="830" font-family="${F}" font-weight="600" font-size="22" fill="#163b32" letter-spacing="2">ROBINHOOD CHAIN</text>
  <svg x="1020" y="70" width="460" height="680" viewBox="150 50 300 500">${pose("float")}</svg>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile("x-launch-pack/img/L1-live.png");
console.log("ok");
