"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** useLayoutEffect chilla en el render del servidor; en el navegador siempre es el de layout. */
const useBeforePaint = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * ¿Este bloque quedó debajo del pliegue cuando la página terminó de hidratar?
 *
 * Es la base de la regla que sigue el sitio: el HTML que manda el servidor es
 * siempre el estado final visible, y recién después de hidratar escondo (o
 * reinicio) lo que nadie está viendo todavía, para poder animarlo cuando entre.
 * Lo que ya está en pantalla se queda como llegó — no se anima, no parpadea y
 * no retrasa el LCP.
 *
 * Antes cada sección montaba con initial="hidden" y el HTML salía del servidor
 * con opacity:0, incluido el <h1>: sin JS o con JS lento la página se veía en
 * blanco.
 *
 * La medición va en useLayoutEffect a propósito: corre antes del primer paint,
 * así que el cambio de estado no alcanza a verse.
 */
export function useBelowFold<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [belowFold, setBelowFold] = useState(false);

  useBeforePaint(() => {
    const el = ref.current;
    if (!el) return;
    setBelowFold(el.getBoundingClientRect().top > window.innerHeight);
  }, []);

  return [ref, belowFold] as const;
}
