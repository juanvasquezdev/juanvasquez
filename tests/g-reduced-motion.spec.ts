import { test, expect, type Page } from "@playwright/test";
import { scrollToAndWaitForRender } from "./support/widths";
import { assertPageIsFunctional } from "./support/guards";

/**
 * Nodos con `opacity: 0` que están EN PANTALLA ahora mismo — la lógica de
 * filtro vive acá porque se usa en cada parada del recorrido.
 *
 * OJO CON EL ALCANCE: esto mide `opacity: 0`, que es el mecanismo exacto que
 * usa <Reveal> (ver lib/motion.ts). No mide "en blanco" en general —
 * `visibility: hidden`, `display: none`, `color: transparent`, `scale(0)` o
 * un alto de 0 no los detecta esto, aunque también dejarían contenido
 * invisible. Ese no es el defecto que <Reveal> puede producir, así que no es
 * lo que esta prueba vigila.
 *
 * Un nodo fuera del viewport en opacity:0 es exactamente lo que
 * hooks/useBelowFold.ts fabrica a propósito para todo lo que sigue debajo
 * del pliegue y todavía no entró en pantalla — no es el defecto que esta
 * prueba busca. La afirmación honesta es "ningún nodo con opacity:0 está EN
 * PANTALLA mientras la página está quieta".
 *
 * Selección y deduplicación, en ese orden — y el orden importa:
 * 1. Se seleccionan TODOS los elementos con texto propio y opacity:0 en
 *    pantalla, sin importar su posición en el árbol.
 * 2. Recién ahí se deduplica hacia ARRIBA: un nodo se descarta solo si
 *    alguno de sus ANCESTROS ya está en el conjunto (para no reportar un
 *    <h2> y su <section> dos veces cuando ambos están rotos por la misma
 *    causa).
 *
 * Antes deduplicaba distinto y mal: filtraba cualquier nodo cuyo ÚNICO HIJO
 * repitiera su mismo texto, ANTES de mirar opacity. `opacity` no se hereda
 * en getComputedStyle — así que un wrapper de <Reveal> con
 * `style="opacity:0"` y un solo hijo de texto (el patrón exacto de
 * `.galeria-item`, `.achievement-item`, `.card.card-wide`) se descartaba por
 * "no es hoja", y el hijo se leía con opacity:1 (heredado visualmente, sano
 * en el computed style). El filtro viejo era CIEGO a esa forma de nodo:
 * medido por el reviewer con `.galeria-item { opacity: 0 }` en pantalla, 7
 * de 7 ítems invisibles, el filtro no detectaba ninguno. Filtrar por
 * "opacity primero, deduplicar por ancestro después" no tiene ese agujero:
 * no importa si el nodo roto tiene hijos con texto repetido, se selecciona
 * igual por su propio opacity.
 */
async function getStuckInViewportNow(page: Page) {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const flagged = Array.from(document.querySelectorAll("body *")).filter((el) => {
      const text = el.textContent?.trim() ?? "";
      if (!text) return false;
      // BackToTop es UI de scroll, no contenido narrativo: opacity:0 en el
      // tope de la página es su estado correcto (components/BackToTop.tsx),
      // no un Reveal atascado. Acotado al componente exacto (no a
      // <button> en general) para no eximir de cobertura a un CTA o
      // filtro futuro que también sea botón.
      if (el.classList.contains("back-to-top")) return false;
      const style = getComputedStyle(el as Element);
      if (style.opacity !== "0") return false;
      const rect = el.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
    });

    const flaggedSet = new Set(flagged);
    const deduped = flagged.filter((el) => {
      let ancestor = el.parentElement;
      while (ancestor) {
        if (flaggedSet.has(ancestor)) return false;
        ancestor = ancestor.parentElement;
      }
      return true;
    });

    return deduped.map((el) => ({ tag: el.tagName, text: el.textContent!.trim().slice(0, 60) }));
  });
}

/**
 * Deja pasar el tiempo hasta que el conjunto de nodos atascados EN PANTALLA
 * se estabilice (3 lecturas seguidas en 0, o el tope de tiempo), y devuelve
 * la última lectura.
 *
 * Medido en la ronda 2 de T1 (webkit, con el scroll viejo): el conteo de
 * atascados oscila (sube y baja varias veces) antes de asentarse, ~880-900ms
 * en el peor caso visto. El tope de abajo es generoso frente a eso — y si de
 * verdad hay algo atascado para siempre, el tope se cumple y la última
 * lectura (no vacía) es la que se devuelve: esto no puede dar un verde falso
 * por más generoso que sea el tope, porque nunca se evalúa "se acabó el
 * tiempo así que pasa", se evalúa el último estado medido.
 */
async function waitForStableStuckInViewport(page: Page, timeoutMs: number) {
  const READS_TO_CONFIRM = 3;
  const POLL_INTERVAL_MS = 150;

  let stuck = await getStuckInViewportNow(page);
  const deadline = Date.now() + timeoutMs;
  let consecutiveEmpty = stuck.length === 0 ? 1 : 0;

  while (consecutiveEmpty < READS_TO_CONFIRM && Date.now() < deadline) {
    await page.waitForTimeout(POLL_INTERVAL_MS);
    stuck = await getStuckInViewportNow(page);
    consecutiveEmpty = stuck.length === 0 ? consecutiveEmpty + 1 : 0;
  }

  return stuck;
}

/** Tope de espera por parada en la fase B (ver docstring del test). */
const FASE_B_PER_STOP_TIMEOUT_MS = 8000;
/** Margen extra sobre el cálculo de fase A + fase B, para lo que no es scroll/espera puro. */
const TIMEOUT_SAFETY_MARGIN_MS = 15000;

/**
 * Suite base (g) — prefers-reduced-motion: con la preferencia activa, el
 * contenido se lee completo. Ningún nodo se queda atascado en opacity:0
 * mientras está en pantalla, EN NINGUNA PARADA del recorrido (ver
 * hooks/useBelowFold.ts + MotionConfig reducedMotion="user" en
 * components/SmoothScroll.tsx: las transiciones se cortan, pero el estado
 * final tiene que aplicarse igual).
 *
 * Dos fases, y las dos hacían falta — medido, no elegido a priori:
 *
 * FASE A — barrido rápido: recorre cada parada (mismo paso que
 * tests/support/widths.ts) con una sola lectura inmediata, sin esperar a que
 * nada se asiente. Sirve para saber DÓNDE mirar: cualquier nodo que aparezca
 * en opacity:0 mientras está en pantalla, en cualquier parada, es candidato.
 *
 * FASE B — verificación con espera generosa, solo de las paradas que
 * dejaron candidatos: vuelve a cada una de esas posiciones y espera de
 * verdad (la misma lógica de estabilización, con tope de 8s por parada)
 * antes de decidir si el nodo sigue atascado o era transitorio.
 *
 * Por qué dos fases y no una sola pasada con espera en cada parada (lo que
 * hacía la primera versión de este fix): medido y descartado. Con espera
 * POR PARADA sola, aunque el tope suba a 8s, dos nodos reales del sitio
 * ("Logros Destacados", un ítem de Formación) quedaban marcados como
 * atascados de forma reproducible en chromium Y webkit — pero visitando esa
 * MISMA posición después de un barrido completo (fase A primero, fase B
 * después) el mismo tope de 8s sí los resuelve, dos corridas seguidas en
 * los dos motores. La diferencia no es el tope de tiempo: es que parar el
 * scroll en seco en una posición aislada (sin haber recorrido el resto de
 * la página antes) deja al navegador sin motivo para seguir produciendo
 * frames — nada se está moviendo ni animando — y la revisión de
 * intersección de esos elementos no vuelve a evaluarse. Un recorrido rápido
 * completo antes de la espera evita esa situación. No se investigó más a
 * fondo el mecanismo exacto del navegador; se registra la medición, no la
 * causa interna.
 *
 * El timeout del test se calcula DESPUÉS de la fase A, a partir de cuántas
 * paradas quedaron como candidatas (`testInfo.setTimeout`, cuenta desde el
 * inicio del test, no desde este punto) — no es un número fijo adivinado.
 * Con la página sana, la fase A típicamente marca la mayoría de las paradas
 * como candidatas (recién se filtran en la fase B), así que un tope fijo
 * (p. ej. 60s) puede quedarse corto si aparece una regresión ancha:
 * el reviewer midió 82.9s/84.3s con 25 nodos atascados de verdad —el
 * peor caso, todas las paradas necesitan el tope completo de 8s cada una—.
 * Ese escenario es justo el que más importa (una regresión grande) y es
 * donde NO puede fallar por timeout genérico sin la lista de nodos: por eso
 * el tope total se dimensiona según cuántas paradas hay que verificar, no
 * al revés.
 */
test("con prefers-reduced-motion activo, el contenido se lee completo", async ({ page }, testInfo) => {
  const testStart = Date.now();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await assertPageIsFunctional(page);

  const step = await page.evaluate(() => window.innerHeight || 800);
  const max = await page.evaluate(() => document.body.scrollHeight);
  const stops: number[] = [];
  for (let y = 0; y <= max; y += step) stops.push(y);
  stops.push(0); // vuelta al principio, igual que scrollThroughPage

  // FASE A — barrido rápido, una lectura por parada, sin esperar.
  const candidateStops = new Set<number>();
  for (const y of stops) {
    await scrollToAndWaitForRender(page, y);
    const stuckHere = await getStuckInViewportNow(page);
    if (stuckHere.length > 0) candidateStops.add(y);
  }

  // Recién acá se sabe cuánto puede llegar a tardar la fase B en el peor
  // caso (todas las paradas candidatas agotan su tope) — así que recién
  // acá se puede dimensionar el timeout del test sin adivinar.
  const elapsedSoFar = Date.now() - testStart;
  testInfo.setTimeout(
    elapsedSoFar + candidateStops.size * FASE_B_PER_STOP_TIMEOUT_MS + TIMEOUT_SAFETY_MARGIN_MS
  );

  // FASE B — solo las paradas con candidatos, con espera generosa de verdad.
  const accumulated = new Map<string, { tag: string; text: string }>();
  for (const y of candidateStops) {
    await scrollToAndWaitForRender(page, y);
    const settled = await waitForStableStuckInViewport(page, FASE_B_PER_STOP_TIMEOUT_MS);
    for (const node of settled) {
      accumulated.set(`${node.tag}|${node.text}`, node);
    }
  }

  const stuckHidden = Array.from(accumulated.values());
  expect(
    stuckHidden,
    `nodos con opacity:0 en pantalla, tras el barrido rápido (${stops.length} paradas) y una ` +
      `espera de hasta ${FASE_B_PER_STOP_TIMEOUT_MS}ms en las ${candidateStops.size} parada(s) ` +
      `candidata(s):\n${JSON.stringify(stuckHidden, null, 2)}`
  ).toEqual([]);

  await expect(page.getByText("Fast Inventory").first()).toBeVisible();
  await expect(page.getByText(/Fosbury/).first()).toBeVisible();
});
