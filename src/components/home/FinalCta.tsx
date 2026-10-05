import { Mascot } from "../mascot";
import { marks } from "@/components/inline-marks";
import { Button } from "../nova/ui/Button";
import { Reveal } from "../nova/motion/Reveal";
import { Face } from "../logo";
import * as store from "@/intern/store";
import { BRAND } from "@/lib/brand";

/** The template's mint CTA band, with the faces of the agents at work on this site. */
export async function FinalCta() {
  const live = (await store.listInterns().catch(() => [])).filter((m) => m.status !== "deleted");
  const faces = [...live].sort((a, b) => (b.status === "running" ? 1 : 0) - (a.status === "running" ? 1 : 0)).slice(0, 7);
  const working = live.filter((m) => m.status === "running").length;
  if (live.length === 0)
    return (
      <section className="bg-mint px-4 py-16 sm:px-6">
        <Reveal y={16} className="mx-auto flex max-w-[1088px] flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
          <Mascot size={110} pose="float" className="h-[96px] w-auto shrink-0" />
          <p className="text-[15px] leading-[1.4] text-ink">
            <span className="font-medium">The sky is just opening.</span>
            <span className="block text-[13.5px] text-text">{marks("Every intern is paid for by a bag of $ORBIO. Launch one and it shows up here first.", 13)}</span>
          </p>
          </div>
          <div className="flex gap-2">
            <Button href="/app">Launch an {BRAND.noun}</Button>
            <Button href="/sky" variant="outline">See the sky</Button>
          </div>
        </Reveal>
      </section>
    );
  // Intern's faces row, in the template's mint band.
  return (
    <section className="bg-mint px-4 py-16 sm:px-6">
      <Reveal y={16} className="mx-auto flex max-w-[1088px] flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="flex shrink-0 -space-x-2.5">
            {faces.map((m) => (
              <Face key={m.id} n={m.avatar} size={40} title={m.spec.name} className="ring-[3px] ring-mint" />
            ))}
            {live.length > faces.length && <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-[11px] text-white ring-[3px] ring-mint">+{live.length - faces.length}</span>}
          </span>
          <p className="text-[15px] leading-[1.4] text-ink">
            <span className="font-medium">{live.length} {live.length === 1 ? BRAND.noun : BRAND.nounPlural}</span> in the sky{working > 0 && <>, <span className="font-medium">{working}</span> working right now</>}.
            <span className="block text-[13.5px] text-text">{marks("Every one of them is paid for by a bag of $ORBIO.", 13)}</span>
          </p>
        </div>
        <Button href="/sky" variant="outline">Meet them</Button>
      </Reveal>
    </section>
  );
}
