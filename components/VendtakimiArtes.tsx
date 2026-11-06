"use client";

import { useState } from "react";

type Gjendja = "idle" | "loading" | "success" | "denied" | "timeout" | "unavailable";

const MESAZHET: Record<Gjendja, string> = {
  idle: "Vendndodhja nuk është kërkuar ende.",
  loading: "Po kërkojmë vendndodhjen…",
  success: "Pozicioni u mor.",
  denied: "Leja u refuzua. Shkruaj vendtakimin vetë.",
  timeout: "Koha mbaroi. Provo sërish ose shkruaj vendtakimin vetë.",
  unavailable: "Pozicioni nuk është i disponueshëm. Shkruaj vendtakimin vetë.",
};

export default function VendtakimiArtes() {
  const [teksti, setTeksti] = useState("");
  const [vendtakimi, setVendtakimi] = useState("");
  const [gabimi, setGabimi] = useState("");
  const [gjendja, setGjendja] = useState<Gjendja>("idle");
  const [saktesia, setSaktesia] = useState<number | null>(null);

  function konfirmo() {
    const pastruar = teksti.trim();
    if (!pastruar) {
      setGabimi("Shkruaj një vendtakim, jo vetëm hapësira.");
      return;
    }
    setGabimi("");
    setVendtakimi(pastruar);
  }

  function kurMerretPozicioni(position: GeolocationPosition) {
    setSaktesia(Math.round(position.coords.accuracy));
    setGjendja("success");
  }

  function kurDeshtonLeximi(error: { code: number }) {
    setSaktesia(null);
    if (error.code === 1) setGjendja("denied");
    else if (error.code === 3) setGjendja("timeout");
    else setGjendja("unavailable");
  }

  function perdorVendndodhjen() {
    if (typeof navigator === "undefined" || !("geolocation" in navigator) || !navigator.geolocation) {
      setGjendja("unavailable");
      return;
    }
    setGjendja("loading");
    navigator.geolocation.getCurrentPosition(kurMerretPozicioni, kurDeshtonLeximi, {
      timeout: 10000,
    });
  }

  return (
    <section className="vendtakimi" aria-label="Vendtakimi i Artës">
      <button
        type="button"
        data-testid="locate-me"
        onClick={perdorVendndodhjen}
        disabled={gjendja === "loading"}
      >
        Përdor vendndodhjen time
      </button>
      <p data-testid="location-status" data-state={gjendja} role="status">
        {MESAZHET[gjendja]}
      </p>
      <p data-testid="location-accuracy">
        {saktesia !== null ? `Saktësia rreth ${saktesia} m` : ""}
      </p>

      <label htmlFor="vendtakimi-input">Shkruaj vendtakimin</label>
      <input
        id="vendtakimi-input"
        data-testid="meeting-input"
        value={teksti}
        onChange={(e) => setTeksti(e.target.value)}
        placeholder="p.sh. Biblioteka"
      />
      <button type="button" data-testid="confirm-meeting" onClick={konfirmo}>
        Konfirmo në telefon
      </button>
      <p data-testid="meeting-error" role="alert">
        {gabimi}
      </p>
      <div>
        <small>Vendtakimi i konfirmuar</small>
        <strong data-testid="confirmed-meeting">{vendtakimi || "Ende pa zgjedhje"}</strong>
      </div>
      <small>Zgjedhje lokale · nuk është dërguar te shoferi.</small>
    </section>
  );
}
