import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Privacy", description: "What Intern stores, what it reads on your behalf, and how to make it stop." };

export default function Privacy() {
  return (
    <LegalPage title="Privacy" updated="6 September 2026">
      <p>
        Intern (intern.money) lets a holder of $ORBIO run small autonomous agents, called interns, that work on a schedule and are paid for by the CREDIT the holder&apos;s staked tokens earn and the holder activates from their own wallet. This page says what we store, what an intern may read or do on your behalf, and how to make it stop. It is written to be read, not skimmed.
      </p>

      <h2>Who we are</h2>
      <p>Intern is operated by the Intern team (&quot;we&quot;). Questions or requests about your data: <a href="https://github.com/bigrceo/intern/issues">open an issue on GitHub</a>. The source code is public at <a href="https://github.com/bigrceo/intern">github.com/bigrceo/intern</a>.</p>

      <h2>What we store about you</h2>
      <ul>
        <li><strong>Your wallet address</strong> and the $ORBIO balance we read from Robinhood Chain. The address is your account identifier; there is no email sign-up and no password.</li>
        <li><strong>Your Orbio key</strong>: the signature your wallet makes over Orbio&apos;s key message, stored encrypted. It is the credential your interns bill inference to; it cannot move tokens or sign anything else. We also record the CREDIT activations you make from your wallet (transaction hash and amount, read from the chain) to keep the balance estimate. We never hold your wallet&apos;s private key and never move tokens.</li>
        <li><strong>The jobs you write</strong> (one sentence each, plus the plan compiled from it) and <strong>every run&apos;s output</strong>: title, summary, body, sources, cost, model, and a hash of the output that is written to Robinhood Chain. Run outputs are public on each intern&apos;s page and on <a href="/sky">the sky</a>; do not put secrets in a job.</li>
        <li><strong>Connections you make</strong> under Connections: Telegram chat id, Discord webhook URL, GitHub access token, Google OAuth tokens, X keys. These are encrypted at rest with a server-side key and are only ever used by your own interns. Disconnecting deletes them immediately.</li>
        <li><strong>Files</strong> an intern writes for you (PDF, DOCX, text) or saves from your email, downloadable only by you.</li>
        <li><strong>Drafts awaiting your approval</strong> (a pull request, a post, an email) with your decision and the result.</li>
      </ul>
      <p>We do not run advertising, do not sell or share this data, and do not use it to train models. Model calls go through Orbio&apos;s gateway to OpenRouter under your own key, subject to those providers&apos; terms.</p>

      <h2>Google user data (Gmail)</h2>
      <p>
        If you connect Gmail, you sign in with Google and grant the scope <span className="font-mono text-[13px]">gmail.modify</span>. Intern&apos;s use of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including the Limited Use requirements. Concretely:
      </p>
      <ul>
        <li><strong>What we access:</strong> your inbox and other labels (message headers, text, attachments), drafts, and labels, but only when an intern you launched or a question you asked in Telegram requires it, and only for the account you connected.</li>
        <li><strong>Why:</strong> to brief you on what came in and what needs an answer, find messages you ask for, save drafts, and, only after you approve each action (or switch that intern to autopilot yourself), send, forward, archive, label, star, mark, report spam, or move messages to trash. Intern never deletes mail permanently.</li>
        <li><strong>What we store:</strong> your Gmail address and OAuth tokens (encrypted), plus whatever the intern puts in its report or a file for you. We do not keep a copy of your mailbox, do not index it, and do not retain message bodies after a run beyond what appears in that run&apos;s report.</li>
        <li><strong>Who sees it:</strong> your intern&apos;s report is delivered to the channels you connected (Telegram, Discord, email to yourself) and shown on the intern&apos;s page. Reports are public in the sky by default; a report about your email is written as a summary in the intern&apos;s words and never quotes one-time codes, passwords or payment details. Message content is sent to the model provider only to produce that report, under your own key.</li>
        <li><strong>Humans:</strong> no person on the Intern team reads your Google data except as needed for security or abuse investigation, with your consent, or where the law requires it.</li>
        <li><strong>Transfer and sale:</strong> we do not transfer Google user data to third parties except to the model provider as described, to comply with law, or as part of a merger or acquisition with prior notice. We never sell it, never use it for advertising, and never use it to build or improve models.</li>
        <li><strong>Revoking:</strong> click Disconnect on the Connections page, or remove Intern under <a href="https://myaccount.google.com/permissions">Google Account → Security → Third-party access</a>. Either one stops all access at once and deletes the stored tokens.</li>
      </ul>

      <h2>Other connections</h2>
      <p>Telegram: we store the chat id of the chat you linked and the ids of messages we sent there so replies can be threaded. GitHub: an OAuth token with repo scope, used to read the repos you name and, after approval, open pull requests, issues or comments. Discord: the webhook URL you paste; reports are posted to that channel. X: keys you provide, used only to post what you approved.</p>

      <h2>Cookies</h2>
      <p>One session cookie (<span className="font-mono text-[13px]">intern_session</span>) signed by us, so the app knows which wallet you are. No analytics or tracking cookies.</p>

      <h2>Retention and deletion</h2>
      <p>Connections are deleted the moment you disconnect. Interns, runs and files stay while your interns exist; delete an intern and its runs and files go with it. Hashes already written to Robinhood Chain cannot be removed; they contain no content, only a fingerprint. To delete your account entirely, ask in your linked Telegram chat (the bot knows which wallet you are), or open an issue on GitHub naming the wallet.</p>

      <h2>Security</h2>
      <p>Secrets are encrypted at rest and only decrypted on the server for the run that needs them. Traffic is HTTPS. Anything an intern wants to do outside reading is drafted and waits for your approval unless you turned autopilot on. Inbox and private-repo work is published as a receipt (hash, cost, time) only; the words stay with you.</p>

      <h2>Changes</h2>
      <p>If this page changes in a way that matters, the date above changes and the change is in the public commit history. Questions: <a href="https://github.com/bigrceo/intern/issues">an issue on GitHub</a>.</p>
    </LegalPage>
  );
}
