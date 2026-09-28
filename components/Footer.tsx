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
    <footer>
      <p>{`${copyright} · ${tagline[lang]}`}</p>
    </footer>
  );
}
