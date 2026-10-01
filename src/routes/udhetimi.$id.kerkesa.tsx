import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Hourglass } from "lucide-react";
import { gjejUdhetimin } from "@/lib/udhetimet";
import { UdhetimNukGjendet } from "@/components/UdhetimNukGjendet";

export const Route = createFileRoute("/udhetimi/$id/kerkesa")({
  loader: ({ params }) => {
    const udhetim = gjejUdhetimin(params.id);
    if (!udhetim) throw notFound();
    return { udhetim };
  },
  head: () => ({
    meta: [
      { title: "Kërkesa në pritje — AAB Rideshare" },
      { name: "description", content: "Kërkesa juaj për vend është dërguar dhe është në pritje." },
      { property: "og:title", content: "Kërkesa në pritje — AAB Rideshare" },
      { property: "og:description", content: "Kërkesa juaj për vend është në pritje të konfirmimit." },
      { name: "robots", content: "noindex" },
    ],
  }),
  notFoundComponent: UdhetimNukGjendet,
  component: Kerkesa,
});

function Kerkesa() {
  const { udhetim } = Route.useLoaderData();
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-warning/20" />
        <span className="relative flex h-24 w-24 items-center justify-center rounded-full border border-warning/40 bg-warning/10 text-warning">
          <Hourglass className="h-10 w-10" />
        </span>
      </div>
      <span className="rounded-full border border-warning/30 bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">Në pritje</span>
      <h1 className="mt-4 text-2xl font-bold text-foreground">Kërkesa u dërgua</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Shoferi {udhetim.shoferi} do të konfirmojë vendin tuaj për udhëtimin {udhetim.nisja} → AAB në {udhetim.ora}.
      </p>
      <div className="glow-card mt-6 w-full rounded-2xl p-4 text-left text-sm">
        <p className="text-muted-foreground">Vendtakimi</p>
        <p className="font-semibold text-foreground">{udhetim.vendtakimi}</p>
      </div>
      <Link to="/" className="mt-8 w-full rounded-2xl border border-border py-4 font-semibold text-foreground hover:bg-secondary">
        Kthehu te udhëtimet
      </Link>
    </main>
  );
}
