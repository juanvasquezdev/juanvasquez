"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

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
      <Reveal as="p" className="eyebrow">
        05 — Momento épico
      </Reveal>
      <Reveal as="h2" index={1}>
        El instante antes de la barra
      </Reveal>
      <Reveal as="p" className="section-intro" index={2}>
        No siempre gana la marca — a veces gana el segundo exacto en que el cuerpo decide saltar.
      </Reveal>

      <div className="epico-strip">
        {FOTOS.map((foto, i) => (
          <Reveal index={i} key={foto.src}>
            <EpicoItem {...foto} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
