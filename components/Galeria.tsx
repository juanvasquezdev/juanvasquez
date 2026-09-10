"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const ITEMS = [
  { src: "/images/pb2.04.jpeg", alt: "Salto de 2.04m en competencia", icon: "📸", label: "Salto 2.04 m" },
  { src: "/images/podio_u23.jpeg", alt: "Podio en categoría U23", icon: "🥇", label: "Podio U23" },
  { src: "/images/podio-mayores.jpeg", alt: "Podio categoría Mayores", icon: "🏅", label: "Podio Mayores" },
  { src: "/images/u18.jpeg", alt: "Competencia categoría U18", icon: "🏃", label: "Competencia U18" },
];

function GaleriaItem({ src, alt, icon, label }: (typeof ITEMS)[number]) {
  const [broken, setBroken] = useState(false);
  return (
    <motion.div className="galeria-item" variants={reveal}>
      {!broken && (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          onError={() => setBroken(true)}
        />
      )}
      <div className="galeria-placeholder" style={broken ? { display: "flex" } : undefined}>
        <div className="ph-icon">{icon}</div>
        <p>{label}</p>
      </div>
    </motion.div>
  );
}

export default function Galeria() {
  return (
    <section className="section" id="galeria">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={revealViewport}>
        <motion.p className="eyebrow" variants={reveal}>
          04 — Momentos
        </motion.p>
        <motion.h2 variants={reveal}>Galería</motion.h2>
      </motion.div>

      <motion.div
        className="galeria"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {ITEMS.map((item) => (
          <GaleriaItem key={item.src} {...item} />
        ))}
      </motion.div>
    </section>
  );
}
