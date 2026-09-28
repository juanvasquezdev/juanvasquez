import type { Profile } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/** Seis tarjetas de cómo trabajo y, abajo, los idiomas. El "01" sale de la posición. */
export default function Habilidades({ content }: { content: Localized<Profile["skills"]> }) {
  return (
    <section className="section skills-section" id="habilidades">
      <div className="wrap">
        <p className="mono eyebrow">{content.eyebrow}</p>
        <h2 className="h2">{content.heading}</h2>

        <ul className="skills">
          {content.items.map((skill, i) => (
            <li className="skill" key={skill.title}>
              <span className="n mono" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{skill.title}</h3>
              <p>{skill.text}</p>
            </li>
          ))}
        </ul>

        <div className="langs">
          <p className="mono langs-label">{content.languagesLabel}</p>
          <ul className="langs-list">
            {content.languages.map((lang) => (
              <li className="chip" key={lang.name}>
                {lang.name}{" "}
                <span className={lang.improving ? "lvl up" : "lvl"}>{lang.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
