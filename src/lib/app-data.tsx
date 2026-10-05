"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, type ApiIntern, type Connections, type OrbioStatus } from "./api";

type AppData = { interns: ApiIntern[] | null; status: OrbioStatus | null; conns: Connections | null; reload: () => Promise<void> };
const Ctx = createContext<AppData>({ interns: null, status: null, conns: null, reload: async () => {} });

/** One fetch of the owner's interns, Orbio state and connections, shared by the sidebar and every app page. */
export function AppDataProvider({ owner, children }: { owner: string; children: React.ReactNode }) {
  const [interns, setInterns] = useState<ApiIntern[] | null>(null);
  const [status, setStatus] = useState<OrbioStatus | null>(null);
  const [conns, setConns] = useState<Connections | null>(null);
  const reload = useCallback(async () => {
    // The Orbio status reads the chain and the gateway and can take seconds; it lands when it lands. Callers wait only for
    // interns and connections, so a finished run's button doesn't sit on "Running…" behind it.
    void api.orbioStatus(owner).then(setStatus, () => undefined);
    await Promise.all([
      api.listInterns(owner).then((m) => setInterns(m.interns)),
      api.connections(owner).then(setConns, () => undefined),
    ]);
  }, [owner]);
  const reloadInterns = useCallback(() => api.listInterns(owner).then((m) => setInterns(m.interns), () => undefined), [owner]);
  const anyRunning = !!interns?.some((m) => m.status === "running");
  useEffect(() => {
    const t = setInterval(reloadInterns, anyRunning ? 4000 : 15_000);
    return () => clearInterval(t);
  }, [reloadInterns, anyRunning]);
  useEffect(() => {
    const first = setTimeout(reload, 0);
    const t = setInterval(reload, 60_000);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [reload]);
  const value = useMemo(() => ({ interns, status, conns, reload }), [interns, status, conns, reload]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAppData = () => useContext(Ctx);
