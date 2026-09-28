/**
 * Con qué construyo hoy y qué sigue en mi ruta. Textos del mockup v2.
 *
 * El nivel va por grupo y no por tecnología: todo lo de "hoy" está en
 * Profundizando y todo lo que sigue, en Aprendiendo.
 */

import type { Stack } from "./types";

export const STACK: Stack = {
  eyebrow: { es: "03 — Stack", en: "03 — Stack" },
  heading: { es: "Con qué construyo", en: "What I build with" },
  intro: {
    es: "Priorizo velocidad, fluidez, rendimiento y seguridad. Uso lo moderno cuando suma y lo probado cuando es lo correcto: la herramienta la decide el problema, no la moda.",
    en: "I prioritize speed, smoothness, performance and security. I use modern tools when they add value and proven ones when that is the right call: the problem picks the tool, not the trend.",
  },

  levels: {
    deep: { es: "Profundizando", en: "Going deeper" },
    learning: { es: "Aprendiendo", en: "Learning" },
  },

  groups: [
    {
      title: { es: "Con esto construyo hoy", en: "What I build with today" },
      level: "deep",
      items: [
        "TypeScript",
        "JavaScript",
        "React · Next.js",
        "Node.js",
        "NestJS",
        "PostgreSQL · Prisma",
        "Python",
        "Docker",
        "HTML · CSS · Tailwind",
        "Git & GitHub",
      ],
    },
    {
      title: { es: "Lo siguiente en mi ruta", en: "Next on my path" },
      level: "learning",
      items: [
        { es: "Testing y CI/CD", en: "Testing & CI/CD" },
        { es: "Cloud y despliegue", en: "Cloud & deployment" },
        "WebSockets",
        { es: "Integración con IA", en: "AI integration" },
        "Java",
      ],
    },
  ],

  practicesLabel: { es: "Prácticas", en: "Practices" },
  practices: [
    { es: "Testing (unitario, integración, E2E)", en: "Testing (unit, integration, E2E)" },
    { es: "CI con GitHub Actions", en: "CI with GitHub Actions" },
    { es: "Autenticación y hashing", en: "Authentication and hashing" },
    { es: "Accesibilidad", en: "Accessibility" },
    {
      es: "Git: ramas, PRs y commits convencionales",
      en: "Git: branches, PRs and conventional commits",
    },
  ],
};
