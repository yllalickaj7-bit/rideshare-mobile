import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AAB RideShare",
  description: "Udhëtime të përbashkëta për studentët dhe profesorët e Kolegjit AAB.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <body>{children}</body>
    </html>
  );
}
