"use client";

import Reveal from "./Reveal";

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
      <Reveal as="p" className="eyebrow">
        03 — Casos
      </Reveal>
      <Reveal as="h2" index={1}>
        Proyectos
      </Reveal>

      <div className="proyecto-grid">
        {PROYECTOS.map((p, i) => (
          <Reveal className="proyecto-card" index={i} key={p.title}>
            <span className="proyecto-status">{p.status}</span>
            <h3>{p.title}</h3>
            <p className="proyecto-label">Problema</p>
            <p>{p.problema}</p>
            <p className="proyecto-label">Solución</p>
            <p>{p.solucion}</p>
          </Reveal>
        ))}
        <Reveal className="proyecto-placeholder" index={PROYECTOS.length}>
          + siguiente proyecto
        </Reveal>
      </div>
    </section>
  );
}
