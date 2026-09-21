import { test, expect } from "@playwright/test";

/**
 * Suite base (e) — CSP: el nonce del header coincide con el de los <script>
 * en la MISMA respuesta. Comparar dos requests distintos no sirve: cada uno
 * trae su propio nonce por request (ver proxy.ts).
 */
test("el nonce del header CSP coincide con el de los <script> inline", async ({ request }) => {
  const res = await request.get("/");
  const cspHeader = res.headers()["content-security-policy"];
  expect(cspHeader, "no vino header Content-Security-Policy").toBeTruthy();

  const headerNonceMatch = cspHeader.match(/'nonce-([^']+)'/);
  expect(headerNonceMatch, `no se encontró nonce en el header CSP: ${cspHeader}`).not.toBeNull();
  const headerNonce = headerNonceMatch![1];

  const html = await res.text();
  const scriptNonces = [...html.matchAll(/<script[^>]*\bnonce="([^"]+)"/g)].map((m) => m[1]);

  expect(scriptNonces.length, "no se encontró ningún <script nonce> en el HTML").toBeGreaterThan(0);

  for (const nonce of scriptNonces) {
    expect(nonce).toBe(headerNonce);
  }
});
