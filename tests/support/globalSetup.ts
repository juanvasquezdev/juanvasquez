/**
 * Chequeo previo a toda la suite: aborta si el servidor en :3000 responde
 * con la CSP de `next dev` en vez de la de `next start`.
 *
 * `playwright.config.ts` deja `reuseExistingServer: !process.env.CI` (para
 * no perder tiempo en local si ya hay un `npm start` corriendo) — pero si
 * alguien dejó un `next dev` levantado en el mismo puerto, Playwright lo
 * reutiliza en silencio, y la suite mide un servidor que el propio plan
 * declara no representativo (StrictMode con doble montaje).
 *
 * Hay un discriminante gratis: `proxy.ts` agrega `'unsafe-eval'` al
 * `script-src` únicamente cuando `NODE_ENV !== "production"`. Si el header
 * lo trae, no es `next start`.
 */
export default async function globalSetup() {
  const res = await fetch("http://localhost:3000/");
  const csp = res.headers.get("content-security-policy") ?? "";

  if (csp.includes("unsafe-eval")) {
    throw new Error(
      "El servidor en :3000 responde con 'unsafe-eval' en la CSP — eso es `next dev`, no " +
        "`next start` (ver proxy.ts). La suite base tiene que correr contra el build de " +
        "producción. Cerrá lo que esté corriendo en :3000 y volvé a correr la suite " +
        "(playwright.config.ts levanta `npm run build && npm start` solo)."
    );
  }
}
