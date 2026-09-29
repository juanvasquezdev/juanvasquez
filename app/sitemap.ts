import type { MetadataRoute } from "next";
import { LOCALES } from "@/content/types";
import { languageAlternates, siteUrl } from "@/lib/site";

// Una entrada por idioma, y cada una lista a todas (ella incluida) como
// alternativas: es lo que pide Google para que el hreflang cuente desde el
// sitemap igual que desde el <head>. Sin lastModified: una fecha que cambia en
// cada build diría que todo cambió aunque no.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const languages = Object.fromEntries(
    Object.entries(languageAlternates()).map(([hreflang, path]) => [
      hreflang,
      new URL(path, base).href,
    ])
  );

  return LOCALES.map((locale) => ({
    url: new URL(`/${locale}`, base).href,
    alternates: { languages },
  }));
}
