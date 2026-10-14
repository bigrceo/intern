"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { burnForCredit, realAddress } from "@/lib/auth";
import { BRAND } from "@/lib/brand";
import { marks } from "./inline-marks";

type Burn = { sig: string; tokens: number; creditUsd: number; at: number; url: string };
const MINT = process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "";
const fmt = (n: number) => (n >= 1e6 ? `${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : n.toFixed(n < 10 ? 2 : 0));

/**
 * Pay for AI the Solana way: burn $INTERN, get AI credit at the market price. Shows the credit left, the wallet's $INTERN,
 * three one-tap amounts in dollars, and the burns already credited (each linked on Solscan).
 */
export function BurnPanel({ creditUsd, onCredited, compact = false }: { creditUsd?: number | null; onCredited?: () => void; compact?: boolean }) {
  const [price, setPrice] = useState<number | null>(null);
  const [held, setHeld] = useState<number | null>(null);
  const [burns, setBurns] = useState<Burn[]>([]);
  const [busy, setBusy] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    if (!MINT) return;
    fetch(`https://api.dexscreener.com/latest/dex/tokens/${MINT}`).then((r) => r.json()).then((j: { pairs?: Array<{ chainId: string; priceUsd?: string; liquidity?: { usd?: number } }> }) => {
      const p = (j.pairs ?? []).filter((x) => x.chainId === "solana").sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
      setPrice(p ? Number(p.priceUsd) : 0);
    }).catch(() => setPrice(0));
    const me = realAddress();
    if (me) {
      fetch("/api/rpc", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getTokenAccountsByOwner", params: [me, { mint: MINT }, { encoding: "jsonParsed" }] }) })
        .then((r) => r.json())
        .then((j: { result?: { value?: Array<{ account: { data: { parsed: { info: { tokenAmount: { uiAmount: number } } } } } }> } }) => setHeld((j.result?.value ?? []).reduce((a, v) => a + (v.account.data.parsed.info.tokenAmount.uiAmount ?? 0), 0)))
        .catch(() => setHeld(null));
    }
    fetch("/api/burn", { credentials: "include" }).then((r) => r.json()).then((j: { burns?: Burn[] }) => setBurns(j.burns ?? [])).catch(() => undefined);
  }, []);
  useEffect(() => { const t = setTimeout(() => void load(), 0); return () => clearTimeout(t); }, [load]);

  const burn = async (usd: number) => {
    if (!price) return;
    setBusy(usd); setMsg(null);
    try {
      const r = await burnForCredit(usd / price);
      setMsg({ ok: true, text: `Burned. +$${r.creditUsd.toFixed(2)} of AI credit.` });
      onCredited?.(); void load();
    } catch (e) {
      setMsg({ ok: false, text: (e as Error).message });
    }
    setBusy(null);
  };

  if (!MINT) return <p className="text-[13px] text-ink-soft">Burning ${BRAND.ticker} for AI credit opens when the token is live.</p>;
  return (
    <div>
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-[13px] text-ink-soft">
        <span>AI credit <b className="text-ink">${(creditUsd ?? 0).toFixed(2)}</b></span>
        {held !== null && <span>in your wallet <b className="text-ink">{fmt(held)} ${BRAND.ticker}</b></span>}
        {price ? <span>price <b className="text-ink">${price < 0.01 ? price.toPrecision(3) : price.toFixed(4)}</b></span> : null}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {[2, 5, 10].map((usd) => (
          <button key={usd} disabled={busy !== null || !price || (held !== null && held < usd / price)} onClick={() => void burn(usd)} className="ui-btn ui-btn-gold" title={price ? `burn about ${fmt(usd / price)} $${BRAND.ticker}` : "waiting for a market price"}>
            <Flame size={13} strokeWidth={2.2} /> {busy === usd ? "Confirm in your wallet…" : `Burn $${usd}`}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-ink-faint">{marks(`Burned $${BRAND.ticker} is gone for good on Solana; you get its market value in AI credit. A typical run costs about 2¢.`, 12)}</p>
      {msg && <p className={`mt-2 text-[12.5px] ${msg.ok ? "text-moss" : "text-red-700"}`}>{msg.text}</p>}
      {!compact && burns.length > 0 && (
        <ul className="mt-3 grid gap-0.5 font-mono text-[11px] text-ink-faint">
          {burns.map((b) => (
            <li key={b.sig}>+${b.creditUsd.toFixed(2)} · {fmt(b.tokens)} ${BRAND.ticker} burned · <Link className="underline" href={b.url} target="_blank" rel="noreferrer">{b.sig.slice(0, 8)}…</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
