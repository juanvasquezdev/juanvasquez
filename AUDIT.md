# Auditoría Técnica — Portafolio Personal

Auditoría del estado real del código (verificado línea por línea, no contra lo que dice CLAUDE.md). Organizada por **fases de prioridad de implementación**. Actualizado el 2026-09-10 tras verificar cada ítem contra el código actual: las Fases 1-5 y dos de los tres ítems de Fase 6 ya están implementados. Se deja constancia de qué commit cerró cada fase y se agrega la Fase 7 con hallazgos nuevos de la segunda pasada.

---

## Fase 1 — Seguridad y bugs que rompen funcionalidad (crítico) — ✅ RESUELTA

- [x] **`index.html:49`** — extensión `.jpg` → `.jpeg` corregida.
- [x] **`css/style.css` `.nav-links` móvil** — `-webkit-backdrop-filter` agregado.
- [x] **`index.html:74`** — fecha de nacimiento completa removida del hero.
- [x] **7 `onerror` inline en `<img>`** — eliminados; fallback centralizado en `js/script.js`.

*(commit `48b0e4d` — bug hero/backdrop-filter/fecha; onerror centralizado junto con la optimización de imágenes)*

---

## Fase 2 — Interfaz / UX y Accesibilidad — ✅ RESUELTA

- [x] Contraste `--accent-dim` sobre fondo oscuro — token nuevo `--accent-dim-text` (cumple 4.5:1).
- [x] `<main>` + skip-link antes de la nav.
- [x] `:focus-visible` en `.nav-link` y `.contact-item`.
- [x] `.back-to-top` alterna `tabIndex` (0/-1) según visibilidad (`js/script.js:216-219`), ya no es focuseable invisible.
- [x] `@media (max-height: 500px)` para el hero en landscape móvil.
- [x] `.nav-toggle` con padding de 14px (~44×44px de zona táctil).

*(commit `2d7ac61`)*

---

## Fase 3 — Organización, arquitectura y DRY — ✅ RESUELTA

- [x] Gradiente `135deg` centralizado en `--gradient-surface` / `-reverse` / `-deep`.
- [x] Sombras centralizadas en `--shadow-sm` / `--shadow-md`.
- [x] `style="margin-top: ...px"` inline reemplazado por clase utilitaria `.mt-lg` / `.mt-sm`.
- [x] `assets/fonts/` y `assets/icons/` ya tienen contenido real (dejaron de estar vacías).

*(commit `a3f6b13`)*

---

## Fase 4 — Rendimiento — ✅ RESUELTA por completo (la salvedad de Fase 7 se cerró con la migración a Next.js)

- [x] Versiones `.webp` con `<picture>` para las imágenes principales — **superado**: con la migración a Next.js (ver Fase 8) se reemplazó por `next/image`, que genera WebP/AVIF bajo demanda para cualquier imagen sin mantener archivos `.webp` a mano.
- [x] `width`/`height` explícitos en todas las `<img>` — CLS resuelto.
- [x] `fetchpriority="high"` en la capa 1 del hero, `"low"` en capas 2-3 — ahora vía la prop `priority` de `next/image`.
- [x] Fuentes autoalojadas — ahora vía `next/font/local` (`app/fonts.ts`), en vez de `@font-face` manual.

*(commit `99f1765`)* en el sitio estático original; superada por la migración a Next.js (Fase 8).

---

## Fase 5 — SEO — ✅ RESUELTA (salvo canonical/robots, bloqueados por dominio)

- [x] Open Graph + Twitter Card.
- [x] Favicon + apple-touch-icon.
- [x] `theme-color`.
- [x] Jerarquía de encabezados de `.goal-card` bajada a `h4`.
- [ ] `<link rel="canonical">` y `robots.txt`/`sitemap.xml` — **Baja**, sigue bloqueado hasta confirmar dominio final.

*(commit `7c993ef`)*

---

## Fase 6 — Mejoras opcionales / nice-to-have

- [x] **CSP** — agregada en el sitio estático (`script-src` estricto, `style-src` con `'unsafe-inline'`) *(commit `585a551`)*. **Actualizada con la migración a Next.js (Fase 8):** ahora `script-src` también necesita `'unsafe-inline'` — se intentó nonce por request vía `proxy.ts` primero, pero se verificó que no funciona en una página prerenderizada como estática (el nonce no llega a los `<script>` inline que genera Next para el streaming de RSC). Ver CLAUDE.md, deuda técnica ítem 9, para el detalle completo.
- [x] **`rel="noreferrer"`** en los links de Instagram y LinkedIn, sumado al `noopener` ya existente. *(commit `eb65fe4`)*
- [ ] **JSON-LD `schema.org/Person`** — **sigue sin implementar, a propósito.** El propio ítem original lo ataba a que existan las secciones Stack/Proyectos (que hoy no existen, ver brecha narrativa en `CLAUDE.md`); implementarlo ahora obligaría a inventar esa estructura sin que Juan la haya confirmado. Queda pendiente hasta esa decisión.

---

## Fase 7 — Hallazgos nuevos (segunda pasada, 2026-09-10, sitio estático)

- [ ] **`public/images/` (antes `assets/images/`)** — **~19MB en 15 imágenes sin usar** (`foto_nike`, `fotogrupal1`, `posando1`, `foto_saltoperu1`, `grupal2`, `salto1`, `salto2`, `salto3`, `vista_epica`, `epica_trasera`, `epica_trasera2`, `foto_salto1`, `foto_blanconegro`, `foto_posando2`, `foto_secuencial`, jpeg+webp cada una). No aparecen referenciadas en ningún componente y están trackeadas en git. — **Media**
  Por qué importa: pesan el repo sin aportar nada hoy; `foto_nike.jpeg` sola son 2.98MB.
  **Sigue abierto tras la migración a Next.js, a propósito:** Juan confirmó explícitamente que migran igual (no se borran) porque se van a usar en la fase de rediseño (Stack/Proyectos) ya aprobada por separado — no es un olvido, es la decisión tomada.

- [x] **Fallbacks JPEG sin comprimir** — `pb2.04.jpeg` (4.5MB), `foto_nike.jpeg` (2.98MB), `foto_blanconegro.jpeg` (2.0MB), `podio-mayores.jpeg` (1.8MB). — **RESUELTO con la migración a Next.js (Fase 8).**
  `next/image` comprime y sirve WebP/AVIF bajo demanda para cualquier imagen del proyecto, sin importar si tiene o no un `.webp` generado a mano — se verificó con `next build && next start`: `pb2.04.jpeg` (4.5MB) se sirve en ~208KB a 1080px vía `/_next/image`. Ya no depende de generar fallbacks manualmente.

---

## Fase 8 — Migración a Next.js (App Router + TypeScript + Tailwind), 2026-09-10

Alcance completo: ver CLAUDE.md → Stack tecnológico para el detalle de decisiones. Resumen de qué se resolvió de pasada:

- [x] Scaffold Next.js 16 (App Router) + TypeScript + Tailwind 3, sin `output: 'export'` (Vercel). *(commit `684d0dc`)*
- [x] Tokens de `css/style.css` traducidos a `tailwind.config.ts` (colors/spacing/shadows/gradients/fontFamily), CSS portado a `app/globals.css`. *(commit `684d0dc`)*
- [x] Fuentes a `next/font/local`, favicon/apple-icon a la convención de archivos especiales de Next. *(commit `efa10bf`)*
- [x] Imágenes a `public/images/`; se descartaron los `.webp` manuales de las 5 fotos que sí se usan (redundantes con lo que hace `next/image` solo) — las 15 sin usar migraron intactas. *(commit `1f5a991`)*
- [x] Interactividad de `script.js` reimplementada como 8 hooks de React con cleanup. *(commit `7cc1c76`)*
- [x] Las 9 secciones + nav/footer/back-to-top portadas a componentes, con el copy y los datos reales. *(commit `22cc6cc`)*
- [x] Sitio estático legacy (`index.html`, `css/`, `js/`) eliminado del repo. *(commit `4d2c2c7`)*
- [x] CSP re-implementada vía `next.config.ts` `headers()` (no `proxy`/nonce, ver deuda técnica ítem 9 en CLAUDE.md para el porqué).
- [x] Fallback de imágenes rotas: dejó de ser un listener delegado global (`onerror` document-wide) y pasó a ser estado local de React por imagen (`onError` en `Hero.tsx`/`Galeria.tsx`) — más idiomático, ya no aplica el motivo original de CSP que forzaba centralizarlo.
- [ ] JSON-LD `schema.org/Person` — sigue sin implementar, mismo motivo que antes (depende de Stack/Proyectos).

*(commits `684d0dc`, `efa10bf`, `1f5a991`, `7cc1c76`, `22cc6cc`, `4d2c2c7`)*

---

## Cómo verificar todo esto sin mí

- `git log --oneline -15` — confirma qué commit cerró cada fase.
- Los checkboxes marcados `[x]` se verificaron leyendo el código actual (y, para la Fase 8, corriendo `next build && next start` + `curl`), no asumidos desde el título del commit.
