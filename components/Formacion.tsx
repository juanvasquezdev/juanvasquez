"use client";

import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const TIMELINE = [
  {
    year: "2023",
    title: "Técnico Laboral por Competencias en Asistente en Programación de Software",
    place: "ITA Profesional – Universidad Pontificia Bolivariana (UPB)",
  },
  {
    year: "2023",
    title: "Bachiller Técnico, especialidad en Informática",
    place: "Institución Educativa de Rozo",
  },
];

const CERTS = [
  "Certificado de Aptitud Laboral en Desarrollo de Software",
  "Certificado de Aptitud Ocupacional – Técnico Laboral por Competencias en Asistente en Programación de Software",
];

export default function Formacion() {
  return (
    <section className="section" id="formacion">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={revealViewport}>
        <motion.p className="eyebrow" variants={reveal}>
          05 — Formación
        </motion.p>
        <motion.h2 variants={reveal}>Formación Académica</motion.h2>
      </motion.div>

      <motion.div
        className="timeline"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {TIMELINE.map((item) => (
          <motion.div className="timeline-item" variants={reveal} key={item.title}>
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-content">
              <h3>{item.title}</h3>
              <p>{item.place}</p>
            </div>
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
        Certificaciones
      </motion.h3>
      <motion.div
        className="cert-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {CERTS.map((cert) => (
          <motion.div className="cert-item" variants={reveal} key={cert}>
            <div className="cert-icon">📜</div>
            <p>{cert}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
