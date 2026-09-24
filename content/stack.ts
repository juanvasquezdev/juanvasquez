/**
 * Mi stack: con qué construyo hoy y qué estoy profundizando.
 *
 * Mudanza literal de `components/Stack.tsx` (R1): los dos títulos de bloque y
 * los doce nombres de tecnología, en el mismo orden en que están en pantalla.
 * Los nombres de tecnología no se traducen — son nombres propios, y "Git &
 * GitHub" se queda con el `&` tal cual.
 *
 * Esta sección no tiene párrafo de intro en el sitio, así que `intro` va
 * ausente en vez de vacío: el tipo lo tiene opcional justo para esto.
 *
 * Los `items` de acá son, de hecho, los ids que referencia `Project["stack"]`
 * (ver la nota en `types.ts`): si un proyecto dice "Next.js", tiene que estar
 * escrito igual que en este archivo.
 */

import type { Stack } from "./types";

export const STACK: Stack = {
  eyebrow: { es: "02 — Herramientas", en: "02 — Tools" },
  heading: { es: "Stack", en: "Stack" },

  groups: [
    {
      title: { es: "Con esto construyo hoy", en: "What I build with today" },
      items: ["HTML", "CSS", "JavaScript", "Git & GitHub", "TypeScript", "Next.js"],
    },
    {
      title: { es: "Profundizando ahora", en: "Going deeper right now" },
      items: ["React", "Node.js", "NestJS", "PostgreSQL", "Prisma", "Docker"],
    },
  ],
};
