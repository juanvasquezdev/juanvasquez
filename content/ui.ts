/**
 * Etiquetas de interfaz: lo que no es contenido de una sección sino cómo se
 * navega el sitio.
 */

import type { UI } from "./types";

export const UI_LABELS: UI = {
  skipLink: { es: "Saltar al contenido", en: "Skip to content" },

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

  // Empieza con "JV", que es lo que se ve: quien maneja la página por voz dice
  // lo que lee en pantalla, y el nombre accesible tiene que contenerlo.
  homeLabel: { es: "JV, ir al inicio", en: "JV, back to top" },
  langLabel: { es: "Idioma", en: "Language" },
  themeToLight: { es: "Cambiar a modo claro", en: "Switch to light mode" },
  themeToDark: { es: "Cambiar a modo oscuro", en: "Switch to dark mode" },
};
