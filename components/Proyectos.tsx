"use client";

import Reveal from "./Reveal";
import type { Projects } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/** TEMPORAL: contenido v2 con los estilos viejos; se reescribe en la Fase 3. */
export default function Proyectos({ content }: { content: Localized<Projects> }) {
  return (
    <section className="section" id="proyectos">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>
      <Reveal as="p" className="section-intro" index={2}>
        {content.intro}
      </Reveal>

      <div className="proyecto-grid">
        {content.items.map((p, i) => (
          <Reveal className="proyecto-card" index={i} key={p.slug}>
            <span className="proyecto-status">{p.statusLabel}</span>
            <h3>{p.title}</h3>
            <p>{p.problem}</p>
            <p>{p.solution}</p>
            <p className="proyecto-label">{p.stack.join(" · ")}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
