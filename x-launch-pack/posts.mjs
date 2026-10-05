// Launch-day bullish posts, 1600×900, dark forest style of the live image. One shared frame, one visual per post.
import { readFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const sharp = req(process.env.SHARP ?? "sharp");
mkdirSync("x-launch-pack/img/posts", { recursive: true });
const poses = readFileSync("design/mascot-poses.svg", "utf8");
const pose = (n) => poses.split(/<g transform="translate\(\d+ 40\)">/).find((c) => c.includes(`>${n}</text>`)).match(/viewBox="150 50 300 500">([\s\S]*)<\/svg><text/)[1];
const M = (n, x, y, h) => `<svg x="${x}" y="${y}" width="${(h * 300) / 500}" height="${h}" viewBox="150 50 300 500">${pose(n)}</svg>`;
const mk = (file, color) => {
  const s = readFileSync(`public/brands/${file}`, "utf8");
  const v = (s.match(/viewBox="([^"]+)"/) || [, "0 0 24 24"])[1];
  const inner = s.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>[\s\S]*?<\/title>/, "").replace(/fill="[^"]*"/g, "").replace(/<path/g, `<path fill="${color}"`);
  return (x, y, sz) => `<svg x="${x}" y="${y}" width="${sz}" height="${sz}" viewBox="${v}">${inner}</svg>`;
};
const RH = mk("robinhood.svg", "#00C805"), TG = mk("telegram.svg", "#26A5E4"), GH = mk("github.svg", "#ffffff"), GHd = mk("github.svg", "#051f20");
const OR = (x, y, s) => `<image x="${x}" y="${y}" width="${s}" height="${s}" href="data:image/png;base64,${readFileSync("public/brands/orbio.png").toString("base64")}"/>`;
const F = "Manrope, Helvetica, Arial";
const esc = (t) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const frame = ({ label, l1, l2, body = [], art }) => `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#051f20"/><stop offset=".55" stop-color="#0b2b26"/><stop offset="1" stop-color="#163b32"/></linearGradient>
    <radialGradient id="halo" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#daf1de" stop-opacity=".9"/><stop offset=".55" stop-color="#8eb69b" stop-opacity=".4"/><stop offset="1" stop-color="#8eb69b" stop-opacity="0"/></radialGradient>
    <radialGradient id="glow" cx="20%" cy="15%" r="60%"><stop offset="0" stop-color="#235347" stop-opacity=".9"/><stop offset="1" stop-color="#051f20" stop-opacity="0"/></radialGradient>
    <filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="26" stdDeviation="30" flood-color="#000" flood-opacity=".45"/></filter>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .05 0"/></filter>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/><rect width="1600" height="900" fill="url(#glow)"/>
  <circle cx="1170" cy="440" r="400" fill="url(#halo)" opacity=".55"/>
  <text x="80" y="170" font-family="${F}" font-weight="700" font-size="22" fill="#8eb69b" letter-spacing="4">${esc(label)}</text>
  <text x="74" y="290" font-family="${F}" font-size="104" fill="#ffffff" letter-spacing="-4">${esc(l1)}</text>
  <text x="74" y="400" font-family="${F}" font-size="104" fill="#8eb69b" letter-spacing="-4">${esc(l2)}</text>
  ${body.map((b, i) => `<text x="80" y="${490 + i * 46}" font-family="${F}" font-size="31" fill="#daf1de" fill-opacity="${i ? 0.72 : 0.95}">${esc(b)}</text>`).join("")}
  <line x1="80" x2="1520" y1="790" y2="790" stroke="#daf1de" stroke-opacity=".12"/>
  <text x="80" y="840" font-family="${F}" font-weight="700" font-size="24" fill="#ffffff" letter-spacing="3">INTERN.MONEY</text>
  ${RH(1220, 820, 26)}<text x="1254" y="840" font-family="${F}" font-weight="700" font-size="24" fill="#daf1de" letter-spacing="3">ROBINHOOD CHAIN</text>
  ${art}
  <rect width="1600" height="900" filter="url(#n)"/>
</svg>`;

const phone = (x, y, inner, w = 380, h = 700) => `<g filter="url(#sh)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="56" fill="#0b1513" stroke="#2c4a42" stroke-width="3"/></g>
  <rect x="${x + 14}" y="${y + 14}" width="${w - 28}" height="${h - 28}" rx="44" fill="#eef4f0"/>
  <rect x="${x + w / 2 - 50}" y="${y + 26}" width="100" height="26" rx="13" fill="#0b1513"/>${inner}`;
const bubble = (x, y, w, lines, mine = false) => `<rect x="${x}" y="${y}" width="${w}" height="${30 + lines.length * 30}" rx="18" fill="${mine ? "#d6f5c9" : "#ffffff"}" stroke="#051f20" stroke-opacity=".06"/>${lines.map((l, i) => `<text x="${x + 18}" y="${y + 40 + i * 30}" font-family="${F}" font-size="21" fill="#051f20" ${i === 0 && !mine ? 'font-weight="600"' : ""}>${esc(l)}</text>`).join("")}`;

const posts = [
  // 1 · Telegram bot
  { file: "1-telegram-bot.png", label: "TELEGRAM BOT · LIVE", l1: "Your intern", l2: "texts you.", body: ["Reports, alerts and Approve / Reject buttons,", "right in Telegram. Reply to ask it anything."],
    art: phone(1000, 90, `${TG(1036, 132, 34)}<text x="1080" y="158" font-family="${F}" font-weight="600" font-size="24" fill="#051f20">Intern</text>
      ${bubble(1034, 196, 310, ["ORBIO watch · 09:00", "Liquidity +11.4% after", "a 220k ORBIO add.", "Price flat at $0.0412."])}
      ${bubble(1034, 380, 310, ["Waiting for your OK", "Open a pull request:", "today's changelog"])}
      <rect x="1034" y="510" width="146" height="48" rx="12" fill="#163b32"/><text x="1107" y="541" text-anchor="middle" font-family="${F}" font-size="21" fill="#fff">Approve</text>
      <rect x="1194" y="510" width="150" height="48" rx="12" fill="#daf1de"/><text x="1269" y="541" text-anchor="middle" font-family="${F}" font-size="21" fill="#163b32">Reject</text>
      ${bubble(1094, 590, 250, ["why did it move?"], true)}
      ${bubble(1034, 664, 310, ["One wallet added both sides.", "Here's the tx ↗"])}`) + M("listen", 1340, 470, 300) },
  // 2 · Telegram community
  { file: "2-telegram-community.png", label: "COMMUNITY", l1: "The break", l2: "room is open.", body: ["Our Telegram is live: share jobs, show your", "interns' reports, talk to the team."],
    art: `${[["# reports", "share what your intern found", 150], ["# jobs", "the best one-sentence jobs", 300], ["# builders", "talk to the team", 450], ["# app", "mobile app updates, first", 600]].map(([n, t, y], i) => `<g filter="url(#sh)"><rect x="${1030 + (i % 2) * 50}" y="${y}" width="${460}" height="104" rx="26" fill="#ffffff"/></g>
      <circle cx="${1080 + (i % 2) * 50}" cy="${y + 52}" r="26" fill="${["#daf1de", "#c9ead0", "#8eb69b", "#235347"][i]}"/>
      <text x="${1122 + (i % 2) * 50}" y="${y + 44}" font-family="${F}" font-weight="600" font-size="22" fill="#235347">${n}</text>
      <text x="${1122 + (i % 2) * 50}" y="${y + 76}" font-family="${F}" font-size="22" fill="#051f20">${esc(t)}</text>`).join("")}
      ${TG(1450, 80, 64)}` },
  // 3 · Mobile app coming
  { file: "3-app-coming.png", label: "IN THE WORKS", l1: "Your intern,", l2: "in your pocket.", body: ["A mobile app is on the way: launch jobs,", "approve actions, read reports, on the go."],
    art: phone(1020, 90, `<text x="1060" y="150" font-family="${F}" font-size="22" fill="#5c876a">9:41</text>
      <text x="1048" y="210" font-family="${F}" font-size="38" fill="#051f20" letter-spacing="-1">Your interns</text>
      ${[["ORBIO watch", "working", "#1f9d55"], ["Evening brief", "next run 9pm", "#5c876a"], ["Repo notes", "waiting for your OK", "#c98a1b"]].map(([t, s, c], i) => `<rect x="1048" y="${240 + i * 122}" width="324" height="104" rx="20" fill="#fff"/>
        <rect x="1066" y="${258 + i * 122}" width="56" height="66" rx="14" fill="#051f20"/><rect x="1074" y="${272 + i * 122}" width="40" height="30" rx="8" fill="#fff"/>
        <text x="1138" y="${286 + i * 122}" font-family="${F}" font-weight="600" font-size="24" fill="#051f20">${t}</text>
        <circle cx="1146" cy="${312 + i * 122}" r="6" fill="${c}"/><text x="1160" y="${319 + i * 122}" font-family="${F}" font-size="20" fill="${c}">${s}</text>`).join("")}
      <rect x="1048" y="634" width="324" height="70" rx="18" fill="#163b32"/><text x="1210" y="678" text-anchor="middle" font-family="${F}" font-weight="600" font-size="24" fill="#fff">+ New intern</text>`) + `<rect x="1400" y="120" width="150" height="50" rx="25" fill="#daf1de"/><text x="1475" y="153" text-anchor="middle" font-family="${F}" font-weight="700" font-size="20" fill="#163b32" letter-spacing="2">SOON</text>` },
  // 4 · Verifiable / open source
  { file: "4-check-it.png", label: "DON'T TRUST IT", l1: "Every job,", l2: "on-chain.", body: ["Cost, AI model, time and a fingerprint of", "every report. Open source. Check it yourself."],
    art: `<g filter="url(#sh)"><rect x="930" y="170" width="600" height="520" rx="30" fill="#ffffff"/></g>
      <text x="980" y="232" font-family="${F}" font-weight="700" font-size="19" fill="#8a9a90" letter-spacing="3">RECEIPT · RUN #128</text>
      ${[["Cost", "$0.018"], ["AI model", "Gemini Flash"], ["Time", "41 seconds"], ["Fingerprint", "0x9f3a…c21e"]].map(([k, v], i) => `<line x1="980" x2="1480" y1="${258 + i * 72}" y2="${258 + i * 72}" stroke="#051f20" stroke-opacity=".08"/><text x="980" y="${304 + i * 72}" font-family="${F}" font-size="26" fill="#5c876a">${k}</text><text x="1480" y="${304 + i * 72}" text-anchor="end" font-family="${F}" font-size="26" fill="#051f20">${v}</text>`).join("")}
      <rect x="980" y="560" width="500" height="80" rx="18" fill="#e6f5ea"/>${RH(1004, 582, 36)}<text x="1054" y="612" font-family="${F}" font-size="26" fill="#163b32">Saved on Robinhood Chain</text><text x="1452" y="613" text-anchor="end" font-family="${F}" font-weight="700" font-size="30" fill="#1f9d55">✓</text>
      <rect x="1160" y="96" width="370" height="56" rx="28" fill="#ffffff" fill-opacity=".1" stroke="#daf1de" stroke-opacity=".3"/>${GH(1182, 110, 28)}<text x="1222" y="133" font-family="${F}" font-size="22" fill="#daf1de">open source on GitHub</text>` + M("stamp", 760, 470, 300) },
  // 5 · Your bag pays
  { file: "5-bag-pays.png", label: "FOR $ORBIO HOLDERS", l1: "Your bag", l2: "has a job now.", body: ["Staked $ORBIO earns CREDIT every hour.", "CREDIT pays your intern. No card, ever."],
    art: `<g transform="translate(1000 300)"><path d="M-100 -60 q-46 140 20 180 h160 q66 -40 20 -180 z" fill="#d9b779" stroke="#051f20" stroke-width="8" stroke-linejoin="round"/><path d="M-88 -66 q88 -48 176 0 l-20 26 q-68 -26 -136 0 z" fill="#b8924f" stroke="#051f20" stroke-width="8" stroke-linejoin="round"/></g>${OR(950, 300, 100)}
      ${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${1130 + i * 64} ${300 - Math.sin((i / 4) * Math.PI) * 150})"><circle r="30" fill="#daf1de" stroke="#235347" stroke-width="6"/><text y="10" text-anchor="middle" font-family="${F}" font-weight="800" font-size="28" fill="#235347">C</text></g>`).join("")}
      <g filter="url(#sh)"><rect x="1220" y="380" width="300" height="190" rx="26" fill="#fff"/></g><text x="1250" y="430" font-family="${F}" font-weight="700" font-size="18" fill="#8a9a90" letter-spacing="3">AI BALANCE</text><text x="1250" y="500" font-family="${F}" font-size="64" fill="#051f20" letter-spacing="-2">$2.00</text><text x="1250" y="545" font-family="${F}" font-size="22" fill="#235347">+ CREDIT every hour</text>` + M("work", 1010, 470, 290) },
  // 6 · The sky
  { file: "6-the-sky.png", label: "THE SKY", l1: "Watch them", l2: "work. Live.", body: ["Every public intern, its latest report and", "its receipts. Like a job? Copy it in one click."],
    art: `${[[980, 160, 1, "ORBIO watch"], [1260, 210, 4, "Evening brief"], [1060, 400, 2, "Repo notes"], [1330, 450, 9, "Whale alert"], [1120, 610, 5, "Pool scout"]].map(([x, y, t, n]) => `<g filter="url(#sh)"><rect x="${x}" y="${y}" width="250" height="120" rx="24" fill="#fff"/></g>
      <circle cx="${x + 52}" cy="${y + 60}" r="34" fill="${["#daf1de", "#c9ead0", "#ebfcef", "#8eb69b", "#235347", "#e4f4e7", "#b8dcc2", "#cfe9d5", "#163b32", "#eef9f0"][t - 1]}"/>
      <rect x="${x + 36}" y="${y + 38}" width="32" height="40" rx="9" fill="#051f20"/><rect x="${x + 42}" y="${y + 47}" width="20" height="15" rx="4" fill="#fff"/>
      <text x="${x + 100}" y="${y + 54}" font-family="${F}" font-weight="600" font-size="22" fill="#051f20">${n}</text>
      <circle cx="${x + 108}" cy="${y + 82}" r="6" fill="#1f9d55"/><text x="${x + 122}" y="${y + 89}" font-family="${F}" font-size="19" fill="#1f9d55">working</text>`).join("")}` },
  // 7 · Hire your first intern
  { file: "7-hire.png", label: "HIRING NOW", l1: "Your first", l2: "intern is ready.", body: ["One sentence. One signature.", "Your bag pays its wage."],
    art: M("float", 1000, 80, 680) + `<g transform="translate(1330 470) rotate(-6)"><rect width="230" height="96" rx="18" fill="#fff" stroke="#051f20" stroke-width="5"/><text x="115" y="62" text-anchor="middle" font-family="${F}" font-weight="800" font-size="34" fill="#051f20">HIRE ME</text></g>` },
];
for (const p of posts) await sharp(Buffer.from(frame(p))).png().toFile(`x-launch-pack/img/posts/${p.file}`);
console.log(posts.map((p) => p.file).join(" "));
