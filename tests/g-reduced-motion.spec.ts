import { test, expect } from "@playwright/test";
import { scrollThroughPage } from "./support/widths";
import { assertPageIsFunctional } from "./support/guards";

/**
 * Suite base (g) — prefers-reduced-motion: con la preferencia activa, el
 * contenido se lee completo. Ningún nodo con texto se queda atascado en
 * opacity:0 (ver hooks/useBelowFold.ts + MotionConfig reducedMotion="user"
 * en components/SmoothScroll.tsx: las transiciones se cortan, pero el estado
 * final tiene que aplicarse igual).
 */
test("con prefers-reduced-motion activo, el contenido se lee completo", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await assertPageIsFunctional(page);
  await scrollThroughPage(page);
  await page.waitForTimeout(300);

  const stuckHidden = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("body *"))
      .filter((el) => {
        const text = el.textContent?.trim() ?? "";
        if (!text) return false;
        // Solo nodos "hoja" de texto, no contenedores que envuelven todo.
        const hasElementChildWithSameText = Array.from(el.children).some(
          (c) => c.textContent?.trim() === text
        );
        if (hasElementChildWithSameText) return false;
        // BackToTop es UI de scroll, no contenido narrativo: opacity:0 en el
        // tope de la página es su estado correcto (components/BackToTop.tsx),
        // no un Reveal atascado. scrollThroughPage vuelve a y=0 al final.
        // Acotado al componente exacto (no a <button> en general) para no
        // eximir de cobertura a un CTA o filtro futuro que también sea botón.
        if (el.classList.contains("back-to-top")) return false;
        const style = getComputedStyle(el as Element);
        return style.opacity === "0";
      })
      .map((el) => ({ tag: el.tagName, text: el.textContent!.trim().slice(0, 60) }));
  });

  expect(
    stuckHidden,
    `nodos con texto atascados en opacity:0:\n${JSON.stringify(stuckHidden, null, 2)}`
  ).toEqual([]);

  await expect(page.getByText("Fast Inventory").first()).toBeVisible();
  await expect(page.getByText(/Fosbury/).first()).toBeVisible();
});
