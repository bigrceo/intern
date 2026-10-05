import { bad, ownerFrom } from "@/intern/http";
import * as store from "@/intern/store";

/** Download a file a intern wrote. Owner only: reports can hold private repo or wallet detail. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const owner = ownerFrom(req);
  if (!owner) return bad("sign in with your wallet first", 401);
  const { id } = await params;
  const f = await store.getFile(id);
  if (!f || f.owner !== owner) return bad("not found", 404);
  return new Response(f.bytes as BodyInit, {
    headers: {
      "content-type": f.mime,
      "content-length": String(f.size),
      "content-disposition": `attachment; filename="${f.name.replace(/"/g, "")}"`,
      "cache-control": "private, max-age=3600",
    },
  });
}
