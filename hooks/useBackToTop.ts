"use client";

import { useEffect } from "react";

/** Botón volver arriba: visible + focuseable solo después de 600px de scroll. */
export function useBackToTop() {
  useEffect(() => {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    const onScroll = () => {
      const isVisible = window.scrollY > 600;
      btn.classList.toggle("visible", isVisible);
      btn.tabIndex = isVisible ? 0 : -1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onClick = () => window.scrollTo({ top: 0, behavior: "smooth" });
    btn.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      btn.removeEventListener("click", onClick);
    };
  }, []);
}
