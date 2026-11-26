# RideShare — Java 10

## Çfarë ndërtova
Shtova sinkronizim pothuajse në kohë reale me polling çdo 5 sekonda. Komponenti `GjendjaLive` merr nga `/api/udhetimi/[id]/gjendja` numrin e vendeve, orën dhe statusin e kërkesës ("Në pritje të shoferit", "Pranuar ✓", "Refuzuar"). Polling-u përdor `AbortController`, ndalon kur skeda është e fshehur, rilexon kur kthehet interneti ose skeda, dhe pastrohet kur komponenti largohet. Nëse lidhja ndërpritet, ruhen vlerat e fundit dhe shfaqet alert. Me 0 vende nuk premtohet rezervim. Kërkesa nuk është më simulim: `POST /api/kerkesat` ruan kërkesën në Neon (tabela `kerkesat`, e njëjta kërkesë nuk dyfishohet, shoferi nuk kërkon vend në udhëtimin e vet). Shoferi shikon kërkesat në pritje te paneli dhe i pranon ose refuzon; pranimi zbret një vend atomikisht (`FOR UPDATE` + CTE, vetëm nëse `vende>0`), ndaj dy pranime njëkohësisht nuk e çojnë numrin nën zero.

## Provat që bëra
### Prova 1: Përditësim çdo 5 sekonda.
- Hapat: Test me kohë të simuluar; nuk ka thirrje në 4.9 s, një në 5.1 s.
- Vëzhgimi: Kaloi; shfaqen "Në pritje", pastaj "Pranuar" dhe ora e re.

### Prova 2: Humbja e lidhjes.
- Hapat: `merr` hedh gabim, pastaj rikthehet.
- Vëzhgimi: Kaloi; del alert, vlerat mbahen, alert zhduket dhe "Nuk ka vende të lira" shfaqet kur vendet bëhen 0.

### Prova 3: Ngjarja `online` dhe largimi.
- Vëzhgimi: Kaloi; `online` rilexon menjëherë dhe pas largimit nuk ka më thirrje.

### Prova 4: 0 vende.
- Vëzhgimi: Kaloi; shfaqet "Me 0 vende nuk premtojmë rezervim." pa "Kërko vend".

### Prova 5: SQL në Neon.
- Hapat: Në një degë të përkohshme të Neon provova dërgimin, dyfishimin dhe pranimin e kërkesave.
- Vëzhgimi: Logjika e vendeve dhe e dublikatave u sillte siç pritej. `tsc --noEmit` dhe `next build` kalojnë.

## Ku gjendet puna
- `aplikacioni/src/components/GjendjaLive.tsx`
- `aplikacioni/src/lib/kerkesat.ts`, `aplikacioni/src/app/api/kerkesat/route.ts`, `aplikacioni/src/app/api/udhetimi/[id]/gjendja/route.ts`
- `aplikacioni/src/app/panel/page.tsx`, `panel/actions.ts`
- `aplikacioni/schema-java10.sql`

## Çfarë mbetet për përmirësim
Polling është i thjeshtë dhe harxhon kërkesa; WebSocket ose SSE do ishin më efikase. Nuk kam provuar me dy pajisje reale njëkohësisht; testet janë automatike.

## Ndihma nga AI (Artificial Intelligence – inteligjencë artificiale)
Përdora AI për kodin, SQL-in konkurent dhe testet; rezultatet i verifikova nga dalja reale e komandave.

## Prova me një hyrje të re
- Hyrja: pranim i dy kërkesave për udhëtim me 1 vend.
- Parashikimi: vetëm njëra pranohet, tjetra kthen `pa_vende`.
- Skedari: `kerkesat.ts`, funksioni `pergjigju` (`UPDATE ... AND vende>0`).
