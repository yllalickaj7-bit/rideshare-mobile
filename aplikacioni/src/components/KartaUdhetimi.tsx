import Link from "next/link";
import type { Udhetim } from "@/lib/udhetimet";

export function KartaUdhetimi({ udhetim }: { udhetim: Udhetim }) {
  const niveli = udhetim.vende === 0 ? "plot" : udhetim.vende <= 1 ? "pak" : "lira";
  return (
    <article className="trip-card">
      <div className="trip-head">
        <h2>
          {udhetim.nisja} <span className="arrow">→</span> {udhetim.destinacioni}
        </h2>
        <span className={`badge ${niveli}`}>
          {udhetim.vende === 0 ? "Plot" : `${udhetim.vende} vende të lira`}
        </span>
      </div>
      <dl className="meta">
        <div><dt>🕗 Ora</dt><dd>{udhetim.ora}</dd></div>
        <div><dt>📍 Vendtakimi</dt><dd>{udhetim.vendtakimi}</dd></div>
      </dl>
      <p className="sr-only">Vende të lira: {udhetim.vende}</p>
      <Link className="action" href={`/udhetimi/${udhetim.id}`}>
        Shiko detajet
      </Link>
    </article>
  );
}
