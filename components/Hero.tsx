import { Fragment } from "react";
import Image from "next/image";
import type { Profile } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * La foto a pantalla completa queda fija (sticky) y lo que va en `children`
 * sube por encima como un panel con las esquinas redondeadas. Por eso Sobre mí
 * entra acá adentro y no como hermano: el sticky dura lo que dura .stage.
 *
 * La foto va en .hero-media y no directo en .hero: next/image con fill pide un
 * padre relative/absolute/fixed, y .hero es sticky.
 */
export default function Hero({
  content,
  children,
}: {
  content: Localized<Profile["hero"]>;
  children: React.ReactNode;
}) {
  return (
    <div className="stage" id="top">
      <section className="hero" aria-labelledby="hero-name">
        <div className="hero-media">
          <Image
            className="hero-img"
            src={content.image.src}
            alt={content.image.alt}
            fill
            sizes="100vw"
            preload
          />
        </div>
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="mono eyebrow">{content.eyebrow}</p>
          <h1 className="hero-name" id="hero-name">
            {content.nameLines.map((line, i) => (
              <Fragment key={line}>
                {i > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </h1>
          <div className="hero-meta">
            <p className="hero-tag">
              {content.tags.map((tag, i) => (
                <Fragment key={tag}>
                  {i > 0 && (
                    <span className="sep" aria-hidden="true">
                      /
                    </span>
                  )}
                  {tag}
                </Fragment>
              ))}
            </p>
            <span className="cue mono" aria-hidden="true">
              <span className="cue-line" />
              {content.scrollCue}
            </span>
          </div>
        </div>
      </section>

      <div className="over">{children}</div>
    </div>
  );
}
