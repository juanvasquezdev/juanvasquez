# CLAUDE.md — Portafolio Personal (Juan José Vásquez Giraldo)

Este archivo es contexto de proyecto para Claude Code. Léelo completo antes de tocar cualquier archivo. Juan lleva la dirección del proyecto (estructura, prioridades, qué se ajusta o no) — tu rol es de complemento técnico: señalar problemas y proponer fixes, explicar paso a paso, no reescribir secciones completas que no se te pidieron explícitamente ni asumir estructura sin preguntar.

## Qué es esto
Página web personal (atleta colombiano de salto alto + programador, Cali, Colombia) que funciona como carta de presentación: quién es, perfil como desarrollador, proyectos, stack, experiencia, formación, fotos y su relación con el deporte y la tecnología.

## Estructura narrativa (no romper sin confirmar con Juan)
El sitio está pensado como las fases de un salto de altura:

- Hero → aproximación (primera impresión, propuesta de valor)
- Sobre mí → impulso (quién es: dev + atleta, sin sonar a dos hojas de vida pegadas)
- Stack → curva (tecnologías agrupadas por categoría — nada de barras de progreso genéricas)
- Proyectos → despegue (cada proyecto como caso: problema → decisión → arquitectura → resultado)
- Deportivo → vuelo (medallas, historial, progresión del PR — mismo nivel de diseño que la parte técnica)
- Contacto → aterrizaje (simple, con links reales)

**Código de color con significado:** gris = universal, azul = mundo técnico, coral = mundo atlético.
Cualquier elemento nuevo respeta ese código.

**Estado real hoy (2026-09-10, tras migrar a Next.js):** la app (`app/page.tsx` + `components/`) solo cubre el lado atlético (Inicio, Sobre mí, Progresión/"La Barra", Galería, Logros, Formación, Técnica del salto, Metas, Contacto), portado 1:1 desde el `index.html` que existía antes de la migración. No existen todavía las secciones "Stack" ni "Proyectos" (mundo técnico/dev), ni el color coral aparece en Tailwind/CSS. Esto sigue siendo una brecha conocida entre la visión completa y el código — no la cierres por tu cuenta, pregúntale a Juan si ya toca construir esas secciones o si van en otra fase (esa fase de rediseño es la que reutilizará las ~19MB de fotos sin usar que migraron intactas a `public/images/`, ver Deuda técnica ítem 8).

## Stack tecnológico

**Hoy (migrado 2026-09-10):** Next.js (App Router) + TypeScript + Tailwind, desplegado en Vercel (sin `output: 'export'`, a propósito — así `next/image` optimiza imágenes bajo demanda). Ya no es HTML/CSS/JS estático; sí sigue sin backend/base de datos, es un sitio de contenido estático servido por Next.

- **Tokens:** siguen viviendo como variables CSS en `:root` (`app/globals.css`), pero ahora también están registrados como tokens propios en `tailwind.config.ts` (`theme.extend.colors/spacing/boxShadow/backgroundImage/fontFamily`), referenciando esas mismas custom properties — nunca la paleta default de Tailwind. Los dos archivos deben mantenerse en sincronía manualmente si cambia un valor base (no hay generación automática todavía).
- **Componentes/hooks vivos como CSS clásico + DOM queries, no 100% "React idiomático":** por velocidad en la migración, las secciones (`components/*.tsx`) reusan las mismas clases CSS del sitio viejo (`.card`, `.nav-link`, etc.) en vez de reescribirse como utilities de Tailwind, y la interactividad (`hooks/*.ts`) sigue el mismo patrón de `getElementById`/`querySelectorAll` + `IntersectionObserver` que tenía `script.js`, ahora dentro de hooks de React con cleanup. Es deliberado para minimizar riesgo de regresión visual/funcional en una migración rápida — se puede ir atomizando a Tailwind puro más adelante, sección por sección, sin que sea obligatorio hacerlo todo de una.
- **Fuentes:** autoalojadas vía `next/font/local` (`app/fonts.ts`), ya no se cargan desde `fonts.googleapis.com`.
- **Imágenes:** `next/image` en todos lados (`fill` + clases CSS existentes para el object-fit) — comprime y sirve WebP/AVIF bajo demanda, ya no hace falta generar `.webp` a mano ni usar `<picture><source>`.
- **Transiciones:** siguen siendo CSS transitions/animations nativas, portadas tal cual desde `css/style.css`. La **View Transitions API** seguía en el roadmap pero no se implementó en esta migración (no estaba en el alcance pedido) — sigue pendiente como decisión futura, no se asuma que ya está.
- **CSP:** vía `headers()` en `next.config.ts` (no vía `middleware`/`proxy` con nonce — se probó ese patrón primero y se descartó porque esta página es estática y el nonce por request nunca llega a inyectarse en el HTML cacheado en build time; ver Deuda técnica ítem 9 para el detalle).

## Reglas no negociables

1. **Design tokens:** todo color, spacing o valor reutilizable vive en variables CSS (`:root`), nunca hardcodeado. Si necesitas un color nuevo, créalo como variable primero, no lo escribas en hex directo en una regla.
2. **Librerías de animación: `motion` y `lenis`, aprobadas — nada más.** Esta regla decía "cero librerías de animación pesadas" cuando el sitio era HTML/CSS/JS estático sin build step; esa razón dejó de aplicar con la migración a Next.js del 2026-09-10. Decisión tomada (no una nota para revisar después): `motion` (el paquete vigente en npm — antes `framer-motion`, hoy renombrado; ver `package.json`) para reveals al hacer scroll, hover states, contadores animados y el crossfade del hero; `lenis` para scroll suave — ambas ya son dependencias reales del proyecto (`hooks/`, `components/*.tsx`, `components/SmoothScroll.tsx`). Sigue sin ser un cheque en blanco: nada de GSAP, AOS, ni ninguna otra sin que Juan la apruebe explícitamente — y toda animación nueva con `motion`/`lenis` debe respetar `prefers-reduced-motion` (ver `MotionConfig reducedMotion="user"` en `SmoothScroll.tsx`), no es opcional.
3. **DRY:** si un patrón visual (gradiente, sombra, layout, easing) se repite 2 o más veces, se centraliza en una variable o clase utilitaria — no se copia y pega la declaración.
4. **No reescribas secciones completas** que no se te pidieron. Señala el problema, explica por qué está mal, propone el fix — deja que Juan decida si lo aplicas.
5. **No asumas estructura.** Si tienes dudas sobre dónde va algo o cómo encaja con la narrativa del salto, pregunta antes de mover cosas.

## Flujo de trabajo: sacar inspiración de Framer / Motion.dev / sitios de referencia

Cuando Juan pida traer ideas de headers, animaciones o tipografías desde sitios como framer.com (templates), motion.dev (librería de animación, antes Framer Motion) u otros:

1. Se navega el sitio de referencia solo para identificar el **patrón**: estructura del header, curva de easing, duración/timing, jerarquía tipográfica, pairing de fuentes, tipo de scroll-trigger. Nunca para copiar código, assets o textos literalmente.
2. El patrón se **re-implementa** en este stack — con Tailwind + `motion`/`lenis` (las librerías de animación ya aprobadas, ver Reglas no negociables #2) o CSS puro/Web Animations API cuando no haga falta más que eso. **Nunca se instala una librería nueva solo porque el sitio de referencia la usa** — si el patrón no se puede lograr con lo que ya hay en el proyecto (`motion`, `lenis`, CSS), se pregunta antes de agregar una dependencia nueva, no se asume.
3. Si la fuente identificada no está autoalojada, se descarga (respetando su licencia) y se sirve localmente desde el proyecto — nunca enlazada al CDN del sitio de referencia.
4. Todo lo que se traiga se adapta al sistema de tokens y al código de color existente (gris/azul/coral) del proyecto — no se pega el estilo visual del sitio de referencia tal cual, se traduce a la identidad de este portafolio.
5. Si el patrón requiere una técnica nueva (ej. scroll-driven animations, `@starting-style`, anchor positioning), verifica soporte de navegadores antes de usarla como base — evitar romper Safari es una prioridad conocida de este proyecto.

## Deuda técnica conocida (última auditoría: 2026-09-10)

1. ~~**Bug — `index.html:49`**~~ — **RESUELTO.** Extensión corregida a `.jpeg`.
2. ~~**Bug compat Safari — `.nav-links` móvil**~~ — **RESUELTO.** `-webkit-backdrop-filter` agregado en la tercera instancia.
3. ~~**Design tokens: hex hardcodeados**~~ — **RESUELTO (2026-09-10).** Se limpiaron todos los hex sueltos y se unificó la paleta a un esquema monocromático azul/blanco/negro. Tokens nuevos en `:root`: `--accent-rgb`, `--bg-rgb` (para poder hacer `rgba(var(--accent-rgb), alpha)` en vez de repetir números crudos), `--white`, `--ink`, `--surface-3` (azul profundo que reemplazó el marrón `#241a06` de `.goal-primary`). También se corrigió un segundo azul "fantasma" (`rgba(77,127,219,...)`) que no coincidía con `--accent` y rompía la armonía visual. **Regla desde ahora:** cualquier color nuevo debe derivar de estos tokens — no se introduce un hue distinto al azul sin confirmar con Juan.
4. ~~**DRY: gradiente repetido**~~ — **RESUELTO.** Centralizado en `--gradient-surface` / `-reverse` / `-deep`, y las sombras repetidas en `--shadow-sm` / `--shadow-md`.
5. ~~**DRY / mantenibilidad: `onerror` inline**~~ — **RESUELTO.** Fallback de imágenes rotas centralizado en `js/script.js`; ya no hay handlers `on*=""` en el HTML, lo que además deja el camino libre para CSP estricto.
6. ~~**SEO**~~ — **RESUELTO.** OG tags, Twitter Card, favicon + apple-touch-icon, `theme-color`, jerarquía de encabezados corregida. Pendiente solo `canonical` (bloqueado por definir dominio final) y `robots.txt`/`sitemap.xml`.
7. **Performance — parcial.** `width`/`height` en todas las `<img>` (CLS resuelto) y fuentes autoalojadas (`assets/fonts/*.woff2`, sin Google Fonts CDN) — **RESUELTO**. Sigue pendiente: varios JPEG de respaldo (el que carga `<picture>` en navegadores sin soporte WebP) siguen sin comprimir — `pb2.04.jpeg` 4.5MB, `foto_nike.jpeg` 2.98MB, `foto_blanconegro.jpeg` 2.0MB, `podio-mayores.jpeg` 1.8MB — el `.webp` correspondiente sí está optimizado, pero el fallback no se tocó.
8. **Repo: ~19MB de imágenes sin usar.** `public/images/` (antes `assets/images/`, migró tal cual con la app) tiene 15 archivos (`foto_nike`, `fotogrupal1`, `posando1`, `salto1-3`, `vista_epica`, `epica_trasera`, `epica_trasera2`, `foto_salto1`, `foto_saltoperu1`, `grupal2`, `foto_secuencial`, `foto_blanconegro`, `foto_posando2`, jpeg+webp) que no se referencian en ningún `.html`/`.css`/`.js` — están trackeados en git, pesan el repo y no salen sobrantes en ningún build. Pendiente decidir con Juan si se usan en la sección Galería/Stack futura o se borran.
9. **CSP** — **RESUELTO, cambió de mecanismo con la migración a Next.js (2026-09-10).** Ya no es la `<meta http-equiv="CSP">` estática del HTML viejo: ahora vive en `next.config.ts` (`headers()`). Se probó primero un `proxy.ts` (ex-`middleware.ts`) generando un nonce por request, siguiendo el patrón recomendado por Next para CSP estricta — se descartó tras verificarlo con `next build && next start`: la página se prerenderiza como estática, así que el nonce nunca queda embebido en los `<script>` inline que el propio Next genera (streaming de RSC), y un navegador real los bloquea bajo `script-src 'nonce-X' 'strict-dynamic'`. Por eso `script-src` quedó con `'unsafe-inline'`, igual que `style-src` (que ya lo necesitaba desde antes por `.bar-marker` posicionando vía `style="--pos: X%"` inline y los hooks mutando `.style.*` — ver `hooks/useHeroCrossfade.ts`, `hooks/useBarChart.ts`, `hooks/useBackToTop.ts`). Si más adelante se quiere CSP con nonce de verdad, la página tendría que dejar de ser estática (`export const dynamic = 'force-dynamic'`), lo cual tiene su propio costo de performance — no se ha decidido hacer eso.
10. **JSON-LD `schema.org/Person`** — sigue sin implementar a propósito: depende de que existan las secciones Stack/Proyectos (ver brecha narrativa arriba), y no se quiso asumir esa estructura sin confirmar con Juan. No cambió con la migración a Next.js.
11. **Fallbacks JPEG sin comprimir — RESUELTO con la migración a Next.js.** `next/image` optimiza y sirve WebP/AVIF bajo demanda para cualquier imagen (se verificó: `pb2.04.jpeg` de 4.5MB baja a ~208KB servida a 1080px vía `/_next/image`), así que ya no hace falta comprimir manualmente ningún fallback ni mantener `.webp` a mano — por eso se borraron los `.webp` de las 5 fotos que sí se usan (quedaba duplicado con lo que ahora hace `next/image` solo). Las 15 fotos sin usar migraron intactas (ítem 8, decisión explícita de Juan de no tocarlas todavía).

## Commits

Nunca incluyas atribución a Claude en los commits: nada de "Co-Authored-By: Claude", "🤖 Generated with Claude Code" ni menciones a esta sesión. El commit debe verse como si lo hubiera escrito y ejecutado Juan directamente.

Formato: tipo (`fix`/`feat`/`chore`/`refactor`/`docs`) + descripción corta en imperativo, y cuerpo opcional si el cambio no es obvio.

## Estructura de archivos

```
app/
  layout.tsx        — shell raíz, metadata (OG/Twitter/theme-color), aplica next/font
  page.tsx           — arma la home con todos los componentes de sección
  globals.css         — tokens (:root) + CSS portado casi verbatim del sitio viejo
  fonts.ts            — next/font/local (Archivo Black, Inter)
  fonts/               — los .woff2 que consume fonts.ts
  icon.svg, apple-icon.png  — favicon/apple-icon (convención de archivos especiales de Next)
components/            — una sección = un componente (Nav, Hero, SobreMi, Progresion, Galeria,
                          Logros, Formacion, Tecnica, Metas, Contacto, Footer, BackToTop) +
                          Interactivity.tsx (engancha todos los hooks, sin salida visual)
hooks/                 — un hook por comportamiento de script.js (useScrollReveal, useCounters,
                          useHeroCrossfade, useBarChart, useActiveNavLink, useBackToTop,
                          useNavbarScroll, useMobileMenu)
public/images/          — todas las fotos (next/image las sirve optimizadas)
next.config.ts          — sin output:'export' (Vercel), CSP vía headers()
tailwind.config.ts        — tokens propios (ver Stack tecnológico)
```

Con build step (Next.js/npm) desde la migración del 2026-09-10 — antes era `index.html` + `css/style.css` + `js/script.js` + `assets/` sin bundler, ese sitio estático ya no existe en el repo (se eliminó, reemplazado por esta app).
