"use client";

import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const CONSTRUYO_HOY = ["HTML", "CSS", "JavaScript", "Git & GitHub", "TypeScript", "Next.js"];
const PROFUNDIZANDO = ["React", "Node.js", "NestJS", "PostgreSQL", "Prisma", "Docker"];

export default function Stack() {
  return (
    <section className="section" id="stack">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={revealViewport}>
        <motion.p className="eyebrow" variants={reveal}>
          02 — Herramientas
        </motion.p>
        <motion.h2 variants={reveal}>Stack</motion.h2>
      </motion.div>

      <motion.div
        className="stack-block"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h3 className="stack-block-title" variants={reveal}>
          Con esto construyo hoy
        </motion.h3>
        <div className="stack-chips">
          {CONSTRUYO_HOY.map((item) => (
            <motion.span className="stack-chip stack-chip-primary" variants={reveal} key={item}>
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="stack-block"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        <motion.h3 className="stack-block-title" variants={reveal}>
          Profundizando ahora
        </motion.h3>
        <div className="stack-chips">
          {PROFUNDIZANDO.map((item) => (
            <motion.span className="stack-chip stack-chip-secondary" variants={reveal} key={item}>
              {item}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
