"use client";

import { Mascot } from "../mascot";

import { marks } from "@/components/inline-marks";

import { motion } from "motion/react";
import { Reveal } from "../nova/motion/Reveal";
import { Section, SectionHead } from "../nova/Section";
import { BRAND } from "@/lib/brand";

/** "Start in N simple steps": alternating rows, 01–04, checks, an illustration on the haze. */
export function Steps({ freeUsd = 0 }: { freeUsd?: number }) {
  const n = BRAND.noun;
  const steps = [
    { pose: "listen" as const, n: "01 · Brief", title: "Say the job", body: "Write it like a text message. Your intern turns it into a plan: what to check, which tools, how often. Change anything before it starts.", art: <BriefArt /> },
    BRAND.features.orbioLogin
      ? { pose: "sign" as const, n: "02 · Sign in", title: "Sign in your way", body: `Google, email or a wallet.${freeUsd > 0 ? ` New accounts start with $${freeUsd} of free AI on us.` : ""} After that, top up from $5 by card or crypto, or let your staked $ORBIO earn the CREDIT that pays for it.`, art: <KeyArt /> }
      : { pose: "sign" as const, n: "02 · Key", title: "Your wallet is the key", body: "One signature in your wallet and you are set. No account, no password, no API key to copy.", art: <KeyArt /> },
    { pose: "work" as const, n: "03 · Run", title: "It works while you don't", body: "On your schedule, within the budget you set, paid from the credits your $ORBIO earns. It reads the chain, the markets and the web, and asks you before it posts anything.", art: <RunArt /> },
    { pose: "stamp" as const, n: "04 · Receipt", title: "It leaves a receipt", body: "After every job: what it cost, which AI it used, how long it took, and a fingerprint of what it wrote, saved on Robinhood Chain. Anyone can check it.", art: <ReceiptArt /> },
  ];
  return (
    <Section id="how">
      <SectionHead eyebrow="How it works" title="One sentence in. A receipt out." text={`No dashboard to watch. Tell your ${BRAND.noun} the job once; it handles the rest and shows its work.`} />
      <div className="mt-14 space-y-12 lg:space-y-6">
        {steps.map((s, i) => (
          <div key={s.n} className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <Reveal y={30}>
              <div className="haze card-shadow relative flex min-h-[300px] items-center overflow-hidden rounded-card p-5 sm:min-h-[340px]">
                {s.art}
                <Mascot size={120} pose={s.pose} className="pointer-events-none absolute -bottom-2 right-3 h-[96px] w-auto sm:h-[120px]" />
              </div>
            </Reveal>
            <Reveal y={20} delay={0.1}>
              <div className="px-1 lg:px-4">
                <p className="eyebrow">{s.n}</p>
                <h3 className="mt-3 text-[26px] font-medium text-ink">{s.title}</h3>
                <p className="mt-3 max-w-[440px] text-[16px] leading-[1.6] text-text">{marks(s.body)}</p>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </Section>
  );
}

const card = "mx-auto w-full max-w-[340px] rounded-[12px] bg-white p-4 shadow-[0_10px_30px_rgba(5,31,32,.12)]";

function BriefArt() {
  const plan = [["Template", "Market watch"], ["Tools", "token_market · chain_read"], ["Every", "12 hours"], ["Cap", "5¢ a run"]];
  return (
    <div className={card}>
      <p className="rounded-[8px] bg-mint-2 px-3 py-2.5 text-[12px] text-pine">{marks("“Ping me if $ORBIO liquidity moves 10%.”", 12)}</p>
      <ul className="mt-3 divide-y divide-line-soft">
        {plan.map(([k, v], i) => (
          <motion.li key={k} className="flex justify-between py-2 text-[11.5px]" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.12 }}>
            <span className="text-muted">{k}</span>
            <span className="font-medium text-ink">{v}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function KeyArt() {
  return (
    <div className={card}>
      <p className="text-[11px] uppercase tracking-[0.08em] text-muted">Signature request</p>
      <p className="mt-2 rounded-[8px] bg-bg-2 px-3 py-2.5 font-mono text-[11.5px] text-ink">Orbio API key · chain 4663 · epoch 1</p>
      <div className="mt-3 flex gap-2">
        <span className="flex-1 rounded-[6px] bg-mint-2 py-1.5 text-center text-[11.5px] text-pine">Cancel</span>
        <motion.span className="btn-grad flex-1 rounded-[6px] py-1.5 text-center text-[11.5px] font-medium text-white" whileInView={{ scale: [1, 0.94, 1] }} viewport={{ once: true }} transition={{ delay: 0.7, duration: 0.4 }}>Sign</motion.span>
      </div>
      <motion.p className="mt-3 text-[11px] font-medium text-green" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 }}>✓ key sealed · runs bill to it</motion.p>
    </div>
  );
}

function RunArt() {
  const bars = [30, 42, 38, 55, 48, 62, 90, 58, 52];
  return (
    <div className={card}>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted">ORBIO liquidity · tripwire 10%</span>
        <span className="rounded-chip bg-amber-soft px-2 py-0.5 font-medium text-amber">woke</span>
      </div>
      <div className="mt-4 flex h-[90px] items-end gap-1.5">
        {bars.map((h, i) => (
          <motion.span key={i} className={`flex-1 rounded-t-[4px] ${i === 6 ? "bg-pine" : "bg-mint-3"}`} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 + i * 0.06 }} />
        ))}
      </div>
      <p className="mt-3 text-[11.5px] text-text">Free probe every 15 min. The model wakes only past your line.</p>
    </div>
  );
}

function ReceiptArt() {
  const rows = [["cost", "$0.018"], ["model", "gemini-3.8-flash"], ["time", "41s"], ["output", "0x9f3a…c21e"], ["tx", "anchored ↗"]];
  return (
    <div className={card}>
      <p className="text-[11px] uppercase tracking-[0.08em] text-muted">Receipt · run #128</p>
      <ul className="mt-2 divide-y divide-line-soft">
        {rows.map(([k, v], i) => (
          <motion.li key={k} className="flex justify-between py-2 text-[11.5px]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.12 }}>
            <span className="text-muted">{k}</span>
            <span className="font-mono font-medium text-ink">{v}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
