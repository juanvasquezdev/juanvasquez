import type { Tools } from "@/content/types";
import type { Localized } from "@/lib/i18n";

const GITHUB_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3.1-.4 6.4-1.5 6.4-7A5.4 5.4 0 0 0 20 4.8 5 5 0 0 0 19.9 1S18.7.6 16 2.5a13.4 13.4 0 0 0-7 0C6.3.6 5.1 1 5.1 1A5 5 0 0 0 5 4.8a5.4 5.4 0 0 0-1.5 3.7c0 5.5 3.3 6.6 6.4 7a3.4 3.4 0 0 0-.9 2.6V22" />
  </svg>
);

/**
 * Proyectos chicos de código abierto. Recibe solo los que ya tienen repo
 * publicado; si no hay ninguno, app/[lang]/page.tsx no la monta (ni su link
 * en el nav).
 */
export default function Herramientas({ content }: { content: Localized<Tools> }) {
  return (
    <section className="section tools-section" id="herramientas">
      <div className="wrap">
        <div className="tools-head">
          <div>
            <p className="mono eyebrow sec-num" data-reveal>{content.eyebrow}</p>
            <h2 className="h2 h2-sm" data-reveal>
              {content.heading}
            </h2>
          </div>
          <p className="intro">{content.intro}</p>
        </div>

        <ul className="tools">
          {content.items.map((tool) => (
            <li key={tool.repoUrl}>
              <a className="tool" href={tool.repoUrl} target="_blank" rel="noopener noreferrer">
                <span className="mono tool-kind">{tool.kind}</span>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
                <span className="gh mono">
                  {GITHUB_ICON}
                  {content.cta}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
