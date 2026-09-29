/**
 * Genera las imágenes de Open Graph / Twitter, una por idioma, en public/og/.
 *
 *   npm run og
 *
 * No uso next/og: solo acepta ttf/otf/woff (mis fuentes son woff2) y saca
 * PNG, que con una foto de fondo se va bien arriba de 300 KB. Acá dibujo la
 * tarjeta con HTML y CSS en el Chromium de Playwright, con las fuentes y la
 * foto del hero de verdad, y la guardo como JPEG. Se corre a mano cuando
 * cambia el nombre, los tags o la foto del hero; el resultado va al repo.
 *
 * Importa content/profile.ts directo: Node 24 le quita los tipos solo. El
 * tamaño y las rutas tienen que coincidir con OG_IMAGE_SIZE y ogImage.src de
 * content/seo.ts (ese archivo no se puede importar desde acá porque sus
 * imports no llevan extensión).
 */

import { readFile, mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import { PROFILE } from "../content/profile.ts";
import { LOCALES } from "../content/types.ts";

const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 84;
const root = process.cwd();

async function dataUrl(path, type) {
  const data = await readFile(join(root, path), "base64");
  return `data:${type};base64,${data}`;
}

const archivo = await dataUrl("app/fonts/archivo-variable.woff2", "font/woff2");
const geist = await dataUrl("app/fonts/geist-variable.woff2", "font/woff2");
const geistMono = await dataUrl("app/fonts/geist-mono-variable.woff2", "font/woff2");
const photo = await dataUrl(`public${PROFILE.hero.image.src}`, "image/jpeg");

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Mismos colores que el tema oscuro de globals.css: el primer tag es el mundo
// técnico (azul) y el segundo el atlético (coral).
function card(lang) {
  const [tech, sport] = PROFILE.hero.tags.map((tag) => escape(tag[lang]));
  const name = PROFILE.hero.nameLines.map(escape).join("<br>");

  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<style>
  @font-face { font-family: Archivo; src: url(${archivo}) format("woff2"); font-weight: 400 900; font-stretch: 62% 125%; }
  @font-face { font-family: Geist; src: url(${geist}) format("woff2"); font-weight: 300 700; }
  @font-face { font-family: GeistMono; src: url(${geistMono}) format("woff2"); font-weight: 400 500; }
  * { box-sizing: border-box; margin: 0; }
  body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; background: #0D0E10; color: #F4F3EF; font-family: Geist, sans-serif; }
  .photo {
    position: absolute; top: 0; right: 0; width: 560px; height: 100%;
    background: #0B0B0B url(${photo}) no-repeat;
    background-size: 820px auto;
    background-position: -40px bottom;
  }
  .photo::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(90deg, #0D0E10 0%, rgba(13, 14, 16, 0) 38%);
  }
  .copy { position: absolute; left: 72px; top: 0; bottom: 0; width: 760px; display: flex; flex-direction: column; justify-content: center; }
  .eyebrow { font-family: GeistMono, monospace; font-size: 20px; letter-spacing: 0.12em; text-transform: uppercase; color: #9C9B95; margin-bottom: 28px; }
  /* Más interlineado que el hero (0.84): en mayúsculas, las tildes de JOSÉ y
     VÁSQUEZ se montaban sobre el renglón de arriba. */
  h1 { font-family: Archivo, sans-serif; font-weight: 900; font-stretch: 72%; font-size: 136px; line-height: 0.98; letter-spacing: -0.02em; text-transform: uppercase; }
  ul { list-style: none; padding: 0; margin-top: 40px; display: grid; gap: 14px; }
  li { display: flex; align-items: center; gap: 16px; font-size: 30px; line-height: 1.2; }
  li::before { content: ""; width: 28px; height: 4px; border-radius: 2px; background: var(--c); flex: none; }
</style>
</head>
<body>
  <div class="photo"></div>
  <div class="copy">
    <p class="eyebrow">${escape(PROFILE.hero.eyebrow)}</p>
    <h1>${name}</h1>
    <ul>
      <li style="--c: #86A6FF">${tech}</li>
      <li style="--c: #FF8061">${sport}</li>
    </ul>
  </div>
</body>
</html>`;
}

await mkdir(join(root, "public/og"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });

for (const lang of LOCALES) {
  await page.setContent(card(lang));
  await page.evaluate(() => document.fonts.ready);
  const path = join(root, `public/og/${lang}.jpg`);
  await page.screenshot({ path, type: "jpeg", quality: QUALITY });
  const { size } = await stat(path);
  console.log(`public/og/${lang}.jpg  ${(size / 1024).toFixed(1)} KiB`);
}

await browser.close();
