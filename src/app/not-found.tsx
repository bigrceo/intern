import { DitherMark } from "@/components/dither-mark";
import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <header className="mx-auto flex h-16 w-full max-w-[1180px] items-center px-5 sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <BrandMark size={30} face="var(--cream)" />
          <Wordmark className="text-[1.25rem] text-ink" />
        </Link>
      </header>
      <main className="mx-auto flex w-full max-w-[36rem] flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <div className="relative w-full max-w-[420px]">
          <p aria-hidden className="select-none font-display text-[9rem] leading-none tracking-[-0.04em] text-ink sm:text-[12rem]">404</p>
          <span className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[70%]"><DitherMark size={150} pose="rest" /></span>
        </div>
        <h1 className="mt-2 text-[1.6rem] font-semibold tracking-[-0.02em]">Nobody works here</h1>
        <p className="mt-2 text-[15px] leading-[1.6] text-ink-soft">That page doesn’t exist, or it drifted off. The intern checked.</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="btn-press rounded-full bg-ink px-5 py-2.5 text-[14px] font-medium text-cream">Back to intern</Link>
          <Link href="/app" className="rounded-full border border-ink/15 bg-white px-5 py-2.5 text-[14px] text-ink hover:border-ink/40">Open the app</Link>
        </div>
      </main>
    </div>
  );
}
