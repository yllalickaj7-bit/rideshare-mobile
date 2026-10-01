import { Link } from "@tanstack/react-router";
import { MapPinOff } from "lucide-react";

export function UdhetimNukGjendet() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
      <MapPinOff className="mb-4 h-12 w-12 text-primary" />
      <h1 className="text-6xl font-bold text-foreground">404</h1>
      <p className="mt-3 text-lg font-semibold text-foreground">Udhëtimi nuk u gjet</p>
      <p className="mt-1 text-sm text-muted-foreground">Ky udhëtim nuk ekziston ose është anuluar.</p>
      <Link to="/" className="mt-8 rounded-2xl bg-primary px-6 py-3 font-semibold text-primary-foreground">
        Shiko udhëtimet
      </Link>
    </main>
  );
}
