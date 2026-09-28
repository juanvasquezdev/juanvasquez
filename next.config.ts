import type { NextConfig } from "next";
import { DEFAULT_LOCALE } from "./content/types";

// Sin `output: 'export'` a propósito: se despliega en Vercel, así next/image
// puede optimizar bajo demanda (compresión, WebP/AVIF, tamaños responsive)
// en vez de servir los JPEG estáticos sin comprimir.

// CSP fija, sin nonce: la página es estática y un nonce por request obligaba a
// renderizarla en cada visita. 'unsafe-inline' en script-src hace falta porque
// Next mete <script> inline en el HTML. 'unsafe-eval' solo en dev: React lo usa
// para reconstruir los stacks de error, nunca en producción.
// El script del tema (lib/theme.ts) también es inline y entra por ese mismo
// permiso. No le pongo su hash: con un hash en script-src el navegador ignora
// 'unsafe-inline' y bloquea los scripts de Next (lo medí: la página deja de
// hidratar). Para usar hashes hay que hashear también los de Next.
// Sin upgrade-insecure-requests: en WebKit rompía localhost (http), y en Vercel
// el sitio ya va siempre por HTTPS.
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // globalNotFound: mi layout raíz vive debajo de [lang] (es la única forma de
  // que <html lang> salga del idioma de la ruta), así que arriba de él no queda
  // ningún layout para dibujar un 404. app/global-not-found.tsx trae su propio
  // documento. Es experimental en Next 16, pero es justo el caso para el que
  // existe según la doc de not-found.md.
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // La raíz no tiene contenido propio: manda al idioma por defecto. Temporal
  // (307) y no permanente, por si algún día elijo el idioma según el navegador.
  async redirects() {
    return [{ source: "/", destination: `/${DEFAULT_LOCALE}`, permanent: false }];
  },
};

export default nextConfig;
