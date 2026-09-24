"use client";

import Reveal from "./Reveal";
import type { Timeline } from "@/content/types";
import type { Localized } from "@/lib/i18n";

export default function Formacion({ content }: { content: Localized<Timeline> }) {
  return (
    <section className="section" id="formacion">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>

      <div className="timeline">
        {content.entries.map((item, i) => (
          <Reveal className="timeline-item" index={i} key={item.title}>
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-content">
              <h3>{item.title}</h3>
              <p>{item.place}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal as="h3" className="sub-heading">
        {content.certsHeading}
      </Reveal>
      <div className="cert-grid">
        {content.certs.map((cert, i) => (
          <Reveal className="cert-item" index={i} key={cert}>
            <div className="cert-icon">📜</div>
            <p>{cert}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
