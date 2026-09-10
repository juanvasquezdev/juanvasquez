"use client";

import { useState } from "react";
import Image from "next/image";

const LAYERS = [
  { src: "/images/podio_u23.jpeg", priority: true },
  { src: "/images/u18.jpeg", priority: false },
  // NUEVA — pendiente reemplazar este archivo por otra foto mía
  { src: "/images/hero-nueva.jpeg", priority: false },
];

function HeroLayer({ src, priority }: { src: string; priority: boolean }) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <Image
      className="hero-img-layer"
      src={src}
      alt=""
      fill
      sizes="100vw"
      priority={priority}
      onError={() => setBroken(true)}
    />
  );
}

export default function Hero() {
  return (
    <header id="inicio" className="hero-scroll">
      <div className="hero-pin">
        <div className="hero-images" id="heroImages" aria-hidden="true">
          {LAYERS.map((layer) => (
            <HeroLayer key={layer.src} {...layer} />
          ))}
        </div>

        <div className="hero-overlay"></div>

        <div className="hero">
          <p className="hero-eyebrow reveal">🇨🇴 Salto Alto · Atletismo</p>
          <h1 className="reveal">Juan José Vásquez Giraldo</h1>
          <h2 className="reveal">Aprendiendo a volar más alto</h2>

          <div className="stats reveal">
            <div className="stat-item">
              <div className="stat-value" data-count="2.06" data-decimals="2">
                0
              </div>
              <div className="stat-label">Marca Personal (m)</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" data-count="2.01" data-decimals="2">
                0
              </div>
              <div className="stat-label">Estatura (m)</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" data-count="19" data-decimals="0">
                0
              </div>
              <div className="stat-label">Años</div>
            </div>
          </div>

          <p className="quote reveal">&quot;Aprendiendo a volar más alto&quot; ✈️</p>

          <div className="scroll-cue reveal" aria-hidden="true">
            <span></span>
          </div>
        </div>
      </div>
    </header>
  );
}
