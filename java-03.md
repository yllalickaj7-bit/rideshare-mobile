# RideShare — Java 3

Yll Alickaj · RE-82145/24

## Çfarë ndërtova
Përfundova tri ekranet e RideShare në Next.js me App Router (dosja `aplikacioni/`): lista e tri udhëtimeve (`src/app/page.tsx`), detajet e udhëtimit të zgjedhur (`src/app/udhetimi/[id]/page.tsx`) dhe ekrani demonstrues i kërkesës (`src/app/udhetimi/[id]/kerkesa/page.tsx`), plus komponentin e ripërdorshëm `src/components/KartaUdhetimi.tsx` dhe faqen `not-found.tsx`.

## Provat që bëra
### Prova 1: Lista në telefon
Hapa faqen kryesore në pamjen e telefonit (375 px te Inspect); prisja tri karta pa lëvizje anash; pashë tri kartat (Prishtinë, Fushë Kosovë, Lipjan) njëra nën tjetrën, të lexueshme dhe pa lëvizje horizontale.

### Prova 2: Detajet e udhëtimit të dytë
Klikova kartën 2; prisja adresën /udhetimi/2 dhe vendtakimin e saj; pashë adresën /udhetimi/2 me vendtakimin "Te stacioni kryesor", orën 08:15 dhe 1 vend të lirë.
Shënova edhe çfarë ndodhi te karta 3 (zero vende) dhe te /udhetimi/99: te karta 3 butoni "Nuk ka vende të lira" ishte i çaktivizuar, ndërsa /udhetimi/99 shfaqi faqen "Udhëtimi nuk u gjet" me lidhjen për t'u kthyer te lista.

### Prova 3: Kërkesa në pritje
Klikova Kërko vend; prisja “Simulim: Në pritje”, pa rezervim real; pashë titullin "Simulim: Në pritje" dhe shënimin që kërkesa nuk është dërguar te shoferi. Pastaj u ktheva te detajet dhe lista: lidhja "← Kthehu te detajet" më çoi te /udhetimi/1 dhe "Kthehu te lista" te faqja kryesore.

## Çfarë do të përmirësoj
Kërkesa tani është vetëm simulim; javën tjetër dua ta ruaj në databazë që shoferi ta pranojë ose refuzojë.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
AI më ndihmoi të gjeneroj strukturën e faqeve dhe stilet; provat në telefon dhe lidhjet mes faqeve i kontrollova vetë.
