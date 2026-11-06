import Link from "next/link";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { gjejUdhetimin } from "@/lib/udhetimet";
import VendtakimiArtes from "@/components/VendtakimiArtes";

export default async function Detajet({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const udhetim = await gjejUdhetimin(id);
  if (!udhetim) notFound();

  return (
    <main>
      <Link href="/">← Kthehu te lista</Link>
      <h1>
        {udhetim.nisja} – {udhetim.destinacioni}
      </h1>
      <p>Ora: {udhetim.ora}</p>
      <p>Vendtakimi: {udhetim.vendtakimi}</p>
      <p>Vende të lira: {udhetim.vende}</p>
      <VendtakimiArtes />
      {udhetim.vende > 0 ? (
        <Link className="action" href={`/udhetimi/${id}/kerkesa`}>
          Kërko vend
        </Link>
      ) : (
        <>
          <p role="status">Me 0 vende nuk premtojmë rezervim.</p>
          <button className="action" disabled aria-disabled="true">
            Nuk ka vende të lira
          </button>
        </>
      )}
    </main>
  );
}
