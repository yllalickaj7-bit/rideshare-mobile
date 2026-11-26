import { preferuaratEMia, vendosPreferuar } from "@/lib/preferuarat";

export const dynamic = "force-dynamic";
const koka = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    return Response.json({ ids: await preferuaratEMia() }, { headers: koka });
  } catch {
    return Response.json({ error: "Lista e ruajtur nuk lexohet tani." }, { status: 503, headers: koka });
  }
}

export async function PUT(request: Request) {
  let trupi: { udhetimId?: unknown; ruaj?: unknown };
  try {
    trupi = await request.json();
  } catch {
    return Response.json({ error: "Kërkesa nuk është e vlefshme." }, { status: 400, headers: koka });
  }
  if (typeof trupi.udhetimId !== "string" || typeof trupi.ruaj !== "boolean") {
    return Response.json({ error: "Kërkesa nuk është e vlefshme." }, { status: 400, headers: koka });
  }
  try {
    const rezultati = await vendosPreferuar(trupi.udhetimId, trupi.ruaj);
    if (rezultati === "hyr") {
      return Response.json({ error: "Hyr me GitHub për të ruajtur." }, { status: 401, headers: koka });
    }
    if (rezultati === "fushe") {
      return Response.json({ error: "Udhëtimi nuk u gjet." }, { status: 400, headers: koka });
    }
    return Response.json({ ok: true, ruajtur: trupi.ruaj }, { headers: koka });
  } catch {
    return Response.json({ error: "Nuk u ruajt. Provo përsëri." }, { status: 503, headers: koka });
  }
}
