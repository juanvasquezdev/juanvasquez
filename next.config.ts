import type { NextConfig } from "next";
import { DEFAULT_LOCALE } from "./content/types";

// Sin `output: 'export'` a propósito: se despliega en Vercel, así next/image
// puede optimizar bajo demanda (compresión, WebP/AVIF, tamaños responsive)
// en vez de servir los JPEG estáticos sin comprimir.

// CSP fija, sin nonce: la página es estática y un nonce por request obligaba a
// renderizarla en cada visita. 'unsafe-eval' solo en dev: React lo usa para
// reconstruir los stacks de error, nunca en producción.
//
// script-src necesita 'unsafe-inline'. Next mete el payload de RSC en <script>
// inline que cambian con el contenido y por idioma, y se generan después de
// que se lee esta config, así que no hay hash estable que ponerles. Lo medí con
// experimental.sri y script-src 'self': bloquea 5 scripts y la página no
// hidrata (SRI solo firma los .js externos). Por lo mismo el script del tema
// (lib/theme.ts) no lleva hash: con un hash en script-src el navegador ignora
// 'unsafe-inline' y bloquea los de Next.
// script-src-attr 'none': nada de onclick="" y compañía; ni React ni Next los
// usan, y así un atributo inyectado no corre aunque haya 'unsafe-inline'.
//
// style-src sí va sin 'unsafe-inline'. Todo el CSS es de archivo; lo único
// inline son los style="" que next/image pone con `fill`, y son siempre el
// mismo texto, así que alcanza con su hash en style-src-attr. Si una versión
// nueva de Next lo cambia, las fotos se desarman y la consola lo avisa (la
// prueba de consola vacía lo agarra). Los style={{...}} de React en el cliente
// van por CSSOM y la CSP no los frena. En dev va 'unsafe-inline' porque el
// recargado en caliente inyecta <style>.
//
// Sin upgrade-insecure-requests: en WebKit rompía localhost (http), y en Vercel
// el sitio ya va siempre por HTTPS.
const isDev = process.env.NODE_ENV === "development";

const NEXT_IMAGE_FILL_STYLE = "'sha256-ZDrxqUOB4m/L0JWL/+gS52g1CRH0l/qwMhjTw5Z/Fsc='";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "script-src-attr 'none'",
  isDev ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",
  ...(isDev ? [] : [`style-src-attr 'unsafe-hashes' ${NEXT_IMAGE_FILL_STYLE}`]),
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// Todo lo que el sitio no usa, apagado. Solo nombres que Chrome reconoce: uno
// desconocido deja un aviso en la consola.
const PERMISSIONS = [
  "accelerometer",
  "autoplay",
  "bluetooth",
  "browsing-topics",
  "camera",
  "display-capture",
  "encrypted-media",
  "gamepad",
  "geolocation",
  "gyroscope",
  "hid",
  "idle-detection",
  "local-fonts",
  "magnetometer",
  "microphone",
  "midi",
  "payment",
  "picture-in-picture",
  "publickey-credentials-get",
  "screen-wake-lock",
  "serial",
  "usb",
  "xr-spatial-tracking",
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Dos años, subdominios incluidos. Sin preload: eso es pedir entrar a la
  // lista de los navegadores, y se decide con el dominio definitivo.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: PERMISSIONS.map((p) => `${p}=()`).join(", ") },
  // Los enlaces de afuera ya abren con noopener; esto aísla la ventana igual.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // frame-ancestors ya lo cubre; esto es para navegadores que no lo leen.
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  // No hace falta anunciar con qué está hecho el servidor.
  poweredByHeader: false,
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
