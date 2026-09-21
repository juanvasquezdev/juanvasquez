import { test, expect } from "@playwright/test";
import { scrollThroughPage } from "./support/widths";
import { assertPageIsFunctional } from "./support/guards";

/**
 * Suite base (d) — consola limpia: sin errores y sin warnings de hidratación.
 * Se recorre toda la página (no solo el primer viewport) para que dispare
 * cualquier warning de hidratación diferida o de next/image fuera de pantalla.
 *
 * El guard de abajo puede fallar ANTES de llegar al assert de errores — en
 * ese caso el diagnóstico del guard ya deja claro que el problema es CSS/
 * hidratación, no hace falta que además se lean los 20+ "SSL connect error"
 * de la consola para entenderlo.
 */
test("consola limpia: sin errores, sin warnings de hidratación", async ({ page }) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
    if (msg.type() === "warning") warnings.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));

  await page.goto("/");
  await assertPageIsFunctional(page);
  await scrollThroughPage(page);
  await page.waitForTimeout(300);

  expect(errors, `errores de consola:\n${JSON.stringify(errors, null, 2)}`).toEqual([]);

  const hydrationWarnings = warnings.filter((w) => /hydrat/i.test(w));
  expect(
    hydrationWarnings,
    `warnings de hidratación:\n${JSON.stringify(hydrationWarnings, null, 2)}`
  ).toEqual([]);
});
