"use client";

import { useMemo } from "react";
import { useLenis } from "lenis/react";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { UI } from "@/content/types";
import type { Localized } from "@/lib/i18n";

/**
 * Pill flotante con 6 links "de alto nivel" en vez de un link por cada una
 * de las 11 secciones reales — "Deportivo" agrupa Progresión/Galería/Logros/
 * Formación/Técnica/Metas (el bloque completo de la narrativa del salto) y
 * hace scroll a la primera; se enciende como activo si cualquiera de esas
 * secciones está en pantalla. Decisión tomada así para que el pill se vea
 * limpio en vez de una fila de 11 palabras — no estaba literalmente pedido,
 * pero once links de texto no entraban en un pill sin verse denso.
 */
export default function Nav({
  label,
  links,
}: {
  label: string;
  links: Localized<UI["nav"]>;
}) {
  // useMemo y no un cálculo suelto: useActiveSection rearma su
  // IntersectionObserver cada vez que cambia la identidad del array, y un
  // flatMap en cada render le daría un array nuevo en cada render.
  const allIds = useMemo(() => links.flatMap((link) => link.sectionIds), [links]);
  const activeId = useActiveSection(allIds);
  const lenis = useLenis();

  const goTo = (id: string) => (e: React.MouseEvent) => {
    // Sin Lenis (prefers-reduced-motion) se deja el <a href="#id"> nativo:
    // salto instantáneo, sin animación — es lo correcto para ese caso.
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo(`#${id}`);
    }
  };

  return (
    <nav className="nav-pill" aria-label={label}>
      {links.map((link) => {
        const active = activeId !== null && link.sectionIds.includes(activeId);
        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            className={`nav-pill-link${active ? " active" : ""}`}
            // El estado activo era solo visual: quien navega con lector de
            // pantalla no tenía forma de saber en qué sección está.
            aria-current={active ? "true" : undefined}
            onClick={goTo(link.id)}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
