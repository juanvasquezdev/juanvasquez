"use client";

import Reveal from "./Reveal";
import type { Projects, UI } from "@/content/types";
import type { Localized } from "@/lib/i18n";

export default function Proyectos({
  content,
  labels,
}: {
  content: Localized<Projects>;
  labels: Localized<UI["projects"]>;
}) {
  return (
    <section className="section" id="proyectos">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>

      <div className="proyecto-grid">
        {content.items.map((p, i) => (
          <Reveal className="proyecto-card" index={i} key={p.slug}>
            <span className="proyecto-status">{p.statusLabel}</span>
            <h3>{p.title}</h3>
            <p className="proyecto-label">{labels.problemLabel}</p>
            <p>{p.problem}</p>
            <p className="proyecto-label">{labels.solutionLabel}</p>
            <p>{p.solution}</p>
          </Reveal>
        ))}
        <Reveal className="proyecto-placeholder" index={content.items.length}>
          {labels.nextPlaceholder}
        </Reveal>
      </div>
    </section>
  );
}
