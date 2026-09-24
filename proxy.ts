import { NextRequest, NextResponse } from "next/server";

/**
 * CSP con nonce por request (reemplaza el `script-src 'unsafe-inline'` que
 * había en next.config.ts). Requiere que la página se renderice dinámicamente
 * (ver `export const dynamic = "force-dynamic"` en app/[lang]/page.tsx) — se probó
 * primero dejando la página estática y el nonce nunca llegaba a los <script>
 * inline que genera Next (streaming de RSC), así que un navegador real los
 * bloqueaba. Con render dinámico sí se verificó (build + start + curl) que
 * el nonce queda embebido en esos scripts. El costo real: esta página ya no
 * se sirve desde la cache estática de Vercel, se renderiza en cada request.
 *
 * upgrade-insecure-requests va solo cuando la página YA viaja por HTTPS.
 * Sobre HTTP plano la directiva no protege nada (la página misma llegó en
 * claro) y en cambio rompe todo: el navegador pide cada subrecurso por
 * https://localhost:3000, que no tiene TLS, y no carga NADA — ni CSS, ni JS,
 * ni imágenes. WebKit la cumple al pie de la letra; Chromium exceptúa a
 * localhost y por eso ahí nunca se notó. Con eso, las pruebas de WebKit —el
 * único motor que aproxima a Safari, que es el riesgo #1 declarado del
 * proyecto— no estaban midiendo nada.
 *
 * Ojo, la condición NO puede ser NODE_ENV: `next start` también corre con
 * NODE_ENV=production (verificado: su header no lleva 'unsafe-eval'), así que
 * mirar NODE_ENV dejaría la directiva puesta exactamente en el caso que la
 * rompe. Lo que distingue los dos mundos es el esquema del request, no el
 * modo de build. En Vercel el proxy pone x-forwarded-proto: https y siempre
 * fuerza HTTPS, así que en producción la CSP sale idéntica a la de antes.
 *
 * 'unsafe-eval' solo en dev: React usa eval() en next dev (no en producción)
 * para reconstruir call stacks en el overlay de errores/debugging. Sin esto,
 * `npm run dev` tira "eval() is not supported in this environment" en la
 * consola del navegador en cada carga — no rompe la página, pero ensucia la
 * consola. `next build && next start` (producción real) nunca lo necesita.
 */
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const scriptSrc =
    process.env.NODE_ENV === "production"
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic';`
      : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval';`;
  // Dos detalles que parecen cosméticos y no lo son, porque los dos terminan
  // en el mismo modo de falla: producción sin upgrade-insecure-requests, en
  // silencio y sin ningún error que lo delate.
  // 1. .toLowerCase(): el esquema es case-insensitive por spec, así que un
  //    proxy puede mandar "HTTPS" perfectamente válido. Sin normalizar, la
  //    comparación de abajo daría false.
  // 2. `||` y no `??`: el `?.` solo cae al fallback si el header está ausente.
  //    Un x-forwarded-proto presente pero vacío devuelve "", y "" ?? fallback
  //    sigue siendo "" — el fallback nunca se dispara y el esquema real del
  //    request queda sin mirar. Con `||`, el string vacío se trata como
  //    ausente, que es lo que es.
  const protocolo = (
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    request.nextUrl.protocol.replace(":", "")
  ).toLowerCase();
  const upgradeInsecure = protocolo === "https" ? "upgrade-insecure-requests;" : "";
  const cspHeader = `
    default-src 'self';
    ${scriptSrc}
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    ${upgradeInsecure}
  `;
  const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, " ").trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });
  response.headers.set("Content-Security-Policy", contentSecurityPolicyHeaderValue);

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
