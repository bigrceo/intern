"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./logo";
import { Button } from "./nova/ui/Button";
import { BRAND } from "@/lib/brand";
import { XIcon } from "./nova/site/XIcon";
import { marks } from "./inline-marks";
import { GitHubMark } from "./marks";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#use-cases", label: "What it does" },
  { href: "/sky", label: "The sky" },
  { href: "/docs", label: "Docs" },
  { href: "https://www.orbio.so", label: "Orbio" },
];

/**
 * The NovaWrite bar: fixed, 90px, transparent over the hero and frosted once you scroll; logo left,
 * four links centred, sign-in and the gradient CTA right; a card menu on phones.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${scrolled || open ? "bg-bg/85 shadow-[0_1px_0_rgba(5,31,32,.06)] backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="relative mx-auto flex h-[72px] w-full max-w-[1120px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[90px]">
          <Link href="/" aria-label={`${BRAND.name} home`} className="shrink-0">
            <Logo size={30} />
          </Link>
          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 lg:flex" aria-label="Primary">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-[13.5px] text-text transition-colors hover:text-ink">
                {marks(l.label, 13)}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            {BRAND.social.github && (
              <Link href={BRAND.social.github} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on GitHub`} className="hidden h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-mint-2 sm:grid">
                <GitHubMark size={16} />
              </Link>
            )}
            {BRAND.social.x && (
              <Link href={BRAND.social.x} target="_blank" rel="noreferrer" aria-label={`${BRAND.name} on X`} className="grid h-9 w-9 place-items-center rounded-full text-ink transition-colors hover:bg-mint-2">
                <XIcon size={14} />
              </Link>
            )}
            <Button href="/sign-in" variant="ghost" size="sm" className="max-sm:!hidden">
              Sign in
            </Button>
            <Button href="/app" size="sm">
              Launch an {BRAND.noun}
            </Button>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-2 text-ink lg:hidden">
              {open ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              ) : (
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden><path d="M1 1h14M1 6h14M1 11h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              )}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ type: "spring", bounce: 0, duration: 0.3 }} className="mx-4 mt-1 overflow-hidden rounded-card bg-white p-3 card-shadow lg:hidden">
              {[...links, { href: "/sign-in", label: "Sign in" }].map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-sm px-3 py-3 text-[16px] text-ink transition-colors hover:bg-mint-2">
                  {l.label}
                </Link>
              ))}
              <div className="px-3 pb-2 pt-3">
                <Button href="/app" full>
                  Launch an {BRAND.noun}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <AnimatePresence>
        {open && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-md lg:hidden" />}
      </AnimatePresence>
    </>
  );
}
