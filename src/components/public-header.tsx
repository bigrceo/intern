import Link from "next/link";
import { Logo } from "./logo";
import { PublicNav } from "./public-nav";

/** Header for public, no-login surfaces (/s/[id], /sky): the NovaWrite bar, frosted, with the right doors. */
export function PublicHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1120px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo size={28} text="text-[20px]" />
        </Link>
        <PublicNav />
      </div>
    </header>
  );
}
