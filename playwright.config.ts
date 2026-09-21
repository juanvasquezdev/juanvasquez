import { defineConfig, devices } from "@playwright/test";

/**
 * Suite base del tester (ver .claude/agents/tester.md). Corre SIEMPRE contra
 * el build de producción (`next build && next start`), nunca `next dev`:
 * dev usa StrictMode con doble montaje (no representativo) y la CSP lleva
 * 'unsafe-eval' solo en dev (ver proxy.ts) — probar ahí escondería una CSP
 * rota en producción real.
 *
 * chromium y webkit. El WebKit de Playwright APROXIMA el motor de Safari
 * pero NO es Safari en un iPhone real — eso sigue pendiente de verificación
 * manual de Juan (sticky, Lenis y scroll-driven animations difieren ahí).
 *
 * Nota para mí mismo (y para quien clone esto en otra máquina): `npx
 * playwright install chromium webkit` se me colgó siempre con timeout a los
 * 30s del downloader interno de playwright-core, aunque `curl` bajaba los
 * mismos .zip sin drama en segundos — huele a algo con happyEyeballs/IPv6 en
 * mi red, no a que el CDN esté caído. Lo saqué bajando los 5 paquetes
 * (chromium, chromium-headless-shell, webkit, ffmpeg, winldd) a mano con
 * Node y extrayéndolos yo mismo en `%LOCALAPPDATA%\ms-playwright\
 * <paquete>-<rev>\`, con un archivo `INSTALLATION_COMPLETE` vacío adentro de
 * cada carpeta (es lo único que Playwright chequea para saber que ya está
 * instalado — lo vi leyendo el propio `registry` del paquete). Si en otra
 * máquina `playwright install` también se cuelga, es el mismo camino.
 *
 * El CI todavía NO corre esta suite — `.github/workflows/ci.yml` hoy es
 * lint + tsc + build nomás. Falta agregarle el paso de Playwright, y si el
 * timeout de arriba resulta ser de este entorno y no de mi red, en el
 * runner de GitHub puede que ni haga falta el rodeo.
 */
export default defineConfig({
  testDir: "./tests",
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
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: {
    command: "npm run build && npm start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 5 * 60 * 1000,
  },
});
