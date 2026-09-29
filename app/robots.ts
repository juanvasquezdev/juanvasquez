import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/site";

// En producción, todo abierto y con el sitemap. En una preview de Vercel, nada:
// esas URLs no deberían terminar en Google. Las páginas además llevan
// noindex en ese caso (ver generateMetadata en app/[lang]/layout.tsx), por si
// algún buscador llega sin pasar por acá.
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl()).href,
  };
}
