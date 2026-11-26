"use client";
import { useState } from "react";
import RuajUdhetimin from "../../components/RuajUdhetimin";

// Faqe prove me të dhëna fiktive: serveri simulohet, pa databazë dhe pa hyrje.
export default function Java09Test() {
  const [dështo, setDështo] = useState(false);
  const [thirrje, setThirrje] = useState(0);

  async function serveriFiktiv() {
    setThirrje((n) => n + 1);
    await new Promise((zgjidhe) => setTimeout(zgjidhe, 800));
    if (dështo) throw new Error("500");
  }

  return (
    <main>
      <h1>RideShare · Java 9</h1>
      <p>Udhëtarja · Arta · Ferizaj → Kolegji AAB · ID 2 · 08:15 · 2 vende (të dhëna fiktive)</p>
      <label>
        <input type="checkbox" checked={dështo} onChange={(e) => setDështo(e.target.checked)} /> Simulo gabim të serverit
      </label>
      <p>Thirrje të dërguara te serveri fiktiv: <strong data-testid="thirrje">{thirrje}</strong></p>
      <RuajUdhetimin udhetimId="2" fillimisht={false} ruaj={serveriFiktiv} />
    </main>
  );
}
