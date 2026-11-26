import { dergoKerkesen } from "../../../lib/kerkesat";

export const dynamic = "force-dynamic";
const koka = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  let trupi: { udhetimId?: unknown };
  try {
    trupi = await request.json();
  } catch {
    return Response.json({ error: "Kërkesa nuk është e vlefshme." }, { status: 400, headers: koka });
  }
  if (typeof trupi.udhetimId !== "string") {
    return Response.json({ error: "Kërkesa nuk është e vlefshme." }, { status: 400, headers: koka });
  }
  try {
    const r = await dergoKerkesen(trupi.udhetimId);
    if (r === "dergua") return Response.json({ ok: true, statusi: "ne_pritje" }, { status: 201, headers: koka });
    if (r === "ekziston") return Response.json({ ok: true, statusi: "ne_pritje", ekziston: true }, { headers: koka });
    if (r === "hyr") return Response.json({ error: "Hyr me GitHub për të kërkuar vend." }, { status: 401, headers: koka });
    if (r === "shofer") return Response.json({ error: "Nuk mund të kërkosh vend te udhëtimi yt." }, { status: 403, headers: koka });
    if (r === "pa_vende") return Response.json({ error: "Nuk ka vende të lira." }, { status: 409, headers: koka });
    return Response.json({ error: "Udhëtimi nuk u gjet." }, { status: 404, headers: koka });
  } catch {
    return Response.json({ error: "Kërkesa nuk u dërgua. Provo përsëri." }, { status: 503, headers: koka });
  }
}
