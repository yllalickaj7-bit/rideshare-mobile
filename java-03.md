# Java 03 — AAB College Rideshare (aplikacion mobil)

## Struktura
- `package.json` në rrënjë (TanStack Start + React + Tailwind).
- Të dhënat: `src/lib/udhetimet.ts` (nisja, destinacioni, ora, vendtakimi, vende, shoferi).
- Komponenti i kartës: `src/components/KartaUdhetimi.tsx` (+ `BadgeVende.tsx`, `UdhetimNukGjendet.tsx`).

## Tri ekranet
1. Faqja kryesore — `/` (`src/routes/index.tsx`)
2. Detajet e udhëtimit — `/udhetimi/:id` (`src/routes/udhetimi.$id.index.tsx`)
3. Kërkesa — `/udhetimi/:id/kerkesa` (`src/routes/udhetimi.$id.kerkesa.tsx`)

## Prova 1 — Lista në pamje mobile
Lista e udhëtimeve u provua në gjerësi telefoni (375px). Kartat shfaqen njëra nën tjetrën, pa lëvizje anash (pa overflow horizontal). Rezultati: ✅ kaloi.

## Prova 2 — Detajet, buton i çaktivizuar dhe 404
- Hapja e kartës 2 (Fushë Kosovë) shfaq vendtakimin "Te stacioni kryesor", orën 08:15 dhe 1 vend të lirë. ✅
- Udhëtimi 3 (Lipjan) ka 0 vende: butoni "Nuk ka vende të lira" është i çaktivizuar. ✅
- Adresa `/udhetimi/99` shfaq faqen "Udhëtimi nuk u gjet" (404). ✅

## Prova 3 — Kërko vend
Klikimi te "Kërko vend" hap `/udhetimi/1/kerkesa` dhe shfaq mesazhin **"Simulim: Në pritje"** si dhe butonin "Kthehu te udhëtimet" për kthim mbrapa. ✅

## Përfundim
Të tri ekranet, komponenti `.tsx` në `components/` dhe tri provat funksionojnë.
