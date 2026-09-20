/** Mismo timing que --ease en globals.css (cubic-bezier(0.16, 1, 0.3, 1)). */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Separación entre hermanos de una lista, igual que el (index % 4) * 80ms original. */
export const STAGGER_STEP = 0.08;

/**
 * Variants del reveal.
 *
 * `hidden` va con duración 0 a propósito: no es un estado al que se anime, es
 * el estado desde el que se arranca. Reveal lo aplica recién después de
 * hidratar y solo sobre lo que quedó debajo del pliegue, así que nadie llega a
 * ver el bloque "escondiéndose".
 *
 * `visible` es función para poder recibir la posición en la lista por `custom`
 * y reproducir el stagger que antes hacía staggerContainer desde el padre.
 */
export const reveal = {
  hidden: { opacity: 0, y: 30, transition: { duration: 0 } },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: index * STAGGER_STEP },
  }),
};

/** Mismos thresholds que tenía el IntersectionObserver de useScrollReveal. */
export const revealViewport = { once: true, amount: 0.15, margin: "0px 0px -40px 0px" } as const;
