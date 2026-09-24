"use client";

import { useState } from "react";
import Image from "next/image";
import Reveal from "./Reveal";
import type { Profile } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/** Lo que Sobre Mí lee de `content/profile.ts`, ya en el idioma de la ruta. */
export type SobreMiContent = Pick<Localized<Profile>, "about" | "photo" | "bio">;

export default function SobreMi({ content }: { content: SobreMiContent }) {
  const [broken, setBroken] = useState(false);

  return (
    <section className="section" id="sobre-mi">
      <Reveal as="p" className="eyebrow">
        {content.about.eyebrow}
      </Reveal>
      <Reveal as="h2" index={1}>
        {content.about.heading}
      </Reveal>

      <div className="sobre-mi-grid">
        {!broken && (
          <Reveal className="sobre-mi-photo" index={2}>
            <Image
              src={content.photo.src}
              alt={content.photo.alt}
              fill
              sizes="(max-width: 700px) 280px, 300px"
              onError={() => setBroken(true)}
            />
          </Reveal>
        )}

        <Reveal className="card card-wide" index={3}>
          <p>{content.bio}</p>
        </Reveal>
      </div>
    </section>
  );
}
