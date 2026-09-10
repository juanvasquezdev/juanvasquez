import { NextRequest, NextResponse } from "next/server";

/**
 * CSP con nonce por request (reemplaza el `script-src 'unsafe-inline'` que
 * había en next.config.ts). Requiere que la página se renderice dinámicamente
 * (ver `export const dynamic = "force-dynamic"` en app/page.tsx) — se probó
 * primero dejando la página estática y el nonce nunca llegaba a los <script>
 * inline que genera Next (streaming de RSC), así que un navegador real los
 * bloqueaba. Con render dinámico sí se verificó (build + start + curl) que
 * el nonce queda embebido en esos scripts. El costo real: esta página ya no
 * se sirve desde la cache estática de Vercel, se renderiza en cada request.
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
    upgrade-insecure-requests;
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
