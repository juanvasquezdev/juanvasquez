import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { checkBilingualCoverage } from "./support/bilingualCoverage";
import { LOCALES } from "../content/types";

/**
 * Barrido permanente de claves `es`/`en` en `content/`. Nota de Juan sobre
 * por qué existe: que al traducir la página se vea todo bien, sin textos en
 * blanco — una clave faltante o vacía en un nodo bilingüe no rompe el build
 * ni `tsc` (ver el límite real de eso en tests/support/bilingualCoverage.ts),
 * y aparece en producción como un hueco de texto en el idioma que le falta.
 *
 * No usa ningún fixture de navegador (`page`/`request`): lee `content/*.ts`
 * del disco como TEXTO y los recorre con el compilador de TypeScript (ver
 * tests/support/bilingualCoverage.ts para el porqué de medir a nivel de AST y
 * no importando el módulo ya construido). Por eso corre rápido y, en
 * principio, no necesita chromium ni webkit — pero tal como está armado hoy
 * `playwright.config.ts`, cualquier invocación de `npx playwright test`
 * (aunque apunte solo a este archivo) igual dispara el `webServer` global
 * (`npm run build && npm start`) y el `globalSetup.ts` que hace `fetch` a
 * `localhost:3000`, así que hoy no corre "gratis" sin levantar el sitio.
 * Para que corra sin navegador de verdad en CI haría falta un paso aparte
 * (`node`/`vitest`/`ts-node`, fuera de la config de Playwright) que no está
 * escrito todavía.
 */
const CONTENT_DIR = path.join(__dirname, "..", "content");

// Los seis archivos de contenido bilingüe. `types.ts` queda afuera a
// propósito: no tiene datos, son las formas (`L<T>`, etc.) que el resto usa.
const CONTENT_FILES = [
  "profile.ts",
  "projects.ts",
  "athletics.ts",
  "stack.ts",
  "timeline.ts",
  "ui.ts",
] as const;

for (const file of CONTENT_FILES) {
  test(`content/${file}: todo nodo bilingüe tiene "es" y "en", y ningún vacío sin marcador`, () => {
    const filePath = path.join(CONTENT_DIR, file);
    const source = fs.readFileSync(filePath, "utf8");
    const violations = checkBilingualCoverage(source, `content/${file}`, LOCALES);

    expect(
      violations,
      `content/${file} — ${violations.length} nodo(s) bilingüe(s) con problema:\n` +
        violations.map((v) => `  línea ${v.line} [${v.kind}]: ${v.detail}`).join("\n")
    ).toEqual([]);
  });
}
