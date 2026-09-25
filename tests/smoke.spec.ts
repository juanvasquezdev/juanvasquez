import { test, expect } from "@playwright/test";

// Pruebas de humo: la página es contenido estático, así que acá solo reviso que
// cargue, que esté en el idioma correcto y que no se rompa lo básico. Corren
// contra el build de producción (ver playwright.config.ts).

test("las dos versiones del sitio cargan, con su título y en su idioma", async ({ page }) => {
  for (const lang of ["es", "en"]) {
    const response = await page.goto(`/${lang}`);

    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toBeVisible();
  }
});

test("quien entra por la raíz llega a la versión en español", async ({ request }) => {
  // maxRedirects: 0 para ver la redirección en sí y no la página a la que lleva.
  const response = await request.get("/", { maxRedirects: 0 });

  expect(response.status()).toBe(307);
  expect(response.headers()["location"]).toBe("/es");
});

test("una dirección que no existe muestra una página de error y no una en blanco", async ({ page }) => {
  const response = await page.goto("/es/no-existe");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("la página carga sin errores en la consola", async ({ page }) => {
  const errores: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errores.push(msg.text());
  });
  page.on("pageerror", (err) => errores.push(err.message));

  await page.goto("/es");
  await page.waitForLoadState("networkidle");

  expect(errores).toEqual([]);
});

test("en un celular la página no se desborda hacia los lados", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/es");
  await page.waitForLoadState("networkidle");

  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
});

test("con movimiento reducido, el nombre y el comienzo de cada sección se leen sin esperar", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  // networkidle para leer después de hidratar: antes de eso todo viene visible
  // del servidor y la prueba pasaría aunque el reveal escondiera algo.
  await page.waitForLoadState("networkidle");

  const { secciones, invisibles } = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll("main section"));
    const textos = [document.querySelector("h1"), ...sections.map((s) => s.querySelector("p"))];

    // La opacidad no se hereda en getComputedStyle: si el que está en 0 es un
    // contenedor, el párrafo igual dice 1. Por eso multiplico la de todos los
    // ancestros, que es la que se ve de verdad.
    const ocultos = textos.filter((el) => {
      let opacidad = 1;
      for (let nodo: HTMLElement | null = el; nodo; nodo = nodo.parentElement) {
        opacidad *= Number(getComputedStyle(nodo).opacity);
      }
      return el !== null && opacidad < 1;
    });

    return {
      secciones: sections.length,
      invisibles: ocultos.map((el) => el!.textContent!.trim().slice(0, 60)),
    };
  });

  expect(secciones).toBeGreaterThan(0);
  expect(invisibles).toEqual([]);
});
