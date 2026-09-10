"use client";

import { useEffect } from "react";

/** Anima el llenado de "La Barra" al entrar en viewport. */
export function useBarChart() {
  useEffect(() => {
    const chart = document.getElementById("barChart");
    const fill = document.getElementById("barFill");
    if (!chart || !fill) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fill.style.width = "100%";
            chart.classList.add("filled");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(chart);
    return () => observer.disconnect();
  }, []);
}
