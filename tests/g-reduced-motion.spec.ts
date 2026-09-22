import { test, expect, type Page } from "@playwright/test";
import { scrollThroughPage } from "./support/widths";
import { assertPageIsFunctional } from "./support/guards";

/**
 * Nodos "hoja" de texto que están en opacity:0 en este instante — la lógica
 * de filtro vive acá porque se usa dos veces: para hacer polling y para
 * armar el diagnóstico final.
 */
async function getStuckTextNodes(page: Page) {
  return page.evaluate(() => {
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
}

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

  // Antes esto era un waitForTimeout(300) fijo. Medido en webkit (script
  // ad-hoc de la ronda 2 de T1, muestreando cada 100ms tras el scroll): el
  // conteo de nodos atascados NO baja monótono — oscila (7-8 al toque, sube
  // y baja varias veces) y recién se asienta en 0 alrededor de ~880-900ms,
  // ahí sí estable en 0 durante los 4s+ que siguió midiendo el script. 300ms
  // medía la ventana en la que el reveal todavía está en tránsito, no el
  // resultado final — de ahí que la prueba viera nodos atascados que en
  // realidad iban a asentarse solos.
  //
  // Por la oscilación, un solo "0" de lectura no basta como señal de que ya
  // se asentó (podría ser un cruce transitorio, como el 5→1→4 que se vio en
  // otra corrida) — se exige que el conteo dé 0 en READS_TO_CONFIRM lecturas
  // seguidas antes de darlo por estable. Tope total generoso (8s) para no
  // ahogarse bajo contención de workers (mismo fenómeno que en
  // tests/support/guards.ts) — si nunca se estabiliza en 0 y de verdad hay
  // un nodo atascado para siempre, el tope se cumple y stuckHidden llega no
  // vacío al assert de abajo: esto NO puede dar un verde falso por más
  // generoso que sea el tope, porque lo que se evalúa al final es el último
  // estado medido, no "se acabó el tiempo así que pasa".
  const READS_TO_CONFIRM = 3;
  const POLL_INTERVAL_MS = 150;
  const TOTAL_TIMEOUT_MS = 8000;

  let stuckHidden = await getStuckTextNodes(page);
  const deadline = Date.now() + TOTAL_TIMEOUT_MS;
  let consecutiveEmpty = stuckHidden.length === 0 ? 1 : 0;

  while (consecutiveEmpty < READS_TO_CONFIRM && Date.now() < deadline) {
    await page.waitForTimeout(POLL_INTERVAL_MS);
    stuckHidden = await getStuckTextNodes(page);
    consecutiveEmpty = stuckHidden.length === 0 ? consecutiveEmpty + 1 : 0;
  }

  expect(
    stuckHidden,
    `nodos con texto atascados en opacity:0 (tras esperar hasta ${TOTAL_TIMEOUT_MS}ms a que se ` +
      `estabilizara en 0, ${READS_TO_CONFIRM} lecturas seguidas cada ${POLL_INTERVAL_MS}ms):\n` +
      `${JSON.stringify(stuckHidden, null, 2)}`
  ).toEqual([]);

  await expect(page.getByText("Fast Inventory").first()).toBeVisible();
  await expect(page.getByText(/Fosbury/).first()).toBeVisible();
});
