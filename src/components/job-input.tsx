"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const EXAMPLES = [
  "Ping me if $ORBIO liquidity moves 10%.",
  "Every morning, tell me what moved on Robinhood Chain and why.",
  "At 9pm, five bullets from https://www.orbio.so/build.",
];

export function JobInput({ id = "job" }: { id?: string } = {}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const target = EXAMPLES[idx];

  useEffect(() => {
    if (value) return;
    let t: ReturnType<typeof setTimeout>;
    if (!deleting && shown < target.length) {
      t = setTimeout(() => setShown((s) => s + 1), 26 + Math.random() * 38);
    } else if (!deleting) {
      t = setTimeout(() => setDeleting(true), 2400);
    } else if (shown > 0) {
      t = setTimeout(() => setShown((s) => s - 1), 12);
    } else {
      t = setTimeout(() => {
        setDeleting(false);
        setIdx((i) => (i + 1) % EXAMPLES.length);
      }, 350);
    }
    return () => clearTimeout(t);
  }, [shown, deleting, target, value]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/app?job=${encodeURIComponent(value.trim() || target)}`);
  };

  return (
    <form
      onSubmit={submit}
      className="card-shadow flex items-center gap-2 rounded-[12px] bg-white p-1.5 pl-4 ring-1 ring-line transition-shadow focus-within:ring-sage"
    >
      <label htmlFor={id} className="sr-only">
        Describe the job in one sentence
      </label>
      <div className="relative min-w-0 flex-1 overflow-hidden">
        <input
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder={target}
          className="w-full bg-transparent py-2.5 text-[15px] text-ink outline-none placeholder:text-transparent"
        />
        {!value && (
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center text-[15px] text-muted">
            <span className="whitespace-nowrap">{target.slice(0, shown)}</span>
            <span className="ml-px inline-block h-[1.1em] w-[1.5px] shrink-0 bg-gold animate-caret" />
          </div>
        )}
      </div>
      <button type="submit" className="btn-grad h-10 shrink-0 rounded-btn px-5 text-[14px] font-medium text-white shadow-[0_8px_20px_-10px_rgba(5,31,32,.6)] transition hover:brightness-110 active:scale-[0.98]">
        Launch
      </button>
    </form>
  );
}
