"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import type { Athletics, Photo } from "@/content/types";
import type { Localized } from "@/lib/i18n";

function EpicoItem({ src, alt }: Localized<Photo>) {
  const [broken, setBroken] = useState(false);
  if (broken) return null;
  return (
    <div className="epico-item">
      <Image src={src} alt={alt} fill sizes="(max-width: 700px) 100vw, 33vw" onError={() => setBroken(true)} />
    </div>
  );
}

export default function MomentoEpico({ content }: { content: Localized<Athletics["epicMoment"]> }) {
  return (
    <section className="section section-dark" id="epico">
      <Reveal as="p" className="eyebrow">
        {content.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.heading}
      </Reveal>
      <Reveal as="p" className="section-intro" index={2}>
        {content.intro}
      </Reveal>

      <div className="epico-strip">
        {content.photos.map((foto, i) => (
          <Reveal index={i} key={foto.src}>
            <EpicoItem {...foto} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
