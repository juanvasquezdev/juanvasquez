"use client";

import Reveal from "./Reveal";
import type { Athletics } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * Lo que Logros lee de `content/athletics.ts`, campo por campo. La liga y la
 * federación (`governingBodies*`) están en el dato pero todavía no las muestro,
 * así que ni siquiera viajan al cliente. Va como lista de lo que entra y no de
 * lo que sale, para que un campo nuevo no llegue al navegador sin que yo lo pida.
 */
export type LogrosContent = Pick<
  Localized<Athletics["achievements"]>,
  "eyebrow" | "heading" | "items" | "clubsLabel" | "clubs"
>;

export default function Logros({ content }: { content: LogrosContent }) {
  return (
    <section className="section section-dark" id="logros">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>

      <div className="achievements">
        {content.items.map((item, i) => (
          <Reveal className="achievement-item" index={i} key={i}>
            <div className="achievement-emoji">{item.icon}</div>
            <p>
              {item.title}
              {item.note && (
                <>
                  <br />
                  <small>{item.note}</small>
                </>
              )}
            </p>
          </Reveal>
        ))}
      </div>

      <Reveal className="card card-wide mt-lg">
        {/* El entrenador sigue escrito a mano acá y no en content/: decidí no
            publicarlo, así que el dato no tiene campo para él. Mientras siga en
            pantalla, vive solo en este componente. */}
        <p>
          <strong>👤 Entrenador:</strong> José Arturo Posada
        </p>
        {/* Espacio y nombres en un solo nodo de texto: si van separados, React
            mete un <!-- --> entre los dos. */}
        <p className="mt-sm">
          <strong>{content.clubsLabel}</strong>
          {` ${content.clubs.join(", ")}`}
        </p>
      </Reveal>
    </section>
  );
}
