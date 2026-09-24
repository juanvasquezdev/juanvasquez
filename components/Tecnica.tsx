"use client";

import Reveal from "./Reveal";
import type { Athletics } from "@/content/types";
import type { Localized } from "@/lib/i18n";

export default function Tecnica({ content }: { content: Localized<Athletics["technique"]> }) {
  return (
    <section className="section section-dark" id="tecnica">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>
      <Reveal as="p" className="section-intro" index={2}>
        {content.intro}
      </Reveal>

      <div className="tech-grid">
        {content.cards.map((card, i) => (
          <Reveal className="tech-card" index={i} key={card.num}>
            <div className="tech-num">{card.num}</div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
