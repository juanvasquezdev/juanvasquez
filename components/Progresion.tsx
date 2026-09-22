"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Reveal from "./Reveal";
import { EASE } from "@/lib/motion";

type Marker = { pos: number; value: string; label: string; variant?: "current" };

const MARKERS: Marker[] = [
  { pos: 0, value: "2.06 m", label: "PB actual", variant: "current" },
  { pos: 30, value: "2.10 m", label: "Próxima meta · Nacional Mayores" },
  { pos: 78, value: "2.19 m", label: "Récord Nacional U20" },
  { pos: 100, value: "2.20 – 2.25 m", label: "Élite mundial · Road to LA 2028" },
];

export default function Progresion() {
  const chartRef = useRef<HTMLDivElement>(null);
  const filled = useInView(chartRef, { once: true, amount: 0.3 });

  return (
    <section className="section section-dark" id="progresion">
      <Reveal as="p" className="eyebrow">
        04 — El objetivo
      </Reveal>
      <Reveal as="h2" index={1}>
        La Barra
      </Reveal>
      <Reveal as="p" className="section-intro" index={2}>
        Cada centímetro es una temporada de trabajo. Esta es mi hoja de ruta hacia la élite mundial.
      </Reveal>

      <div className={`bar-chart${filled ? " filled" : ""}`} ref={chartRef}>
        <div className="bar-track">
          <motion.div
            className="bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: filled ? "100%" : "0%" }}
            transition={{ duration: 1.8, ease: EASE }}
          />

          {MARKERS.map((marker, i) => (
            <div
              key={marker.label}
              // La alternancia de renglón la decide el índice del dato, no la
              // posición en el DOM: si mañana entra otro nodo dentro de
              // .bar-track (como ya está .bar-fill), un :nth-child corre la
              // paridad y dos etiquetas vecinas caen en el mismo renglón sin
              // que nada lo avise. Cuál de las dos filas baja da igual; lo que
              // importa es que se turnen.
              className={`bar-marker${marker.variant === "current" ? " marker-current" : ""}${
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
