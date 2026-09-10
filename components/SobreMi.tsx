"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

export default function SobreMi() {
  const [broken, setBroken] = useState(false);

  return (
    <motion.section
      className="section"
      id="sobre-mi"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      <motion.p className="eyebrow" variants={reveal}>
        01 — Quién soy
      </motion.p>
      <motion.h2 variants={reveal}>Sobre Mí</motion.h2>

      <div className="sobre-mi-grid">
        {!broken && (
          <motion.div className="sobre-mi-photo" variants={reveal}>
            <Image
              src="/images/foto_posando2.jpeg"
              alt="Juan José Vásquez Giraldo"
              fill
              sizes="(max-width: 700px) 280px, 300px"
              onError={() => setBroken(true)}
            />
          </motion.div>
        )}

        <motion.div className="card card-wide" variants={reveal}>
          <p>
            Soy Juan José Vásquez Giraldo, atleta colombiano especializado en salto alto. Con una marca
            personal de 2.06 metros, he demostrado ser un competidor de alto nivel a nivel nacional. He sido
            campeón nacional U18 en dos ocasiones y tengo una trayectoria destacada en competencias de élite.
            Mi dedicación, disciplina y pasión por el deporte me impulsan a seguir mejorando y alcanzando
            nuevas metas en mi carrera atlética — con la mirada puesta en la élite mundial.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
