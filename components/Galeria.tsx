import Image from "next/image";
import type { GalleryPhoto } from "@/content/types";
import type { Localized } from "@/lib/i18n";

// El ancho de .shot es clamp(240px, 26vw, 360px): 26vw vale 240 a los 923 px
// y 360 a los 1385 px.
const SHOT_SIZES = "(max-width: 923px) 240px, (max-width: 1385px) 26vw, 360px";

/**
 * Galería que se mueve sola, solo con CSS: la lista va dos veces seguidas y la
 * pista se corre exactamente una lista, así el bucle no tiene salto. La copia
 * es aria-hidden para que un lector de pantalla no la lea dos veces.
 *
 * Con movimiento reducido la pista queda quieta, la copia se esconde y la
 * galería se recorre con scroll horizontal (ver globals.css).
 */
export default function Galeria({
  label,
  photos,
}: {
  label: string;
  photos: Localized<GalleryPhoto>[];
}) {
  const list = (copy: boolean) => (
    <ul className="shots" aria-hidden={copy || undefined}>
      {photos.map((photo) => (
        <li key={photo.src}>
          <figure className="shot">
            <div className="ph">
              <Image src={photo.src} alt={copy ? "" : photo.alt} fill sizes={SHOT_SIZES} />
            </div>
            <figcaption className="mono">{photo.caption}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="gallery">
      <div className="wrap">
        <p className="mono eyebrow gallery-label" id="galeria-label">
          {label}
        </p>
      </div>
      <div className="marquee" role="region" aria-labelledby="galeria-label" tabIndex={0}>
        <div className="track">
          {list(false)}
          {list(true)}
        </div>
      </div>
    </div>
  );
}
