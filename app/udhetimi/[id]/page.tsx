import Link from "next/link";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "../../../lib/udhetimet";
import { gjendjaLive } from "../../../lib/kerkesat";
import { preferuaratEMia } from "../../../lib/preferuarat";
import { profiliIm } from "../../../lib/lejet";
import VendtakimiArtes from "../../../components/VendtakimiArtes";
import RuajUdhetimin from "../../../components/RuajUdhetimin";
import GjendjaLive from "../../../components/GjendjaLive";

export default async function Detajet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const udhetim = await gjejUdhetimin(id);
  if (!udhetim) notFound();

  // Pjesët private (hyrja, të ruajturat, kërkesa ime) nuk e prishin faqen publike nëse dështojnë.
  let kycur = false;
  let eRuajtur = false;
  let fillimi = { vende: udhetim.vende, ora: udhetim.ora, kerkesa: null as null | "ne_pritje" | "pranuar" | "refuzuar" };
  try {
    kycur = (await profiliIm()) !== null;
    if (kycur) {
      eRuajtur = (await preferuaratEMia()).includes(id);
      fillimi = (await gjendjaLive(id)) ?? fillimi;
    }
  } catch {
    // mbetet pamja publike
  }

  return (
    <main>
      <Link href="/" className="mbrapa">← Kthehu te lista</Link>
      <header className="udhetim-top">
        <p className="eyebrow">Detajet e udhëtimit</p>
        <h1>
          {udhetim.nisja} – {udhetim.destinacioni}
        </h1>
        <div className="rruga" aria-hidden="true"><b>{udhetim.nisja}</b><i /><b>{udhetim.destinacioni}</b></div>
        <p>📍 Vendtakimi: {udhetim.vendtakimi}</p>
      </header>
      <GjendjaLive udhetimId={id} fillimi={fillimi} kycur={kycur} mod="detaje" />
      <RuajUdhetimin udhetimId={id} fillimisht={eRuajtur} kycur={kycur} />
      <VendtakimiArtes />
    </main>
  );
}
