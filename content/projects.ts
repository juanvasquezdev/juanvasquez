/**
 * Proyectos (sistemas grandes, con su problema y su solución) y Herramientas
 * (proyectos chicos de código abierto). Textos del mockup v2.
 *
 * Sin `repoUrl` la tarjeta dice "Repo privado" y no enlaza a un 404; con
 * `repoUrl` pasa sola a ser un enlace al repo.
 */

import type { Projects, Tools } from "./types";

export const PROJECTS: Projects = {
  eyebrow: { es: "Proyectos", en: "Projects" },
  heading: { es: "Proyectos", en: "Projects" },
  intro: {
    es: "Sistemas reales en distintas etapas: qué resuelven, cómo están hechos y en qué van.",
    en: "Real systems at different stages: what they solve, how they are built and where they stand.",
  },
  privateRepoLabel: { es: "Repo privado", en: "Private repo" },

  items: [
    {
      slug: "athletics-hub",
      title: { es: "Athletics Hub", en: "Athletics Hub" },
      statusLabel: { es: "En construcción", en: "In progress" },
      live: false,
      problem: {
        es: "La Liga Vallecaucana de Atletismo no tiene un sistema digital para atletas, competencias, resultados y rankings.",
        en: "The Liga Vallecaucana de Atletismo has no digital system for athletes, competitions, results and rankings.",
      },
      solution: {
        es: "Plataforma propia en un monorepo: API en NestJS con Prisma y PostgreSQL, autenticación con hashing argon2id, y CI con tests de unidad, integración y E2E.",
        en: "A platform of my own in a monorepo: NestJS API with Prisma and PostgreSQL, argon2id password hashing, and CI with unit, integration and E2E tests.",
      },
      stack: ["NestJS", "Bun", "Prisma", "PostgreSQL", "Docker", "React 19"],
    },
    {
      slug: "nudo",
      title: { es: "Nudo", en: "Nudo" },
      statusLabel: { es: "En consolidación", en: "Consolidating" },
      live: false,
      problem: {
        es: "Empresas y familias que manejan inventario, ventas, deudas y caja en papel, sin datos para decidir.",
        en: "Businesses and families running inventory, sales, debts and cash on paper, with no data to make decisions.",
      },
      solution: {
        es: "Primer eslabón de una plataforma de gestión más grande: un ERP modular al que se le suman capas de IA que analizan, controlan y automatizan, y agentes que ejecutan acciones. Cada módulo funciona solo o conectado a los demás.",
        en: "The first link of a larger management platform: a modular ERP with AI layers that analyze, control and automate, and agents that take action. Each module works on its own or connected to the rest.",
      },
      // PENDIENTE: el mockup trae un quinto chip "[confirmar stack]". No lo
      // publico con corchetes; cuando tenga el stack completo, va acá.
      stack: ["Node.js", "NestJS", "PostgreSQL", "Prisma"],
    },
    {
      slug: "nyx",
      title: { es: "Nyx", en: "Nyx" },
      statusLabel: { es: "En desarrollo", en: "In development" },
      live: false,
      problem: {
        es: "Tiendas pequeñas y rurales que necesitan algo más simple que un ERP, que funcione en local.",
        en: "Small and rural shops that need something simpler than an ERP, running locally.",
      },
      solution: {
        es: "Gestión local de productos, stock, ventas, fiados con abonos y caja diaria. Funciona sin internet, en escritorio o como app en el celular.",
        en: "Local management of products, stock, sales, store credit with partial payments and a daily cash register. Works offline, on desktop or as a phone app.",
      },
      stack: ["React", "Vite", "TypeScript", "Express", "SQLite", "PWA"],
    },
    {
      slug: "portafolio",
      title: { es: "Portafolio personal", en: "Personal portfolio" },
      statusLabel: { es: "Vivo", en: "Live" },
      live: true,
      problem: {
        es: "Mostrar en un solo lugar coherente el lado técnico y el atlético.",
        en: "Showing the technical side and the athletic one in a single coherent place.",
      },
      solution: {
        es: "Este mismo sitio: migrado de un builder no-code a Next.js y TypeScript, auditado y construido por fases.",
        en: "This very site: moved off a no-code builder to Next.js and TypeScript, audited and built in phases.",
      },
      // El mockup dice Tailwind, pero lo saqué en la Fase 1: el CSS es propio.
      stack: ["Next.js", "TypeScript", "CSS", "Playwright"],
      // Cuando el repo sea público: descomentar e importar GITHUB_URL de ./profile.
      // repoUrl: `${GITHUB_URL}/juanvasquez`,
    },
  ],
};

export const TOOLS: Tools = {
  eyebrow: { es: "Herramientas", en: "Tools" },
  heading: { es: "Herramientas", en: "Tools" },
  intro: {
    es: "Proyectos pequeños y de código abierto. Úsalos, revísalos o mejóralos desde GitHub.",
    en: "Small, open-source projects. Use them, review them or improve them on GitHub.",
  },
  cta: { es: "Ver en GitHub", en: "View on GitHub" },

  // Placeholders del mockup: no salen en pantalla hasta tener `repoUrl`, y
  // mientras ninguno lo tenga la sección no se renderiza.
  items: [
    {
      name: { es: "[Nombre de la herramienta]", en: "[Tool name]" },
      kind: { es: "Automatización · Python", en: "Automation · Python" },
      description: {
        es: "[Qué hace en una línea y para quién sirve.]",
        en: "[What it does in one line and who it is for.]",
      },
    },
    {
      name: { es: "[Nombre de la herramienta]", en: "[Tool name]" },
      kind: { es: "API REST · Node.js", en: "REST API · Node.js" },
      description: {
        es: "[Qué hace en una línea y para quién sirve.]",
        en: "[What it does in one line and who it is for.]",
      },
    },
    {
      name: { es: "[Nombre de la herramienta]", en: "[Tool name]" },
      kind: { es: "Script · TypeScript", en: "Script · TypeScript" },
      description: {
        es: "[Qué hace en una línea y para quién sirve.]",
        en: "[What it does in one line and who it is for.]",
      },
    },
  ],
};
