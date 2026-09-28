/**
 * Etiquetas de interfaz: lo que no es contenido de una sección sino cómo se
 * navega el sitio.
 */

import type { UI } from "./types";

export const UI_LABELS: UI = {
  skipLink: { es: "Saltar al contenido", en: "Skip to content" },

  // El aria-label del botón; la flecha visible es decorativa y no se traduce.
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
};
