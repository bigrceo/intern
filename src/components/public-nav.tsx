"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "./nova/ui/Button";
import { BRAND } from "@/lib/brand";

/** On public pages, a signed-in holder gets their own doors back; everyone else gets the hire button. */
export function PublicNav() {
  const { address } = useAuth();
  const onSky = usePathname()?.startsWith("/sky");
  const link = "rounded-btn px-3 py-1.5 text-[13.5px] text-text transition-colors hover:bg-mint-2 hover:text-ink";
  if (address) {
    return (
      <nav className="flex items-center gap-1">
        <Link href="/app" className={link}>← My {BRAND.nounPlural}</Link>
        <Link href="/app/connections" className={`${link} hidden sm:inline-flex`}>Connections</Link>
        <Link href="/sky" className={`${link} hidden sm:inline-flex`}>The sky</Link>
        <Button href="/app/new" size="sm" className="ml-1">
          <span className="sm:hidden">Launch</span>
          <span className="hidden sm:inline">Launch an {BRAND.noun}</span>
        </Button>
      </nav>
    );
  }
  return (
    <nav className="flex items-center gap-1.5">
      <Link href="/" className={`${link} max-sm:hidden`}>Home</Link>
      {!onSky && <Link href="/sky" className={`${link} max-sm:hidden`}>The sky</Link>}
      <Link href="/docs" className={`${link} max-sm:hidden`}>Docs</Link>
      <Button href="/sign-in" size="sm" variant="ghost" className="max-sm:!hidden">Sign in</Button>
      <Button href="/app" size="sm">
        <span className="sm:hidden">Launch</span>
        <span className="hidden sm:inline">Launch an {BRAND.noun}</span>
      </Button>
    </nav>
  );
}
