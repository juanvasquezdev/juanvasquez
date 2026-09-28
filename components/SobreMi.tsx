"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import type { Profile } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/** TEMPORAL: contenido v2 con los estilos viejos; se reescribe en la Fase 3. */
export default function SobreMi({ content }: { content: Localized<Profile["about"]> }) {
  return (
    <section className="section" id="sobre-mi">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>

      <div className="sobre-mi-grid">
        <Reveal className="sobre-mi-photo" index={2}>
          <Image
            src={content.portrait.src}
            alt={content.portrait.alt}
            fill
            sizes="(max-width: 700px) 280px, 300px"
          />
        </Reveal>

        <Reveal className="card card-wide" index={3}>
          <p>{content.body}</p>
          <dl>
            {content.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  {fact.value}
                  {fact.link && (
                    <>
                      {" · "}
                      <a href={fact.link.href} target="_blank" rel="noopener noreferrer">
                        {fact.link.label}
                      </a>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
