# AAB Ride Connect

Krijo një aplikacion mobil modern, ultra-profesional dhe responsive për RideShare dedikuar studentëve dhe profesorëve të Kolegjit AAB (AAB College Rideshare). 

Dizajni visual duhet të jetë i optimizuar për pamje telefonike (Mobile-first UI/UX), me temë dark-mode elegante (sfond #0b1220 ose të ngjashëm dark navy, karta me border te hollë me shkëlqim, badges me ngjyra për vendet e lira, dhe tipografi të qartë).

Ju lutem ndërtoni të gjithë strukturën e skedarëve dhe kodit me të gjitha faqet:
1. Lista e udhëtimeve me të dhëna (Prishtinë -> AAB, Fushë Kosovë -> AAB, Lipjan -> AAB) me orën, vendtakimin dhe vendet e lira.
2. Komponentë e ripërdorshme e kartës së udhëtimit me UI moderne (ikona për orën, vendtakimin dhe vendet e lira).
3. Faqja kryesore që liston udhëtimet me titull të qartë për AAB.
4. Faqja e detajeve të udhëtimit të zgjedhur (/udhetimi/:id) me mundësi për të klikuar "Kërko vend" nëse ka vende të lira.
5. Faqja e demonstrimit të kërkesës (/udhetimi/:id/kerkesa) që shfaq simulimin "Në pritje".
6. Faqja 404 kur ID e udhëtimit nuk gjendet.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://rideshare-yllalickaj.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/86e0219e-8afe-478a-b442-5070a130248f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
