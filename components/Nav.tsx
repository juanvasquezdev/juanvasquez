"use client";

import { useLenis } from "lenis/react";
import { useActiveSection } from "@/hooks/useActiveSection";

/**
 * Pill flotante con 6 links "de alto nivel" en vez de un link por cada una
 * de las 11 secciones reales — "Deportivo" agrupa Progresión/Galería/Logros/
 * Formación/Técnica/Metas (el bloque completo de la narrativa del salto) y
 * hace scroll a la primera; se enciende como activo si cualquiera de esas
 * secciones está en pantalla. Decisión tomada así para que el pill se vea
 * limpio en vez de una fila de 11 palabras — no estaba literalmente pedido,
 * pero once links de texto no entraban en un pill sin verse denso.
 */
const LINKS = [
  { label: "Inicio", ids: ["inicio"] },
  { label: "Sobre mí", ids: ["sobre-mi"] },
  { label: "Stack", ids: ["stack"] },
  { label: "Proyectos", ids: ["proyectos"] },
  { label: "Deportivo", ids: ["progresion", "galeria", "logros", "formacion", "tecnica", "metas"] },
  { label: "Contacto", ids: ["contacto"] },
];

const ALL_IDS = LINKS.flatMap((link) => link.ids);

export default function Nav() {
  const activeId = useActiveSection(ALL_IDS);
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
    <nav className="nav-pill" aria-label="Navegación principal">
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={`#${link.ids[0]}`}
          className={`nav-pill-link${activeId && link.ids.includes(activeId) ? " active" : ""}`}
          onClick={goTo(link.ids[0])}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
