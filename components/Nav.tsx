"use client";

import { useMemo } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";
import LangToggle from "./LangToggle";
import ThemeToggle from "./ThemeToggle";
import type { Locale, UI } from "@/content/types";
import type { Localized } from "@/lib/i18n";

type Labels = Pick<
  Localized<UI>,
  "navLabel" | "nav" | "homeLabel" | "langLabel" | "themeToLight" | "themeToDark"
>;

/**
 * Pill flotante arriba al centro: la marca "JV", los links a las secciones y
 * los toggles de idioma y tema. En móvil los links se esconden por CSS y
 * quedan la marca y los toggles.
 */
export default function Nav({ lang, labels }: { lang: Locale; labels: Labels }) {
  // useMemo y no un map suelto: useActiveSection rearma su IntersectionObserver
  // cada vez que cambia la identidad del array.
  const ids = useMemo(() => labels.nav.map((link) => link.id), [labels.nav]);
  const activeId = useActiveSection(ids);

  return (
    <header className="nav">
      <a className="mark" href="#top" aria-label={labels.homeLabel}>
        JV
      </a>
      <nav className="navlinks" aria-label={labels.navLabel}>
        {labels.nav.map((link) => {
          const active = link.id === activeId;
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={active ? "active" : undefined}
              aria-current={active ? "true" : undefined}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
      <LangToggle lang={lang} label={labels.langLabel} />
      <ThemeToggle toLight={labels.themeToLight} toDark={labels.themeToDark} />
    </header>
  );
}
