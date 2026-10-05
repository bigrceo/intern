// Article images: cover 1500×600 (5:2) and three 1600×900 inline visuals, in the site's palette, font and mascot.
import { readFileSync, mkdirSync } from "node:fs";
import * as require_fs from "node:fs";
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const sharp = req(process.env.SHARP ?? "sharp");
mkdirSync("x-launch-pack/img/article", { recursive: true });

const poses = readFileSync("design/mascot-poses.svg", "utf8");
const pose = (n) => {
  const cell = poses.split(/<g transform="translate\(\d+ 40\)">/).find((c) => c.includes(`>${n}</text>`));
  return cell.match(/viewBox="150 50 300 500">([\s\S]*)<\/svg><text/)[1];
};
const mark = (file, color) => {
  const s = readFileSync(`public/brands/${file}`, "utf8");
  const vb = (s.match(/viewBox="([^"]+)"/) || [, "0 0 24 24"])[1];
  const inner = s.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
  return (x, y, sz) => `<svg x="${x}" y="${y}" width="${sz}" height="${sz}" viewBox="${vb}">${color ? inner.replace(/fill="[^"]*"/g, "").replace(/<path/g, `<path fill="${color}"`) : inner}</svg>`;
};
const RH = mark("robinhood.svg", "#00C805"), GH = mark("github.svg", "#051f20"), TG = mark("telegram.svg", "#26A5E4");
const orbio = (x, y, sz) => `<image x="${x}" y="${y}" width="${sz}" height="${sz}" href="data:image/png;base64,${readFileSync("public/brands/orbio.png").toString("base64")}"/>`;
const F = "Manrope, Helvetica, Arial";
const bg = (w, h) => `<defs>
  <radialGradient id="g1" cx="80%" cy="35%" r="65%"><stop offset="0" stop-color="#82bf95" stop-opacity=".8"/><stop offset=".6" stop-color="#daf1de" stop-opacity=".5"/><stop offset="1" stop-color="#fcfffd" stop-opacity="0"/></radialGradient>
  <radialGradient id="g2" cx="10%" cy="110%" r="55%"><stop offset="0" stop-color="#8eb69b" stop-opacity=".5"/><stop offset="1" stop-color="#fcfffd" stop-opacity="0"/></radialGradient>
  <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="28" flood-color="#13213a" flood-opacity=".14"/></filter>
</defs><rect width="${w}" height="${h}" fill="#fcfffd"/><rect width="${w}" height="${h}" fill="url(#g1)"/><rect width="${w}" height="${h}" fill="url(#g2)"/>`;
const foot = (w, h) => `<line x1="80" x2="${w - 80}" y1="${h - 80}" y2="${h - 80}" stroke="#051f20" stroke-opacity=".1"/>
  <text x="80" y="${h - 40}" font-family="${F}" font-weight="600" font-size="20" fill="#163b32" letter-spacing="2">INTERN.MONEY</text>
  ${RH(w - 330, h - 58, 22)}<text x="${w - 302}" y="${h - 40}" font-family="${F}" font-weight="600" font-size="20" fill="#163b32" letter-spacing="2">ROBINHOOD CHAIN</text>`;
const render = (svg, out) => (require_fs.writeFileSync(`x-launch-pack/img/article/${out}.svg`, svg), sharp(Buffer.from(svg)).png().toFile(`x-launch-pack/img/article/${out}`));

// Cover 1500×600
await render(`<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="600">${bg(1500, 600)}
  <text x="90" y="150" font-family="${F}" font-weight="600" font-size="20" fill="#235347" letter-spacing="3">AI AGENTS PAID BY YOUR BAG</text>
  <text x="86" y="270" font-family="${F}" font-size="104" fill="#051f20" letter-spacing="-4">Your bag runs</text>
  <text x="86" y="384" font-family="${F}" font-size="104" fill="#235347" letter-spacing="-4">an agent.</text>
  <text x="90" y="460" font-family="${F}" font-size="28" fill="#163b32">One sentence in. A receipt out.</text>
  <svg x="1060" y="40" width="360" height="530" viewBox="150 50 300 500">${pose("float")}</svg></svg>`, "cover.png");

// 1 · How it works: four steps with the mascot's gestures
const steps = [["listen", "01", "Say the job", "One sentence, like a text."], ["sign", "02", "Your wallet is the key", "One signature. No account."], ["work", "03", "It works while you don't", "Your schedule, your budget."], ["stamp", "04", "It leaves a receipt", "Public, on Robinhood Chain."]];
await render(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${bg(1600, 900)}
  <text x="80" y="110" font-family="${F}" font-weight="600" font-size="20" fill="#235347" letter-spacing="3">HOW IT WORKS</text>
  <text x="78" y="180" font-family="${F}" font-size="60" fill="#051f20" letter-spacing="-2">Four steps. <tspan fill="#235347">Zero setup.</tspan></text>
  ${steps.map(([p, n, t, d], i) => { const x = 80 + i * 368; return `<g filter="url(#sh)"><rect x="${x}" y="240" width="336" height="520" rx="22" fill="#ffffff"/></g>
    <rect x="${x + 14}" y="254" width="308" height="300" rx="16" fill="#daf1de"/>
    <svg x="${x + 64}" y="262" width="208" height="290" viewBox="150 50 300 500">${pose(p)}</svg>
    <text x="${x + 28}" y="604" font-family="${F}" font-weight="600" font-size="18" fill="#8eb69b" letter-spacing="2">${n}</text>
    <text x="${x + 28}" y="650" font-family="${F}" font-size="${t.length > 20 ? 25 : 28}" fill="#051f20" letter-spacing="-0.5">${t}</text>
    ${i === 3 ? `<text x="${x + 28}" y="694" font-family="${F}" font-size="21" fill="#3f6355">Public, on</text>${RH(x + 128, 677, 20)}<text x="${x + 152}" y="694" font-family="${F}" font-size="21" fill="#3f6355">Robinhood Chain.</text>` : `<text x="${x + 28}" y="694" font-family="${F}" font-size="21" fill="#3f6355">${d}</text>`}`; }).join("")}
  ${foot(1600, 900)}</svg>`, "1-how-it-works.png");

// 2 · The receipt
const rows = [["Job", "ORBIO liquidity watch"], ["Cost", "$0.018, paid in CREDIT"], ["AI model", "Gemini Flash"], ["Time", "41 seconds"], ["Fingerprint", "0x9f3a…c21e"]];
await render(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${bg(1600, 900)}
  <text x="80" y="140" font-family="${F}" font-weight="600" font-size="20" fill="#235347" letter-spacing="3">EVERY JOB LEAVES A RECEIPT</text>
  <text x="78" y="220" font-family="${F}" font-size="64" fill="#051f20" letter-spacing="-2">Don't trust it.</text>
  <text x="78" y="296" font-family="${F}" font-size="64" fill="#235347" letter-spacing="-2">Check it.</text>
  <text x="80" y="370" font-family="${F}" font-size="26" fill="#3f6355">What it cost, which AI, how long,</text>
  <text x="80" y="408" font-family="${F}" font-size="26" fill="#3f6355">and a fingerprint of what it wrote.</text>
  <g filter="url(#sh)"><rect x="880" y="150" width="620" height="600" rx="26" fill="#ffffff"/></g>
  <text x="930" y="220" font-family="${F}" font-weight="600" font-size="18" fill="#8a9a90" letter-spacing="2">RECEIPT · RUN #128</text>
  ${rows.map(([k, v], i) => `<line x1="930" x2="1450" y1="${250 + i * 72}" y2="${250 + i * 72}" stroke="#051f20" stroke-opacity=".07"/>
    <text x="930" y="${296 + i * 72}" font-family="${F}" font-size="24" fill="#5c876a">${k}</text>
    <text x="1450" y="${296 + i * 72}" text-anchor="end" font-family="${F}" font-size="24" fill="#051f20">${v}</text>`).join("")}
  <rect x="930" y="636" width="520" height="70" rx="14" fill="#daf1de"/>
  ${RH(956, 656, 30)}<text x="998" y="680" font-family="${F}" font-size="24" fill="#163b32">Saved on Robinhood Chain</text>
  <text x="1426" y="681" text-anchor="end" font-family="${F}" font-weight="600" font-size="26" fill="#1f9d55">✓</text>
  <svg x="700" y="520" width="170" height="250" viewBox="150 50 300 500">${pose("stamp")}</svg>
  ${foot(1600, 900)}</svg>`, "2-receipt.png");

// 3 · It asks before it acts (Telegram card, GitHub action, read back)
await render(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${bg(1600, 900)}
  <text x="80" y="140" font-family="${F}" font-weight="600" font-size="20" fill="#235347" letter-spacing="3">IT ASKS BEFORE IT ACTS</text>
  <text x="78" y="220" font-family="${F}" font-size="64" fill="#051f20" letter-spacing="-2">Your intern drafts.</text>
  <text x="78" y="296" font-family="${F}" font-size="64" fill="#235347" letter-spacing="-2">You decide.</text>
  <text x="80" y="370" font-family="${F}" font-size="26" fill="#3f6355">Pull requests, issues, new interns: nothing goes out</text>
  <text x="80" y="408" font-family="${F}" font-size="26" fill="#3f6355">without your OK. Autopilot is your call.</text>
  <g filter="url(#sh)"><rect x="880" y="170" width="620" height="520" rx="26" fill="#ffffff"/></g>
  ${TG(926, 210, 34)}<text x="974" y="236" font-family="${F}" font-size="24" fill="#051f20">Intern · Telegram</text>
  <rect x="926" y="270" width="528" height="250" rx="18" fill="#f3faf5"/>
  <text x="954" y="314" font-family="${F}" font-weight="600" font-size="16" fill="#8a9a90" letter-spacing="2">WAITING FOR YOUR OK</text>
  ${GH(954, 336, 28)}<text x="994" y="358" font-family="${F}" font-size="24" fill="#051f20">Open a pull request</text>
  <text x="954" y="402" font-family="${F}" font-size="21" fill="#3f6355">“Add today's CHANGELOG entry”</text>
  <rect x="954" y="440" width="170" height="54" rx="10" fill="#163b32"/><text x="1039" y="475" text-anchor="middle" font-family="${F}" font-size="21" fill="#ffffff">Approve</text>
  <rect x="1140" y="440" width="150" height="54" rx="10" fill="#daf1de"/><text x="1215" y="475" text-anchor="middle" font-family="${F}" font-size="21" fill="#163b32">Reject</text>
  <rect x="926" y="548" width="528" height="98" rx="18" fill="#e6f5ea"/>
  <text x="954" y="590" font-family="${F}" font-weight="600" font-size="22" fill="#1f9d55">✓ Verified</text>
  <text x="954" y="624" font-family="${F}" font-size="19" fill="#3f6355">Read back from</text>${GH(1094, 606, 22)}<text x="1124" y="624" font-family="${F}" font-size="19" fill="#3f6355">GitHub, matches what you approved.</text>
  <svg x="700" y="510" width="170" height="250" viewBox="150 50 300 500">${pose("sign")}</svg>
  ${foot(1600, 900)}</svg>`, "3-asks-first.png");

// 4 · Paid by your bag
await render(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">${bg(1600, 900)}
  <text x="80" y="140" font-family="${F}" font-weight="600" font-size="20" fill="#235347" letter-spacing="3">WHO PAYS</text>
  <text x="78" y="220" font-family="${F}" font-size="64" fill="#051f20" letter-spacing="-2">Not your card.</text>
  <text x="78" y="296" font-family="${F}" font-size="64" fill="#235347" letter-spacing="-2">Your bag.</text>
  ${[["Stake", "$ORBIO", true], ["It earns", "CREDIT every hour", false], ["CREDIT pays", "your intern's work", false]].map(([a, b, logo], i) => { const x = 80 + i * 470; return `<g filter="url(#sh)"><rect x="${x}" y="400" width="420" height="230" rx="22" fill="#ffffff"/></g>
    <text x="${x + 36}" y="470" font-family="${F}" font-weight="600" font-size="18" fill="#8eb69b" letter-spacing="2">0${i + 1}</text>
    <text x="${x + 36}" y="530" font-family="${F}" font-size="34" fill="#051f20" letter-spacing="-1">${a}</text>
    ${logo ? `${orbio(x + 36, 556, 34)}<text x="${x + 80}" y="584" font-family="${F}" font-size="26" fill="#3f6355">${b}</text>` : `<text x="${x + 36}" y="584" font-family="${F}" font-size="26" fill="#3f6355">${b}</text>`}
    ${i < 2 ? `<text x="${x + 432}" y="526" font-family="${F}" font-size="40" fill="#8eb69b">→</text>` : ""}`; }).join("")}
  <text x="80" y="720" font-family="${F}" font-size="26" fill="#3f6355">1 CREDIT = $1 of AI. No card, no API key. Sell the bag and it stops.</text>
  <svg x="1330" y="90" width="200" height="290" viewBox="150 50 300 500">${pose("float")}</svg>
  ${foot(1600, 900)}</svg>`, "4-who-pays.png");
console.log("ok");
