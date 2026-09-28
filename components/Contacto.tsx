"use client";

import Reveal from "./Reveal";
import type { Profile } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/** TEMPORAL: contenido v2 con los estilos viejos; se reescribe en la Fase 3. */
export default function Contacto({ content }: { content: Localized<Profile["contact"]> }) {
  return (
    <section className="section section-dark" id="contacto">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>

      <div className="contact-grid">
        {content.links.map((link, i) => (
          <Reveal
            as="a"
            key={link.id}
            href={link.href}
            {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="contact-item"
            index={i}
          >
            <div className="contact-label">{link.label}</div>
            <span className="contact-value">{link.value}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
