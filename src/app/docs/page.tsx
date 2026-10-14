import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { DocsNav } from "@/components/docs/DocsNav";
import { marks } from "@/components/inline-marks";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = { title: "Docs", description: `How ${BRAND.name} works: funding, jobs, approvals, on-chain receipts, contracts, API and source code.` };

const EXPLORER = "https://solscan.io";
const SOL_ANCHOR = process.env.NEXT_PUBLIC_ANCHOR_WALLET || "";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "how-it-works", label: "How it works" },
  { id: "funding", label: "Who pays" },
  { id: "jobs", label: "What it can do" },
  { id: "safety", label: "Approvals & safety" },
  { id: "receipts", label: "On-chain receipts" },
  { id: "verify", label: "Verify it yourself" },
  { id: "contracts", label: "Addresses" },
  { id: "api", label: "Public API" },
  { id: "source", label: "Source code" },
];

const Addr = ({ a, kind = "address" }: { a: string; kind?: "address" | "token" }) => (
  <a href={`${EXPLORER}/${kind}/${a}`} target="_blank" rel="noreferrer">
    <code>{a}</code>
  </a>
);

export default function DocsPage() {
  const n = BRAND.noun;
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-[1120px] px-4 pb-24 pt-[130px] sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
          <DocsNav items={SECTIONS} />
          <article className="prose-pl max-w-[780px]">
            <p className="eyebrow">Docs</p>
            <h1 className="mt-2 text-[40px]">{BRAND.name}, explained</h1>
            <p>Everything you need to check what {BRAND.name} does, how it is paid for, and where the proof lives. Every claim on this page links to something you can open yourself.</p>

            <h2 id="overview">Overview</h2>
            <p><strong>Your bag runs an agent.</strong> You write a job in one sentence. An AI {n} does it on your schedule, paid for by burning a little of your {marks("$INTERN", 14)} bag on {marks("Solana", 14)}. No card, no API key, nothing to install.</p>
            <ul>
              <li><strong>One sentence in</strong>: “Ping me if $INTERN liquidity moves 10%.” becomes a plan you can edit before anything runs.</li>
              <li><strong>It works while you don&apos;t</strong>: on your schedule, within the budget you set.</li>
              <li><strong>A receipt out</strong>: every job leaves a public receipt on {marks("Solana", 14)}.</li>
            </ul>

            <h2 id="how-it-works">How it works</h2>
            <ol>
              <li><strong>Sign in with your Solana wallet.</strong> Phantom, Solflare or Backpack: one signature, no transaction, no fee, no email, no password.</li>
              <li><strong>Burn a little $INTERN for AI credit.</strong> One transaction from your wallet; the burn is read back from the chain and credited at its market value.</li>
              <li><strong>Write the job.</strong> It is turned into a plan: which tools, which sources, how often, and a maximum spend per run. You can change all of it.</li>
              <li><strong>It runs.</strong> A scheduler wakes due {n}s every minute. Each run reads the chain, the market or the web, writes a report and sends it to Telegram, Discord or its public page.</li>
              <li><strong>It leaves a receipt.</strong> Cost, AI model, duration, the list of tools it used and a fingerprint (sha256) of what it wrote, written to Solana.</li>
            </ol>

            <h2 id="funding">Who pays</h2>
            <p>Your bag does. You <strong>burn $INTERN</strong> from your own Solana wallet (a standard SPL burn: the tokens are destroyed, not sent anywhere). {BRAND.name} reads the burn back from the chain, values it at the token&apos;s market price at that moment (DexScreener, deepest Solana pool) and adds that amount of <strong>AI credit</strong> to your account. Runs are billed to it at the model&apos;s real price; a typical run costs about 2¢.</p>
            <ul>
              <li>Every burn is counted once, and only for the wallet that signed it. Your burns are listed, with links to Solscan, under Connections.</li>
              <li>{BRAND.name} never holds your tokens or your private key. The only transaction you ever sign is your own burn.</li>
              <li>When the credit cannot pay for the next run, the {n} goes quiet and asks you once to burn a little more.</li>
              <li>Every run that uses AI burns supply: the more {n}s work, the less $INTERN there is.</li>
            </ul>

            <h2 id="jobs">What it can do</h2>
            <table>
              <thead><tr><th>Job</th><th>What it does</th><th>Typical cost</th></tr></thead>
              <tbody>
                <tr><td>Market watch</td><td>Price, liquidity, big transfers, new pools, a wallet you care about. Tells you only what moved.</td><td>~2¢ a run</td></tr>
                <tr><td>Repo watch</td><td>Reads a GitHub repo, opens issues and pull requests (with your OK).</td><td>~2¢ a run</td></tr>
                <tr><td>Digest</td><td>Reads the pages you name and sends one short brief.</td><td>~2¢ a run</td></tr>
                <tr><td>Custom</td><td>Anything you can say in a sentence, with search, fetch, chain and market tools.</td><td>~3¢ a run</td></tr>
                <tr><td>Inbox</td><td>Works in your Gmail: briefs, drafts, tidies. <em>Coming soon.</em></td><td>~4¢ a run</td></tr>
              </tbody>
            </table>
            <p>Alert jobs get a <strong>tripwire</strong>: one number is checked for free every 15 minutes, and the AI only wakes up when it crosses your line (at most once every three hours). AI models: Gemini Flash, GPT-5.6 Terra or Claude Sonnet 5, or Auto. If a model is down, the next one answers and the receipt names the one that did.</p>

            <h2 id="safety">Approvals &amp; safety</h2>
            <ul>
              <li><strong>It asks before it acts.</strong> Sending an email, opening a pull request, posting on X or launching another {n} creates a card you approve or reject, in the app or in Telegram. Autopilot is a separate switch per {n}; launching another {n} always asks.</li>
              <li><strong>What you approve is what runs.</strong> The exact draft is stored when it is proposed and executed once.</li>
              <li><strong>Checked after the fact.</strong> After an action, {BRAND.name} reads the result back from GitHub or Gmail and marks it <em>verified</em>, <em>mismatch</em> or <em>not checked</em>.</li>
              <li><strong>Fences in code, not in the prompt.</strong> GitHub writes only to repos named in the job; new emails only to addresses named in the job. Text inside a page or an email cannot widen that.</li>
              <li><strong>Private stays private.</strong> Runs that touch your mailbox or a private repo show only their receipt publicly. Connection tokens are encrypted at rest and deleted when you disconnect.</li>
            </ul>

            <h2 id="receipts">On-chain receipts</h2>
            <p>When a run finishes, its output is hashed (sha256) and a small transaction is sent on {marks("Solana", 14)} from the {BRAND.name} receipts wallet through the Memo program. The memo is the receipt, in plain text:</p>
            <pre><code>intern:v1:&lt;internId&gt;:&lt;runId&gt;:&lt;sha256 of the report&gt;:&lt;cost in micro-dollars&gt;:&lt;unix time&gt;</code></pre>
            <p>Anyone can decode it from the explorer and compare the hash with the report shown on the {n}&apos;s public page. Each public page lists every run with its hash and a link to its transaction.</p>

            <h2 id="verify">Verify it yourself (2 minutes)</h2>
            <ol>
              <li>Open any {n} on <a href="/sky">The sky</a> and pick a run.</li>
              <li>Click its transaction link: it opens on Solscan, signed by the receipts wallet below.</li>
              <li>Read the memo: the run id and the hash match the page.</li>
              <li>Or read it raw: <code>GET /api/interns/&lt;id&gt;/runs</code> returns every run with <code>outputHash</code>, <code>txHash</code> and <code>explorerUrl</code>.</li>
            </ol>

            <h2 id="contracts">Addresses</h2>
            <table>
              <tbody>
                {SOL_ANCHOR && <tr><td>Receipts wallet</td><td><a href={`https://solscan.io/account/${SOL_ANCHOR}`} target="_blank" rel="noreferrer"><code>{SOL_ANCHOR}</code></a></td></tr>}
                <tr><td>Memo program</td><td><a href="https://solscan.io/account/MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr" target="_blank" rel="noreferrer"><code>MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr</code></a></td></tr>
                <tr><td>Chain</td><td>{marks("Solana", 14)} mainnet</td></tr>
              </tbody>
            </table>

            <h2 id="api">Public API</h2>
            <p>Read-only, no key needed:</p>
            <ul>
              <li><code>GET /api/sky/stats</code>: {n}s alive, runs today, total spent.</li>
              <li><code>GET /api/interns/&lt;id&gt;</code>: one {n} and its job (private jobs are redacted).</li>
              <li><code>GET /api/interns/&lt;id&gt;/runs</code>: its runs, with <code>outputHash</code>, <code>txHash</code> and <code>explorerUrl</code>.</li>
            </ul>
            <p>Anything that writes needs a signed wallet session.</p>

            <h2 id="source">Source code</h2>
            {BRAND.social.github ? (
              <p>The whole app is open source: <a href={BRAND.social.github} target="_blank" rel="noreferrer">{BRAND.social.github.replace("https://", "")}</a>. Next.js and TypeScript, Postgres, viem for the chain, and a test suite that covers every promise on this page (approvals act once, private content never goes public, receipts match, spending caps hold).</p>
            ) : (
              <p>Source code link coming at launch.</p>
            )}
          </article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
