"use client";

import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const ACHIEVEMENTS = [
  { emoji: "🥇", html: <>Campeón Nacional U18<br /><small>(2 veces)</small></> },
  { emoji: "🥈", html: "Subcampeón Juegos Nacionales Juveniles" },
  { emoji: "🥈", html: "Subcampeón Interclubes U20" },
  { emoji: "📈", html: "Marca Personal: 2.06 m" },
];

export default function Logros() {
  return (
    <section className="section section-dark" id="logros">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={revealViewport}>
        <motion.p className="eyebrow" variants={reveal}>
          04 — Trayectoria
        </motion.p>
        <motion.h2 variants={reveal}>Logros Destacados</motion.h2>
      </motion.div>

      <motion.div
        className="achievements"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {ACHIEVEMENTS.map((item, i) => (
          <motion.div className="achievement-item" variants={reveal} key={i}>
            <div className="achievement-emoji">{item.emoji}</div>
            <p>{item.html}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="card card-wide mt-lg"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <p>
          <strong>👤 Entrenador:</strong> José Arturo Posada
        </p>
        <p className="mt-sm">
          <strong>🏃 Clubes:</strong> Todomed, The Jumpers Club
        </p>
      </motion.div>
    </section>
  );
}
