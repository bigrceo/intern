/**
 * The NovaWrite haze behind a section: the blurred green mist of the template, anchored to one side and
 * fading toward the copy. Same API as the old dither field so every page keeps its placement.
 */
export function DitherField({ className, from = "right" }: { className?: string; from?: "left" | "right" | "around" | "top" }) {
  const mask = {
    right: "radial-gradient(60% 80% at 100% 40%, #000 0%, transparent 75%)",
    left: "radial-gradient(60% 80% at 0% 40%, #000 0%, transparent 75%)",
    top: "radial-gradient(90% 70% at 50% 0%, #000 0%, transparent 75%)",
    around: "radial-gradient(70% 70% at 50% 50%, transparent 35%, #000 100%)",
  }[from];
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute opacity-60 ${className ?? ""}`}
      style={{ background: "url(/haze.jpg) center/cover", filter: "blur(28px)", WebkitMaskImage: mask, maskImage: mask }}
    />
  );
}
