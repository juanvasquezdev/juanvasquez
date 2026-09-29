import Image from "next/image";
import type { Profile } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/** Texto y datos a la izquierda, retrato a la derecha. Va dentro del panel del Hero. */
export default function SobreMi({ content }: { content: Localized<Profile["about"]> }) {
  return (
    <section className="section" id="sobre-mi">
      <div className="wrap about">
        <div>
          <p className="mono eyebrow sec-num" data-reveal>{content.eyebrow}</p>
          <h2 className="h2" data-reveal>
            {content.heading}
          </h2>
          <p className="body">{content.body}</p>
          <dl className="facts">
            {content.facts.map((fact) => (
              <div className="fact" key={fact.label}>
                <dt className="mono">{fact.label}</dt>
                <dd>
                  {fact.value}
                  {fact.link && (
                    <a
                      className="fact-link"
                      href={fact.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {fact.link.label} <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* El ancho lo da la columna del grid (sin margin auto, que lo anula) y
            el alto sale del aspect-ratio. Si cambian las columnas de .about,
            cambia también este sizes. */}
        <div className="portrait">
          <Image
            src={content.portrait.src}
            alt={content.portrait.alt}
            fill
            sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 860px) 440px, (max-width: 1240px) 36vw, 456px"
          />
        </div>
      </div>
    </section>
  );
}
