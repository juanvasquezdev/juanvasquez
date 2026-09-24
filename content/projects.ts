/**
 * Mis proyectos.
 *
 * Mudanza literal de `components/Proyectos.tsx` (R1): los tres que el sitio
 * muestra hoy —Fast Inventory, Athletics Hub, Portafolio Personal— con su
 * etiqueta de estado, su problema y su solución, palabra por palabra y en el
 * mismo orden. **No es la lista nueva**: reconciliar estos tres con los
 * proyectos de los que hablé después (¿Fast Inventory es el Mini ERP?,
 * ¿Athletics Hub es la Sports Management Platform?) es trabajo de PORT-010,
 * con las respuestas de ❓1–4 en la mano.
 *
 * Los campos que el tipo pide y el sitio de hoy no tiene (`tagline`, `stack`,
 * `evolution`, `cover`, `architecture`) quedan vacíos o ausentes, con su
 * marcador donde hace falta un dato real. Nada de rellenarlos con texto
 * plausible.
 *
 * D7 — todos mis repos son privados, así que los tres van con
 * `repoVisibility: 'private'` y **ninguno lleva `links.repo`**: un link a un
 * repo privado es un 404 para cualquiera que no sea yo. La evidencia de cada
 * proyecto van a ser capturas propias, no el código.
 *
 * ❓ PENDIENTE JUAN: cuáles de los tres tienen una demo desplegada y con qué
 * URL. Hoy el sitio no enlaza ninguna, así que los tres van sin `links.demo`.
 *
 * ❓ PENDIENTE JUAN: qué tecnologías lleva cada proyecto, para poblar `stack`
 * con los nombres tal como los escribe `content/stack.ts`. Hoy las tarjetas no
 * muestran tecnologías por proyecto, así que los tres van con `stack: []` —
 * preferí dejarlo vacío antes que deducirlo del texto de la solución.
 */

import type { Projects } from "./types";

export const PROJECTS: Projects = {
  eyebrow: { es: "03 — Casos", en: "03 — Case studies" },
  heading: { es: "Proyectos", en: "Projects" },

  items: [
    {
      slug: "fast-inventory",
      title: "Fast Inventory",
      // ❓ PENDIENTE JUAN: la frase de una línea que resume el proyecto. Hoy la
      // tarjeta no tiene ninguna y no me la invento.
      tagline: { es: "", en: "" },
      // ❓ PENDIENTE JUAN: el estado real de este proyecto en el enum.
      // "En consolidación" no cae solo en ninguno de los cinco valores: lo
      // puse en 'active' porque el texto dice que ya funciona y lo sigo
      // ampliando, pero podría ser 'mvp'. La etiqueta que se lee en pantalla
      // no depende de esto (sale de `statusLabel`), así que el enum se puede
      // corregir sin tocar nada visible.
      status: "active",
      statusLabel: { es: "En consolidación", en: "Consolidating" },
      // `featured: true` en los tres no es una curaduría: el sitio no tiene hoy
      // concepto de proyecto destacado (las tres tarjetas se ven igual), así que
      // true es el valor neutro que no inventa jerarquía. Quién destaca a quién
      // lo define PORT-010.
      featured: true,
      problem: {
        es: "Negocios que todavía llevan inventario, ventas y caja en papel o en hojas sueltas.",
        en: "Businesses still tracking inventory, sales, and cash on paper or in loose spreadsheets.",
      },
      solution: {
        es: "Un sistema de gestión modular — inventario, ventas y caja en un solo lugar — que hoy sigo consolidando módulo por módulo.",
        en: "A modular management system — inventory, sales, and cash in one place — that I keep consolidating module by module.",
      },
      stack: [],
      links: { caseStudy: false },
      repoVisibility: "private",
      evolution: [],
    },
    {
      slug: "athletics-hub",
      title: "Athletics Hub",
      // ❓ PENDIENTE JUAN: la frase de una línea que resume el proyecto.
      tagline: { es: "", en: "" },
      status: "building",
      statusLabel: { es: "En construcción", en: "In progress" },
      // featured: true por lo mismo que arriba — no es curaduría (PORT-010).
      featured: true,
      problem: {
        es: "La Liga Vallecaucana de Atletismo no tiene un sistema digital para atletas, competencias, resultados y rankings.",
        en: "The Liga Vallecaucana de Atletismo has no digital system for athletes, competitions, results, and rankings.",
      },
      solution: {
        es: "Una plataforma propia, sin depender de builders no-code, con un primer despliegue pensado para unas 100 personas.",
        en: "A platform of my own, without relying on no-code builders, with a first release aimed at around 100 people.",
      },
      stack: [],
      links: { caseStudy: false },
      repoVisibility: "private",
      evolution: [],
    },
    {
      slug: "portafolio-personal",
      title: "Portafolio Personal",
      // ❓ PENDIENTE JUAN: la frase de una línea que resume el proyecto.
      tagline: { es: "", en: "" },
      status: "active",
      statusLabel: { es: "Vivo", en: "Live" },
      // featured: true por lo mismo que arriba — no es curaduría (PORT-010).
      featured: true,
      problem: {
        es: "Mostrar en un solo lugar coherente el lado técnico y el atlético, con una base seria para seguir creciendo.",
        en: "Showing the technical side and the athletic one in a single coherent place, on a serious foundation I can keep building on.",
      },
      // Sigue diciendo "Tailwind" porque es el texto que hoy está en pantalla
      // (R1) — aunque D4 ya decidió desinstalarlo en PORT-005a. Cuando eso
      // pase, esta frase queda desactualizada y hay que corregirla: es
      // contenido, y le toca a PORT-010 o a PORT-014, no a esta mudanza.
      solution: {
        es: "Este mismo sitio — Next.js, TypeScript y Tailwind, con sistema de diseño propio — construido y auditado por fases.",
        en: "This very site — Next.js, TypeScript, and Tailwind, with a design system of my own — built and audited in phases.",
      },
      stack: [],
      links: { caseStudy: false },
      repoVisibility: "private",
      evolution: [],
    },
  ],
};
