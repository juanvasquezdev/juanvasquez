import type { Stack as StackData } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * Dos columnas de filas: lo que uso hoy (punto lleno) y lo que sigue (punto
 * hueco). El nivel va por grupo, así que se repite en cada fila del grupo.
 */
export default function Stack({ content }: { content: Localized<StackData> }) {
  return (
    <section className="section" id="stack">
      <div className="wrap">
        <p className="mono eyebrow sec-num">{content.eyebrow}</p>
        <h2 className="h2">{content.heading}</h2>
        <p className="intro stack-intro">{content.intro}</p>

        <div className="stack-grid">
          {content.groups.map((group) => (
            <div key={group.title}>
              <h3 className="group-title mono">
                <span
                  className={group.level === "deep" ? "dot" : "dot soft"}
                  aria-hidden="true"
                />
                {group.title}
              </h3>
              <ul className="rows">
                {group.items.map((item) => (
                  <li className="row" key={item}>
                    <span className="row-name">{item}</span>
                    <span className={group.level === "deep" ? "lvl up mono" : "lvl mono"}>
                      {content.levels[group.level]}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="chip-row practices">
          <p className="mono chip-row-label">{content.practicesLabel}</p>
          <ul className="chip-list">
            {content.practices.map((practice) => (
              <li className="chip" key={practice}>
                {practice}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
