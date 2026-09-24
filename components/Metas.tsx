"use client";

import Reveal from "./Reveal";
import type { Athletics } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * El texto de cada meta llega plano, sin la negrita sobre la marca ("los
 * 2.10 m"). Lo dejé así a propósito: prefiero el texto simple en el dato a
 * inventar una convención de marcado para un énfasis (ver `Goal` en
 * `content/types.ts`).
 */
export default function Metas({ content }: { content: Localized<Athletics["goals"]> }) {
  return (
    <section className="section" id="metas">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>

      <Reveal as="h3" className="sub-heading">
        {content.sportsLabel}
      </Reveal>
      <div className="goal-grid">
        {content.sports.map((goal, i) => (
          <Reveal
            className={`goal-card${goal.primary ? " goal-primary" : ""}`}
            index={i}
            key={goal.title}
          >
            <span className="goal-tag">{goal.tag}</span>
            <h4>{goal.title}</h4>
            <p>{goal.text}</p>
          </Reveal>
        ))}
      </div>

      <Reveal as="h3" className="sub-heading">
        {content.techLabel}
      </Reveal>
      <div className="goal-grid">
        {content.tech.map((goal, i) => (
          <Reveal className="goal-card" index={i} key={goal.title}>
            <span className="goal-tag">{goal.tag}</span>
            <h4>{goal.title}</h4>
            <p>{goal.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
