# RideShare — Java 9

## Çfarë ndërtova
Shtova butonin "Ruaj udhëtimin" te detajet e udhëtimit. Ndërfaqja përditësohet menjëherë (optimistic UI): butoni kalon në "★ E ruajtur" dhe del "Duke ruajtur…" para se serveri të përgjigjet. Nëse serveri dështon, gjendja kthehet mbrapsht, shfaqet një mesazh gabimi (`role="alert"`) dhe butoni "Provo përsëri". Gjatë ruajtjes butoni është i çaktivizuar dhe një `ref` bllokon klikimet e përsëritura, ndaj një prekje e shpejtë tre herë dërgon vetëm një kërkesë. Pa hyrje nuk ka buton, vetëm lidhje "Hyr me GitHub". Shërbimi është idempotent: `INSERT ... ON CONFLICT DO NOTHING` për ruajtje dhe `DELETE` për heqje. Faqja kryesore dhe karta e udhëtimit shfaqin ★ te udhëtimet e ruajtura.

## Provat që bëra
### Prova 1: Ndërfaqja ndryshon menjëherë dhe mbetet pas suksesit.
- Hapat: Test komponenti (vitest + jsdom) me një server të simuluar që përgjigjet me vonesë të kontrolluar; klikova "Ruaj udhëtimin".
- Pritshmëria: Menjëherë "★ E ruajtur" i çaktivizuar dhe "Duke ruajtur…"; pas përgjigjes "Udhëtimi është i ruajtur."
- Vëzhgimi: Testi kaloi; serveri u thirr një herë.

### Prova 2: Klikime të përsëritura.
- Hapat: Tre klikime radhazi para përgjigjes.
- Pritshmëria: Vetëm një thirrje.
- Vëzhgimi: Testi kaloi, 1 thirrje.

### Prova 3: Dështimi i serverit.
- Hapat: Serveri hedh gabim; pastaj e rregullova dhe klikova "Provo përsëri". Provova edhe heqjen e një udhëtimi të ruajtur që dështon.
- Pritshmëria: Kthehet "☆ Ruaj udhëtimin", del alert, pa mesazh suksesi; pas retry-së ruhet. Te heqja që dështon, ylli mbetet.
- Vëzhgimi: Të dy testet kaluan (retry: 2 thirrje gjithsej).

### Prova 4: Pa hyrje dhe të dhënat në Neon.
- Hapat: Test pa hyrje; SQL e shërbimit e provova në një degë të përkohshme të Neon (jo në main).
- Pritshmëria: Pa buton; ruajtje e dyfishtë nuk krijon rresht të dytë.
- Vëzhgimi: U shfaq lidhja e hyrjes; SQL u sillte siç pritej. `tsc --noEmit` dhe `next build` kalojnë.

## Ku gjendet puna
- `aplikacioni/src/components/RuajUdhetimin.tsx` — komponenti i klientit.
- `aplikacioni/src/lib/preferuarat.ts` — logjika në server (`vendosPreferuar`).
- `aplikacioni/src/app/api/te-preferuarat/route.ts` — API (401, 400, 503).
- `aplikacioni/src/app/java-09-test/page.tsx` — faqe prove me server të simuluar dhe kutizë "Simulo gabim".
- `aplikacioni/schema-java09.sql` — tabela `te_preferuarat`.

## Çfarë mbetet për përmirësim
Provat e ndërfaqes janë automatike në jsdom; nuk i kam provuar në telefon real. Lista e plotë e të ruajturave (faqe e veçantë) nuk është bërë.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
Përdora AI për të shkruar komponentin dhe testet. Rezultatet e testeve i pashë në dalje të vërtetë të komandës, jo të supozuara.

## Prova me një hyrje të re
- Hyrja: tre klikime të shpejta, pastaj një udhëtim me id të pavlefshëm te API.
- Parashikimi: një thirrje; API kthen 400.
- Çfarë pashë: një thirrje në test; vlefshmëria `/^[0-9]{1,6}$/` refuzon id-të e pavlefshme.
- Skedari: `RuajUdhetimin.tsx`, `preferuarat.ts`.
