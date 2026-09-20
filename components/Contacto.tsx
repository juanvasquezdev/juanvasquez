"use client";

import Reveal from "./Reveal";
import { GITHUB_URL, SHOW_GITHUB_PROFILE } from "@/content/profile";

/**
 * El logo de GitHub no existe como emoji, y justo acabo de comprobar que los
 * emojis no son confiables como iconografía (la bandera del hero se veía como
 * "co" en Windows), así que este va como SVG. Los otros tres siguen en emoji
 * hasta que los cambie todos juntos.
 */
function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

const CONTACTS = [
  {
    href: "mailto:juanjosevasquez1313@gmail.com",
    icon: "📧",
    label: "Email",
    value: "juanjosevasquez1313@gmail.com",
    external: false,
  },
  ...(SHOW_GITHUB_PROFILE
    ? [
        {
          href: GITHUB_URL,
          icon: <GitHubMark />,
          label: "GitHub",
          value: "juanjosevasquez1313-ai",
          external: true,
        },
      ]
    : []),
  {
    href: "https://instagram.com/juanvasquezhj",
    icon: "📱",
    label: "Instagram",
    value: "@juanvasquezhj",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/juan-jos%C3%A9-vasquez-giraldo-93b25b304/",
    icon: "💼",
    label: "LinkedIn",
    value: "Juan José Vásquez Giraldo",
    external: true,
  },
];

export default function Contacto() {
  return (
    <section className="section section-dark" id="contacto">
      <Reveal as="p" className="eyebrow">
        11 — Hablemos
      </Reveal>
      <Reveal as="h2" index={1}>
        Contacto
      </Reveal>

      <div className="contact-grid">
        {CONTACTS.map((contact, i) => (
          <Reveal
            as="a"
            key={contact.href}
            href={contact.href}
            {...(contact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="contact-item"
            index={i}
          >
            <div className="contact-icon">{contact.icon}</div>
            <div className="contact-label">{contact.label}</div>
            <span className="contact-value">{contact.value}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
