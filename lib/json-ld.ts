import { WORLD_ATHLETICS_URL } from "@/content/athletics";
import { GITHUB_URL, INSTAGRAM_URL, LINKEDIN_URL } from "@/content/profile";
import { SEO } from "@/content/seo";
import { STACK } from "@/content/stack";
import type { Locale } from "@/content/types";
import { localize } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

/**
 * El schema.org/Person de la página, en el idioma de la ruta. Solo lo lee el
 * layout, en el servidor: sale como texto en el HTML y no suma JS.
 */
export function personJsonLd(lang: Locale) {
  const seo = localize(SEO, lang);
  const { person } = seo;

  // knowsAbout es lo que ya uso, no lo que estoy aprendiendo: solo el grupo
  // "deep" del stack. "React · Next.js" son dos cosas, así que lo separo.
  const knowsAbout = localize(STACK, lang)
    .groups.filter((group) => group.level === "deep")
    .flatMap((group) => group.items)
    .flatMap((item) => item.split(" · "));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    alternateName: person.alternateNames,
    jobTitle: person.jobTitle,
    nationality: { "@type": "Country", name: person.nationality },
    address: {
      "@type": "PostalAddress",
      addressLocality: person.address.locality,
      addressRegion: person.address.region,
      addressCountry: person.address.country,
    },
    knowsAbout,
    url: new URL(`/${lang}`, siteUrl()).href,
    sameAs: [WORLD_ATHLETICS_URL, INSTAGRAM_URL, LINKEDIN_URL, GITHUB_URL],
  };
}

/**
 * JSON.stringify no escapa "<": un "</script>" dentro de algún texto cerraría
 * la etiqueta antes de tiempo. Con < el JSON sigue siendo el mismo.
 */
export function serializeJsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
