# Auditoría Técnica — Portafolio Personal

Auditoría del estado real del código (verificado línea por línea, no contra lo que dice CLAUDE.md ni asumido desde los mensajes de commit). Organizada por **fases de prioridad de implementación**. Última actualización: 2026-09-10, tras la migración completa a Next.js (Fase 8) y el endurecimiento de CSP + refactor de interactividad a `motion`/`lenis` (Fase 9). Estado real hoy: **Fases 1-6 y 8-9 resueltas por completo** (Fase 4 con un trade-off de performance documentado en Fase 9, no un pendiente). Siguen abiertas, a propósito: Fase 7 (imágenes sin usar, esperando la fase de rediseño) y el JSON-LD de Fase 6/8 (depende de que existan las secciones Stack/Proyectos).

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

## Fase 4 — Rendimiento — ✅ RESUELTA (con un trade-off nuevo, ver Fase 9)

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

- [x] **CSP** — agregada en el sitio estático (`script-src` estricto, `style-src` con `'unsafe-inline'`) *(commit `585a551`)*. Pasó por `next.config.ts` `headers()` con la migración a Next.js, y terminó en nonce estricto por request (`script-src` sin `unsafe-inline`) en la Fase 9 — ver ahí el detalle completo, incluyendo el trade-off de performance que costó.
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

## Fase 9 — CSP estricta con nonce + hooks a React idiomático (motion/lenis), 2026-09-10

- [x] **CSP: nonce por request, sin `unsafe-inline` en `script-src`.** `proxy.ts` genera un nonce distinto en cada response; `app/page.tsx` fuerza `dynamic = "force-dynamic"` (requisito, no opcional: una página estática no puede tener un nonce por request embebido en su HTML). Se verificó con `next build && next start` + `curl` que el nonce del header `Content-Security-Policy` coincide con el de los dos `<script>` inline que genera Next — antes de forzar dynamic rendering NO coincidía (se había probado y descartado en la Fase 8). Se evaluaron hashes SHA-256 de los scripts como alternativa a "quedarse estático" y se descartó: requeriría un paso de build que lea el HTML generado, calcule hashes y los inyecte en la config de headers, frágil ante cualquier cambio de versión de Next o de contenido — no calificaba como "mantenible". `style-src` se queda con `'unsafe-inline'` (no hay forma de darle nonce a atributos `style=""` sueltos, solo a elementos `<style>`, y `.bar-marker` + varios componentes siguen usando `style` inline). *(commit `4d87f6a`)*
- [x] **Trade-off aceptado y documentado:** `/` pasó de `○ (Static)` a `ƒ (Dynamic)` en el build — ya no se sirve desde cache estática de Vercel, se renderiza en cada request. Confirmado con Juan como consecuencia esperada al pedir la opción "más estricta que sea real y mantenible" — no es una regresión no vista.
- [x] **Hooks de interactividad reescritos a React idiomático.** Se borraron los 8 hooks imperativos (`useScrollReveal`, `useCounters`, `useBarChart`, `useHeroCrossfade`, `useActiveNavLink`, `useBackToTop`, `useNavbarScroll`, `useMobileMenu`) y `Interactivity.tsx`. Reemplazo:
  - `motion` (paquete npm vigente — se confirmó que `framer-motion` y `motion` resuelven ambos a la misma versión, 13.2.0, antes de instalar) para: reveals (`whileInView` + `variants`, con stagger real vía `staggerChildren` en vez del `index % 4` a mano), contador animado (`useMotionValue` + `animate` + `useInView`, componente nuevo `AnimatedStat.tsx`), crossfade del hero (`useScroll` + `useTransform`, matemática del "floatIndex" original resuelta como keyframes), barra de progreso (`useInView` + `animate` en el `width`), navbar y back-to-top (`useScroll` + `useMotionValueEvent`).
  - `lenis` (paquete vigente, no `@studio-freight/lenis` que es el nombre viejo/deprecado) para scroll suave, vía `<ReactLenis root>` en `components/SmoothScroll.tsx` — reemplaza `scroll-behavior: smooth` de `globals.css` (se quitó, competían).
  - `hooks/useActiveSection.ts` es el único que sigue con `IntersectionObserver` a mano — es scrollspy real (comparar qué sección de varias está visible), no hay equivalente en Motion; lo que sí cambió es que ya no toca el DOM directo, devuelve el id activo como estado de React.
  - Accesibilidad: `MotionConfig reducedMotion="user"` cubre las animaciones de `motion.*`; Lenis se desactiva por completo (no solo "más lento") si `prefers-reduced-motion: reduce`, con fallback a scroll nativo instantáneo en nav y back-to-top.
  *(commit `55bd9e4`, incluye también la actualización de CLAUDE.md regla #2)*
- [x] **`.reveal`/`.reveal.is-visible` y la `transition: width` de `.bar-fill` se borraron de `app/globals.css`** — CSS muerto, ahora las anima Motion.

*(commits `4d87f6a`, `55bd9e4`)*

---

## Cómo verificar todo esto sin mí

- `git log --oneline -20` — confirma qué commit cerró cada fase.
- Los checkboxes marcados `[x]` se verificaron leyendo el código actual (y, para las Fases 8-9, corriendo `next build && next start` + `curl` contra el servidor real — incluyendo comparar el nonce del header CSP contra el de los `<script>` inline del HTML), no asumidos desde el título del commit.
