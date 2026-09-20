"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";

const ITEMS = [
  { src: "/images/pb2.04.jpeg", alt: "Salto de 2.04m en competencia", icon: "📸", label: "Salto 2.04 m" },
  { src: "/images/podio_u23.jpeg", alt: "Podio en categoría U23", icon: "🥇", label: "Podio U23" },
  { src: "/images/podio-mayores.jpeg", alt: "Podio categoría Mayores", icon: "🏅", label: "Podio Mayores" },
  { src: "/images/u18.jpeg", alt: "Competencia categoría U18", icon: "🏃", label: "Competencia U18" },
  { src: "/images/salto2.jpeg", alt: "Salto de altura en competencia", icon: "🤸", label: "En el aire" },
  {
    src: "/images/foto_saltoperu1.jpeg",
    alt: "Competencia internacional en Perú",
    icon: "🌎",
    label: "Legado Lima 2019",
  },
  { src: "/images/epica_trasera.jpeg", alt: "Celebración tras una marca", icon: "🙌", label: "Celebración" },
];

function GaleriaItem({ src, alt, icon, label, index }: (typeof ITEMS)[number] & { index: number }) {
  const [broken, setBroken] = useState(false);
  return (
    <Reveal className="galeria-item" index={index}>
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
    </Reveal>
  );
}

export default function Galeria() {
  return (
    <section className="section" id="galeria">
      <Reveal as="p" className="eyebrow">
        06 — Momentos
      </Reveal>
      <Reveal as="h2" index={1}>
        Galería
      </Reveal>

      <div className="galeria">
        {ITEMS.map((item, i) => (
          <GaleriaItem key={item.src} {...item} index={i} />
        ))}
      </div>
    </section>
  );
}
