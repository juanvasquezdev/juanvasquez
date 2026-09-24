/**
 * Datos de perfil: quién soy, el hero, y cómo contactarme.
 *
 * PORT-001a: esta fue la muestra del GATE 1 — el archivo que probó que la
 * forma de `content/types.ts` alcanza para el contenido real. Con el gate
 * aprobado (2026-09-23) lo único que se le sumó son las dos cabeceras de
 * sección (`about`, `contact`), que eran los dos textos del sitio que se
 * quedaban sin archivo. El español es
 * el texto que hoy está en `components/Hero.tsx`, `components/SobreMi.tsx` y
 * `components/Contacto.tsx`, copiado literal (R1). El inglés es traducción
 * mía; la parte en primera persona (heroSubtitle, heroQuote, bio) va listada
 * en el reporte para que Juan la revise (R5).
 *
 * Todavía no lo consume ningún componente — eso es PORT-001b en adelante.
 */

import type { Profile, SocialLink } from "./types";

/** Mi perfil de GitHub. */
export const GITHUB_URL = "https://github.com/juanjosevasquez1313-ai";

/**
 * Interruptor del link al perfil de GitHub en Contacto.
 *
 * Tengo todos los repos privados, y un perfil así se ve vacío a menos que esté
 * activo *Settings → Profile → "Include private contributions on my profile"*.
 * Si no lo activo, el link juega en contra: manda a alguien a un perfil sin
 * nada. Mientras lo decido, esto se apaga en un renglón y el link desaparece
 * de la sección sin tocar el componente.
 */
export const SHOW_GITHUB_PROFILE = true;

/**
 * Mismo orden y mismo contenido que `CONTACTS` en `components/Contacto.tsx`
 * hoy: Email siempre, GitHub solo si `SHOW_GITHUB_PROFILE`, después Instagram
 * y LinkedIn. El ícono de GitHub no tiene emoji real (por eso el componente
 * actual dibuja un SVG, `GitHubMark`) — acá queda como la clave `"github-mark"`
 * en vez de emoji, porque el dato no puede cargar el JSX del ícono.
 */
const CONTACTS: SocialLink[] = [
  {
    id: "email",
    href: "mailto:juanjosevasquez1313@gmail.com",
    icon: "📧",
    label: { es: "Email", en: "Email" },
    value: "juanjosevasquez1313@gmail.com",
    external: false,
  },
  ...(SHOW_GITHUB_PROFILE
    ? [
        {
          id: "github",
          href: GITHUB_URL,
          icon: "github-mark",
          label: { es: "GitHub", en: "GitHub" },
          value: "juanjosevasquez1313-ai",
          external: true,
        } satisfies SocialLink,
      ]
    : []),
  {
    id: "instagram",
    href: "https://instagram.com/juanvasquezhj",
    icon: "📱",
    label: { es: "Instagram", en: "Instagram" },
    value: "@juanvasquezhj",
    external: true,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/juan-jos%C3%A9-vasquez-giraldo-93b25b304/",
    icon: "💼",
    label: { es: "LinkedIn", en: "LinkedIn" },
    value: "Juan José Vásquez Giraldo",
    external: true,
  },
];

export const PROFILE: Profile = {
  name: "Juan José Vásquez Giraldo",

  eyebrow: { es: "Salto Alto · Atletismo", en: "High Jump · Athletics" },

  heroSubtitle: {
    es: "Aprendiendo a volar más alto",
    en: "Learning to fly higher",
  },

  // Hoy repite heroSubtitle palabra por palabra (es el mismo texto en el <h2>
  // y en la cita de abajo — ver N5 en el plan). Es una mudanza literal, no
  // corrijo la duplicación acá; eso es PORT-007.
  heroQuote: {
    es: '"Aprendiendo a volar más alto" ✈️',
    en: '"Learning to fly higher" ✈️',
  },

  // Las tres capas del crossfade del hero. Decorativas (alt="" en el
  // componente actual, contenedor con aria-hidden), por eso acá no llevan alt.
  heroImages: [
    { src: "/images/podio_u23.jpeg" },
    { src: "/images/u18.jpeg" },
    { src: "/images/hero-nueva.jpeg" },
  ],

  // Las cabeceras de las dos secciones que se alimentan de este archivo. Los
  // números del eyebrow son los del sitio de hoy (Sobre Mí es la 01, Contacto
  // la 11) — los copio tal cual aunque PORT-006 vaya a renumerar todo: hoy es
  // el texto que está en pantalla y R1 manda sobre eso.
  about: {
    eyebrow: { es: "01 — Quién soy", en: "01 — Who I am" },
    heading: { es: "Sobre Mí", en: "About Me" },
  },

  contact: {
    eyebrow: { es: "11 — Hablemos", en: "11 — Let's talk" },
    heading: { es: "Contacto", en: "Contact" },
  },

  photo: {
    src: "/images/foto_posando2.jpeg",
    alt: "Juan José Vásquez Giraldo",
  },

  bio: {
    es:
      "Soy Juan José Vásquez Giraldo, atleta colombiano especializado en salto alto. Con una marca " +
      "personal de 2.06 metros, he demostrado ser un competidor de alto nivel a nivel nacional. He sido " +
      "campeón nacional U18 en dos ocasiones y tengo una trayectoria destacada en competencias de élite. " +
      "Mi dedicación, disciplina y pasión por el deporte me impulsan a seguir mejorando y alcanzando " +
      "nuevas metas en mi carrera atlética — con la mirada puesta en la élite mundial.",
    en:
      "I'm Juan José Vásquez Giraldo, a Colombian high jump athlete. With a personal best of 2.06 " +
      "meters, I've shown myself to be a top-level competitor nationally. I've been national U18 champion " +
      "twice and have a strong track record in elite competitions. My dedication, discipline, and passion " +
      "for the sport drive me to keep improving and reaching new goals in my athletic career — with my " +
      "sights set on the world elite.",
  },

  stats: [
    { value: 2.06, decimals: 2, label: { es: "Marca Personal (m)", en: "Personal Best (m)" } },
    { value: 2.01, decimals: 2, label: { es: "Estatura (m)", en: "Height (m)" } },
    { value: 19, decimals: 0, label: { es: "Años", en: "Age" } },
  ],

  contacts: CONTACTS,

  // El nombre en el footer sale de `name`, la bandera la sigue dibujando el
  // componente (mismo SVG que el eyebrow del hero) — acá solo el año y el tag.
  footer: {
    year: 2026,
    roleTag: { es: "Atleta de Salto Alto", en: "High Jump Athlete" },
  },
};
