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

test("con movimiento reducido, nada de lo que aparece al scroll queda transparente", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/es");
  await page.waitForLoadState("networkidle");

  const { selectores, elementos, transparentes } = await page.evaluate(() => {
    // Los elementos animados salen del CSS mismo: las reglas que atan una
    // animación al scroll. Las reglas están en el CSSOM aunque su @media no
    // aplique, así que con reduce se encuentran igual. Hay que buscar view( o
    // scroll( y no cualquier valor: el shorthand `animation` deja
    // animation-timeline en "auto", y el `* { animation: none }` de reduce
    // entraría con todo el DOM.
    const encontrados: string[] = [];
    const recorrer = (reglas: CSSRuleList) => {
      for (const regla of Array.from(reglas)) {
        if (
          regla instanceof CSSStyleRule &&
          /\b(view|scroll)\(/.test(regla.style.getPropertyValue("animation-timeline"))
        ) {
          encontrados.push(regla.selectorText);
        } else if ("cssRules" in regla) {
          recorrer((regla as CSSGroupingRule).cssRules);
        }
      }
    };
    for (const hoja of Array.from(document.styleSheets)) recorrer(hoja.cssRules);

    const animados = encontrados.flatMap((s) => Array.from(document.querySelectorAll<HTMLElement>(s)));
    // Arriba de todo: lo animado está debajo del pliegue, que es justo donde
    // quedaría en el `from` (opacity 0) si la animación no se apagara.
    const ocultos = animados.filter((el) => Number(getComputedStyle(el).opacity) < 1);

    return {
      selectores: encontrados.length,
      elementos: animados.length,
      transparentes: ocultos.map((el) => `${el.className}: ${el.textContent!.trim().slice(0, 40)}`),
    };
  });

  // Si el CSS cambia y no encuentra nada, que falle en vez de pasar vacía.
  expect(selectores).toBeGreaterThan(0);
  expect(elementos).toBeGreaterThan(0);
  expect(transparentes).toEqual([]);
});
