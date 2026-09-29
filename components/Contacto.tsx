import ArrowUpRight from "./ArrowUpRight";
import type { Profile } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/** Una fila grande por canal; al pasar el mouse la fila se pinta y la flecha se corre. */
export default function Contacto({ content }: { content: Localized<Profile["contact"]> }) {
  return (
    <section className="section contact-section" id="contacto">
      <div className="wrap">
        <p className="mono eyebrow sec-num">{content.eyebrow}</p>
        <h2 className="h2 contact-title">{content.heading}</h2>
        <p className="intro">{content.intro}</p>

        <ul className="contact-list">
          {content.links.map((link) => (
            <li key={link.id}>
              <a
                className="c-row"
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <span>{link.label}</span>
                <span className="v mono">
                  {link.value}
                  <ArrowUpRight size={20} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
