import type { FullConfig } from "@playwright/test";

/**
 * Chequeo previo a toda la suite: aborta si el servidor de las pruebas responde
 * con la CSP de `next dev` en vez de la de `next start`.
 *
 * `playwright.config.ts` deja `reuseExistingServer: !process.env.CI` (para
 * no perder tiempo en local si ya hay un `npm start` corriendo) — pero si
 * alguien dejó un `next dev` levantado en el mismo puerto, Playwright lo
 * reutiliza en silencio, y la suite mide un servidor no representativo
 * (StrictMode con doble montaje).
 *
 * Hay un discriminante gratis: `next.config.ts` agrega `'unsafe-eval'` al
 * `script-src` únicamente cuando `NODE_ENV === "development"`. Si el header
 * lo trae, no es `next start`.
 */
export default async function globalSetup(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL!;
  const res = await fetch(`${baseURL}/`, { redirect: "manual" });
  const csp = res.headers.get("content-security-policy") ?? "";

  if (csp.includes("unsafe-eval")) {
    throw new Error(
      `El servidor en ${baseURL} responde con 'unsafe-eval' en la CSP — eso es \`next dev\`, no ` +
        "`next start` (ver next.config.ts). Las pruebas tienen que correr contra el build de " +
        "producción. Cerrá lo que esté corriendo en ese puerto y volvé a correr la suite " +
        "(playwright.config.ts levanta `npm run build && npm start` solo)."
    );
  }
}
