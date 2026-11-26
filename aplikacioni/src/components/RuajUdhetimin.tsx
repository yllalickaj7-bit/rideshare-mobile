"use client";
import Link from "next/link";
import { useRef, useState } from "react";

export type RuajFn = (udhetimId: string, ruaj: boolean) => Promise<void>;

async function ruajNeServer(udhetimId: string, ruaj: boolean): Promise<void> {
  const pergjigja = await fetch("/api/te-preferuarat", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ udhetimId, ruaj }),
  });
  if (!pergjigja.ok) throw new Error(String(pergjigja.status));
}

type Gjendja = "mire" | "ruan" | "gabim";

export default function RuajUdhetimin({
  udhetimId,
  fillimisht,
  kycur = true,
  ruaj = ruajNeServer,
}: {
  udhetimId: string;
  fillimisht: boolean;
  kycur?: boolean;
  ruaj?: RuajFn;
}) {
  const [ruajtur, setRuajtur] = useState(fillimisht);
  const [gjendja, setGjendja] = useState<Gjendja>("mire");
  const [tentuar, setTentuar] = useState<boolean>(!fillimisht);
  // Ref-i bllokon klikimin e dytë menjëherë, para se React të rifreskojë butonin.
  const zene = useRef(false);

  async function ndrysho(vlera: boolean) {
    if (zene.current) return;
    zene.current = true;
    const paraSe = ruajtur;
    setTentuar(vlera);
    setRuajtur(vlera); // ndërfaqja optimiste: ndryshon menjëherë
    setGjendja("ruan");
    try {
      await ruaj(udhetimId, vlera);
      setGjendja("mire");
    } catch {
      setRuajtur(paraSe); // rikthe gjendjen e mëparshme, pa sukses të rremë
      setGjendja("gabim");
    } finally {
      zene.current = false;
    }
  }

  if (!kycur) {
    return (
      <p>
        <Link href="/panel">Hyr me GitHub për të ruajtur udhëtimin.</Link>
      </p>
    );
  }

  return (
    <div className="ruaj">
      <button
        type="button"
        className="action"
        aria-pressed={ruajtur}
        disabled={gjendja === "ruan"}
        onClick={() => ndrysho(!ruajtur)}
      >
        {ruajtur ? "★ E ruajtur" : "☆ Ruaj udhëtimin"}
      </button>
      <p role="status" aria-live="polite">
        {gjendja === "ruan" && "Duke ruajtur…"}
        {gjendja === "mire" && ruajtur && "Udhëtimi është i ruajtur."}
      </p>
      {gjendja === "gabim" && (
        <p role="alert" className="alert">
          Nuk u ruajt dhe gjendja u kthye si më parë.{" "}
          <button type="button" className="action small" onClick={() => ndrysho(tentuar)}>
            Provo përsëri
          </button>
        </p>
      )}
    </div>
  );
}
