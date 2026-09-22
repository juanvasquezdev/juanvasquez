/**
 * Anchos obligatorios de la suite base (ver .claude/agents/tester.md).
 * 418 y 650 no son opcionales: ahí se midió el defecto N1 (imagen 0×0).
 */
export const WIDTHS = [360, 390, 418, 650, 768, 1024, 1440] as const;

export const VIEWPORT_HEIGHT = 900;

type EvaluablePage = {
  evaluate: <T>(fn: (arg: T) => unknown, arg?: T) => Promise<unknown>;
};

/**
 * Scrollea a `y` y espera a que el navegador haya RENDERIZADO esa posición
 * antes de devolver el control — no un número fijo de ms.
 *
 * Antes esto esperaba un `setTimeout` fijo (70ms) entre paradas. Eso
 * TELETRANSPORTA en WebKit: `setTimeout` no garantiza que haya habido un
 * render real de por medio, y bajo contención (varios workers/páginas
 * corriendo a la vez, que es exactamente cómo corre esta suite) WebKit no
 * llega a pintar cada parada antes de que el bucle salte a la siguiente —
 * la posición nunca se renderiza, y el IntersectionObserver de los <Reveal>
 * nunca la ve. Medido con contención real (T1c, script ad-hoc de 16 páginas
 * de WebKit en paralelo, ~7fps cada una): el `setTimeout(70)` viejo
 * coalescía 59 de 224 paradas (nunca llegaban a pintarse); el
 * doble-`requestAnimationFrame` de abajo coalescía 0 de 224. La técnica:
 * rAF se agenda "antes del próximo repintado", así que encadenar dos
 * garantiza que se cruzó un límite de frame completo (el primero agenda
 * el repintado con el scroll ya aplicado, el segundo confirma que ese
 * frame ya arrancó) — determinístico sin importar el fps real, a
 * diferencia de cualquier número de ms fijo. **No subir un timeout fijo en
 * su lugar**: 120ms medido peor que 70ms (10/10 de reproducción del defecto
 * contra 8/10) y 200ms funcionaba por fase, no por margen — un número mágico
 * más alto pone la suite en verde sin arreglar el mecanismo.
 *
 * Exportado (no solo interno de `scrollThroughPage`) porque
 * tests/g-reduced-motion.spec.ts necesita revisar el contenido EN CADA
 * parada, no solo recorrerlas — reusa este mismo mecanismo por parada en vez
 * de duplicar la lógica del doble rAF.
 */
export async function scrollToAndWaitForRender(page: EvaluablePage, y: number) {
  await page.evaluate((yy) => {
    window.scrollTo(0, yy);
    return new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
  }, y);
}

/**
 * Recorre toda la página en pasos de un viewport, garantizando un render real
 * en cada parada (ver `scrollToAndWaitForRender`), y vuelve arriba. Sirve
 * para: (a) forzar que next/image cargue las imágenes con loading="lazy" que
 * están debajo del pliegue, y (b) que cada Reveal debajo del pliegue (ver
 * hooks/useBelowFold.ts) entre en pantalla y dispare su animación — sin
 * esto, probar "imágenes que no son 0×0" o "contenido que se lee con reduced
 * motion" solo cubriría el primer viewport.
 */
export async function scrollThroughPage(page: EvaluablePage) {
  const step = (await page.evaluate(() => window.innerHeight || 800)) as number;
  const max = (await page.evaluate(() => document.body.scrollHeight)) as number;

  for (let y = 0; y <= max; y += step) {
    await scrollToAndWaitForRender(page, y);
  }
  await scrollToAndWaitForRender(page, 0);
}
