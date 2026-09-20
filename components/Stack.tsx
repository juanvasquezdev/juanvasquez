"use client";

import Reveal from "./Reveal";

const CONSTRUYO_HOY = ["HTML", "CSS", "JavaScript", "Git & GitHub", "TypeScript", "Next.js"];
const PROFUNDIZANDO = ["React", "Node.js", "NestJS", "PostgreSQL", "Prisma", "Docker"];

export default function Stack() {
  return (
    <section className="section" id="stack">
      <Reveal as="p" className="eyebrow">
        02 — Herramientas
      </Reveal>
      <Reveal as="h2" index={1}>
        Stack
      </Reveal>

      <div className="stack-block">
        <Reveal as="h3" className="stack-block-title">
          Con esto construyo hoy
        </Reveal>
        <div className="stack-chips">
          {CONSTRUYO_HOY.map((item, i) => (
            <Reveal as="span" className="stack-chip stack-chip-primary" index={i + 1} key={item}>
              {item}
            </Reveal>
          ))}
        </div>
      </div>

      <div className="stack-block">
        <Reveal as="h3" className="stack-block-title">
          Profundizando ahora
        </Reveal>
        <div className="stack-chips">
          {PROFUNDIZANDO.map((item, i) => (
            <Reveal as="span" className="stack-chip stack-chip-secondary" index={i + 1} key={item}>
              {item}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
