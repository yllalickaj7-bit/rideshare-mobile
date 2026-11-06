import { Link } from "@tanstack/react-router";
import { Clock, MapPin, ChevronRight, User } from "lucide-react";
import type { Udhetim } from "@/lib/udhetimet";
import { BadgeVende } from "./BadgeVende";

export function KartaUdhetimi({ udhetim }: { udhetim: Udhetim }) {
  return (
    <Link
      to="/udhetimi/$id"
      params={{ id: udhetim.id }}
      className="glow-card fade-up group block rounded-3xl p-5 transition-all hover:-translate-y-0.5 active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-hero text-primary-foreground shadow-glow">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-bold">{udhetim.ora}</span>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Ruta</p>
            <h2 className="text-lg font-bold text-foreground">{udhetim.nisja}</h2>
          </div>
        </div>
        <BadgeVende vende={udhetim.vende} />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full border-2 border-primary" />
        <span className="h-px flex-1 border-t border-dashed border-primary/40" />
        <span className="text-xs font-semibold text-primary">Kolegji {udhetim.destinacioni}</span>
        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-sm text-muted-foreground">
        <div className="space-y-1">
          <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{udhetim.vendtakimi}</span>
          <span className="flex items-center gap-2"><User className="h-4 w-4 text-primary" />{udhetim.shoferi}</span>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </Link>
  );
}
