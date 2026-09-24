import { test, expect } from "@playwright/test";

/**
 * Suite base (h) del plan de PORT-001b: "/" redirige a "/es". `app/route.ts`
 * usa `redirect()` de next/navigation, que responde 307 (no 301/302) — se
 * mide el código exacto, no solo "algún redirect".
 *
 * `maxRedirects: 0` a propósito: seguir el redirect (lo que hace el resto de
 * la suite base al navegar a "/") mide el HTML final en /es, no distingue un
 * 307 real de que "/" sirviera ese mismo HTML directo. Acá se mide la
 * respuesta CRUDA de "/".
 */
test("/ responde 307 y redirige a /es", async ({ request }) => {
  const res = await request.get("/", { maxRedirects: 0 });
  expect(res.status()).toBe(307);

  const location = res.headers()["location"];
  expect(location, "no vino header Location en el 307").toBeTruthy();
  // Alcanza con que la ruta termine en /es: Next puede escribir el Location
  // como relativo ("/es") o absoluto (http://localhost:3000/es) según el
  // entorno, y no es lo que esta prueba vigila.
  expect(location.endsWith("/es")).toBe(true);
});

/**
 * El 404 real del sitio: `app/global-not-found.tsx` + `experimental.
 * globalNotFound` (ver next.config.ts) y `localeOrRedirect()` en
 * `lib/i18n.ts`. Dos caminos hasta ahí:
 *
 * - `/es/foo`: el segmento de idioma YA es válido, así que `[lang]/layout.tsx`
 *   ni redirige — la ruta simplemente no coincide con nada y cae directo al
 *   404 global.
 * - `/contacto`: el segmento ("contacto") no es un idioma, así que
 *   `localeOrRedirect()` primero hace 307 a `/es/contacto` (mismo mecanismo
 *   que "/" → "/es" de arriba) y a partir de ahí es el mismo caso que
 *   `/es/foo` — una ruta que no existe. Acá se sigue el redirect (no se pasa
 *   `maxRedirects: 0`) porque lo que importa es dónde ATERRIZA, no el salto
 *   intermedio.
 *
 * Se mide sobre el HTML crudo de la respuesta (`request`, sin ejecutar JS):
 * status 404, un `<html lang>` presente (global-not-found.tsx no conoce la
 * URL que falló, así que sale siempre en el idioma por defecto — "es" hoy),
 * y el texto del 404 legible sin JS, no solo el código de estado.
 */
test("/es/foo no existe: 404 con <html lang> y texto visible sin JS", async ({ request }) => {
  const res = await request.get("/es/foo");
  expect(res.status()).toBe(404);

  const html = await res.text();
  expect(html).toMatch(/<html[^>]*\blang="es"/);
  expect(html).toContain("could not be found");
});

test("/contacto: redirige a /es/contacto, que tampoco existe → 404 con <html lang> y texto visible sin JS", async ({
  request,
}) => {
  const res = await request.get("/contacto");
  expect(res.status()).toBe(404);
  // request.get sigue redirects por defecto: esto confirma que el 404 es el
  // final del salto /contacto → /es/contacto, no que /contacto haya dado 404
  // directo (que sería un mecanismo distinto al que describe localeOrRedirect).
  expect(res.url().endsWith("/es/contacto")).toBe(true);

  const html = await res.text();
  expect(html).toMatch(/<html[^>]*\blang="es"/);
  expect(html).toContain("could not be found");
});
