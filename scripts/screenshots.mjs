/**
 * Capturas del README, en docs/screenshots/, tema oscuro y WebP.
 *
 *   npm run screenshots
 *
 * Corre contra `next start` (lo levanta y lo apaga este mismo script en un
 * puerto propio), así que el npm script arma el build antes. Playwright solo
 * saca PNG o JPEG: el WebP lo codifica el canvas del mismo Chromium, sin
 * sumar dependencias. Si una imagen pasa de 150 KB, baja la calidad hasta que
 * entre.
 *
 * Movimiento reducido para que nada salga a medio aparecer, y el tema oscuro
 * forzado con la misma clave de localStorage que usa el toggle.
 */

import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const PORT = 3200;
const BASE = `http://localhost:${PORT}`;
const OUT = join(process.cwd(), "docs/screenshots");
const MAX_BYTES = 150 * 1024;

const SHOTS = [
  { name: "hero-desktop", viewport: { width: 1440, height: 900 }, scale: 1, target: "viewport" },
  { name: "hero-mobile", viewport: { width: 375, height: 812 }, scale: 2, target: "viewport" },
  { name: "proyectos", viewport: { width: 1440, height: 900 }, scale: 1, target: ["#proyectos"] },
  {
    name: "trayectoria",
    viewport: { width: 1440, height: 900 },
    scale: 1,
    target: [".traj-head", ".results"],
    // La tabla entera mide casi 2000 px; con 2026 y 2025 alcanza para verla.
    maxHeight: 1080,
  },
];

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`${BASE}/es`)).ok) return;
    } catch {
      // todavía no escucha
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`next start no respondió en ${BASE}`);
}

const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "-p", String(PORT)], {
  stdio: "ignore",
});

try {
  await waitForServer();
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const shot of SHOTS) {
    const context = await browser.newContext({
      viewport: shot.viewport,
      deviceScaleFactor: shot.scale,
      colorScheme: "dark",
      reducedMotion: "reduce",
    });
    await context.addInitScript(() => localStorage.setItem("theme", "dark"));
    const page = await context.newPage();
    await page.goto(`${BASE}/es`);
    await page.waitForLoadState("networkidle");

    if (shot.target !== "viewport") {
      // Un bloque: el viewport pasa a medir lo que el bloque y se hace scroll
      // hasta él. Con fullPage los sticky (el índice de Proyectos) quedaban
      // corridos y el nav fijo aparecía en el medio.
      // Dos pasos: el alto del bloque no depende del viewport, pero su posición
      // sí (el hero mide 100vh), así que la posición se mide después de cambiarlo.
      const span = (sels) =>
        page.evaluate((sels) => {
          const rs = sels.map((s) => document.querySelector(s).getBoundingClientRect());
          const top = Math.min(...rs.map((r) => r.top)) + scrollY - 24;
          const bottom = Math.max(...rs.map((r) => r.bottom)) + scrollY;
          return { top: Math.max(0, top), height: bottom - Math.max(0, top) };
        }, sels);
      const { height } = await span(shot.target);
      await page.setViewportSize({
        width: shot.viewport.width,
        height: Math.round(Math.min(height, shot.maxHeight ?? Infinity)),
      });
      const { top } = await span(shot.target);
      await page.evaluate((y) => {
        document.querySelector(".nav").style.visibility = "hidden";
        scrollTo(0, y);
      }, top);
      await page.waitForTimeout(300);
      await page.waitForLoadState("networkidle");
    }
    const png = await page.screenshot();

    // PNG → WebP en el canvas del navegador, bajando la calidad si hace falta.
    const { webp, quality } = await page.evaluate(
      async ({ b64, max }) => {
        const img = new Image();
        img.src = `data:image/png;base64,${b64}`;
        await img.decode();
        const canvas = new OffscreenCanvas(img.width, img.height);
        canvas.getContext("2d").drawImage(img, 0, 0);
        for (let q = 0.85; q >= 0.4; q -= 0.05) {
          const blob = await canvas.convertToBlob({ type: "image/webp", quality: q });
          if (blob.size <= max || q - 0.05 < 0.4) {
            const bytes = new Uint8Array(await blob.arrayBuffer());
            let bin = "";
            for (const b of bytes) bin += String.fromCharCode(b);
            return { webp: btoa(bin), quality: q };
          }
        }
      },
      { b64: png.toString("base64"), max: MAX_BYTES }
    );

    const data = Buffer.from(webp, "base64");
    await writeFile(join(OUT, `${shot.name}.webp`), data);
    const kib = (data.length / 1024).toFixed(1);
    const over = data.length > MAX_BYTES ? "  ← pasa de 150 KB" : "";
    console.log(`docs/screenshots/${shot.name}.webp  ${kib} KiB  (calidad ${quality.toFixed(2)})${over}`);
    await context.close();
  }

  await browser.close();
} finally {
  server.kill();
}
