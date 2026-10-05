import { ImageResponse } from "next/og";
import { TEMPLATE_LABEL } from "@/components/labels";
import * as store from "@/intern/store";
import { isPrivateSpec, PRIVATE_OBJECTIVE } from "@/intern/privacy";
import { fmtBag, shortAddr } from "@/lib/api";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MARK = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect x="40" y="4" width="20" height="16" rx="5" fill="#8eb69b"/><rect x="16" y="14" width="68" height="82" rx="18" fill="#051f20"/><rect x="38" y="20" width="24" height="6" rx="3" fill="#fff" opacity=".35"/><rect x="26" y="34" width="48" height="40" rx="12" fill="#fff"/><circle cx="41" cy="52" r="4.6" fill="#051f20"/><circle cx="59" cy="52" r="4.6" fill="#051f20"/><path d="M43 63Q50 68 57 63" fill="none" stroke="#051f20" stroke-width="4" stroke-linecap="round"/><rect x="30" y="81" width="40" height="5" rx="2.5" fill="#fff" opacity=".35"/></svg>')}`;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await store.getIntern(id);
  const owner = m ? await store.getOwner(m.owner) : null;
  const name = m?.name ?? "intern";
  const job = m ? (isPrivateSpec(m.spec) ? PRIVATE_OBJECTIVE : m.spec.objective) : "Your bag hires an intern.";
  const meta = m ? `${TEMPLATE_LABEL[m.spec.template]} · works for ${shortAddr(m.owner)}${owner ? ` · ${fmtBag(owner.bag)} $ORBIO` : ""}` : "";
  const alive = m ? m.status === "running" || m.status === "idle" : false;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(160deg, #ebfcef 0%, #fcfffd 55%)",
          color: "#051f20",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26 }}>
            <div style={{ width: 16, height: 16, borderRadius: 999, background: alive ? "#235347" : "#8a9a90" }} />
            <div style={{ display: "flex", color: "#3f6355" }}>{alive ? "alive · an intern" : "quiet · an intern"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 32, color: "#051f20" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={MARK} width={44} height={44} alt="" />
            intern
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 132, fontWeight: 400, letterSpacing: -5, lineHeight: 0.95 }}>{name}</div>
          <div style={{ display: "flex", fontSize: 36, lineHeight: 1.3, maxWidth: 980 }}>{`“${job}”`}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#3f6355" }}>
          <div style={{ display: "flex" }}>{meta}</div>
          <div style={{ display: "flex" }}>every run hashed and public</div>
        </div>
      </div>
    ),
    size,
  );
}
