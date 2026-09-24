import { test, expect } from "@playwright/test";
import { WIDTHS, VIEWPORT_HEIGHT, scrollThroughPage } from "./support/widths";
import { assertPageIsFunctional } from "./support/guards";

/**
 * Cobertura mínima de /en (T6, PORT-001b). Hasta ahora la suite base
 * (a-ssr…h-marker-label-overlap) solo mide /es: navega a "/" y Playwright
 * sigue el 307 solo (ver tests/i-lang-redirect.spec.ts para el redirect en
 * sí). Este archivo cubre lo mínimo pedido para /en: status 200, <html
 * lang="en">, consola limpia, sin scroll horizontal en los 7 anchos
 * obligatorios, y el nonce de la CSP coincidiendo con los <script> EN LA
 * MISMA respuesta.
 *
 * No repite TODA la suite base para /en (imágenes 0×0, aria-current,
 * reduced-motion, el solape de .marker-label): es el mismo layout y el mismo
 * código React sirviendo otro idioma, y eso ya está cubierto en /es.
 *
 * Ojo con lo que esto NO mide: no hay una prueba de /en para el solape de
 * .marker-label (h-marker-label-overlap.spec.ts), aunque el texto en inglés
 * es distinto (y en algunos casos más largo) y ese es justo el tipo de cosa
 * que podría romper un layout ajustado en px. No lo agrego a propósito acá:
 * el reviewer lo midió por separado (0 solapes en los 40 anchos de esa
 * prueba, corridos contra /en) y La Barra —la sección donde vive
 * .marker-label— sale del sitio en PORT-006, así que agregar cobertura
 * permanente para /en ahí sería medir algo que ya tiene fecha de baja. Lo
 * que sí se mide acá es lo que puede romperse específico de /en y no de
 * /es: el idioma no resuelve (notFound) o <html lang> queda mal, y sin
 * scroll horizontal en los 7 anchos (que si un texto más largo desborda
 * ALGO, es lo primero que se ve).
 */

test('/en responde 200 con <html lang="en">', async ({ request }) => {
  const res = await request.get("/en");
  expect(res.status()).toBe(200);

  const html = await res.text();
  expect(html).toMatch(/<html[^>]*\blang="en"/);
});

test("/en: el nonce del header CSP coincide con el de los <script> en la misma respuesta", async ({
  request,
}) => {
  const res = await request.get("/en");
  const cspHeader = res.headers()["content-security-policy"];
  expect(cspHeader, "no vino header Content-Security-Policy en /en").toBeTruthy();

  const headerNonceMatch = cspHeader.match(/'nonce-([^']+)'/);
  expect(headerNonceMatch, `no se encontró nonce en el header CSP: ${cspHeader}`).not.toBeNull();
  const headerNonce = headerNonceMatch![1];

  const html = await res.text();
  const scriptNonces = [...html.matchAll(/<script[^>]*\bnonce="([^"]+)"/g)].map((m) => m[1]);
  expect(scriptNonces.length, "no se encontró ningún <script nonce> en /en").toBeGreaterThan(0);

  for (const nonce of scriptNonces) {
    expect(nonce).toBe(headerNonce);
  }
});

test("/en: consola limpia, sin errores ni warnings de hidratación", async ({ page }) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
    if (msg.type() === "warning") warnings.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  await page.goto("/en");
  await assertPageIsFunctional(page);
  await scrollThroughPage(page);
  await page.waitForTimeout(300);

  expect(errors, `errores de consola en /en:\n${JSON.stringify(errors, null, 2)}`).toEqual([]);

  const hydrationWarnings = warnings.filter((w) => /hydrat/i.test(w));
  expect(
    hydrationWarnings,
    `warnings de hidratación en /en:\n${JSON.stringify(hydrationWarnings, null, 2)}`
  ).toEqual([]);
});

for (const width of WIDTHS) {
  test(`/en: sin scroll horizontal a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
    await page.goto("/en");
    await assertPageIsFunctional(page);
    await scrollThroughPage(page);
    await page.waitForTimeout(150);

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(
      scrollWidth,
      `scrollWidth ${scrollWidth} > clientWidth ${clientWidth} a ${width}px (/en) — hay overflow horizontal`
    ).toBeLessThanOrEqual(clientWidth);
  });
}
