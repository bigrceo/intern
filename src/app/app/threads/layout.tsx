import { redirect } from "next/navigation";
import { BRAND } from "@/lib/brand";

/** Threads need the computers host; until it runs, the page is off and its URL lands on the dashboard. */
export default function ThreadsLayout({ children }: { children: React.ReactNode }) {
  if (!BRAND.features.threads) redirect("/app");
  return children;
}
