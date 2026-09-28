"use client";

import Image from "next/image";
import Reveal from "./Reveal";
import type { GalleryPhoto } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/** TEMPORAL: contenido v2 con los estilos viejos; en la Fase 3 pasa a marquee. */
export default function Galeria({
  label,
  photos,
}: {
  label: string;
  photos: Localized<GalleryPhoto>[];
}) {
  return (
    <section className="section" id="galeria">
      <Reveal as="h2">{label}</Reveal>

      <div className="galeria">
        {photos.map((photo, i) => (
          <Reveal className="galeria-item" index={i} key={photo.src}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 100vw, 50vw" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
