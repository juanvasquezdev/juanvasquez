import { test, expect } from "@playwright/test";
import { WIDTHS, VIEWPORT_HEIGHT, scrollThroughPage } from "./support/widths";
import { assertPageIsFunctional } from "./support/guards";

/**
 * Suite base (b) — regresión de N1. Ninguna <img> con ancho O alto igual a 0
 * después de cargar, en los 7 anchos obligatorios. Mide LAS DOS dimensiones.
 */
for (const width of WIDTHS) {
  test(`ninguna <img> en 0×0 a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
    await page.goto("/");
    await assertPageIsFunctional(page);
    await scrollThroughPage(page);
    await page.waitForTimeout(250);

    const boxes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("img")).map((img) => {
        const rect = img.getBoundingClientRect();
        const parent = img.parentElement;
        const parentRect = parent ? parent.getBoundingClientRect() : null;
        return {
          src: img.currentSrc || img.getAttribute("src") || "",
          alt: img.alt,
          width: rect.width,
          height: rect.height,
          complete: img.complete,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          parentTag: parent?.tagName ?? null,
          parentClass: parent?.className ?? null,
          parentWidth: parentRect?.width ?? null,
          parentHeight: parentRect?.height ?? null,
        };
      });
    });

    expect(boxes.length, "no se encontró ninguna <img> en la página").toBeGreaterThan(0);

    const zeroed = boxes.filter((b) => b.width === 0 || b.height === 0);
    expect(
      zeroed,
      `${zeroed.length} imagen(es) con ancho o alto 0 a ${width}px:\n${JSON.stringify(zeroed, null, 2)}`
    ).toEqual([]);
  });
}

/**
 * N1, específicamente — no la regla genérica de arriba.
 *
 * La regla genérica de "ancho O alto === 0" nunca puede atrapar a N1 tal
 * como está hoy el código: `.sobre-mi-photo` tiene `aspect-ratio: 3/4` +
 * `min-height: 260px` (el fix parcial de PORT-000). A ≤700px, el
 * `margin: 0 auto` de `app/globals.css:382` anula el `stretch` del grid
 * item — el ancho intrínseco de la caja pasa a depender de su único hijo,
 * que es el <img fill> de next/image, absolutamente posicionado y por lo
 * tanto sin ancho intrínseco propio → el ancho "real" de layout es 0. Pero
 * `aspect-ratio: 3/4` con el `min-height: 260px` como piso deriva un ancho
 * de 195px (260 × 3/4) a partir de esa altura — nunca literalmente 0, así
 * que la prueba de arriba pasa siempre, aunque la foto esté deforme y a un
 * 30% menos del ancho pretendido (280px, `max-width` de la misma regla).
 *
 * Confirmado con el reviewer (ronda 1 de T0): quitando el `min-height` la
 * caja sí da 0×0 a 418 y 650 — los anchos exactos que midió Juan. El piso
 * del fix parcial es lo que esconde el defecto, no lo resuelve.
 *
 * Esta prueba NO se arregla quitando el 0-check de arriba (sigue siendo una
 * red útil para cualquier otra imagen). Se agrega un chequeo aparte, atado
 * al selector real de N1, con un piso de 260px: cualquier valor por debajo
 * de eso es el artefacto derivado del alto, no un ancho de layout real (280
 * en móvil, 300 en desktop — los dos boundary conocidos de este componente
 * están por encima de 260).
 *
 * No se arregla acá (es de T1, del implementer) — el trabajo de esta
 * prueba es que la regresión sea imposible de esconder, no resolverla.
 */
for (const width of WIDTHS) {
  test(`N1 — la foto de Sobre Mí no colapsa a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
    await page.goto("/");
    await assertPageIsFunctional(page);
    await scrollThroughPage(page);
    await page.waitForTimeout(250);

    // Si `onError` disparó, SobreMi.tsx (línea 20) saca la foto del DOM por
    // completo — sin este chequeo, el día que la foto no cargue, la prueba
    // de N1 se queda sin sujeto y "pasa" sin haber medido nada.
    const photo = page.locator(".sobre-mi-photo img");
    await expect(photo, ".sobre-mi-photo img no está en el DOM (¿onError disparó?)").toHaveCount(1);

    const box = await page.evaluate(() => {
      const img = document.querySelector(".sobre-mi-photo img");
      const container = document.querySelector(".sobre-mi-photo");
      if (!img || !container) return null;
      const imgRect = img.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      return {
        imgWidth: imgRect.width,
        imgHeight: imgRect.height,
        containerWidth: containerRect.width,
        containerHeight: containerRect.height,
      };
    });

    expect(box, "no se pudo medir .sobre-mi-photo / .sobre-mi-photo img").not.toBeNull();
    const { imgWidth, imgHeight, containerWidth, containerHeight } = box!;

    // Sanity: el <img fill> tiene que ocupar exactamente la caja del padre.
    expect(imgWidth, `imgWidth (${imgWidth}) !== containerWidth (${containerWidth})`).toBe(
      containerWidth
    );
    expect(imgHeight, `imgHeight (${imgHeight}) !== containerHeight (${containerHeight})`).toBe(
      containerHeight
    );

    // El piso real: 260px es el valor que da el artefacto height→width vía
    // aspect-ratio cuando el ancho de layout colapsó. Cualquier cosa por
    // debajo es el defecto, no una foto legítimamente angosta.
    //
    // Ojo: este piso de 260 es el MISMO número que `min-height: 260px` en
    // app/globals.css — o sea que está derivado del valor de la perilla que
    // un fix a medias puede girar. Si alguien "arregla" N1 subiendo el
    // min-height a 373px (el alto real de la foto en 3:4 a 280 de ancho),
    // la caja mide 280×373 y ESTA aserción pasa en verde con el defecto
    // intacto: el ancho de layout seguiría siendo 0, tapado por un piso más
    // alto. No es hipotético — así llegó el 260 actual, de un fix anterior
    // que solo tocó el alto. Por eso la aserción de mecanismo de abajo es la
    // que de verdad cierra N1, y esta se deja como piso adicional, no como
    // la prueba principal.
    expect(
      imgWidth,
      `la foto mide ${imgWidth}×${imgHeight} a ${width}px — por debajo del piso de 260px ` +
        `(N1: el fix parcial de PORT-000 solo pone un piso al ALTO vía min-height; el ANCHO ` +
        `sigue colapsando y aspect-ratio lo deriva del alto, no de layout real)`
    ).toBeGreaterThanOrEqual(260);

    // La aserción que de verdad importa: el MECANISMO, no un valor que
    // cualquier min-height puede maquillar. Se saca el piso en caliente (sin
    // tocar app/globals.css, solo el estilo inline del elemento ya montado
    // en esta página) y se mide qué ancho da el layout real, sin la muleta.
    // Si el `stretch` del grid item funciona, el ancho no depende de la
    // altura y se queda positivo aunque no haya min-height. Si sigue
    // colapsando (0×0, el bug real que midió Juan a 418 y 650), esto falla
    // sin importar qué tan alto esté el piso puesto en CSS.
    //
    // No basta con apagar min-height: la caja también tiene
    // `aspect-ratio: 3/4` (app/globals.css:364), que es el mecanismo que
    // convierte cualquier alto resuelto en un ancho derivado. Un fix futuro
    // podría reemplazar el piso de min-height por un alto fijo (`height:
    // 373px` o un padding-block equivalente) y dejar el aspect-ratio
    // intacto — el ancho seguiría viniendo del alto, no de layout real, y
    // si solo apagara min-height esta aserción pasaría en verde igual. Por
    // eso se apagan las tres perillas que pueden derivar un ancho a partir
    // de una altura (min-height, aspect-ratio y height) antes de medir.
    const sinPiso = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>(".sobre-mi-photo")!;
      const prev = {
        minHeight: el.style.minHeight,
        aspectRatio: el.style.aspectRatio,
        height: el.style.height,
      };
      el.style.minHeight = "0px";
      el.style.aspectRatio = "auto";
      el.style.height = "auto";
      const r = el.getBoundingClientRect();
      el.style.minHeight = prev.minHeight;
      el.style.aspectRatio = prev.aspectRatio;
      el.style.height = prev.height;
      return { w: r.width, h: r.height };
    });
    expect(
      sinPiso.w,
      `sin el piso de min-height, .sobre-mi-photo mide ${sinPiso.w}×${sinPiso.h} a ${width}px — ` +
        `el ancho de layout es 0 y lo único que lo disimula es el min-height de app/globals.css. ` +
        `N1 (ver CLAUDE.md, memoria "no-cerrar-defectos-reportados-sin-medicion")`
    ).toBeGreaterThan(0);
  });
}
