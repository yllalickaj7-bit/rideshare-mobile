import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Users, ArrowRight } from "lucide-react";
import type { Udhetim } from "@/lib/udhetimet";
import { BadgeVende } from "./BadgeVende";

export function KartaUdhetimi({ udhetim }: { udhetim: Udhetim }) {
  return (
    <Link
      to="/udhetimi/$id"
      params={{ id: udhetim.id }}
      className="glow-card block rounded-2xl p-5 transition-all active:scale-[0.99]"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Ruta për AAB</span>
          <h2 className="mt-1 flex items-center gap-2 text-xl font-bold text-foreground">
            {udhetim.nisja} <ArrowRight className="h-4 w-4 text-muted-foreground" /> {udhetim.destinacioni}
          </h2>
        </div>
        <BadgeVende vende={udhetim.vende} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{udhetim.ora}</span>
        <span className="flex items-center gap-2"><Users className="h-4 w-4 text-primary" />{udhetim.vende} vende</span>
        <span className="col-span-2 flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{udhetim.vendtakimi}</span>
      </div>
    </Link>
  );
}
