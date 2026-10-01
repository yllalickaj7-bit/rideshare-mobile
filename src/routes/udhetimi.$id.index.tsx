import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Users, User } from "lucide-react";
import { gjejUdhetimin } from "@/lib/udhetimet";
import { BadgeVende } from "@/components/BadgeVende";
import { UdhetimNukGjendet } from "@/components/UdhetimNukGjendet";

export const Route = createFileRoute("/udhetimi/$id/")({
  loader: ({ params }) => {
    const udhetim = gjejUdhetimin(params.id);
    if (!udhetim) throw notFound();
    return { udhetim };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Udhëtimi nuk u gjet" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.udhetim.nisja} → AAB në ${loaderData.udhetim.ora} — AAB Rideshare`;
    const d = `Takimi: ${loaderData.udhetim.vendtakimi}. Vende të lira: ${loaderData.udhetim.vende}.`;
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }] };
  },
  notFoundComponent: UdhetimNukGjendet,
  component: Detajet,
});

function Detajet() {
  const { udhetim } = Route.useLoaderData();
  const kaVende = udhetim.vende > 0;
  const rows = [
    { icon: Clock, label: "Ora e nisjes", value: udhetim.ora },
    { icon: MapPin, label: "Vendtakimi", value: udhetim.vendtakimi },
    { icon: Users, label: "Vende të lira", value: String(udhetim.vende) },
    { icon: User, label: "Shoferi", value: udhetim.shoferi },
  ];
  return (
    <main className="mx-auto min-h-screen max-w-md px-5 pb-10 pt-6">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kthehu
      </Link>
      <div className="glow-card rounded-3xl p-6">
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Detajet e udhëtimit</span>
          <BadgeVende vende={udhetim.vende} />
        </div>
        <h1 className="mt-3 text-3xl font-bold text-foreground">{udhetim.nisja}</h1>
        <p className="text-lg text-muted-foreground">→ Kolegji {udhetim.destinacioni}</p>
        <ul className="mt-6 divide-y divide-border">
          {rows.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-3 py-3">
              <Icon className="h-5 w-5 text-primary" />
              <span className="flex-1 text-sm text-muted-foreground">{label}</span>
              <span className="font-semibold text-foreground">{value}</span>
            </li>
          ))}
        </ul>
      </div>
      {kaVende ? (
        <Link to="/udhetimi/$id/kerkesa" params={{ id: udhetim.id }}
          className="mt-6 flex w-full items-center justify-center rounded-2xl bg-primary py-4 font-semibold text-primary-foreground shadow-glow transition active:scale-[0.98]">
          Kërko vend
        </Link>
      ) : (
        <button disabled className="mt-6 w-full rounded-2xl bg-muted py-4 font-semibold text-muted-foreground">
          Nuk ka vende të lira
        </button>
      )}
    </main>
  );
}
