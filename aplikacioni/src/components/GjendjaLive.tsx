"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Statusi = "ne_pritje" | "pranuar" | "refuzuar";
export type Gjendja = { vende: number; ora: string; kerkesa: Statusi | null };
export type MerrFn = (udhetimId: string, signal: AbortSignal) => Promise<Gjendja>;

const etiketat: Record<Statusi, string> = {
  ne_pritje: "Në pritje të shoferit",
  pranuar: "Pranuar ✓",
  refuzuar: "Refuzuar",
};

async function merrNgaServeri(udhetimId: string, signal: AbortSignal): Promise<Gjendja> {
  const pergjigja = await fetch(`/api/udhetimi/${encodeURIComponent(udhetimId)}/gjendja`, {
    cache: "no-store",
    signal,
  });
  if (!pergjigja.ok) throw new Error(String(pergjigja.status));
  return (await pergjigja.json()) as Gjendja;
}

// Rilexon vendet dhe statusin e kërkesës çdo 5 sekonda (polling), pa rifreskuar faqen.
export default function GjendjaLive({
  udhetimId,
  fillimi,
  kycur,
  mod,
  intervali = 5000,
  merr = merrNgaServeri,
}: {
  udhetimId: string;
  fillimi: Gjendja;
  kycur: boolean;
  mod: "detaje" | "kerkese";
  intervali?: number;
  merr?: MerrFn;
}) {
  const [gj, setGj] = useState<Gjendja>(fillimi);
  const [lidhja, setLidhja] = useState<"ok" | "ndalur">("ok");
  const [perditesuar, setPerditesuar] = useState<string | null>(null);
  const [dergimi, setDergimi] = useState<"idle" | "dergon" | "gabim">("idle");
  const [mesazhi, setMesazhi] = useState("");
  const zene = useRef(false);
  const rifreskoRef = useRef<() => Promise<void>>(async () => {});

  useEffect(() => {
    let mbyllur = false;
    let kontrolli: AbortController | null = null;

    async function rifresko() {
      kontrolli?.abort();
      const ky = new AbortController();
      kontrolli = ky;
      try {
        const g = await merr(udhetimId, ky.signal);
        if (mbyllur || ky.signal.aborted) return;
        setGj(g);
        setLidhja("ok");
        setPerditesuar(new Date().toLocaleTimeString("sq-AL"));
      } catch {
        if (mbyllur || ky.signal.aborted) return;
        setLidhja("ndalur"); // mbaj vlerat e fundit dhe provo përsëri në rradhë
      }
    }
    rifreskoRef.current = rifresko;

    const kohez = setInterval(() => {
      if (document.visibilityState === "visible") void rifresko();
    }, intervali);
    // Kur kthehet interneti ose kthehet skeda, rilexo menjëherë.
    const kthim = () => {
      if (document.visibilityState === "visible") void rifresko();
    };
    window.addEventListener("online", kthim);
    document.addEventListener("visibilitychange", kthim);
    return () => {
      mbyllur = true;
      clearInterval(kohez);
      kontrolli?.abort();
      window.removeEventListener("online", kthim);
      document.removeEventListener("visibilitychange", kthim);
    };
  }, [udhetimId, intervali, merr]);

  async function dergo() {
    if (zene.current) return;
    zene.current = true;
    setDergimi("dergon");
    setMesazhi("");
    try {
      const pergjigja = await fetch("/api/kerkesat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ udhetimId }),
      });
      if (!pergjigja.ok) {
        const trupi = (await pergjigja.json().catch(() => ({}))) as { error?: string };
        setDergimi("gabim");
        setMesazhi(trupi.error ?? "Kërkesa nuk u dërgua.");
      } else {
        setDergimi("idle");
        setGj((g) => ({ ...g, kerkesa: "ne_pritje" }));
      }
      await rifreskoRef.current();
    } catch {
      setDergimi("gabim");
      setMesazhi("Nuk ka lidhje. Provo përsëri.");
    } finally {
      zene.current = false;
    }
  }

  return (
    <section aria-label="Gjendja e udhëtimit">
      <p>Ora: <strong data-testid="ora">{gj.ora}</strong></p>
      <p>Vende të lira: <strong data-testid="vende">{gj.vende}</strong></p>
      {gj.kerkesa && (
        <p role="status" data-testid="statusi">
          Kërkesa jote: <strong>{etiketat[gj.kerkesa]}</strong>
        </p>
      )}
      {lidhja === "ndalur" ? (
        <p role="alert" className="alert">
          Lidhja u ndërpre. Vlerat mund të jenë të vjetra; po provoj përsëri.
        </p>
      ) : (
        perditesuar && <small>U përditësua në {perditesuar} (çdo {Math.round(intervali / 1000)} sek)</small>
      )}

      {mod === "detaje" &&
        (gj.kerkesa ? null : gj.vende > 0 ? (
          <p>
            <Link className="action" href={`/udhetimi/${udhetimId}/kerkesa`}>
              Kërko vend
            </Link>
          </p>
        ) : (
          <>
            <p role="status">Me 0 vende nuk premtojmë rezervim.</p>
            <button className="action" disabled aria-disabled="true">
              Nuk ka vende të lira
            </button>
          </>
        ))}

      {mod === "kerkese" && !gj.kerkesa && (
        <>
          {!kycur ? (
            <p>
              <Link href="/panel">Hyr me GitHub për të kërkuar vend.</Link>
            </p>
          ) : gj.vende > 0 ? (
            <button type="button" className="action" disabled={dergimi === "dergon"} onClick={dergo}>
              {dergimi === "dergon" ? "Duke dërguar…" : "Dërgo kërkesën"}
            </button>
          ) : (
            <p role="status">Nuk ka vende të lira.</p>
          )}
          {dergimi === "gabim" && (
            <p role="alert" className="alert">
              {mesazhi}{" "}
              <button type="button" className="action small" onClick={dergo}>
                Provo përsëri
              </button>
            </p>
          )}
        </>
      )}
    </section>
  );
}
