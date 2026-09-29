import { DEFAULT_LOCALE, LOCALES } from "@/content/types";

/**
 * La URL pública del sitio, para todo lo que necesita una dirección absoluta:
 * metadataBase, canonical, sitemap, robots y el JSON-LD.
 *
 * Primero NEXT_PUBLIC_SITE_URL (la pongo a mano cuando haya dominio). Si no
 * está y el build corre en Vercel, el dominio de producción del proyecto, que
 * Vercel expone sin protocolo; así, aunque se me olvide la variable, el
 * canonical nunca apunta a localhost en el sitio real. Fuera de Vercel queda
 * localhost, que solo sirve para desarrollo y las pruebas.
 */
export function siteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return new URL(`https://${vercel}`);

  return new URL("http://localhost:3000");
}

/**
 * Si los buscadores pueden indexar este deploy. Vercel pone VERCEL_ENV en
 * "preview" o "development" fuera de producción, y esas URLs no deberían
 * aparecer en Google. Sin la variable (local, CI) cuenta como producción.
 */
export function isIndexable(): boolean {
  const env = process.env.VERCEL_ENV;
  return !env || env === "production";
}

/**
 * hreflang: cada idioma a su ruta y x-default a la del idioma por defecto (a
 * donde redirige la raíz). Rutas relativas; quien necesite absolutas las arma
 * contra siteUrl().
 */
export function languageAlternates(): Record<string, string> {
  return Object.fromEntries([
    ...LOCALES.map((locale) => [locale, `/${locale}`]),
    ["x-default", `/${DEFAULT_LOCALE}`],
  ]);
}
