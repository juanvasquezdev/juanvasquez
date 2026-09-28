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

  // Los mismos seis links del mockup v2, en el orden de la página. El id es el
  // de la sección de destino.
  nav: [
    { id: "sobre-mi", label: { es: "Sobre mí", en: "About" } },
    { id: "stack", label: { es: "Stack", en: "Stack" } },
    { id: "proyectos", label: { es: "Proyectos", en: "Projects" } },
    { id: "herramientas", label: { es: "Herramientas", en: "Tools" } },
    { id: "atleta", label: { es: "Atleta", en: "Athlete" } },
    { id: "contacto", label: { es: "Contacto", en: "Contact" } },
  ],

  homeLabel: { es: "Ir al inicio", en: "Back to top" },
  langLabel: { es: "Idioma", en: "Language" },
  themeToLight: { es: "Cambiar a modo claro", en: "Switch to light mode" },
  themeToDark: { es: "Cambiar a modo oscuro", en: "Switch to dark mode" },

  projects: {
    problemLabel: { es: "Problema", en: "Problem" },
    solutionLabel: { es: "Solución", en: "Solution" },
    // La cuarta tarjeta del grid no es un proyecto: es un hueco a propósito
    // para que el layout no haya que rehacerlo cuando entre un cuarto
    // proyecto real. Por eso la etiqueta vive acá y no en `projects.ts`.
    nextPlaceholder: { es: "+ siguiente proyecto", en: "+ next project" },
  },
};
