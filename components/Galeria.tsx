"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import type { Athletics } from "@/content/types";
import type { Localized } from "@/lib/i18n";

type GaleriaPhoto = Localized<Athletics["gallery"]>["photos"][number];

function GaleriaItem({
  src,
  alt,
  fallbackIcon,
  fallbackLabel,
  index,
}: GaleriaPhoto & { index: number }) {
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
        <div className="ph-icon">{fallbackIcon}</div>
        <p>{fallbackLabel}</p>
      </div>
    </Reveal>
  );
}

export default function Galeria({ content }: { content: Localized<Athletics["gallery"]> }) {
  return (
    <section className="section" id="galeria">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>

      <div className="galeria">
        {content.photos.map((item, i) => (
          <GaleriaItem key={item.src} {...item} index={i} />
        ))}
      </div>
    </section>
  );
}
