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
    <main className="mx-auto min-h-screen max-w-md px-5 pb-16 pt-5">
      <header className="glass sticky top-3 z-10 mb-6 flex items-center justify-between rounded-2xl px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-hero text-primary-foreground shadow-glow">
            <Car className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold text-foreground">AAB RideShare</p>
            <p className="text-[11px] text-muted-foreground">Kolegji AAB · Prishtinë</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${online ? "border-success/40 bg-success/10 text-success" : "border-destructive/50 bg-destructive/10 text-destructive"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${online ? "animate-pulse bg-success" : "bg-destructive"}`} />
          {online ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
          {online ? "Online" : "Pa internet"}
        </span>
      </header>

      {!online && (
        <p className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          Pa internet — po shfaqet kopja e fundit lokale.
        </p>
      )}

      <section className="fade-up relative mb-6 overflow-hidden rounded-3xl bg-hero p-6 text-primary-foreground shadow-glow">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-background/10 blur-2xl" />
        <p className="text-xs font-semibold uppercase tracking-widest opacity-80">Sot drejt kampusit</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight">Udhëtimet drejt AAB</h1>
        <p className="mt-1 text-sm opacity-85">Për studentë dhe profesorë — ndaj makinën, kurse kohë.</p>
        <div className="mt-5 grid grid-cols-3 gap-2">
          {[
            { i: Car, v: lista.length, t: "Udhëtime" },
            { i: Users, v: vende, t: "Vende" },
            { i: MapPin, v: 3, t: "Qytete" },
          ].map(({ i: I, v, t }) => (
            <div key={t} className="rounded-2xl bg-background/15 p-3 text-center backdrop-blur">
              <I className="mx-auto mb-1 h-4 w-4" />
              <div className="text-xl font-bold">{v}</div>
              <div className="text-[11px] opacity-80">{t}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass mb-6 rounded-3xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Roli yt</p>
          {roli !== "vizitor" && (
            <span className="flex items-center gap-1 text-xs text-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" /> {roli === "shofer" ? "Shofer" : "Udhëtar"}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1 rounded-2xl bg-background/60 p-1">
          {(["vizitor", "udhetar", "shofer"] as Roli[]).map((r) => (
            <button key={r} onClick={() => ndryshoRolin(r)}
              className={`rounded-xl px-2 py-2 text-xs font-semibold transition ${roli === r ? "bg-hero text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`}>
              {r === "udhetar" ? "Udhëtar" : r === "shofer" ? "Shofer" : "Vizitor"}
            </button>
          ))}
        </div>
        {roli === "vizitor" && (
          <button onClick={() => ndryshoRolin("udhetar")} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground py-3 text-sm font-semibold text-background transition hover:opacity-90">
            <Github className="h-4 w-4" /> Kyçu me GitHub
          </button>
        )}
        {roli === "udhetar" && (
          <p className="mt-3 text-sm text-muted-foreground">Zgjidh një udhëtim me vende të lira dhe kliko "Kërko vend".</p>
        )}
        {roli === "shofer" && imi && (
          <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm font-semibold text-foreground">Paneli i shoferit</p>
            <p className="mb-3 text-xs text-muted-foreground">Udhëtimi yt: {imi.nisja} → AAB · ora {imi.ora}</p>
            <div className="flex gap-2">
              <input value={ora} onChange={(e) => setOra(e.target.value)} placeholder="08:25"
                className="w-24 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary" />
              <button onClick={() => ruajOren(SHOFERI_ID)} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-hero py-2 text-sm font-semibold text-primary-foreground">
                <Clock className="h-4 w-4" /> Ruaj orën
              </button>
            </div>
            <button onClick={() => ruajOren("1")} className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl border border-border py-2 text-xs text-muted-foreground hover:text-foreground">
              <Lock className="h-3.5 w-3.5" /> Provo të ndryshosh ID 1 (jo i yti)
            </button>
          </div>
        )}
      </section>

      {mesazh && <p className="fade-up mb-4 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-sm text-foreground">{mesazh}</p>}

      <div className="glass mb-3 flex items-center gap-2 rounded-2xl px-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Kërko qytetin e nisjes…"
          className="w-full bg-transparent py-3 text-sm text-foreground outline-none" />
      </div>
      <div className="mb-5 flex items-center justify-between">
        <button onClick={() => setLira(!lira)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${lira ? "border-success/50 bg-success/15 text-success" : "border-border text-muted-foreground"}`}>
          {lira ? "✓ " : ""}Vetëm me vende të lira
        </button>
        <button onClick={rifresko} className="text-sm font-semibold text-primary">Rifresko listën</button>
      </div>

      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-lg font-bold text-foreground">Udhëtimet e sotme</h2>
        <span className="text-xs text-muted-foreground">{filtruar.length} rezultate</span>
      </div>
      <section className="space-y-4">
        {filtruar.length === 0 ? (
          <p className="glass rounded-3xl p-8 text-center text-sm text-muted-foreground">Nuk ka udhëtime për këtë kërkim.</p>
        ) : (
          filtruar.map((u) => <KartaUdhetimi key={u.id} udhetim={u} />)
        )}
      </section>
    </main>
  );
}
