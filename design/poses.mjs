import ts from "typescript";
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
const req = createRequire(process.cwd() + "/package.json");
const src = readFileSync("src/components/mascot.tsx", "utf8");
const js = ts.transpileModule(src, { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = { exports: {} }; new Function("require", "module", "exports", js)(req, mod, mod.exports);
const React = req("react"); const { renderToStaticMarkup } = req("react-dom/server");
const poses = ["float", "listen", "sign", "work", "stamp", "rest"];
const cells = poses.map((p, i) => {
  const svg = renderToStaticMarkup(React.createElement(mod.exports.Mascot, { size: 300, pose: p }));
  const inner = svg.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  return `<g transform="translate(${40 + i * 300} 40)"><rect width="270" height="380" rx="24" fill="#daf1de"/><svg x="25" y="20" width="220" height="330" viewBox="150 50 300 500">${inner}</svg><text x="135" y="368" text-anchor="middle" font-family="Helvetica" font-size="20" fill="#163b32">${p}</text></g>`;
}).join("");
const board = `<svg xmlns="http://www.w3.org/2000/svg" width="1860" height="460"><rect width="1860" height="460" fill="#f3faf5"/>${cells}</svg>`;
writeFileSync("design/mascot-poses.svg", board);
await req(process.env.SHARP)(Buffer.from(board)).png().toFile("design/mascot-poses.png");
console.log("ok");
