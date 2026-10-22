import type { Metadata, Viewport } from "next";
import "./globals.css";
import Pwa from "@/components/Pwa";

export const metadata: Metadata = {
  title: "RideShare AAB",
  description: "Udhëtime të përbashkëta për studentët dhe profesorët e Kolegjit AAB.",
};

export const viewport: Viewport = { themeColor: "#be3455" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sq">
      <body>
        <Pwa />
        {children}
      </body>
    </html>
  );
}
