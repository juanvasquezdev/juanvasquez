import type { Locale } from "@/content/types";
import { PROFILE } from "@/content/profile";

/**
 * Server component: lee `content/` directo, sin pasar por la prop resuelta que
 * usan las secciones client (ver `lib/i18n.ts`), porque acá no hay bundle que
 * cuidar.
 */
export default function Footer({ lang }: { lang: Locale }) {
  const { copyright, tagline } = PROFILE.footer;
  return (
    <footer className="wrap footer mono">
      <span>{copyright}</span>
      <span>{tagline[lang]}</span>
    </footer>
  );
}
