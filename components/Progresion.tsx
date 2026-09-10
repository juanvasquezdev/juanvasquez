"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { reveal, staggerContainer, revealViewport, EASE } from "@/lib/motion";

type Marker = { pos: number; value: string; label: string; variant?: "current" | "elite" };

const MARKERS: Marker[] = [
  { pos: 0, value: "2.06 m", label: "PB actual", variant: "current" },
  { pos: 30, value: "2.10 m", label: "Próxima meta · Nacional Mayores" },
  { pos: 78, value: "2.19 m", label: "Récord Nacional U20" },
  { pos: 100, value: "2.20 – 2.25 m", label: "Élite mundial · Road to LA 2028", variant: "elite" },
];

export default function Progresion() {
  const chartRef = useRef<HTMLDivElement>(null);
  const filled = useInView(chartRef, { once: true, amount: 0.3 });

  return (
    <section className="section section-dark" id="progresion">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.p className="eyebrow" variants={reveal}>
          04 — El objetivo
        </motion.p>
        <motion.h2 variants={reveal}>La Barra</motion.h2>
        <motion.p className="section-intro" variants={reveal}>
          Cada centímetro es una temporada de trabajo. Esta es mi hoja de ruta hacia la élite mundial.
        </motion.p>
      </motion.div>

      <div className={`bar-chart${filled ? " filled" : ""}`} ref={chartRef}>
        <div className="bar-track">
          <motion.div
            className="bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: filled ? "100%" : "0%" }}
            transition={{ duration: 1.8, ease: EASE }}
          />

          {MARKERS.map((marker) => (
            <div
              key={marker.label}
              className={`bar-marker${marker.variant === "current" ? " marker-current" : ""}${
                marker.variant === "elite" ? " marker-elite" : ""
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
