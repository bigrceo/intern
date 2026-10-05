"use client";

import { marks } from "@/components/inline-marks";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "./logo";
import { GitHubMark, TelegramMark } from "./marks";
import { XIcon } from "./nova/site/XIcon";
import { BRAND } from "@/lib/brand";

const COLS: [string, { href: string; label: string; external?: boolean }[]][] = [
  ["Product", [
    { href: "/app", label: `Launch an ${BRAND.noun}` },
    { href: "/sky", label: "The sky" },
    ...(BRAND.token ? [{ href: "/#token", label: `$${BRAND.ticker} contract` }] : []),
    { href: "/sign-in", label: "Sign in" },
  ]],
  ["Learn", [
    { href: "/#how", label: "How it works" },
    { href: "/docs", label: "Docs" },
    { href: "https://www.orbio.so/build", label: "Orbio Build Week", external: true },
    ...(BRAND.social.github ? [{ href: BRAND.social.github, label: "Source", external: true }] : []),
    ...(BRAND.social.x ? [{ href: BRAND.social.x, label: `${BRAND.name} on X`, external: true }] : []),
  ]],
  ["Legal", [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ]],
];

/**
 * The NovaWrite footer: logo and blurb left, link columns, then the newsletter slot, here a one-sentence
 * job box that drops you into the wizard; copyright bar with the socials below.
 */
export function SiteFooter() {
  const router = useRouter();
  const [job, setJob] = useState("");
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto w-full max-w-[1120px] px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.7fr))_minmax(0,1.3fr)]">
          <div>
            <Logo size={32} />
            <p className="mt-4 max-w-[280px] text-[13.5px] leading-relaxed text-muted">{marks("AI agents paid for by your staked $ORBIO. Write one sentence; get a receipt for every job.", 13)}</p>
          </div>
          {COLS.map(([title, links]) => (
            <div key={title}>
              <p className="text-[14px] font-semibold text-ink">{title}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} target={l.external ? "_blank" : undefined} rel={l.external ? "noreferrer" : undefined} className="text-[13.5px] text-muted transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="text-[14px] font-semibold text-ink">Launch one</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/app?job=${encodeURIComponent(job.trim() || "Every morning, tell me what moved on Robinhood Chain and why.")}`);
              }}
              className="mt-4 flex items-center gap-2 rounded-btn bg-white p-1.5 pl-3 ring-1 ring-line transition-shadow focus-within:ring-sage"
            >
              <label htmlFor="job-footer" className="sr-only">Describe the job in one sentence</label>
              <input id="job-footer" value={job} onChange={(e) => setJob(e.target.value)} placeholder={`What should your ${BRAND.noun} do?`} className="min-w-0 flex-1 bg-transparent py-1.5 text-[13.5px] text-ink outline-none placeholder:text-muted-2" />
              <button type="submit" className="btn-grad h-8 shrink-0 rounded-[6px] px-3 text-[12.5px] font-medium text-white">Launch</button>
            </form>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted">* One sentence is enough. You review the plan before a cent moves.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[12.5px] text-muted-2 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.name} · {marks("Built for Orbio Build Week", 12)} · <Link href="/sky" className="hover:text-ink">Every run is public</Link></p>
          <div className="flex items-center gap-1">
            {BRAND.social.x && <Link href={BRAND.social.x} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on X`} className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-mint-2 hover:text-ink"><XIcon size={13} /></Link>}
            {BRAND.social.telegramBot && <Link href={`https://t.me/${BRAND.social.telegramBot}`} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} bot on Telegram`} className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-mint-2 hover:text-ink"><TelegramMark size={15} /></Link>}
            {BRAND.social.github && <Link href={BRAND.social.github} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on GitHub`} className="grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-mint-2 hover:text-ink"><GitHubMark size={15} /></Link>}
          </div>
        </div>
      </div>
    </footer>
  );
}
