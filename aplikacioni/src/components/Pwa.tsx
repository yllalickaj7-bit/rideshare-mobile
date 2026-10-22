"use client";
import { useEffect, useState } from "react";

export default function Pwa() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    setOnline(navigator.onLine);
    const on = () => setOnline(true), off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    if (!("serviceWorker" in navigator)) return;
    let cancelled = false;
    // Server rendering nuk mbush cache-n e JSON-it. E kërkojmë një herë këtu.
    async function warmSnapshot() {
      if (cancelled || !navigator.serviceWorker.controller) return;
      try { await fetch("/api/udhetimet", { cache: "no-store" }); } catch { /* offline */ }
    }
    navigator.serviceWorker.addEventListener("controllerchange", warmSnapshot);
    navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .then(() => navigator.serviceWorker.ready).then(warmSnapshot).catch(() => {});
    return () => {
      cancelled = true;
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      navigator.serviceWorker.removeEventListener("controllerchange", warmSnapshot);
    };
  }, []);
  return (
    <aside className="pwa-bar">
      <span className={online ? "dot live" : "dot off"} />
      <span>{online ? "Live nga Neon" : "Pa internet"}</span>
      <a href="/offline.html">Lista për lexim pa internet</a>
      <small>Kopja e ruajtur mund të jetë e vjetër. Këtu nuk konfirmohen rezervime.</small>
    </aside>
  );
}
