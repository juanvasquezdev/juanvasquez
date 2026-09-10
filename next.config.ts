import type { NextConfig } from "next";

/*
 * CSP vía headers() en vez de proxy/middleware con nonce: se probó el patrón
 * de nonce por request (ver AUDIT.md/CLAUDE.md) y se descartó porque esta
 * página se prerenderiza como estática (mejor rendimiento, sin nada dinámico
 * por request) — un nonce generado en cada request nunca llega a inyectarse
 * en el HTML ya cacheado en build time, así que los <script> inline que
 * genera el propio Next.js (streaming de RSC) quedan sin nonce y un CSP
 * estrictamente nonce+strict-dynamic los bloquea en un navegador real
 * (se verificó con `next build && next start` + inspección del HTML).
 * Por eso script-src, igual que style-src, necesita 'unsafe-inline' — mismo
 * tipo de excepción documentada, ahora por una razón distinta (inline
 * scripts del framework en vez de estilos dinámicos del bar-chart).
 */
const cspHeader = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// Sin `output: 'export'` a propósito: se despliega en Vercel, así next/image
// puede optimizar bajo demanda (compresión, WebP/AVIF, tamaños responsive)
// en vez de servir los JPEG estáticos sin comprimir.
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Content-Security-Policy", value: cspHeader }],
      },
    ];
  },
};

export default nextConfig;
