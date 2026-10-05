// Rename the product word in user-facing text only: string literals, template text and JSX text, found with the
// TypeScript parser so identifiers, imports, SQL and keys are never touched.
//   node scripts/rename.mjs intern intern     (then: npx tsc --noEmit && the tests)
import ts from "typescript";
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const [OLD, NEW] = process.argv.slice(2).map((s) => s.toLowerCase());
const an = (w) => ("aeiou".includes(w[0]) ? "an" : "a");
const SQL = /\b(SELECT|INSERT INTO|UPDATE \w+ SET|DELETE FROM|CREATE TABLE|ALTER TABLE|FROM \w+|JOIN)\b/;
const word = new RegExp(`(?<![\\w.$/@?&=#:-])(${OLD[0].toUpperCase()}|${OLD[0]})${OLD.slice(1)}(s?)(?![\\w(\\[_/:-])(?!\\.[a-z_]\\w*\\()`, "g");

function rewrite(text) {
  if (SQL.test(text)) return text;
  if (/^[\w-]+$/.test(text.trim()) && text.trim().toLowerCase().startsWith(OLD) && !/\s/.test(text)) return text; // bare token: a key, kind, id
  let out = text.replace(word, (m, first, s) => {
    const w = NEW + s;
    return first === first.toUpperCase() ? w[0].toUpperCase() + w.slice(1) : w;
  });
  if (out !== text) {
    const want = an(NEW), other = want === "an" ? "a" : "an";
    out = out.replace(new RegExp(`\\b${other} (${NEW})`, "g"), `${want} $1`).replace(new RegExp(`\\b${other[0].toUpperCase() + other.slice(1)} (${NEW})`, "gi"), (m, w) => `${want[0].toUpperCase() + want.slice(1)} ${w}`);
  }
  return out;
}

const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(p) && files.push(p); });
(process.argv[4] ? process.argv.slice(4) : ["src"]).forEach(walk);

let changed = 0;
for (const file of files) {
  const src = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits = [];
  const visit = (node) => {
    const k = node.kind;
    const p = node.parent;
    const isKey = p && (ts.isPropertyAssignment(p) || ts.isPropertySignature(p) || ts.isElementAccessExpression(p)) && (p.name === node || p.argumentExpression === node);
    const isModule = p && (ts.isImportDeclaration(p) || ts.isExportDeclaration(p) || (ts.isCallExpression(p) && /^(import|require)$/.test(p.expression.getText(sf))));
    const isTypeLit = p && ts.isLiteralTypeNode(p);
    const isCompare = p && ts.isBinaryExpression(p) && /===|!==|==|!=/.test(p.operatorToken.getText(sf));
    const isCase = p && ts.isCaseClause(p);
    const isAttr = p && ts.isJsxAttribute(p) && /^(href|src|id|htmlFor|name|key|data-|aria-controls)/.test(p.name.getText(sf));
    if ((k === ts.SyntaxKind.StringLiteral || k === ts.SyntaxKind.NoSubstitutionTemplateLiteral) && !isKey && !isModule && !isTypeLit && !isCompare && !isCase && !isAttr) {
      edits.push([node.getStart(sf) + 1, node.getEnd() - 1]);
    } else if (k === ts.SyntaxKind.TemplateHead || k === ts.SyntaxKind.TemplateMiddle || k === ts.SyntaxKind.TemplateTail) {
      const start = node.getStart(sf) + 1;
      const end = node.getEnd() - (k === ts.SyntaxKind.TemplateTail ? 1 : 2);
      edits.push([start, end]);
    } else if (k === ts.SyntaxKind.JsxText) {
      edits.push([node.getStart(sf), node.getEnd()]);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  let out = src;
  for (const [a, b] of edits.sort((x, y) => y[0] - x[0])) {
    const seg = out.slice(a, b);
    const r = rewrite(seg);
    if (r !== seg) out = out.slice(0, a) + r + out.slice(b);
  }
  if (out !== src) { writeFileSync(file, out); changed++; }
}
console.log(`${changed} files changed`);
