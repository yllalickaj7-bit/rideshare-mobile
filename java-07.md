# RideShare · Java 7

## Rasti im
GitHub: yllalickaj7-bit
Kodi: P7-825
Skenari i zgjedhur (numri dhe titulli, nga Rastet 1–5): Rasti 2 · Pa vende
ID i udhëtimit në projektin tim: 2
Të dhënat fiktive të rastit: Nisja Pejë → AAB, ora fillestare 10:15, 1 vend fillestar, ora për provën e re 10:20, rasti kufitar 0 vende.

## Parashikimi
Në listë pres të shoh udhëtimin ID 2 me orën dhe numrin e vendeve. Te detajet pres të njëjtat vlera. Kur vendet bëhen 0, pres që butoni "Kërko vend" të zhduket, të shfaqet "Nuk ka vende të lira" dhe aplikacioni të mos premtojë rezervim.

## Dy probleme
1. Me 0 vende, faqja e detajeve shfaqte vetëm një buton joaktiv pa shpjegim; përdoruesi nuk e kuptonte pse nuk mund të kërkonte vend. E përsërita duke vendosur 0 vende për ID 2 dhe duke hapur /udhetimi/2.
2. Faqja e kërkesës shkruan "Simulim: Në pritje", por lista nuk tregon askund që kërkesa është vetëm demonstrim dhe nuk ruhet.

## Korrigjimi
Skedari: aplikacioni/src/app/udhetimi/[id]/page.tsx
Ky skedar shfaq detajet e udhëtimit të zgjedhur sipas ID-së dhe vendos nëse shfaqet lidhja "Kërko vend". Shtova mesazhin "Me 0 vende nuk premtojmë rezervim." pranë butonit joaktiv, që përdoruesi të kuptojë qartë pse nuk ka kërkesë dhe që aplikacioni të mos premtojë vend të lirë.

## Versionet
Para: https://github.com/yllalickaj7-bit/rideshare-mobile/commit/e8cc7c4c7ae2839a337cb5753b0238abc3399c5f
Pas: https://github.com/yllalickaj7-bit/rideshare-mobile/commit/82fdad0b975fe17e437d31a63ebcde584b42d6ea

## Provat që bëra
### Prova 1
Hapat: Hapa listën, klikova udhëtimin ID 2, pastaj "Kërko vend".
Pritshmëria: Të njëjtat vlera në listë dhe detaje; faqja e kërkesës tregon "Simulim: Në pritje".
Vëzhgimi: Ora dhe vendet përputheshin; u shfaq simulimi pa rezervim real.

### Prova 2
Hapat: Vendosa 0 vende për ID 2 dhe hapa /udhetimi/2.
Pritshmëria: Nuk shfaqet "Kërko vend"; shfaqet mesazhi pa vende.
Vëzhgimi: U shfaq "Me 0 vende nuk premtojmë rezervim." dhe butoni joaktiv "Nuk ka vende të lira".

### Prova 3
Hapat: Hapa /udhetimi/999, një ID që nuk ekziston.
Pritshmëria: Mesazh "Udhëtimi nuk u gjet" dhe lidhje te lista.
Vëzhgimi: U shfaq faqja 404 me lidhjen për t'u kthyer te lista.

## Ndryshimi i ri
Kolegu ndryshoi orën në 10:20. Parashikova që lista dhe detajet të tregojnë 10:20 pas rifreskimit, sepse të dy lexojnë të njëjtin rresht nga databaza. Nëse nuk është demonstruar ende në klasë, do ta demonstroj në takimin e radhës.

## Ndihma nga AI
Përdora AI për të gjetur skedarin që kontrollon butonin me 0 vende dhe për strukturën e raportit. E verifikova vetë ndryshimin duke hapur detajet me 0 vende.
