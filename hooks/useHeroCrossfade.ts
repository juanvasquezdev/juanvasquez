"use client";

import { useEffect } from "react";

/** Hero: las fotos se cruzan (crossfade) mientras se hace scroll. */
export function useHeroCrossfade() {
  useEffect(() => {
    const container = document.querySelector<HTMLElement>(".hero-scroll");
    const layers = document.querySelectorAll<HTMLElement>(".hero-img-layer");
    if (!container || !layers.length) return;

    // La primera capa siempre visible al cargar, sin esperar al primer scroll
    layers[0].style.opacity = "1";

    let ticking = false;

    const update = () => {
      ticking = false;
      const rect = container.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;

      // progreso de 0 a 1 dentro de la sección pineada
      let progress = -rect.top / scrollable;
      progress = Math.min(Math.max(progress, 0), 1);

      // posición "flotante" entre capas: 0 = capa 0, (n-1) = última capa
      const floatIndex = progress * (layers.length - 1);

      layers.forEach((layer, i) => {
        const distance = Math.abs(floatIndex - i);
        const opacity = Math.max(1 - distance, 0);
        layer.style.opacity = opacity.toFixed(3);
      });
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}
