import { test, expect } from "@playwright/test";
import { WIDTHS, VIEWPORT_HEIGHT, scrollThroughPage } from "./support/widths";
import { assertPageIsFunctional } from "./support/guards";

/**
 * Suite base (c) — sin scroll horizontal en ninguno de los 7 anchos
 * obligatorios. Sin CSS no hay `overflow` que medir (ver
 * tests/support/guards.ts) — por eso el guard corre primero: un ambiente
 * roto tiene que fallar acá, ruidoso, en vez de pasar por falta de layout.
 */
for (const width of WIDTHS) {
  test(`sin scroll horizontal a ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: VIEWPORT_HEIGHT });
    await page.goto("/");
    await assertPageIsFunctional(page);
    await scrollThroughPage(page);
    await page.waitForTimeout(150);

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(
      scrollWidth,
      `scrollWidth ${scrollWidth} > clientWidth ${clientWidth} a ${width}px — hay overflow horizontal`
    ).toBeLessThanOrEqual(clientWidth);
  });
}
