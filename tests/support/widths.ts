/**
 * Anchos obligatorios de la suite base (ver .claude/agents/tester.md).
 * 418 y 650 no son opcionales: ahí se midió el defecto N1 (imagen 0×0).
 */
export const WIDTHS = [360, 390, 418, 650, 768, 1024, 1440] as const;

export const VIEWPORT_HEIGHT = 900;

/**
 * Recorre toda la página en pasos de un viewport, esperando un poco en cada
 * parada, y vuelve arriba. Sirve para: (a) forzar que next/image cargue las
 * imágenes con loading="lazy" que están debajo del pliegue, y (b) que cada
 * Reveal debajo del pliegue (ver hooks/useBelowFold.ts) entre en pantalla y
 * dispare su animación — sin esto, probar "imágenes que no son 0×0" o
 * "contenido que se lee con reduced motion" solo cubriría el primer viewport.
 */
export async function scrollThroughPage(page: {
  evaluate: <T>(fn: (arg: T) => unknown, arg?: T) => Promise<unknown>;
}) {
  await page.evaluate(async () => {
    const step = window.innerHeight || 800;
    const max = document.body.scrollHeight;
    for (let y = 0; y <= max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 70));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 70));
  });
}
