import type { Metadata, Viewport } from "next";
import { archivoBlack, inter } from "../fonts";
import SmoothScroll from "@/components/SmoothScroll";
import { LOCALES, DEFAULT_LOCALE } from "@/content/types";
import { toLocale } from "@/lib/i18n";
import "../globals.css";

// El título y la descripción son los mismos en la metadata base, en Open Graph
// y en Twitter, así que viven en una constante cada uno en vez de repetirse tres
// veces (si cambian, cambian en un solo lugar).
const TITLE = "Juan José Vásquez | Desarrollador y Atleta de Salto Alto";
const DESCRIPTION =
  "Desarrollador y atleta colombiano de salto alto, marca personal de 2.06 m. " +
  "Construyo sistemas de gestión y plataformas web con Next.js, TypeScript y Node.";

// hreflang: cada idioma apunta a su ruta, y x-default a la del idioma por
// defecto (que es a donde redirige la raíz). Sale de LOCALES para que un idioma
// nuevo aparezca acá sin tocar este archivo.
const LANGUAGES = Object.fromEntries([
  ...LOCALES.map((locale) => [locale, `/${locale}`]),
  ["x-default", `/${DEFAULT_LOCALE}`],
]);

// metadataBase: todavía no hay dominio y el sitio no está desplegado, así que el
// fallback a localhost es PROVISIONAL — se cae solo en cuanto exista
// NEXT_PUBLIC_SITE_URL en el entorno. Sirve para que Next no arme las URLs
// absolutas de OG/Twitter contra un dominio inventado mientras tanto.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    languages: LANGUAGES,
  },
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

// /es y /en se generan una vez en el build y se sirven estáticas. Con
// dynamicParams = false no existe ningún otro idioma: /xx da 404 directo (lo
// dibuja app/global-not-found.tsx) en vez de intentar renderizarse.
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const lang = toLocale((await params).lang);

  return (
    <html lang={lang} className={`${archivoBlack.variable} ${inter.variable}`}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
