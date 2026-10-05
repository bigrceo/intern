import { redirect } from "next/navigation";

/** The hunt (a puzzle with CREDIT prizes from a treasury) stays off until NEXT_PUBLIC_HUNT=1 and its treasury are set. */
export default function HuntLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_HUNT !== "1") redirect("/");
  return children;
}
