import type { NextConfig } from "next";

// Sin `output: 'export'` a propósito: se despliega en Vercel, así next/image
// puede optimizar bajo demanda (compresión, WebP/AVIF, tamaños responsive)
// en vez de servir los JPEG estáticos sin comprimir.
//
// La CSP ya no vive acá (ver proxy.ts): pasó a nonce por request porque
// dynamic = "force-dynamic" en app/page.tsx dejó de servir la página desde
// cache estática, así que headers() estático ya no era la pieza correcta.
const nextConfig: NextConfig = {};

export default nextConfig;
