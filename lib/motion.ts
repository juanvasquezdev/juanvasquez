/** Mismo timing que --ease en globals.css (cubic-bezier(0.16, 1, 0.3, 1)). */
export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Variants para un elemento "reveal" (equivalente a .reveal/.reveal.is-visible
 * + el IntersectionObserver que tenía useScrollReveal). Se usa solo (con
 * initial/whileInView/viewport propios) o como hijo de staggerContainer
 * (ahí solo necesita `variants={reveal}`, hereda hidden/visible del padre).
 */
export const reveal = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Mismos thresholds que el IntersectionObserver que tenía useScrollReveal. */
export const revealViewport = { once: true, amount: 0.15, margin: "0px 0px -40px 0px" } as const;

/** Parent con hijos en variants={reveal}: stagger de 80ms, igual que el (index % 4) * 80 original. */
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
