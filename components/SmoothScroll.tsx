"use client";

import { useState } from "react";
import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Lenis solo se activa si el usuario no pidió reducir movimiento (no tiene
 * awareness de prefers-reduced-motion por su cuenta, a diferencia de Motion).
 * `MotionConfig reducedMotion="user"` sí cubre automáticamente todas las
 * animaciones de motion.* de los componentes hijos.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reducedMotion] = useState(prefersReducedMotion);

  return (
    <MotionConfig reducedMotion="user">
      {reducedMotion ? children : <ReactLenis root>{children}</ReactLenis>}
    </MotionConfig>
  );
}
