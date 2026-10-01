import { createFileRoute } from "@tanstack/react-router";
import { Car } from "lucide-react";
import { udhetimet } from "@/lib/udhetimet";
import { KartaUdhetimi } from "@/components/KartaUdhetimi";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AAB Rideshare — Udhëtime për Kolegjin AAB" },
      { name: "description", content: "Gjej udhëtime të përbashkëta drejt Kolegjit AAB për studentë dhe profesorë." },
      { property: "og:title", content: "AAB Rideshare — Udhëtime për Kolegjin AAB" },
      { property: "og:description", content: "Gjej udhëtime të përbashkëta drejt Kolegjit AAB." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-10 pt-8">
      <header className="mb-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
          <Car className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-primary">AAB College Rideshare</p>
        <h1 className="mt-1 text-3xl font-bold leading-tight text-foreground">Udhëtimet drejt AAB sot</h1>
        <p className="mt-2 text-sm text-muted-foreground">Për studentë dhe profesorë. Zgjidh një udhëtim dhe kërko vend.</p>
      </header>
      <section className="space-y-4">
        {udhetimet.map((u) => <KartaUdhetimi key={u.id} udhetim={u} />)}
      </section>
    </main>
  );
}
