import { test, expect } from "@playwright/test";
import { assertPageIsFunctional } from "./support/guards";

/**
 * Suite base (f) — aria-current cambia correctamente al hacer scroll por las
 * secciones. El pill de Nav agrupa varias secciones bajo "Deportivo" (ver
 * components/Nav.tsx), así que se verifica contra esa agrupación real, no
 * contra un id por sección.
 */
test("aria-current sigue la sección visible al hacer scroll", async ({ page }) => {
  await page.goto("/");
  await assertPageIsFunctional(page);

  const activeLabel = page.locator('.nav-pill-link[aria-current="true"]');

  await page.locator("#inicio").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(activeLabel).toHaveText("Inicio");

  await page.locator("#stack").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(activeLabel).toHaveText("Stack");

  await page.locator("#proyectos").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(activeLabel).toHaveText("Proyectos");

  // "Deportivo" agrupa progresion/epico/galeria/logros/formacion/tecnica/metas
  await page.locator("#progresion").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(activeLabel).toHaveText("Deportivo");

  await page.locator("#logros").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(activeLabel).toHaveText("Deportivo");

  await page.locator("#contacto").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await expect(activeLabel).toHaveText("Contacto");
});
