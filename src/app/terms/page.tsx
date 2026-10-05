import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = { title: "Terms", description: "The short terms for running an intern." };

export default function Terms() {
  return (
    <LegalPage title="Terms" updated="6 September 2026">
      <p>Intern is an early product built on Orbio CREDIT. Using it means you accept the following, which we have kept short on purpose.</p>

      <h2>What Intern is</h2>
      <p>A way to run small autonomous agents on a schedule, paid for by Orbio CREDIT your staked $ORBIO earns and you activate from your own wallet. Activated balance is product access, not cash; Intern never holds or moves your tokens.</p>

      <h2>Your side</h2>
      <ul>
        <li>You are responsible for the jobs you write and for what you approve. An intern acts on your behalf only after you approve a draft, or after you switch it to autopilot yourself.</li>
        <li>Don&apos;t use it to spam, harass, scrape private data you have no right to, or break the terms of a connected service (Google, GitHub, Telegram, Discord, X).</li>
        <li>Run outputs are public by default. Don&apos;t put anything in a job you wouldn&apos;t want on a public page.</li>
      </ul>

      <h2>Our side</h2>
      <ul>
        <li>We provide the service as is. Models make mistakes; an intern&apos;s report is information, not advice, and never financial advice.</li>
        <li>We may pause an intern that is failing, abusive, or out of credits, and we may change or shut down the service at any time.</li>
        <li>We are not liable for indirect losses. Our total liability to you is limited to what you paid us, which today is nothing.</li>
      </ul>

      <h2>Privacy</h2>
      <p>What we store and how connections work is in the <a href="/privacy">privacy page</a>.</p>

      <h2>Contact</h2>
      <p><a href="https://github.com/bigrceo/intern/issues">Open an issue on GitHub</a>. The Telegram bot delivers your interns&apos; reports; it isn&apos;t a support channel.</p>
    </LegalPage>
  );
}
