export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "../../../../lib/udhetimet";
import { gjendjaLive } from "../../../../lib/kerkesat";
import { profiliIm } from "../../../../lib/lejet";
import GjendjaLive from "../../../../components/GjendjaLive";

export default async function Kerkesa({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const udhetim = await gjejUdhetimin(id);
  if (!udhetim) notFound();

  let kycur = false;
  let fillimi = { vende: udhetim.vende, ora: udhetim.ora, kerkesa: null as null | "ne_pritje" | "pranuar" | "refuzuar" };
  try {
    kycur = (await profiliIm()) !== null;
    if (kycur) fillimi = (await gjendjaLive(id)) ?? fillimi;
  } catch {
    // mbetet pamja publike
  }

  return (
    <main>
      <Link href={`/udhetimi/${id}`}>← Kthehu te detajet</Link>
      <h1>Kërko vend: {udhetim.nisja} → {udhetim.destinacioni}</h1>
      <p>Kërkesa ruhet dhe shoferi e shikon te paneli i tij. Statusi përditësohet vetë çdo 5 sekonda.</p>
      <GjendjaLive udhetimId={id} fillimi={fillimi} kycur={kycur} mod="kerkese" />
      <p>
        <Link href="/">Kthehu te lista</Link>
      </p>
    </main>
  );
}
