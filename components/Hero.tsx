import Image from "next/image";
import type { Profile } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * TEMPORAL: adaptado al contenido v2 con los estilos viejos (app/legacy.css)
 * para que la página siga armada. En la Fase 3 se reescribe con el diseño
 * del mockup (foto sticky y el panel que sube).
 */
export default function Hero({ content }: { content: Localized<Profile["hero"]> }) {
  return (
    <header id="inicio" className="hero-pin" style={{ position: "relative" }}>
      <div className="hero-images">
        <div className="hero-img-layer">
          <Image
            src={content.image.src}
            alt={content.image.alt}
            fill
            sizes="100vw"
            priority
            fetchPriority="high"
          />
        </div>
      </div>
      <div className="hero-overlay"></div>
      <div className="hero">
        <p className="hero-eyebrow">{content.eyebrow}</p>
        <h1>{content.nameLines.join(" ")}</h1>
        <h2>{content.tags.join(" / ")}</h2>
      </div>
    </header>
  );
}
