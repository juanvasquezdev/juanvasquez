"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const FOTOS = [
  { src: "/images/vista_epica.jpeg", alt: "Aproximación al salto, vista desde la barra" },
  { src: "/images/foto_blanconegro.jpeg", alt: "Salto de vallas en entrenamiento nocturno" },
  { src: "/images/epica_trasera2.jpeg", alt: "Celebración de espaldas frente al horizonte" },
];

function EpicoItem({ src, alt }: (typeof FOTOS)[number]) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <div className="epico-item">
      <Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" onError={() => setBroken(true)} />
    </div>
  );
}

export default function MomentoEpico() {
  return (
    <section className="section section-dark" id="epico">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={revealViewport}>
        <motion.p className="eyebrow" variants={reveal}>
          05 — Momento épico
        </motion.p>
        <motion.h2 variants={reveal}>El instante antes de la barra</motion.h2>
        <motion.p className="section-intro" variants={reveal}>
          No siempre gana la marca — a veces gana el segundo exacto en que el cuerpo decide saltar.
        </motion.p>
      </motion.div>

      <motion.div
        className="epico-strip"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {FOTOS.map((foto) => (
          <motion.div variants={reveal} key={foto.src}>
            <EpicoItem {...foto} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
