"use client";

import dynamic from "next/dynamic";
import { Reveal } from "./nova/motion/Reveal";
import { BRAND } from "@/lib/brand";
import { marks } from "./inline-marks";

const ToolPhysics = dynamic(() => import("./tool-physics").then((m) => m.ToolPhysics), { ssr: false });

/** What it runs on: copy on the left, the draggable tool tiles on a haze stage on the right. */
export function Rails() {
  return (
    <section id="rails" className="relative px-4 py-20 sm:px-6 lg:py-28">
      <Reveal y={30} className="mx-auto w-full max-w-[1088px]">
        <div className="card-shadow grid overflow-hidden rounded-card bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="p-8 sm:p-12">
            <p className="eyebrow">What it runs on</p>
            <h2 className="mt-3 text-[32px] sm:text-[40px]">
              Your accounts.
              <br />
              Nothing to install.
            </h2>
            <p className="mt-5 max-w-[30rem] text-[15px] leading-[1.6] text-text">
              {marks(`Orbio pays for the work, Robinhood Chain keeps the receipts, and your ${BRAND.noun} works through apps you already use: Gmail, GitHub, Telegram, Discord and X, one click each. Anything that speaks for you waits for your OK.`)}
            </p>
            <p className="mt-6 text-[12.5px] text-muted">Drag the tiles. They&apos;re real; the connections are one tap each.</p>
          </div>
          <ToolPhysics className="tool-stage haze relative h-[320px] overflow-hidden lg:h-auto lg:min-h-[380px]" />
        </div>
      </Reveal>
    </section>
  );
}
