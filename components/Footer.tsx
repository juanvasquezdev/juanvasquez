import type { Locale } from "@/content/types";
import { PROFILE } from "@/content/profile";

/**
 * Server component: lee `content/` directo, sin pasar por la prop resuelta que
 * usan las secciones client (ver `lib/i18n.ts`), porque acá no hay bundle que
 * cuidar. La bandera es el emoji, escrita acá y no en el dato; no es el SVG del
 * eyebrow del hero.
 */
export default function Footer({ lang }: { lang: Locale }) {
  const { name, footer } = PROFILE;
  // Una sola plantilla y no varios {…} sueltos: cada corte entre texto y
  // expresión React lo imprime como un <!-- --> en el HTML.
  return (
    <footer>
      <p>{`${name} © ${footer.year} | ${footer.roleTag[lang]} 🇨🇴`}</p>
    </footer>
  );
}
