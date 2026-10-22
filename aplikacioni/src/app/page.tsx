import { KartaUdhetimi } from "@/components/KartaUdhetimi";
import { lexoUdhetimet, type Udhetim } from "@/lib/udhetimet";

export const dynamic = "force-dynamic";

export default async function Home() {
  let udhetimet: Udhetim[] = [];
  let gabim = false;
  try {
    udhetimet = await lexoUdhetimet();
  } catch (e) {
    console.error(e);
    gabim = true;
  }

  return (
    <main>
      <h1>RideShare · Udhëtimet për AAB</h1>
      <p>Zgjidh një nisje dhe lexo detajet para kërkesës.</p>
      {gabim ? (
        <p role="alert">Nuk u lidhëm me databazën. Provo përsëri.</p>
      ) : udhetimet.length === 0 ? (
        <p>Nuk ka udhëtime për momentin.</p>
      ) : (
        <div className="trip-list">
          {udhetimet.map((udhetim) => (
            <KartaUdhetimi key={udhetim.id} udhetim={udhetim} />
          ))}
        </div>
      )}
    </main>
  );
}
