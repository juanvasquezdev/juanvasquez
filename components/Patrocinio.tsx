import Image from "next/image";
import ArrowUpRight from "./ArrowUpRight";
import { EMAIL, INSTAGRAM_URL, INSTAGRAM_USER, PROFILE } from "@/content/profile";
import type { Athletics } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * Texto con tres puntos y un mail directo, y al lado una vista previa de mi
 * Instagram hecha con mis fotos locales. Nada de la API ni de embeds de
 * Instagram: rompen la CSP y traen scripts de terceros. Toda la tarjeta es un
 * solo enlace al perfil.
 */
export default function Patrocinio({
  content,
}: {
  content: Localized<Athletics["sponsorship"]>;
}) {
  const mailto = `mailto:${EMAIL}?subject=${encodeURIComponent(content.mailSubject)}`;

  return (
    <section className="section sponsor-section" id="patrocinio">
      <div className="wrap">
        <div className="sponsor" data-reveal>
          <div>
            <p className="mono eyebrow">{content.eyebrow}</p>
            <h2 className="h2">{content.heading}</h2>
            <p className="intro">{content.intro}</p>
            <ul>
              {content.points.map((point, i) => (
                <li key={point}>
                  <span className="n" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <a className="cta" href={mailto}>
              {content.cta}
              <ArrowUpRight size={18} />
            </a>
          </div>

          <a
            className="ig"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={content.instagram.ariaLabel}
          >
            <span className="ig-head">
              <span className="ig-av">
                <Image src={PROFILE.about.portrait.src} alt="" fill sizes="48px" />
              </span>
              <span className="ig-name">
                <b>@{INSTAGRAM_USER}</b>
                <span>{content.instagram.bio}</span>
              </span>
              <span className="ig-follow">{content.instagram.follow}</span>
            </span>
            <span className="ig-grid">
              {content.instagram.grid.map((src) => (
                <span className="ig-cell" key={src}>
                  <Image src={src} alt="" fill sizes="(max-width: 860px) 33vw, 160px" />
                </span>
              ))}
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
