import { defineConfig, devices } from "@playwright/test";

/**
 * Pruebas de humo (tests/smoke.spec.ts). Corren SIEMPRE contra el build de
 * producción (`next build && next start`), nunca `next dev`: dev usa
 * StrictMode con doble montaje y la CSP lleva 'unsafe-eval' (ver
 * next.config.ts), así que no se parece a lo que se despliega.
 *
 * Solo chromium: para una página de contenido estática no vale la pena
 * mantener dos navegadores. Safari lo sigo revisando a mano en el iPhone.
 *
 * Nota para mí mismo (y para quien clone esto en otra máquina): `npx
 * playwright install chromium` se me colgó siempre con timeout a los 30s del
 * downloader interno de playwright-core, aunque `curl` bajaba los mismos .zip
 * sin drama en segundos — huele a algo con happyEyeballs/IPv6 en mi red, no a
 * que el CDN esté caído. Lo saqué bajando los paquetes (chromium,
 * chromium-headless-shell, ffmpeg, winldd) a mano con Node y extrayéndolos yo
 * mismo en `%LOCALAPPDATA%\ms-playwright\<paquete>-<rev>\`, con un archivo
 * `INSTALLATION_COMPLETE` vacío adentro de cada carpeta (es lo único que
 * Playwright chequea para saber que ya está instalado). Si en otra máquina
 * `playwright install` también se cuelga, es el mismo camino.
 */
export default defineConfig({
  testDir: "./tests",
  testMatch: "smoke.spec.ts",
  // Aborta la corrida entera si :3000 resulta ser `next dev` reusado en vez
  // de `next start` (ver tests/support/globalSetup.ts) — cierra el agujero
  // de reuseExistingServer de más abajo.
  globalSetup: "./tests/support/globalSetup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run build && npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 5 * 60 * 1000,
  },
});
