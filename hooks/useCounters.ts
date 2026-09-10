"use client";

import { useEffect } from "react";

/** Contador animado en las stats del hero (lee data-count / data-decimals). */
export function useCounters() {
  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>("[data-count]");
    if (!counters.length) return;

    const animateCounter = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.count!);
      const decimals = parseInt(el.dataset.decimals || "0", 10);
      const duration = 1400;
      const start = performance.now();

      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = target * eased;
        el.textContent = value.toFixed(decimals);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(decimals);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);
}
