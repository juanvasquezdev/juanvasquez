"use client";

import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const CARDS = [
  {
    num: "01",
    title: "Ángulo de despegue",
    text: "Trabajo el ángulo óptimo de aproximación (curva de 5-6 zancadas) para maximizar la conversión de velocidad horizontal en impulso vertical, sin perder velocidad de carrera.",
  },
  {
    num: "02",
    title: "Centro de masa",
    text: "El objetivo técnico del Fosbury Flop es que el centro de masa pase por debajo de la barra mientras el cuerpo pasa por encima — cuanto mejor el arco dorsal, menos altura \"desperdiciada\".",
  },
  {
    num: "03",
    title: "Fuerza reactiva",
    text: "El despegue depende de la fuerza reactiva de la pierna de batida en apenas ~0.15 segundos de contacto — de ahí el trabajo pliométrico y de potencia en cada bloque de entrenamiento.",
  },
  {
    num: "04",
    title: "Mentalidad de competencia",
    text: "Cada intento es un experimento controlado: ajusto una sola variable a la vez (marca de carrera, timing de brazos, ritmo de los últimos pasos) y evalúo el resultado con datos, no solo sensaciones.",
  },
];

export default function Tecnica() {
  return (
    <section className="section section-dark" id="tecnica">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={revealViewport}>
        <motion.p className="eyebrow" variants={reveal}>
          09 — Mentalidad
        </motion.p>
        <motion.h2 variants={reveal}>Técnica &amp; Ciencia del Salto</motion.h2>
        <motion.p className="section-intro" variants={reveal}>
          Para mí el salto alto no es solo talento — es física aplicada. Cada ajuste de carrera, cada grado
          de despegue, cada milisegundo de tensión en el arco dorsal (Fosbury Flop) se puede medir, entender
          y mejorar.
        </motion.p>
      </motion.div>

      <motion.div
        className="tech-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {CARDS.map((card) => (
          <motion.div className="tech-card" variants={reveal} key={card.num}>
            <div className="tech-num">{card.num}</div>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
