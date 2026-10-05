import { Nav } from "@/components/nav";
import { Hero } from "@/components/home/Hero";
import { Steps } from "@/components/home/Steps";
import { UseCases } from "@/components/usecases";
import { Rails } from "@/components/rails";
import { FinalCta } from "@/components/home/FinalCta";
import { SiteFooter } from "@/components/site-footer";
import { currentTrialUsd, trialOpen } from "@/intern/trial";

export const dynamic = "force-dynamic";

/** Intern's page, section for section: hero, token, how it works, three jobs, the rails, the faces, footer. */
export default function Home() {
  const freeUsd = trialOpen() ? currentTrialUsd() : 0;
  return (
    <>
      <Nav />
      <main>
        <Hero freeUsd={freeUsd} />
        <Steps freeUsd={freeUsd} />
        <UseCases />
        <Rails />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
