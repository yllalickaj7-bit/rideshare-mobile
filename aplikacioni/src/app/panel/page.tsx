import Link from "next/link";
import Hyrja from "@/components/Hyrja";
import { profiliIm, type Profil } from "@/lib/lejet";
import { kerkesatNePritjePerShofer, type KerkeseNePritje } from "@/lib/kerkesat";
import { ruajOren, pergjigjuKerkeses } from "./actions";

export const dynamic = "force-dynamic";
const mesazhet: Record<string, string> = {
  hyr: "Hyr në llogari para se të ndryshosh udhëtimin.",
  ndaluar: "Nuk ke leje për këtë udhëtim. Ora nuk ndryshoi.",
  fushe: "Shkruaj një orë të vlefshme, p.sh. 08:25. ID duhet të jetë 1, 2 ose 3.",
  ruajtur: "Ora u ruajt me sukses. Kontrollo listën dhe detajet.",
  databaza: "Nuk u lidhëm me databazën. Kontrollo Neon dhe provo përsëri.",
  pranuar: "Kërkesa u pranua dhe vendi u zbrit me 1.",
  refuzuar: "Kërkesa u refuzua.",
  pa_vende: "Nuk ka vende të lira, kërkesa mbetet në pritje.",
};

export default async function Panel({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  let p: Profil | null;
  try {
    p = await profiliIm();
  } catch {
    return (
      <main>
        <h1>Paneli im</h1>
        <p role="alert">{mesazhet.databaza}</p>
        <Link href="/panel">Provo përsëri</Link>
      </main>
    );
  }
  let kerkesat: KerkeseNePritje[] = [];
  try {
    kerkesat = await kerkesatNePritjePerShofer();
  } catch {
    kerkesat = [];
  }
  return (
    <main>
      <h1>Paneli im</h1>
      {m && mesazhet[m] && <p role="status">{mesazhet[m]}</p>}
      {!p ? (
        <p>Lista është publike. Për panelin hyr me llogarinë tënde GitHub.</p>
      ) : (
        <>
          <p>Përshëndetje, {p.emri}. Roli: <strong>{p.roli}</strong>.</p>
          <p>ID ime GitHub: <code>{p.id}</code></p>
        </>
      )}
      <Hyrja brenda={Boolean(p)} />
      {p?.roli === "shofer" ? (
        <form action={ruajOren}>
          <h2>Ndrysho orën e udhëtimit tim</h2>
          <input type="hidden" name="id" value="2" />
          <label htmlFor="ora">Ora e re</label>{" "}
          <input id="ora" name="ora" type="time" defaultValue="08:15" required />{" "}
          <button type="submit">Ruaj orën</button>
          <p>Formulari i laboratorit provon ID 2. Serveri verifikon pronarin edhe nëse ID ndryshohet.</p>
        </form>
      ) : (
        p && <p>Si udhëtar mund të shohësh udhëtimet; nuk mund të ndryshosh orën e shoferit.</p>
      )}
      {p?.roli === "shofer" && (
        <section>
          <h2>Kërkesat në pritje</h2>
          {kerkesat.length === 0 ? (
            <p>Nuk ka kërkesa në pritje.</p>
          ) : (
            <ul>
              {kerkesat.map((k) => (
                <li key={k.id}>
                  {k.udhetari} · {k.nisja} → AAB · {k.ora}
                  <form action={pergjigjuKerkeses}>
                    <input type="hidden" name="id" value={k.id} />
                    <button type="submit" name="veprimi" value="prano" className="action small">Prano</button>{" "}
                    <button type="submit" name="veprimi" value="refuzo" className="action small">Refuzo</button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
      <p><Link href="/">Kthehu te udhëtimet</Link></p>
    </main>
  );
}
