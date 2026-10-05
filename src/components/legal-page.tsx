import { Nav } from "./nav";
import { SiteFooter } from "./site-footer";

/** Plain reading page for policy text, inside the NovaWrite bar and footer. */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-[44rem] px-6 pb-24 pt-[140px]">
        <p className="eyebrow">Last updated {updated}</p>
        <h1 className="mt-3 text-[40px]">{title}</h1>
        <div className="prose-pl mt-8 [&_li]:ml-5 [&_li]:list-disc">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
