import { z } from "zod";
import * as store from "./store";
import { pickModel } from "./model";
import { runLoop, type LocalTool } from "./llm";
import { Cadence, CADENCE_MS } from "./spec";
import { CADENCE_WORDS, cadenceReply } from "./budget";
import { runOne } from "./scheduler";
import { compileJob } from "./compile";
import { launchIntern } from "./launch";
import { TEMPLATE_IDS } from "./spec";
import { DOC_FORMATS, DOC_MIME, renderDocument, safeFilename } from "./documents";
import { fileSink } from "./files";
import type { TelegramConn } from "./connections/telegram";
import type { GmailConn } from "./connections/gmail";
import { buildTools } from "./tools";

/**
 * The owner talks to their interns in Telegram. Free text from a linked chat
 * comes here: a small model call with tools that can read interns and runs,
 * run one now, pause/resume, and change the cadence. Billed to the owner's own
 * Orbio key (any of their interns holds one), so a holder with no key yet
 * gets a plain pointer instead.
 */

const CHARACTER = `You are the owner's intern concierge in Telegram: the voice of their small agents.
Terse, warm, concrete. One to four short sentences, no markdown, no emoji, no bullet lists unless listing interns.
You can: list their interns and what each does, report the latest result, run an intern now, pause or resume one, change how often it runs, send an intern's latest report as a file (pdf, docx, txt or md) to this chat and its page, and spawn a new intern from a one-sentence job ("spawn an intern that watches wallet 0x…", "make me one that digests my repo nightly").
When Gmail is connected you can also work in their inbox right now: gmail_read for "what's in my email", "anything from X?", "find the invoice"; gmail_draft when they ask you to draft or prepare a reply (it lands in their Gmail drafts); gmail_send when they say send or reply for them, gmail_forward to pass an email on, and gmail_organize for archive, label, star, mark read, spam, trash ("delete" means trash; it empties itself after 30 days). For bulk asks ("clear my spam", "archive all the newsletters") use gmail_organize with a search q rather than reading each one. Sending, forwarding and tidying always ask them first: a card with Approve / Reject appears here; say so in one line and stop. Read a message before replying to it. "Send me a PDF/report of my email": read what's needed, then write_document with the report; it lands in this chat. Never quote one-time codes, passwords or bank details. When something recurring is asked ("every morning tell me what came in"), spawn an inbox intern instead of doing it once.
When spawning, pass the owner's words as the sentence; pick the template yourself. Tell them its name, what it will do, how often, and that it is running its first check now. Include the tool's note if there is one.
If they ask for something you cannot do (connections, spending, deleting), say so in one line and point to the site.
Never speculate on price or give financial advice. Never ask for keys or wallet access.
When you run something now, say it started and that the result will arrive here in about a minute.
Use tool results; do not invent interns, runs or numbers.`;


export async function concierge(owner: string, text: string, opts: { appUrl: string; fetch?: typeof fetch; runNow?: (id: string) => Promise<unknown> } ): Promise<string> {
  const interns = await store.listInterns(owner);
  const key = interns.find((m) => m.key?.key)?.key?.key ?? process.env.COMPILE_API_KEY;
  const gm = await store.getConnection<GmailConn>(owner, "gmail");
  if (!interns.length && !gm && !/\b(spawn|make|create|launch|start|new)\b/i.test(text)) return `You have no interns yet. Launch one at ${opts.appUrl}/app/new, or tell me what it should do ("spawn an intern that watches $ORBIO liquidity") and I'll make it.`;
  if (!key) return `Your interns haven't claimed a key yet, so I can't think on your behalf until the first run. Ask again after that, or manage them at ${opts.appUrl}/app.`;

  const byName = (q: string) => {
    const s = q.trim().toLowerCase();
    return interns.find((m) => m.id === s || m.name.toLowerCase() === s) ?? interns.find((m) => m.name.toLowerCase().includes(s)) ?? (interns.length === 1 ? interns[0] : undefined);
  };
  const describe = (m: (typeof interns)[number]) => ({
    id: m.id,
    name: m.name,
    job: m.spec.objective,
    cadence: CADENCE_WORDS[m.cadence as Cadence],
    status: m.status,
    nextRunInMinutes: m.status === "paused" ? null : Math.max(0, Math.round((m.nextRunAt - Date.now()) / 60_000)),
    runs: m.runsTotal,
    failed: m.runsFailed,
    spentUsd: Number(m.spentTotalUsd.toFixed(4)),
    fuelUsd: m.key ? Number((m.key.limitUsd - m.key.spentUsd).toFixed(2)) : null,
    page: `${opts.appUrl}/s/${m.id}`,
  });

  const tool = <S extends z.ZodType>(t: { name: string; description: string; inputSchema: S; execute: (a: z.infer<S>) => Promise<unknown> }): LocalTool => ({ name: t.name, description: t.description, schema: t.inputSchema, execute: t.execute as never });
  const tgConnForFiles = gm ? await store.getConnection<TelegramConn>(owner, "telegram") : null;
  const gmailTools = gm
    ? buildTools(["gmail_read", "gmail_draft", "gmail_send", "gmail_forward", "gmail_organize", "write_document"], {
        fetch: opts.fetch,
        delivery: {},
        connections: { gmail: { owner, email: gm.data.email } },
        propose: { owner, internId: "concierge", internName: "Your concierge", runId: null, autopilot: false, fetch: opts.fetch },
        files: fileSink({ owner, internId: "concierge", runId: null, chatId: tgConnForFiles?.data.chatId, fetch: opts.fetch }),
      }).tools
    : [];
  const tools = [
    ...gmailTools,
    tool({
      name: "list_interns",
      description: "The owner's interns: job, cadence, status, next run, spend, fuel.",
      inputSchema: z.object({}),
      execute: async () => ({ interns: interns.map(describe) }),
    }),
    tool({
      name: "latest_runs",
      description: "Most recent results of one intern (title, summary, cost, when).",
      inputSchema: z.object({ intern: z.string().describe("name or id"), limit: z.number().int().min(1).max(5).optional() }),
      execute: async ({ intern, limit }) => {
        const m = byName(intern);
        if (!m) return { error: "no such intern" };
        const runs = await store.listRuns(m.id, limit ?? 3);
        return { intern: m.name, runs: runs.map((r) => ({ when: new Date(r.at).toISOString(), status: r.status, title: r.title, summary: r.summary, body: r.body.slice(0, 1200), costUsd: r.costUsd, sources: r.sources.slice(0, 5), anchored: !!r.txHash, error: r.error })) };
      },
    }),
    tool({
      name: "run_now",
      description: "Start an intern's job immediately. The result is delivered to this chat when it finishes.",
      inputSchema: z.object({ intern: z.string() }),
      execute: async ({ intern }) => {
        const m = byName(intern);
        if (!m) return { error: "no such intern" };
        if (!(await store.claimNow(m.id))) return { started: false, note: "already running" };
        void (opts.runNow ?? ((id: string) => runOne(id, { fetch: opts.fetch })))(m.id);
        return { started: true, intern: m.name };
      },
    }),
    tool({
      name: "set_cadence",
      description: "Change how often an intern runs.",
      inputSchema: z.object({ intern: z.string(), cadence: Cadence }),
      execute: async ({ intern, cadence }) => {
        const m = byName(intern);
        if (!m) return { error: "no such intern" };
        await store.updateIntern(m.id, { spec: { ...m.spec, cadence }, cadence, nextRunAt: Math.min(m.nextRunAt, Date.now() + CADENCE_MS[cadence]) });
        return { ok: true, tellOwner: cadenceReply(m.name, m.spec, cadence, m.earnPerDayUsd) };
      },
    }),
    tool({
      name: "send_report_file",
      description: "Send an intern's latest report (or its last few) to the owner as a file: pdf, docx, txt or md. The file is also kept on the intern page.",
      inputSchema: z.object({ intern: z.string(), format: z.enum(DOC_FORMATS).default("pdf"), runs: z.number().int().min(1).max(5).default(1) }),
      execute: async ({ intern, format, runs: n }) => {
        const m = byName(intern);
        if (!m) return { error: "no such intern" };
        const runs = (await store.listRuns(m.id, n)).filter((r) => r.status !== "quiet" || n === 1);
        if (!runs.length) return { error: `${m.name} has no report yet` };
        const content = runs
          .map((r) => [`# ${r.title}`, `_${new Date(r.at).toISOString().slice(0, 16).replace("T", " ")} UTC · ${r.status}_`, "", r.summary, "", ...(r.sections ?? []).map((sec) => `- **${sec.check}** — ${sec.finding}`), "", r.body, r.sources.length ? `\nSources: ${r.sources.join(", ")}` : ""].join("\n"))
          .join("\n\n");
        const title = runs.length === 1 ? `${m.name} · ${runs[0].title}` : `${m.name} · last ${runs.length} reports`;
        const bytes = await renderDocument({ format, title, content, footer: `${m.name} · ${m.spec.objective} · every run hashed on Robinhood Chain` });
        const tgConn = await store.getConnection<TelegramConn>(owner, "telegram");
        const r = await fileSink({ owner, internId: m.id, runId: runs[0].id, chatId: tgConn?.data.chatId, fetch: opts.fetch })({ name: safeFilename(title, format), mime: DOC_MIME[format], bytes, caption: title });
        return { ok: r.ok, file: safeFilename(title, format), sentTo: r.sentTo, tellOwner: r.sentTo?.includes("telegram") ? "The file is right above this message and on the intern page." : "Saved on the intern page; link Telegram to receive files here." };
      },
    }),
    tool({
      name: "spawn_intern",
      description: "Create a new intern for the owner from one plain sentence describing its job. It is compiled, planned against the bag, and starts its first run at once. Use only when the owner asks for a new intern.",
      inputSchema: z.object({
        sentence: z.string().min(8).max(400).describe("The job, in the owner's words"),
        template: z.enum(TEMPLATE_IDS).describe("market-watch for tokens/pools/wallets on Robinhood Chain, repo-mechanic for a GitHub repo, inbox for the owner's Gmail, digest for reading sources, custom otherwise"),
        name: z.string().min(2).max(24).optional().describe("Only if the owner named it"),
      }),
      execute: async ({ sentence, template, name }) => {
        const spec = await compileJob(key, { sentence, template, name });
        const r = await launchIntern(owner, spec, { fetch: opts.fetch });
        if (!r.ok) return { error: r.error };
        return { ok: true, intern: describe(r.intern), firstRunStarted: r.firstRunStarted, note: r.familyNote || undefined };
      },
    }),
    tool({
      name: "pause_or_resume",
      description: "Pause an intern (keeps its fuel) or resume it.",
      inputSchema: z.object({ intern: z.string(), action: z.enum(["pause", "resume"]) }),
      execute: async ({ intern, action }) => {
        const m = byName(intern);
        if (!m) return { error: "no such intern" };
        const ok = action === "pause" ? await store.setStatusIfNotRunning(m.id, "paused") : await store.setStatusIfNotRunning(m.id, "idle", Date.now() + 60_000);
        if (!ok) return { ok: false, intern: m.name, note: "it is running right now; try again in a minute" };
        return { ok: true, intern: m.name, status: action === "pause" ? "paused" : "resumed, next run in a minute" };
      },
    }),
  ];

  try {
    const r = await runLoop({
      key,
      model: pickModel(0, "compile"),
      instructions: `${CHARACTER}\n\nIt is ${new Date().toISOString()}. The owner has ${interns.length} intern${interns.length === 1 ? "" : "s"}: ${interns.map((m) => `${m.name} (${CADENCE_WORDS[m.spec.cadence]}, ${m.status})`).join(", ") || "none yet"}. ${gm ? `Gmail is connected as ${gm.data.email}.` : "Gmail is not connected (they can under Connections on the site)."} Site: ${opts.appUrl}`,
      input: text,
      tools,
      maxCostUsd: 0.03,
      maxSteps: gm ? 6 : 4,
      fetch: opts.fetch,
    });
    const reply = r.text.trim();
    return reply || "Done.";
  } catch (e) {
    const msg = String((e as Error).message ?? e);
    if (/401|user not found|unauthorized|402|insufficient/i.test(msg)) return `Your interns' key isn't working right now; it rotates on the next run. Meanwhile: ${opts.appUrl}/app`;
    throw e;
  }
}
