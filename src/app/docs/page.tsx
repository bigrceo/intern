import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { DocsNav } from "@/components/docs/DocsNav";
import { marks } from "@/components/inline-marks";
import { BRAND } from "@/lib/brand";
import { ORBIO } from "@/intern/orbio";
import { ANCHOR_TO } from "@/intern/anchor";

export const metadata: Metadata = { title: "Docs", description: `How ${BRAND.name} works: funding, jobs, approvals, on-chain receipts, contracts, API and source code.` };

const EXPLORER = "https://robinhoodchain.blockscout.com";
const ANCHOR_WALLET = process.env.NEXT_PUBLIC_ANCHOR_WALLET || "0xcdd0eD25F553a252F11aDC8472adb66396222817";

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
            <p><strong>Your bag runs an agent.</strong> You write a job in one sentence. An AI {n} does it on your schedule, paid by the CREDIT your staked {marks("$ORBIO", 14)} earns. No card, no API key, nothing to install. Sell the bag and it stops.</p>
            <ul>
              <li><strong>One sentence in</strong>: “Ping me if $ORBIO liquidity moves 10%.” becomes a plan you can edit before anything runs.</li>
              <li><strong>It works while you don&apos;t</strong>: on your schedule, within the budget you set.</li>
              <li><strong>A receipt out</strong>: every job leaves a public receipt on {marks("Robinhood Chain", 14)}.</li>
            </ul>

            <h2 id="how-it-works">How it works</h2>
            <ol>
              <li><strong>Sign in with your wallet.</strong> One signature, no email, no password.</li>
              <li><strong>Sign {marks("Orbio", 14)}&apos;s key message once.</strong> That signature becomes the key your {n}s are billed to. It cannot sign transactions or move tokens.</li>
              <li><strong>Write the job.</strong> It is turned into a plan: which tools, which sources, how often, and a maximum spend per run. You can change all of it.</li>
              <li><strong>It runs.</strong> A scheduler wakes due {n}s every minute. Each run reads the chain, the market or the web, writes a report and sends it to Telegram, Discord or its public page.</li>
              <li><strong>It leaves a receipt.</strong> Cost, AI model, duration, the list of tools it used and a fingerprint (sha256) of what it wrote, written to Robinhood Chain.</li>
            </ol>

            <h2 id="funding">Who pays</h2>
            <p>Your bag does. Staked $ORBIO mints Orbio <strong>CREDIT</strong> every hour; 1 CREDIT buys $1 of AI. You activate CREDIT from your own wallet into an AI balance, and runs are billed to it at the model&apos;s real price.</p>
            <ul>
              <li>{BRAND.name} never holds your tokens or your private key, and never moves anything.</li>
              <li>When the balance cannot pay for the next run, the {n} goes quiet and asks you once, with an “Activate CREDIT” card sized to about a week.</li>
              <li>Anyone can <strong>Fuel</strong> a public {n}: burn 1, 2 or 5 of their own CREDIT into its balance with one signature. The giver is listed on its page.</li>
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
            <p>When a run finishes, its output is hashed (sha256) and a small transaction is sent on {marks("Robinhood Chain", 14)} from the {BRAND.name} receipts wallet to a fixed anchor address with no code. The transaction data is the ABI encoding of:</p>
            <pre><code>(string internId, string runId, bytes32 outputHash, uint256 costMicroUsd, uint256 timestamp)</code></pre>
            <p>Anyone can decode it from the explorer and compare the hash with the report shown on the {n}&apos;s public page. Each public page lists every run with its hash and a link to its transaction.</p>

            <h2 id="verify">Verify it yourself (2 minutes)</h2>
            <ol>
              <li>Open any {n} on <a href="/sky">The sky</a> and pick a run.</li>
              <li>Click its transaction link: it opens on the Robinhood Chain explorer, sent by the receipts wallet to the anchor address below.</li>
              <li>Decode the input data with the layout above: the run id and hash match the page.</li>
              <li>Or read it raw: <code>GET /api/interns/&lt;id&gt;/runs</code> returns every run with <code>outputHash</code>, <code>txHash</code> and <code>explorerUrl</code>.</li>
            </ol>

            <h2 id="contracts">Addresses</h2>
            <table>
              <tbody>
                <tr><td>Receipts wallet</td><td><Addr a={ANCHOR_WALLET} /></td></tr>
                <tr><td>Anchor address</td><td><Addr a={ANCHOR_TO} /></td></tr>
                <tr><td>$ORBIO token</td><td><Addr a={ORBIO.orbio} kind="token" /></td></tr>
                <tr><td>Orbio CREDIT</td><td><Addr a={ORBIO.credit} kind="token" /></td></tr>
                <tr><td>Orbio staking</td><td><Addr a={ORBIO.staking} /></td></tr>
                <tr><td>Chain</td><td>{marks("Robinhood Chain", 14)} (chain id {ORBIO.chainId})</td></tr>
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
