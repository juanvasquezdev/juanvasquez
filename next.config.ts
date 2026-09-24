import type { NextConfig } from "next";

// Sin `output: 'export'` a propósito: se despliega en Vercel, así next/image
// puede optimizar bajo demanda (compresión, WebP/AVIF, tamaños responsive)
// en vez de servir los JPEG estáticos sin comprimir.
//
// La CSP ya no vive acá (ver proxy.ts): pasó a nonce por request porque
// dynamic = "force-dynamic" en app/[lang]/page.tsx dejó de servir la página desde
// cache estática, así que headers() estático ya no era la pieza correcta.
//
// globalNotFound: mi layout raíz vive debajo de [lang] (es la única forma de
// que <html lang> salga del idioma de la ruta), así que arriba de él no queda
// ningún layout para dibujar un 404. Sin esto, /xx o /es/foo respondían un
// <html> vacío que sin JS no mostraba nada. Es experimental en Next 16, pero es
// justo el caso que la doc de not-found.md describe para este flag.
const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
