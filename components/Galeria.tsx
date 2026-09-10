"use client";

import { useState } from "react";
import Image from "next/image";

const ITEMS = [
  { src: "/images/pb2.04.jpeg", alt: "Salto de 2.04m en competencia", icon: "📸", label: "Salto 2.04 m" },
  { src: "/images/podio_u23.jpeg", alt: "Podio en categoría U23", icon: "🥇", label: "Podio U23" },
  { src: "/images/podio-mayores.jpeg", alt: "Podio categoría Mayores", icon: "🏅", label: "Podio Mayores" },
  { src: "/images/u18.jpeg", alt: "Competencia categoría U18", icon: "🏃", label: "Competencia U18" },
];

function GaleriaItem({ src, alt, icon, label }: (typeof ITEMS)[number]) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="galeria-item reveal">
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
    </div>
  );
}

export default function Galeria() {
  return (
    <section className="section" id="galeria">
      <p className="eyebrow reveal">03 — Momentos</p>
      <h2 className="reveal">Galería</h2>

      <div className="galeria">
        {ITEMS.map((item) => (
          <GaleriaItem key={item.src} {...item} />
        ))}
      </div>
    </section>
  );
}
