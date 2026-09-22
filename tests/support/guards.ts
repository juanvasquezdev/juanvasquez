import { Page, expect } from "@playwright/test";

/**
 * Guard duro: si el CSS no se aplicó o React no hidrató, cualquier medición
 * de layout, overflow o aria-current de ahí en más es ruido, no señal.
 *
 * Nace del hallazgo del reviewer en la ronda 1 de T0: en WebKit, contra
 * `next start` en HTTP plano, la CSP de `proxy.ts` (`upgrade-insecure-
 * requests`) hace que WebKit pida cada subrecurso por `https://localhost:3000/
 * ...` — que no existe — y absolutamente nada carga (ni CSS, ni JS, ni
 * imágenes). Sin CSS no hay `overflow`, así que `c-no-horizontal-scroll`
 * pasaba sus 7 anchos en WebKit por la razón equivocada: no es que no haya
 * overflow, es que no hay layout. Sin JS no hidrata, así que cualquier
 * prueba que dependa de estado de React (aria-current, Reveal) tampoco mide
 * nada real. Este guard hace que esas pruebas fallen ruidosamente, con el
 * diagnóstico adentro del mensaje, en vez de dar un verde falso.
 *
 * Deliberadamente NO toca `proxy.ts` — no es su alcance arreglar la CSP,
 * solo el de dejar de ocultar el problema.
 */
export async function assertPageIsFunctional(page: Page) {
  const diag = await page.evaluate(() => {
    let cssRules = -1;
    try {
      const sheet = document.styleSheets[0];
      cssRules = sheet ? sheet.cssRules.length : 0;
    } catch {
      cssRules = -1; // hoja bloqueada (no debería pasar same-origin, pero por si acaso)
    }
    return {
      cssRules,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
    };
  });

  expect(
    diag.cssRules,
    `El CSS no se aplicó: document.styleSheets[0].cssRules.length = ${diag.cssRules}. ` +
      `Diagnóstico: ${JSON.stringify(diag)}. Ver tests/support/guards.ts.`
  ).toBeGreaterThan(0);

  expect(
    diag.bodyBackground,
    `El <body> no tiene background-color real (${diag.bodyBackground}) — el CSS no se aplicó. ` +
      `Diagnóstico: ${JSON.stringify(diag)}. Ver tests/support/guards.ts.`
  ).not.toBe("rgba(0, 0, 0, 0)");

  // El hidratado tarda un poco (useActiveSection dispara su IntersectionObserver
  // después del mount), así que esto se reintenta en vez de medir una sola vez.
  //
  // El timeout de 5000ms medía contención de workers, no el sitio: en
  // webkit, aislado (`--project=webkit --workers=1`), aria-current aparece
  // entre 1s y 2s tras el load. Pero corriendo la suite completa en paralelo
  // (16 cores, workers por defecto de Playwright ≈ 8, y forzado a 16 para
  // reproducir a propósito) medí tests completos tardando 14-19s bajo esa
  // carga — la CPU compartida entre navegadores retrasa la hidratación real,
  // no un cuelgue. Con timeout 5000ms eso da flaky: 3 corridas seguidas sin
  // forzar workers dieron 55/1 estable, pero forzando --workers=16 reproduje
  // fallas de ESTE guard (timeout 5000ms exceeded) en b-images y
  // c-no-horizontal-scroll de webkit, no solo en f-aria-current — confirma
  // que es contención de recursos, no un caso puntual. Subido a 20000ms:
  // generoso frente a los ~19s medidos bajo contención forzada, y no cuesta
  // nada en el caso feliz porque expect.poll devuelve apenas la condición es
  // true, no espera el timeout completo.
  await expect
    .poll(
      async () =>
        page.evaluate(() => document.querySelector(".nav-pill-link[aria-current]") !== null),
      {
        message:
          "Ningún .nav-pill-link tiene aria-current — React no hidrató (o useActiveSection nunca corrió). Ver tests/support/guards.ts.",
        timeout: 20000,
      }
    )
    .toBe(true);
}
