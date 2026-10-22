# RideShare — Java 4 · Neon dhe PostgreSQL

## Çfarë ndërtova
Udhëtimet nuk janë më në një listë fikse në kod. Ato ruhen në tabelën `udhetimet` në Neon (PostgreSQL). `src/lib/db.ts` krijon lidhjen me `@neondatabase/serverless` duke lexuar `DATABASE_URL` nga `.env.local` vetëm në server (`server-only`). `lexoUdhetimet()` lexon të gjitha udhëtimet për listën, ndërsa `gjejUdhetimin(id)` lexon një udhëtim për faqen e detajeve dhe kërkesës. Faqet janë `force-dynamic`, që çdo rifreskim të lexojë të dhënat e fundit.

## Provat që bëra
### Prova 1: Ndryshimi në databazë shfaqet në aplikacion
Në SQL Editor ekzekutova `UPDATE udhetimet SET ora = '08:25' WHERE id = '2';`. Pas rifreskimit, lista tregoi Fushë Kosovë → AAB në 08:25 dhe detajet `/udhetimi/2` treguan gjithashtu 08:25. E ktheva orën në 08:15, rifreskova dhe të dyja faqet treguan sërish 08:15.

### Prova 2: Lista bosh dhe rikthimi
Shtova `WHERE false` vetëm te pyetja e `lexoUdhetimet`. Lista shfaqi mesazhin "Nuk ka udhëtime për momentin." Hoqa `WHERE false` dhe u kthyen të tri kartat.

### Prova 3: Lidhja mungon, rikthimi dhe siguria
Ndryshova përkohësisht emrin `DATABASE_URL` në `.env.local`, rinisa serverin dhe faqja shfaqi "Nuk u lidhëm me databazën. Provo përsëri." Riktheva emrin, rinisa serverin dhe lista punoi sërish me tri udhëtimet. `.env.local` nuk shfaqet në listën e GitHub Desktop sepse është në `.gitignore`.

## Ku gjendet puna
- `schema.sql` (pranë README dhe në `aplikacioni/schema.sql`)
- `aplikacioni/src/lib/db.ts`
- `aplikacioni/src/lib/udhetimet.ts`
- `aplikacioni/src/app/page.tsx`
- `aplikacioni/src/app/udhetimi/[id]/page.tsx`
- `aplikacioni/src/app/udhetimi/[id]/kerkesa/page.tsx`
- Repository: https://github.com/yllalickaj7-bit/rideshare-mobile

## Çfarë mbetet për përmirësim
Kërkesa “Në pritje” mbetet simulim; nuk ka rezervim real dhe vendet e lira nuk zvogëlohen. Hapi i ardhshëm: tabela `kerkesat` dhe ruajtja e kërkesës në Neon.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
AI më ndihmoi të shkruaj `schema.sql`, lidhjen me Neon dhe trajtimin e gabimeve. Provat 1–3 i verifikova vetë në aplikacion dhe në SQL Editor të Neon.
