import type { Metadata, Viewport } from "next";
import { archivoBlack, inter } from "./fonts";
import "./globals.css";

// metadataBase: dominio final aún sin confirmar (ver AUDIT.md Fase 5) — usa
// NEXT_PUBLIC_SITE_URL cuando esté definida, si no cae a localhost para que
// Next no arme URLs absolutas de OG/Twitter con un dominio inventado.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Juan José Vásquez Giraldo | Atleta de Salto Alto",
  description:
    "Juan José Vásquez Giraldo - Atleta colombiano de salto alto. PB 2.06m. Camino a la élite mundial.",
  openGraph: {
    type: "profile",
    title: "Juan José Vásquez Giraldo | Atleta de Salto Alto",
    description:
      "Juan José Vásquez Giraldo - Atleta colombiano de salto alto. PB 2.06m. Camino a la élite mundial.",
    images: ["/images/hero-nueva.jpeg"],
    // TODO: actualizar cuando el dominio esté confirmado
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Juan José Vásquez Giraldo | Atleta de Salto Alto",
    description:
      "Juan José Vásquez Giraldo - Atleta colombiano de salto alto. PB 2.06m. Camino a la élite mundial.",
    images: ["/images/hero-nueva.jpeg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#04060a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${archivoBlack.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
