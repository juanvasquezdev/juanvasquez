import { test, expect } from "@playwright/test";
import { VIEWPORT_HEIGHT } from "./support/widths";
import { assertPageIsFunctional } from "./support/guards";

/**
 * Regresión: las etiquetas de los marcadores de "La Barra" (.marker-label)
 * llegaron a solaparse entre 769 y 959px — una banda que ninguno de los 7
 * anchos obligatorios de la suite (360/390/418/650/768/1024/1440) toca: 768
 * pasa porque ahí activa una media query, 1024 pasa porque ya hay lugar de
 * sobra. El defecto vivía entero en el hueco entre dos anchos "cómodos" de
 * medir — ver tests/support/widths.ts para la razón de ser de 418 y 650 con
 * N1, mismo patrón acá.
 *
 * La prueba mide el SÍNTOMA (dos cajas de .marker-label que se pisan en el
 * plano, en 2D — no solo el eje horizontal, porque el escalonado de filas
 * las separa en el eje vertical y ahí NO hay overlap real aunque se crucen
 * en X) y no la PERILLA (--marker-label-w: 150px, el breakpoint de 979px,
 * cuántas filas hay). Si mañana cambia el ancho de la etiqueta o dónde cae
 * el escalonado, esta prueba se sigue preguntando lo mismo: ¿hay glifos
 * encimados?, sin que haga falta tocarla.
 *
 * No hace falta scrollear la sección a la vista: .bar-chart no está detrás
 * de un Reveal (solo el eyebrow/h2/intro de arriba lo están), así que su
 * layout es el mismo esté o no en pantalla — getBoundingClientRect() da
 * coordenadas de viewport válidas igual.
 */
const OVERLAP_WIDTHS = [
  700, 720, 740, 760, 769, 780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880, 890, 900, 910,
  920, 930, 940, 950, 959, 960, 970, 979, 980, 990, 1000, 1024,
];

type Box = { left: number; right: number; top: number; bottom: number; text: string };

function boxesOverlap(a: Box, b: Box) {
  // Overlap real en 2D: los rangos horizontales Y verticales tienen que
  // intersectar los dos. Dos etiquetas en filas distintas pueden compartir
  // rango horizontal sin pisarse — eso es el escalonado funcionando, no un
  // defecto.
  return a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
}

for (const width of OVERLAP_WIDTHS) {
  test(`las etiquetas de .marker-label no se pisan a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
    await page.goto("/");
    await assertPageIsFunctional(page);

    const boxes: Box[] = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("#progresion .marker-label")).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          left: r.left,
          right: r.right,
          top: r.top,
          bottom: r.bottom,
          text: el.textContent?.trim() ?? "",
        };
      });
    });

    expect(boxes.length, "no se encontró ninguna .marker-label en #progresion").toBeGreaterThan(0);

    const overlaps: { a: Box; b: Box }[] = [];
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        if (boxesOverlap(boxes[i], boxes[j])) {
          overlaps.push({ a: boxes[i], b: boxes[j] });
        }
      }
    }

    expect(
      overlaps,
      `etiquetas de .marker-label encimadas a ${width}px:\n${JSON.stringify(overlaps, null, 2)}`
    ).toEqual([]);
  });
}
