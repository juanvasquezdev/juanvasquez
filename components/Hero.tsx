"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import AnimatedStat from "./AnimatedStat";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const LAYER_SRC = [
  "/images/podio_u23.jpeg",
  "/images/u18.jpeg",
  // NUEVA — pendiente reemplazar este archivo por otra foto mía
  "/images/hero-nueva.jpeg",
];

function HeroLayer({
  src,
  priority,
  opacity,
}: {
  src: string;
  priority: boolean;
  opacity: import("motion/react").MotionValue<number>;
}) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <motion.div className="hero-img-layer" style={{ opacity }}>
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        onError={() => setBroken(true)}
      />
    </motion.div>
  );
}

export default function Hero() {
  const scrollRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });

  // Mismo "floatIndex" del crossfade original (progress * (N-1), distancia
  // triangular a cada capa) resuelto como keyframes de useTransform: para
  // 3 capas, floatIndex = progress*2, y cada capa i vale 1 en su propio
  // punto y 0 en los extremos.
  const opacity0 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0, 0]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);
  const opacities = [opacity0, opacity1, opacity2];

  return (
    <header id="inicio" className="hero-scroll" ref={scrollRef}>
      <div className="hero-pin">
        <div className="hero-images" aria-hidden="true">
          {LAYER_SRC.map((src, i) => (
            <HeroLayer key={src} src={src} priority={i === 0} opacity={opacities[i]} />
          ))}
        </div>

        <div className="hero-overlay"></div>

        <motion.div
          className="hero"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
        >
          <motion.p className="hero-eyebrow" variants={reveal}>
            🇨🇴 Salto Alto · Atletismo
          </motion.p>
          <motion.h1 variants={reveal}>Juan José Vásquez Giraldo</motion.h1>
          <motion.h2 variants={reveal}>Aprendiendo a volar más alto</motion.h2>

          <motion.div className="stats" variants={reveal}>
            <div className="stat-item">
              <AnimatedStat target={2.06} decimals={2} />
              <div className="stat-label">Marca Personal (m)</div>
            </div>
            <div className="stat-item">
              <AnimatedStat target={2.01} decimals={2} />
              <div className="stat-label">Estatura (m)</div>
            </div>
            <div className="stat-item">
              <AnimatedStat target={19} decimals={0} />
              <div className="stat-label">Años</div>
            </div>
          </motion.div>

          <motion.p className="quote" variants={reveal}>
            &quot;Aprendiendo a volar más alto&quot; ✈️
          </motion.p>

          <motion.div className="scroll-cue" variants={reveal} aria-hidden="true">
            <span></span>
          </motion.div>
        </motion.div>
      </div>
    </header>
  );
}
