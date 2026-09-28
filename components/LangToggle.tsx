"use client";

import { LOCALES, type Locale } from "@/content/types";

/**
 * ES | EN. Son links de verdad a /es y /en (funcionan sin JS y se pueden abrir
 * en otra pestaña); el click solo les suma el #hash de la URL actual para que
 * al cambiar de idioma se quede en la misma sección.
 */
export default function LangToggle({ lang, label }: { lang: Locale; label: string }) {
  const keepHash = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/Cmd/Shift-click o click del medio: que el navegador haga lo suyo.
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    window.location.assign(e.currentTarget.pathname + window.location.hash);
  };

  return (
    <div className="seg" role="group" aria-label={label}>
      {LOCALES.map((locale) => {
        const active = locale === lang;
        return (
          <a
            key={locale}
            href={`/${locale}`}
            hrefLang={locale}
            lang={locale}
            className={`seg-btn${active ? " on" : ""}`}
            aria-current={active ? "page" : undefined}
            onClick={active ? undefined : keepHash}
          >
            {locale.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}
