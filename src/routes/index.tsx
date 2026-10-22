import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Car, Search, Wifi, WifiOff, Github, Users, MapPin, Clock, ShieldCheck, Lock } from "lucide-react";
import { udhetimet as burimi, type Udhetim } from "@/lib/udhetimet";
import { KartaUdhetimi } from "@/components/KartaUdhetimi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AAB Rideshare — Udhëtime për Kolegjin AAB" },
      { name: "description", content: "Gjej udhëtime të përbashkëta drejt Kolegjit AAB për studentë dhe profesorë." },
      { property: "og:title", content: "AAB Rideshare — Udhëtime për Kolegjin AAB" },
      { property: "og:description", content: "Gjej udhëtime të përbashkëta drejt Kolegjit AAB." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

type Roli = "vizitor" | "udhetar" | "shofer";
const CACHE = "aab-udhetimet-cache";
const ROLI = "aab-roli";
const SHOFERI_ID = "2"; // shoferi demo zotëron udhëtimin ID 2

function Index() {
  const [lista, setLista] = useState<Udhetim[]>(burimi);
  const [online, setOnline] = useState(true);
  const [roli, setRoli] = useState<Roli>("vizitor");
  const [q, setQ] = useState("");
  const [lira, setLira] = useState(false);
  const [ora, setOra] = useState("");
  const [mesazh, setMesazh] = useState("");

  useEffect(() => {
    const ruajtur = localStorage.getItem(CACHE);
    const r = localStorage.getItem(ROLI) as Roli | null;
    if (r) setRoli(r);
    const isOnline = navigator.onLine;
    setOnline(isOnline);
    if (!isOnline && ruajtur) setLista(JSON.parse(ruajtur));
    else if (ruajtur) {
      // ruaj ndryshimet e shoferit, përndryshe burimi
      setLista(JSON.parse(ruajtur));
    } else localStorage.setItem(CACHE, JSON.stringify(burimi));
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const ndryshoRolin = (r: Roli) => {
    setRoli(r);
    localStorage.setItem(ROLI, r);
    setMesazh("");
  };

  const ruajOren = (id: string) => {
    if (roli !== "shofer") return setMesazh("Vetëm shoferi mund ta ndryshojë orën.");
    if (id !== SHOFERI_ID) return setMesazh("Refuzuar: ky udhëtim nuk është i yti.");
    if (!/^\d{2}:\d{2}$/.test(ora)) return setMesazh("Shkruaj orën si 08:25.");
    const e_re = lista.map((u) => (u.id === id ? { ...u, ora } : u));
    setLista(e_re);
    localStorage.setItem(CACHE, JSON.stringify(e_re));
    setMesazh(`Ora u ndryshua në ${ora}.`);
  };

  const rifresko = () => {
    if (!online) return setMesazh("Pa internet — po shfaqet kopja e fundit.");
    const ruajtur = localStorage.getItem(CACHE);
    setLista(ruajtur ? JSON.parse(ruajtur) : burimi);
    setMesazh("Lista u rifreskua.");
  };

  const filtruar = useMemo(
    () => lista.filter((u) => u.nisja.toLowerCase().includes(q.toLowerCase()) && (!lira || u.vende > 0)),
    [lista, q, lira],
  );
  const vende = lista.reduce((s, u) => s + u.vende, 0);
  const imi = lista.find((u) => u.id === SHOFERI_ID);

  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-12 pt-5">
      <header className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Car className="h-5 w-5" />
          </span>
          <span className="font-bold text-foreground">AAB RideShare</span>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${online ? "border-primary/40 text-primary" : "border-destructive/50 text-destructive"}`}>
          {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          {online ? "Online" : "Pa internet"}
        </span>
      </header>

      {!online && (
        <p className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          Pa internet — po shfaqet kopja e fundit lokale.
        </p>
      )}

      <section className="mb-5 rounded-2xl border border-border bg-card p-4">
        <p className="mb-2 text-xs text-muted-foreground">Kyçja (demo e roleve)</p>
        <div className="grid grid-cols-3 gap-2">
          {(["vizitor", "udhetar", "shofer"] as Roli[]).map((r) => (
            <button key={r} onClick={() => ndryshoRolin(r)}
              className={`rounded-xl border px-2 py-2 text-xs font-semibold capitalize transition ${roli === r ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground"}`}>
              {r === "udhetar" ? "Udhëtar" : r === "shofer" ? "Shofer" : "Vizitor"}
            </button>
          ))}
        </div>
        {roli === "vizitor" ? (
          <button onClick={() => ndryshoRolin("udhetar")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-2.5 text-sm font-semibold text-background">
            <Github className="h-4 w-4" /> Kyçu me GitHub
          </button>
        ) : (
          <p className="mt-3 flex items-center gap-2 text-sm text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> I kyçur si <b>{roli === "shofer" ? "Shofer" : "Udhëtar"}</b>
          </p>
        )}
      </section>

      <h1 className="text-3xl font-bold leading-tight text-foreground">Udhëtimet drejt AAB sot</h1>
      <p className="mt-1 text-sm text-muted-foreground">Për studentë dhe profesorë të Kolegjit AAB.</p>

      <div className="my-5 grid grid-cols-3 gap-2">
        {[
          { i: Car, v: lista.length, t: "Udhëtime" },
          { i: Users, v: vende, t: "Vende të lira" },
          { i: MapPin, v: 3, t: "Qytete" },
        ].map(({ i: I, v, t }) => (
          <div key={t} className="rounded-2xl border border-border bg-card p-3 text-center">
            <I className="mx-auto mb-1 h-4 w-4 text-primary" />
            <div className="text-xl font-bold text-foreground">{v}</div>
            <div className="text-[11px] text-muted-foreground">{t}</div>
          </div>
        ))}
      </div>

      {roli === "shofer" && imi && (
        <section className="mb-5 rounded-2xl border border-primary/40 bg-primary/5 p-4">
          <p className="mb-1 text-sm font-semibold text-foreground">Paneli i shoferit</p>
          <p className="mb-3 text-xs text-muted-foreground">Udhëtimi yt: {imi.nisja} → AAB, ora {imi.ora}</p>
          <div className="flex gap-2">
            <input value={ora} onChange={(e) => setOra(e.target.value)} placeholder="08:25"
              className="w-24 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground" />
            <button onClick={() => ruajOren(SHOFERI_ID)} className="flex-1 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground">
              <Clock className="mr-1 inline h-4 w-4" /> Ruaj orën
            </button>
          </div>
          <button onClick={() => ruajOren("1")} className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-border py-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" /> Provo të ndryshosh ID 1 (jo i yti)
          </button>
        </section>
      )}
      {roli === "udhetar" && (
        <p className="mb-5 rounded-2xl border border-border bg-card p-3 text-sm text-muted-foreground">
          Zgjidh një udhëtim me vende të lira dhe kliko "Kërko vend".
        </p>
      )}

      {mesazh && <p className="mb-4 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground">{mesazh}</p>}

      <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-card px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kërko qytetin e nisjes…"
          className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none" />
      </div>
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={lira} onChange={(e) => setLira(e.target.checked)} className="accent-primary" />
          Vetëm me vende të lira
        </label>
        <button onClick={rifresko} className="text-sm font-medium text-primary">Rifresko listën</button>
      </div>

      <section className="space-y-4">
        {filtruar.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">Nuk ka udhëtime për këtë kërkim.</p>
        ) : (
          filtruar.map((u) => <KartaUdhetimi key={u.id} udhetim={u} />)
        )}
      </section>
    </main>
  );
}
