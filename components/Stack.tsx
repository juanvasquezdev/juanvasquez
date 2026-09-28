"use client";

import Reveal from "./Reveal";
import type { Stack as StackData } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/** TEMPORAL: contenido v2 con los estilos viejos; se reescribe en la Fase 3. */
export default function Stack({ content }: { content: Localized<StackData> }) {
  return (
    <section className="section" id="stack">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>
      <Reveal as="p" className="section-intro" index={2}>
        {content.intro}
      </Reveal>

      {content.groups.map((group) => (
        <div className="stack-block" key={group.title}>
          <Reveal as="h3" className="stack-block-title">
            {`${group.title} · ${content.levels[group.level]}`}
          </Reveal>
          <div className="stack-chips">
            {group.items.map((item, i) => (
              <Reveal
                as="span"
                className={`stack-chip ${group.level === "deep" ? "stack-chip-primary" : "stack-chip-secondary"}`}
                index={i + 1}
                key={item}
              >
                {item}
              </Reveal>
            ))}
          </div>
        </div>
      ))}

      <div className="stack-block">
        <Reveal as="h3" className="stack-block-title">
          {content.practicesLabel}
        </Reveal>
        <div className="stack-chips">
          {content.practices.map((practice) => (
            <span className="stack-chip stack-chip-secondary" key={practice}>
              {practice}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
