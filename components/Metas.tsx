"use client";

import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const DEPORTIVAS = [
  {
    tag: "Próxima competencia",
    title: "Campeonato Nacional Mayores",
    text: (
      <>
        Meta: romper la barrera de los <strong>2.10 m</strong> — mi próximo salto de nivel sobre mi PB
        actual de 2.06 m.
      </>
    ),
    primary: true,
  },
  {
    tag: "Meta mayor",
    title: "Récord Nacional U20",
    text: (
      <>
        Superar los <strong>2.19 m</strong> que hoy marcan el récord nacional en categoría U20.
      </>
    ),
  },
  {
    tag: "Meta máxima",
    title: "Élite Mundial · Road to LA 2028",
    text: (
      <>
        Alcanzar entre <strong>2.20 m y 2.25 m</strong> de altura y competir al nivel de la élite mundial,
        con la mira puesta en Los Ángeles 2028.
      </>
    ),
  },
];

const TECNOLOGICAS = [
  {
    tag: "En desarrollo",
    title: "Plataforma de registro y monitoreo",
    text: "Una web + app para registrar competencias, marcas y perfiles de atletas, y hacer seguimiento del rendimiento a lo largo del tiempo.",
  },
  {
    tag: "En desarrollo",
    title: "APIs y sistemas de optimización",
    text: "Construcción de APIs y sistemas propios que mejoren y optimicen procesos del día a día, aplicando lo aprendido en programación de software.",
  },
];

export default function Metas() {
  return (
    <section className="section" id="metas">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={revealViewport}>
        <motion.p className="eyebrow" variants={reveal}>
          10 — Lo que viene
        </motion.p>
        <motion.h2 variants={reveal}>Próximos Proyectos</motion.h2>
      </motion.div>

      <motion.h3
        className="sub-heading"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        🏆 Deportivos
      </motion.h3>
      <motion.div
        className="goal-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {DEPORTIVAS.map((goal) => (
          <motion.div
            className={`goal-card${goal.primary ? " goal-primary" : ""}`}
            variants={reveal}
            key={goal.title}
          >
            <span className="goal-tag">{goal.tag}</span>
            <h4>{goal.title}</h4>
            <p>{goal.text}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.h3
        className="sub-heading"
        variants={reveal}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        💻 Tecnológicos
      </motion.h3>
      <motion.div
        className="goal-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {TECNOLOGICAS.map((goal) => (
          <motion.div className="goal-card" variants={reveal} key={goal.title}>
            <span className="goal-tag">{goal.tag}</span>
            <h4>{goal.title}</h4>
            <p>{goal.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
