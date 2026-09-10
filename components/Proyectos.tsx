"use client";

import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const PROYECTOS = [
  {
    title: "Fast Inventory",
    status: "En consolidación",
    problema:
      "Negocios que todavía llevan inventario, ventas y caja en papel o en hojas sueltas.",
    solucion:
      "Un sistema de gestión modular — inventario, ventas y caja en un solo lugar — que hoy sigo consolidando módulo por módulo.",
  },
  {
    title: "Athletics Hub",
    status: "En construcción",
    problema:
      "La Liga Vallecaucana de Atletismo no tiene un sistema digital para atletas, competencias, resultados y rankings.",
    solucion:
      "Una plataforma propia, sin depender de builders no-code, con un primer despliegue pensado para unas 100 personas.",
  },
  {
    title: "Portafolio Personal",
    status: "Vivo",
    problema:
      "Mostrar en un solo lugar coherente el lado técnico y el atlético, con una base seria para seguir creciendo.",
    solucion:
      "Este mismo sitio — Next.js, TypeScript y Tailwind, con sistema de diseño propio — construido y auditado por fases.",
  },
];

export default function Proyectos() {
  return (
    <section className="section" id="proyectos">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={revealViewport}>
        <motion.p className="eyebrow" variants={reveal}>
          03 — Casos
        </motion.p>
        <motion.h2 variants={reveal}>Proyectos</motion.h2>
      </motion.div>

      <motion.div
        className="proyecto-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {PROYECTOS.map((p) => (
          <motion.div className="proyecto-card" variants={reveal} key={p.title}>
            <span className="proyecto-status">{p.status}</span>
            <h3>{p.title}</h3>
            <p className="proyecto-label">Problema</p>
            <p>{p.problema}</p>
            <p className="proyecto-label">Solución</p>
            <p>{p.solucion}</p>
          </motion.div>
        ))}
        <motion.div className="proyecto-placeholder" variants={reveal}>
          + siguiente proyecto
        </motion.div>
      </motion.div>
    </section>
  );
}
