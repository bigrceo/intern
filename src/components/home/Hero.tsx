import { Mascot } from "../mascot";
import { marks } from "@/components/inline-marks";
import Link from "next/link";
import { Check } from "../nova/ui/Button";
import { Reveal } from "../nova/motion/Reveal";
import { JobInput } from "../job-input";
import { HeroMock } from "./HeroMock";
import { BRAND } from "@/lib/brand";

/** The template hero: two columns, a two-line 48px title, the input as the CTA, three checks, the app mock on the right. */
export function Hero({ freeUsd = 0 }: { freeUsd?: number }) {
  return (
    <section className="hero-haze relative overflow-hidden px-4 pb-16 pt-[112px] sm:px-6 lg:pb-24 lg:pt-[150px]">
      <div className="relative z-10 mx-auto grid w-full max-w-[1088px] items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div>
          <Reveal onLoad y={20}>
            <p className="eyebrow">AI agents paid by your bag{freeUsd > 0 ? " · start free" : ""}</p>
          </Reveal>
          <Reveal onLoad y={20} delay={0.05}>
            <h1 className="mt-4 text-[40px] sm:text-[46px] lg:text-[48px]">
              Your bag runs
              <br />
              an agent.
            </h1>
          </Reveal>
          <Reveal onLoad y={20} delay={0.1}>
            <p className="mt-5 max-w-[460px] text-[16px] leading-[1.6] text-text">
              {marks(`Write what you want in one sentence. An AI ${BRAND.noun} does it for you around the clock, paid by what your staked $ORBIO earns. No card, nothing to set up. Sell the bag and it stops.${freeUsd > 0 ? ` Start free with $${freeUsd} of AI on us.` : ""}`, 15)}
            </p>
          </Reveal>
          <Reveal onLoad y={20} delay={0.2}>
            <div className="mt-7 max-w-[480px]">
              <JobInput />
            </div>
          </Reveal>
          <Reveal onLoad y={20} delay={0.3}>
            <div className="mt-8 flex flex-col gap-3">
              <Check>{marks("Paid by your $ORBIO, never by your card")}</Check>
              <Check>One wallet signature, nothing to install</Check>
              <Check>{marks("A public receipt for every job, on Robinhood Chain")}</Check>
            </div>
          </Reveal>
          {freeUsd > 0 && (
            <Reveal onLoad y={20} delay={0.33}>
              <Link href="/sign-in" className="btn-grad mt-7 inline-flex h-11 items-center gap-2 rounded-btn px-5 text-[14px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(5,31,32,.6)] transition hover:brightness-110">
                Start free · ${freeUsd} on us →
              </Link>
            </Reveal>
          )}
          <Reveal onLoad y={20} delay={0.35}>
            <Link href="#how" className="mt-6 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-pine underline decoration-sage/60 underline-offset-4 hover:decoration-pine">
              How it works →
            </Link>
          </Reveal>
        </div>
        <Reveal onLoad y={30} delay={0.25} className="relative">
          <HeroMock />
          <div className="pointer-events-none absolute -right-2 top-[300px] z-20 hidden sm:block drop-shadow-[0_18px_30px_rgba(5,31,32,.25)] sm:-right-8 sm:top-[330px] lg:-right-28 lg:top-[290px]">
            <Mascot size={210} pose="float" className="h-[140px] w-auto sm:h-[180px] lg:h-[230px]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
