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

## Fase 4 — Rendimiento — ✅ RESUELTA (con una salvedad, ver Fase 7)

- [x] Versiones `.webp` con `<picture>` para las imágenes principales.
- [x] `width`/`height` explícitos en todas las `<img>` — CLS resuelto.
- [x] `fetchpriority="high"` en la capa 1 del hero, `"low"` en capas 2-3.
- [x] Fuentes autoalojadas (`assets/fonts/*.woff2`), sin `fonts.googleapis.com`.

*(commit `99f1765`)* — la compresión de los JPEG de **fallback** (los que sirve `<picture>` a navegadores sin soporte WebP) quedó incompleta; ver Fase 7.

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

- [x] **CSP** — agregada. `script-src` estricto (`'self'`, sin `unsafe-inline`, ya no hay `onerror`/`on*=""` en el HTML); `style-src` necesita `'unsafe-inline'` porque `.bar-marker` posiciona vía `style="--pos: X%"` inline y `js/script.js` muta `.style.opacity`/`.style.width`/`.style.display` en varios puntos — ambos casos caen bajo `style-src` en la spec de CSP. *(commit `585a551`)*
- [x] **`rel="noreferrer"`** en los links de Instagram y LinkedIn, sumado al `noopener` ya existente. *(commit `eb65fe4`)*
- [ ] **JSON-LD `schema.org/Person`** — **sigue sin implementar, a propósito.** El propio ítem original lo ataba a que existan las secciones Stack/Proyectos (que hoy no existen, ver brecha narrativa en `CLAUDE.md`); implementarlo ahora obligaría a inventar esa estructura sin que Juan la haya confirmado. Queda pendiente hasta esa decisión.

---

## Fase 7 — Hallazgos nuevos (segunda pasada, 2026-09-10)

- [ ] **`assets/images/`** — **~19MB en 15 imágenes sin usar** (`foto_nike`, `fotogrupal1`, `posando1`, `foto_saltoperu1`, `grupal2`, `salto1`, `salto2`, `salto3`, `vista_epica`, `epica_trasera`, `epica_trasera2`, `foto_salto1`, `foto_blanconegro`, `foto_posando2`, `foto_secuencial`, jpeg+webp cada una). No aparecen referenciadas en ningún `.html`/`.css`/`.js` y están trackeadas en git (`git ls-files` las confirma). — **Media**
  Por qué importa: pesan el repo y el historial sin aportar nada hoy; `foto_nike.jpeg` sola son 2.98MB.
  Fix sugerido: confirmar con Juan si van a usarse (¿ampliar la Galería? ¿sección Stack/Proyectos futura?) antes de borrarlas — podrían ser material que todavía no se integró, no basura.

- [ ] **Fallbacks JPEG sin comprimir** — `pb2.04.jpeg` (4.5MB), `foto_nike.jpeg` (2.98MB), `foto_blanconegro.jpeg` (2.0MB), `podio-mayores.jpeg` (1.8MB). — **Media**
  Por qué importa: son el `<img>` dentro de `<picture>` que sirve a cualquier navegador sin soporte WebP (raro hoy, pero existe) — ese caso sigue cargando el archivo pesado original sin optimizar, aunque el `.webp` principal ya esté bien.
  Fix sugerido: comprimir también el JPEG de fallback (no solo generar el `.webp`), manteniendo la misma resolución.

---

## Cómo verificar todo esto sin mí

- `git log --oneline -10` — confirma qué commit cerró cada fase.
- Los checkboxes marcados `[x]` se verificaron leyendo el código actual, no asumidos desde el título del commit.
