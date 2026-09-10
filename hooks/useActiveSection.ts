"use client";

import { useEffect, useState } from "react";

/**
 * Scrollspy: qué sección está visible ahora mismo. Sigue usando
 * IntersectionObserver por su cuenta (no hay reemplazo de Motion para esto:
 * useInView de Motion observa un elemento a la vez, y esto necesita comparar
 * varias secciones a la vez para decidir cuál está "activa") — lo que cambió
 * es que ya no manipula el DOM directamente (querySelectorAll + classList),
 * ahora devuelve el id activo como estado de React para que quien lo consuma
 * (Nav) lo use en su render.
 */
export function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { threshold: 0.4, rootMargin: "-80px 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
