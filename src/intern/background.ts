import { after } from "next/server";

/**
 * Work that must outlive the HTTP response. On a long-lived Node server a dangling promise is enough; on Vercel the
 * function freezes once the response is sent, so inside a request the work is handed to Next's after(), which keeps
 * the invocation alive until it settles. Outside a request (ticks, tests) it simply runs.
 */
export function background(work: () => Promise<unknown>) {
  const run = () => work().catch(() => undefined);
  try {
    after(run);
  } catch {
    void run();
  }
}
