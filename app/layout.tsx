import type { Metadata, Viewport } from "next";
import { archivoBlack, inter } from "./fonts";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

// El título y la descripción son los mismos en la metadata base, en Open Graph
// y en Twitter, así que viven en una constante cada uno en vez de repetirse tres
// veces (si cambian, cambian en un solo lugar).
const TITLE = "Juan José Vásquez | Desarrollador y Atleta de Salto Alto";
const DESCRIPTION =
  "Desarrollador y atleta colombiano de salto alto, marca personal de 2.06 m. " +
  "Construyo sistemas de gestión y plataformas web con Next.js, TypeScript y Node.";

// metadataBase: todavía no hay dominio y el sitio no está desplegado, así que el
// fallback a localhost es PROVISIONAL — se cae solo en cuanto exista
// NEXT_PUBLIC_SITE_URL en el entorno. Sirve para que Next no arme las URLs
// absolutas de OG/Twitter contra un dominio inventado mientras tanto.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "profile",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/hero-nueva.jpeg"],
    // TODO: actualizar cuando el dominio esté confirmado
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
