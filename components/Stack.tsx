"use client";

import Reveal from "./Reveal";
import type { Stack as StackData } from "@/content/types";
import type { Localized } from "@/lib/i18n";

export default function Stack({ content }: { content: Localized<StackData> }) {
  return (
    <section className="section" id="stack">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>

      {content.groups.map((group, g) => (
        <div className="stack-block" key={group.title}>
          <Reveal as="h3" className="stack-block-title">
            {group.title}
          </Reveal>
          <div className="stack-chips">
            {group.items.map((item, i) => (
              <Reveal
                as="span"
                // El primer bloque es lo que ya uso (chip primario) y el resto
                // lo que estoy profundizando: va por posición porque el dato no
                // tiene un campo de "nivel".
                className={`stack-chip ${g === 0 ? "stack-chip-primary" : "stack-chip-secondary"}`}
                index={i + 1}
                key={item}
              >
                {item}
              </Reveal>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
