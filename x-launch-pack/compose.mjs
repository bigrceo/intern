// X profile visuals: banner 1500×500 and avatar 1024×1024, from the mascot SVG and the site's palette and font.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const sharp = req(process.env.SHARP ?? "sharp");

const poses = readFileSync("design/mascot-poses.svg", "utf8");
const pose = (name) => poses.match(new RegExp(`<svg x="25" y="20" width="220" height="330" viewBox="150 50 300 500">([\\s\\S]*?)</svg><text[^>]*>${name}<`))[1];
const rh = readFileSync("public/brands/robinhood.svg", "utf8").replace(/<\?xml[^>]*>/, "");
const rhPath = rh.match(/<path[^>]*d="([^"]+)"/)[1];
const rhView = (rh.match(/viewBox="([^"]+)"/) || [, "0 0 24 24"])[1];
const FONT = "Manrope, Helvetica, Arial";

const haze = `<defs>
  <radialGradient id="h1" cx="78%" cy="40%" r="60%"><stop offset="0" stop-color="#82bf95" stop-opacity=".85"/><stop offset=".6" stop-color="#daf1de" stop-opacity=".55"/><stop offset="1" stop-color="#fcfffd" stop-opacity="0"/></radialGradient>
  <radialGradient id="h2" cx="20%" cy="110%" r="55%"><stop offset="0" stop-color="#8eb69b" stop-opacity=".5"/><stop offset="1" stop-color="#fcfffd" stop-opacity="0"/></radialGradient>
</defs>`;

// Banner: left third left empty for the avatar, title left of centre, mascot on the right.
const banner = `<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500">${haze}
  <rect width="1500" height="500" fill="#fcfffd"/><rect width="1500" height="500" fill="url(#h1)"/><rect width="1500" height="500" fill="url(#h2)"/>
  <text x="520" y="200" font-family="${FONT}" font-size="76" fill="#051f20" letter-spacing="-3">Your bag runs</text>
  <text x="520" y="284" font-family="${FONT}" font-size="76" fill="#235347" letter-spacing="-3">an agent.</text>
  <text x="522" y="350" font-family="${FONT}" font-weight="600" font-size="17" fill="#163b32" letter-spacing="2.4">$INTERN  ·  ON</text>
  <svg x="667" y="335" width="18" height="18" viewBox="${rhView}"><path d="${rhPath}" fill="#00C805"/></svg>
  <text x="691" y="350" font-family="${FONT}" font-weight="600" font-size="17" fill="#163b32" letter-spacing="2.4">ROBINHOOD CHAIN</text>
  <svg x="1150" y="40" width="300" height="440" viewBox="150 50 300 500">${pose("float")}</svg>
</svg>`;
await sharp(Buffer.from(banner)).png().toFile("x-launch-pack/img/x-banner.png");

// Avatar: the mascot in full, ~14% margin, on the mint haze.
const avatar = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024">
  <defs><radialGradient id="a" cx="50%" cy="32%" r="78%"><stop offset="0" stop-color="#ebfcef"/><stop offset=".6" stop-color="#daf1de"/><stop offset="1" stop-color="#8eb69b"/></radialGradient></defs>
  <rect width="1024" height="1024" fill="url(#a)"/>
  <svg x="143" y="110" width="738" height="840" viewBox="130 40 340 470">${pose("float")}</svg></svg>`;
await sharp(Buffer.from(avatar)).png().toFile("x-launch-pack/img/pfp.png");
console.log("ok");
