"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Reveal from "./Reveal";
import { EASE } from "@/lib/motion";
import type { Athletics } from "@/content/types";
import type { Localized } from "@/lib/i18n";

export default function Progresion({ content }: { content: Localized<Athletics["progression"]> }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const filled = useInView(chartRef, { once: true, amount: 0.3 });

  return (
    <section className="section section-dark" id="progresion">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>
      <Reveal as="p" className="section-intro" index={2}>
        {content.intro}
      </Reveal>

      <div className={`bar-chart${filled ? " filled" : ""}`} ref={chartRef}>
        <div className="bar-track">
          <motion.div
            className="bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: filled ? "100%" : "0%" }}
            transition={{ duration: 1.8, ease: EASE }}
          />

          {content.markers.map((marker, i) => (
            <div
              key={marker.label}
              // La alternancia de renglón la decide el índice del dato, no la
              // posición en el DOM: si mañana entra otro nodo dentro de
              // .bar-track (como ya está .bar-fill), un :nth-child corre la
              // paridad y dos etiquetas vecinas caen en el mismo renglón sin
              // que nada lo avise. Cuál de las dos filas baja da igual; lo que
              // importa es que se turnen.
              className={`bar-marker${marker.current ? " marker-current" : ""}${
                i % 2 === 1 ? " marker-row-low" : ""
              }`}
              style={{ "--pos": `${marker.pos}%` } as React.CSSProperties}
            >
              <div className="marker-dot"></div>
              <div className="marker-label">
                <strong>{marker.value}</strong>
                <span>{marker.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
