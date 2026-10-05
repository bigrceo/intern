import { Mascot, type MascotPose } from "./mascot";

/** The mascot on a haze disc; used where the product greets you on an empty canvas (sign-in, 404, first run). */
export function DitherMark({ size = 240, className, pose = "float" }: { size?: number; cell?: number; className?: string; pose?: MascotPose }) {
  return (
    <div className={`haze relative grid place-items-center rounded-full card-shadow ${className ?? ""}`} style={{ width: size, height: size }}>
      <Mascot size={Math.round(size * 0.82)} pose={pose} className="translate-y-[4%]" />
    </div>
  );
}
