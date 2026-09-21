import { test, expect } from "@playwright/test";

/**
 * Suite base (a) — SSR sin JS. Sobre el HTML crudo de la respuesta (un
 * `request`, sin ejecutar JS en un navegador): el <h1> trae texto plano, el
 * contenido profundo está presente, y solo aparecen los opacity:0 esperados
 * (hoy: 2, las capas del crossfade del hero — ver components/Hero.tsx).
 */
test.describe("SSR sin JS", () => {
  test("h1 con texto plano", async ({ request }) => {
    const res = await request.get("/");
    expect(res.status()).toBe(200);
    const html = await res.text();

    const h1Match = html.match(/<h1[^>]*>([^<]*)<\/h1>/);
    expect(h1Match, "no se encontró un <h1> en el HTML servido").not.toBeNull();
    expect(h1Match![1].trim().length).toBeGreaterThan(0);
    expect(h1Match![1]).toContain("Juan José Vásquez Giraldo");
  });

  test("contenido profundo presente sin JS", async ({ request }) => {
    const res = await request.get("/");
    const html = await res.text();

    expect(html).toContain("Fast Inventory");
    expect(html).toContain("Fosbury");
  });

  test("solo los opacity:0 esperados (hoy: 2, crossfade del hero)", async ({ request }) => {
    const res = await request.get("/");
    const html = await res.text();

    const matches = html.match(/style="opacity:0"/g) || [];
    expect(matches.length, `se encontraron ${matches.length} nodos con opacity:0 inline`).toBe(2);
  });
});
