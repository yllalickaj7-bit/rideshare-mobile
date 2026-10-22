import Link from "next/link";
import { KartaUdhetimi } from "@/components/KartaUdhetimi";
import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";
import { profiliIm, type Profil } from "@/lib/lejet";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ q?: string; lira?: string }> }) {
  const { q = "", lira } = await searchParams;
  let udhetimet: Udhetim[] = [];
  let gabim = false;
  let profili: Profil | null = null;
  try {
    udhetimet = await lexoUdhetimet();
  } catch (e) {
    console.error(e);
    gabim = true;
  }
  try { profili = await profiliIm(); } catch { profili = null; }

  const filtruar = udhetimet.filter(
    (u) => u.nisja.toLowerCase().includes(q.toLowerCase()) && (!lira || u.vende > 0),
  );
  const vendeGjithsej = udhetimet.reduce((s, u) => s + u.vende, 0);

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="logo">AAB</span> RideShare</div>
        {profili ? (
          <Link href="/panel" className="user-chip">
            {profili.emri}
            <span className={`role ${profili.roli}`}>{profili.roli === "shofer" ? "Shofer" : "Udhëtar"}</span>
          </Link>
        ) : (
          <Link href="/panel" className="action small">Kyçu me GitHub</Link>
        )}
      </header>

      <section className="hero">
        <p className="eyebrow">Kolegji AAB · Fushë Kosovë</p>
        <h1>RideShare · Udhëtimet për AAB</h1>
        <p>Zgjidh një nisje dhe lexo detajet para kërkesës.</p>
        <div className="stats">
          <div><strong>{udhetimet.length}</strong><span>udhëtime sot</span></div>
          <div><strong>{vendeGjithsej}</strong><span>vende të lira</span></div>
          <div><strong>3</strong><span>qytete</span></div>
        </div>
      </section>

      {profili?.roli === "shofer" && (
        <section className="role-panel shofer">
          <h2>Paneli i shoferit</h2>
          <p>Ndrysho orën e nisjes vetëm për udhëtimin që të takon. Serveri kontrollon pronësinë.</p>
          <Link href="/panel" className="action">Menaxho udhëtimin tim</Link>
        </section>
      )}
      {profili?.roli === "udhetar" && (
        <section className="role-panel udhetar">
          <h2>Mirë se erdhe, {profili.emri}</h2>
          <p>Gjej një udhëtim me vende të lira dhe kërko vendin tënd.</p>
        </section>
      )}
      {!profili && (
        <section className="role-panel guest">
          <p>Kyçu për të parë rolin tënd. Shoferët menaxhojnë orën, udhëtarët kërkojnë vend.</p>
        </section>
      )}

      <form className="filters" action="/">
        <input name="q" defaultValue={q} placeholder="Kërko sipas nisjes (p.sh. Lipjan)" aria-label="Kërko sipas nisjes" />
        <label><input type="checkbox" name="lira" value="1" defaultChecked={!!lira} /> Vetëm me vende</label>
        <button className="action small" type="submit">Filtro</button>
      </form>

      {gabim ? (
        <p role="alert" className="alert">Nuk u lidhëm me databazën. Provo përsëri ose hap listën pa internet.</p>
      ) : filtruar.length === 0 ? (
        <p className="empty">Nuk ka udhëtime për momentin.</p>
      ) : (
        <div className="trip-list">
          {filtruar.map((udhetim) => (
            <KartaUdhetimi key={udhetim.id} udhetim={udhetim} />
          ))}
        </div>
      )}
    </main>
  );
}
