"use client";

import { useEffect, useState } from "react";

/** The sticky docs nav; follows the section being read. */
export function DocsNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -65% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);
  return (
    <nav className="hidden lg:block">
      <ul className="sticky top-[118px] space-y-1 border-l border-line pl-4">
        {items.map((i) => (
          <li key={i.id}>
            <a href={`#${i.id}`} className={`block py-1 text-[13px] transition-colors ${active === i.id ? "font-semibold text-ink" : "text-muted hover:text-ink"}`}>
              {i.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
