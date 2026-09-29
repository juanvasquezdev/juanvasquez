import Image from "next/image";
import ArrowUpRight from "./ArrowUpRight";
import Galeria from "./Galeria";
import Trayectoria, { type SeasonBest, type TrackRow } from "./Trayectoria";
import { OFFICIAL_PB } from "@/content/athletics";
import { INSTAGRAM_URL } from "@/content/profile";
import type { Athletics, Locale } from "@/content/types";
import type { Localized } from "@/lib/i18n";
import { formatDate, formatMark, formatPlace, yearOf } from "@/lib/format";

// Escala de las barras de "Mejor por temporada": 1,80 m es el piso y 2,10 m
// (la meta) el techo.
const SCALE_MIN = 1.8;
const SCALE_MAX = 2.1;

/**
 * La foto del salto queda fija y el panel sube por encima, igual que en el
 * hero. Todo se arma acá en el servidor; lo único client es la Trayectoria,
 * que recibe las filas ya formateadas.
 */
export default function Atleta({
  content,
  lang,
}: {
  content: Localized<Athletics>;
  lang: Locale;
}) {
  const { trackRecord } = content;

  const rows: TrackRow[] = trackRecord.results.map((result) => ({
    key: `${result.date}-${result.competition}`,
    year: yearOf(result.date),
    date: formatDate(result.date, lang),
    competition: result.competition,
    venue: result.venue,
    place: formatPlace(result.place),
    podium: result.place <= 3,
    mark: formatMark(result.mark, lang),
    pb: result.mark === OFFICIAL_PB,
  }));

  // La mejor de cada año, del más viejo al más nuevo para que las barras suban
  // hacia la derecha.
  const years = [...new Set(trackRecord.results.map((r) => yearOf(r.date)))].sort((a, b) => a - b);
  const seasons: SeasonBest[] = years.map((year) => {
    const best = trackRecord.results
      .filter((r) => yearOf(r.date) === year)
      .reduce((a, b) => (b.mark > a.mark ? b : a));
    return {
      year,
      mark: formatMark(best.mark, lang),
      competition: best.competition,
      height: Math.round(((best.mark - SCALE_MIN) / (SCALE_MAX - SCALE_MIN)) * 100),
      pb: best.mark === OFFICIAL_PB,
    };
  });

  return (
    <section className="athlete-stage" id="atleta" aria-labelledby="atleta-title">
      <div className="ath-bg">
        <div className="hero-media">
          <Image src={content.image.src} alt={content.image.alt} fill sizes="100vw" />
        </div>
        <div className="hero-shade" />
        <div className="ath-title">
          <p className="mono eyebrow sec-num">{content.eyebrow}</p>
          <h2 className="big" id="atleta-title">
            {content.heading}
          </h2>
        </div>
      </div>

      <div className="ath-over">
        <div className="section ath-body">
          <div className="wrap">
            <p className="ath-intro">{content.intro}</p>

            <div className="stats">
              {content.stats.map((stat) => (
                <div className="stat" key={stat.label}>
                  <div className="stat-v">{formatMark(stat.mark, lang)}</div>
                  <div className="stat-l mono">{stat.label}</div>
                  <span className={stat.official ? "stat-tag ok" : "stat-tag"}>{stat.tag}</span>
                </div>
              ))}
            </div>

            <a
              className="wa-card"
              href={content.worldAthletics.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="l">
                <span className="t">{content.worldAthletics.label}</span>
                <span className="u mono">worldathletics.org · ID {content.worldAthletics.id}</span>
              </span>
              <ArrowUpRight />
            </a>

            <Trayectoria
              labels={{
                eyebrow: trackRecord.eyebrow,
                heading: trackRecord.heading,
                all: trackRecord.filters.all,
                best: trackRecord.filters.best,
                columns: trackRecord.columns,
              }}
              rows={rows}
              seasons={seasons}
            />
            <p className="mono traj-source">{trackRecord.source}</p>

            <div className="ach">
              <div>
                <h3 className="group-title mono">{content.achievementsLabel}</h3>
                <ul>
                  {content.achievements.map((achievement) => (
                    <li key={achievement.title}>
                      <span>{achievement.title}</span>
                      <span className="m mono">
                        {achievement.mark
                          ? `${achievement.year} · ${formatMark(achievement.mark, lang)}`
                          : achievement.year}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="group-title mono">{content.affiliationsLabel}</h3>
                <ul>
                  {content.affiliations.map((affiliation) => (
                    <li key={affiliation.name}>
                      <span>{affiliation.name}</span>
                      <span className="m mono">{affiliation.note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <Galeria label={content.galleryLabel} photos={content.gallery} />

          <div className="wrap">
            <a
              className="ig-link mono"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.instagramMore}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
