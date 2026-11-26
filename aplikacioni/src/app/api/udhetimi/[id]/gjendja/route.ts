import { gjendjaLive } from "@/lib/kerkesat";

export const dynamic = "force-dynamic";
const koka = { "Cache-Control": "no-store" };

// Vendet dhe statusi i kërkesës së vetë përdoruesit. Asnjë të dhënë për udhëtarë të tjerë.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const g = await gjendjaLive(id);
    if (!g) return Response.json({ error: "Udhëtimi nuk u gjet." }, { status: 404, headers: koka });
    return Response.json(g, { headers: koka });
  } catch {
    return Response.json({ error: "Gjendja nuk lexohet tani." }, { status: 503, headers: koka });
  }
}
