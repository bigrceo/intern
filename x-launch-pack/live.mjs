// LIVE image v2 (1600×900): dark forest, the mascot lit on a mint halo holding up a LIVE card, confetti, three proof chips. No ticker.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const sharp = req(process.env.SHARP ?? "sharp");
const poses = readFileSync("design/mascot-poses.svg", "utf8");
const pose = (n) => poses.split(/<g transform="translate\(\d+ 40\)">/).find((c) => c.includes(`>${n}</text>`)).match(/viewBox="150 50 300 500">([\s\S]*)<\/svg><text/)[1];
const mark = (file, color) => {
  const s = readFileSync(`public/brands/${file}`, "utf8");
  const v = (s.match(/viewBox="([^"]+)"/) || [, "0 0 24 24"])[1];
  const inner = s.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>[\s\S]*?<\/title>/, "").replace(/fill="[^"]*"/g, "").replace(/<path/g, `<path fill="${color}"`);
  return (x, y, sz) => `<svg x="${x}" y="${y}" width="${sz}" height="${sz}" viewBox="${v}">${inner}</svg>`;
};
const RH = mark("robinhood.svg", "#00C805");
const orbio = (x, y, s) => `<image x="${x}" y="${y}" width="${s}" height="${s}" href="data:image/png;base64,${readFileSync("public/brands/orbio.png").toString("base64")}"/>`;
const F = "Manrope, Helvetica, Arial";
// deterministic confetti
let seed = 7; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const confetti = Array.from({ length: 46 }, () => {
  const x = 860 + rnd() * 700, y = 40 + rnd() * 760, r = rnd() * 360, w = 8 + rnd() * 12, c = ["#daf1de", "#8eb69b", "#ffffff", "#c9ead0", "#f4b6a8"][Math.floor(rnd() * 5)];
  return rnd() > 0.45 ? `<rect x="${x}" y="${y}" width="${w}" height="${w * 0.45}" rx="2" fill="${c}" opacity="${0.55 + rnd() * 0.45}" transform="rotate(${r} ${x} ${y})"/>` : `<circle cx="${x}" cy="${y}" r="${w * 0.32}" fill="${c}" opacity="${0.5 + rnd() * 0.5}"/>`;
}).join("");
const chip = (x, label, iconFn) => `<g><rect x="${x}" y="676" width="${label.length * 12.4 + (iconFn ? 64 : 40)}" height="54" rx="27" fill="#ffffff" fill-opacity=".08" stroke="#daf1de" stroke-opacity=".25"/>${iconFn ? iconFn(x + 16, 690, 26) : ""}<text x="${x + (iconFn ? 50 : 20)}" y="711" font-family="${F}" font-weight="500" font-size="22" fill="#daf1de">${label}</text></g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#051f20"/><stop offset=".55" stop-color="#0b2b26"/><stop offset="1" stop-color="#163b32"/></linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#daf1de"/><stop offset=".55" stop-color="#8eb69b" stop-opacity=".55"/><stop offset="1" stop-color="#8eb69b" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow" cx="25%" cy="20%" r="60%"><stop offset="0" stop-color="#235347" stop-opacity=".9"/><stop offset="1" stop-color="#051f20" stop-opacity="0"/></radialGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .05 0"/></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/><rect width="1600" height="900" fill="url(#glow)"/>
  <circle cx="1210" cy="430" r="380" fill="url(#halo)" opacity=".85"/>
  ${confetti}
  <text x="72" y="330" font-family="${F}" font-size="148" fill="#ffffff" letter-spacing="-6">Intern</text>
  <text x="72" y="480" font-family="${F}" font-size="148" fill="#8eb69b" letter-spacing="-6">is live.</text>
  <text x="80" y="570" font-family="${F}" font-size="34" fill="#daf1de">Write one sentence. Your intern does the job.</text>
  <text x="80" y="618" font-family="${F}" font-size="34" fill="#daf1de" fill-opacity=".7">Your bag pays for it.</text>
  ${chip(80, "One sentence in")}
  ${chip(320, "Paid by $ORBIO", orbio)}
  ${chip(574, "Receipt on Robinhood Chain", RH)}
  <text x="80" y="830" font-family="${F}" font-weight="700" font-size="26" fill="#ffffff" letter-spacing="3">INTERN.MONEY</text>
  <!-- mascot with a LIVE card in hand -->
  <svg x="980" y="110" width="470" height="700" viewBox="150 50 300 500">${pose("float")}</svg>
  <g transform="translate(1316 470) rotate(8)">
    <rect x="0" y="0" width="200" height="96" rx="18" fill="#ffffff" stroke="#051f20" stroke-width="5"/>
    <circle cx="40" cy="48" r="13" fill="#e5484d"/><circle cx="40" cy="48" r="24" fill="#e5484d" opacity=".2"/>
    <text x="70" y="62" font-family="${F}" font-weight="800" font-size="40" fill="#051f20" letter-spacing="1">LIVE</text>
  </g>
  <rect width="1600" height="900" filter="url(#n)"/>
</svg>`;
await sharp(Buffer.from(svg)).png().toFile("x-launch-pack/img/L1-live.png");
console.log("ok");
