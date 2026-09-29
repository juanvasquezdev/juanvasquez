"use client";

import { useEffect, useState } from "react";

/**
 * Scrollspy: qué sección está visible ahora mismo. Un solo
 * IntersectionObserver para todas, porque hay que compararlas entre sí para
 * decidir cuál está "activa". No toca el DOM: devuelve el id activo como
 * estado de React y Nav lo usa en su render.
 *
 * El criterio es una banda fina en la mitad de la pantalla, no "¿se ve el 40%
 * de la sección?". Con el umbral por fracción el hero nunca se encendía: mide
 * 320vh (260vh en móvil), así que la porción visible máxima era ~13% y jamás
 * llegaba al 40% que se le pedía — "Inicio" no se marcaba activo nunca. Con la
 * banda gana la sección que la cruza, sin importar cuánto mida.
 */
export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const crossing = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) crossing.add(entry.target.id);
          else crossing.delete(entry.target.id);
        });

        // Si dos secciones cruzan la banda a la vez (una terminando y la otra
        // empezando), gana la de más arriba en el documento: es el orden en que
        // las va leyendo quien baja. Si no cruza ninguna —el final de la página,
        // donde el footer empuja a Contacto fuera de la banda— se deja el último
        // id activo en vez de apagar el nav.
        const first = ids.find((id) => crossing.has(id));
        if (first) setActiveId(first);
      },
      { threshold: 0, rootMargin: "-45% 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
