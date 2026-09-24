/**
 * Etiquetas de interfaz: lo que no es contenido de una sección sino cómo se
 * navega el sitio.
 *
 * Mudanza literal (R1) de `app/page.tsx` (el skip-link), `components/Nav.tsx`
 * (los seis links y el `aria-label` del pill) y `components/BackToTop.tsx`
 * (el `aria-label` del botón). Las tres etiquetas de las tarjetas de proyecto
 * salen de `components/Proyectos.tsx`.
 *
 * Ojo con un detalle que parece un typo y no lo es: el link del nav dice
 * "Sobre mí" con m minúscula y el título de la sección dice "Sobre Mí" con
 * mayúscula. Está así en el sitio; lo copio como está y lo anoto, no lo
 * unifico (eso es PORT-007 en adelante).
 */

import type { UI } from "./types";

export const UI_LABELS: UI = {
  skipLink: { es: "Saltar al contenido", en: "Skip to content" },

  // Esto es el `aria-label` del botón. La flecha visible (`↑` en
  // `BackToTop.tsx`) NO está acá, a propósito: es glifo decorativo, idéntico en
  // los dos idiomas, y quien lo usa con lector de pantalla oye esta etiqueta,
  // no el carácter. Un campo aparte para el `↑` sería un dato muerto que nadie
  // traduce. Mismo criterio que el `📜` de `timeline.ts`.
  backToTopLabel: { es: "Volver arriba", en: "Back to top" },

  navLabel: { es: "Navegación principal", en: "Main navigation" },

  /**
   * Seis links para once secciones: "Deportivo" agrupa las siete que forman el
   * bloque del salto y hace scroll a la primera. Esa agrupación ya está
   * decidida y explicada en `Nav.tsx`; acá solo se mudan las etiquetas y los
   * ids. El `id` de cada link es el primero de sus `sectionIds`, que es el
   * ancla a la que navega.
   */
  nav: [
    { id: "inicio", label: { es: "Inicio", en: "Home" }, sectionIds: ["inicio"] },
    { id: "sobre-mi", label: { es: "Sobre mí", en: "About" }, sectionIds: ["sobre-mi"] },
    { id: "stack", label: { es: "Stack", en: "Stack" }, sectionIds: ["stack"] },
    { id: "proyectos", label: { es: "Proyectos", en: "Projects" }, sectionIds: ["proyectos"] },
    {
      id: "progresion",
      label: { es: "Deportivo", en: "Athletics" },
      sectionIds: ["progresion", "epico", "galeria", "logros", "formacion", "tecnica", "metas"],
    },
    { id: "contacto", label: { es: "Contacto", en: "Contact" }, sectionIds: ["contacto"] },
  ],

  projects: {
    problemLabel: { es: "Problema", en: "Problem" },
    solutionLabel: { es: "Solución", en: "Solution" },
    // La cuarta tarjeta del grid no es un proyecto: es un hueco a propósito
    // para que el layout no haya que rehacerlo cuando entre un cuarto
    // proyecto real. Por eso la etiqueta vive acá y no en `projects.ts`.
    nextPlaceholder: { es: "+ siguiente proyecto", en: "+ next project" },
  },
};
