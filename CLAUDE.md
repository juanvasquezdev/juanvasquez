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
Cualquier elemento nuevo respeta ese código. **Coral activo desde el rediseño visual (2026-09-10)** — tokens en `:root` (`--coral`, `--coral-rgb`, `--coral-dim`, `--coral-soft`) y en `tailwind.config.ts`, aplicado solo a Progresión/Momento Épico(*)/Logros/Metas y al acento de las stats del Hero; Sobre Mí, Stack, Proyectos y Contacto se quedan en azul/gris. (*) Momento Épico no tiene acento de color — es la única sección deliberadamente en blanco y negro.

**Estado real hoy (2026-09-10, tras el rediseño visual):** la app (`app/page.tsx` + `components/`) ya cubre las dos mitades de la narrativa completa: Hero, Sobre Mí, **Stack**, **Proyectos**, Progresión/"La Barra", **Momento Épico** (nueva, triptico blanco y negro), Galería, Logros, Formación, Técnica del salto, Metas, Contacto — en ese orden, siguiendo la estructura narrativa de arriba. La brecha que existía (sin Stack ni Proyectos, sin coral) **está cerrada.** Lo que sigue pendiente de la visión completa: el contenido de Stack/Proyectos es el mínimo pedido (puede crecer), y la 4ª tarjeta de Proyectos es un placeholder "+ siguiente proyecto" a propósito, para no rehacer el layout cuando haya un cuarto proyecto real.

## Stack tecnológico

**Hoy (migrado 2026-09-10):** Next.js (App Router) + TypeScript + Tailwind, desplegado en Vercel (sin `output: 'export'`, a propósito — así `next/image` optimiza imágenes bajo demanda). Ya no es HTML/CSS/JS estático; sí sigue sin backend/base de datos, es un sitio de contenido estático servido por Next.

- **Tokens:** siguen viviendo como variables CSS en `:root` (`app/globals.css`), pero ahora también están registrados como tokens propios en `tailwind.config.ts` (`theme.extend.colors/spacing/boxShadow/backgroundImage/fontFamily`), referenciando esas mismas custom properties — nunca la paleta default de Tailwind. Los dos archivos deben mantenerse en sincronía manualmente si cambia un valor base (no hay generación automática todavía).
- **Componentes/hooks:** las secciones (`components/*.tsx`) siguen reusando las mismas clases CSS del sitio viejo (`.card`, `.nav-link`, etc. en `app/globals.css`) en vez de reescribirse como utilities de Tailwind — eso sigue pendiente, se puede ir atomizando más adelante sección por sección. Lo que sí se terminó (2026-09-10): la interactividad dejó de ser DOM queries imperativas (`getElementById`/`querySelectorAll` + mutar `classList`/`.style` a mano); ahora es React idiomático — estado (`useState`), refs y `useEffect` donde hace falta lógica propia (`hooks/useActiveSection.ts`, el único que sigue usando `IntersectionObserver` directo porque es un scrollspy real, no una animación), y **`motion`** + **`lenis`** para todo lo demás (reveals al hacer scroll, contadores, crossfade del hero, barra de progreso, scroll suave) — ver regla #2 más abajo.
- **Fuentes:** autoalojadas vía `next/font/local` (`app/fonts.ts`), ya no se cargan desde `fonts.googleapis.com`.
- **Imágenes:** `next/image` en todos lados (`fill` + clases CSS existentes para el object-fit) — comprime y sirve WebP/AVIF bajo demanda, ya no hace falta generar `.webp` a mano ni usar `<picture><source>`.
- **Animación/scroll:** `motion` (paquete npm vigente, antes `framer-motion`) para todas las animaciones — `useScroll`/`useTransform` para el crossfade del hero y la barra de progreso, `useInView`/`whileInView` para los reveals y el contador animado, `useMotionValueEvent` para el navbar y el botón volver arriba. `lenis` para scroll suave, vía `<ReactLenis root>` en `components/SmoothScroll.tsx`. Ambos respetan `prefers-reduced-motion` (`MotionConfig reducedMotion="user"` + Lenis se desactiva del todo en ese caso, con fallback a scroll nativo). La **View Transitions API** seguía en el roadmap pero no se usó — con `motion` ya cubriendo el caso de uso, no está claro que siga haciendo falta; no se ha decidido nada, no se asuma.
- **CSP:** nonce estricto por request vía `proxy.ts` (`script-src 'nonce-X' 'strict-dynamic'`, sin `unsafe-inline`). Requiere que la página se renderice dinámicamente (`export const dynamic = "force-dynamic"` en `app/page.tsx`) — ya no se sirve desde la cache estática de Vercel. Ver Deuda técnica ítem 9 para el trade-off completo.

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
7. **Performance — RESUELTO lo de imágenes/CLS/fuentes, pero se abrió un ítem nuevo (ver 12).** `width`/`height` en todas las `<img>` (CLS resuelto) y fuentes autoalojadas (`assets/fonts/*.woff2`, sin Google Fonts CDN) — **RESUELTO**. Los JPEG de respaldo sin comprimir se resolvieron aparte con la migración a Next.js (ítem 11).
8. ~~**Repo: ~19MB de imágenes sin usar**~~ — **RESUELTO con el rediseño visual (2026-09-10), fue justo la fase que esperaba.** De las 15 fotos: **7 se usaron** (`foto_posando2` en Sobre Mí; `salto2`, `foto_saltoperu1`, `epica_trasera` sumadas a la Galería; `vista_epica`, `foto_blanconegro`, `epica_trasera2` en la nueva sección Momento Épico). **3 se borraron** por redundantes o de baja calidad (`salto1`/`salto3`, casi duplicados de `salto2` ya usada; `foto_salto1`, screenshot de transmisión con gráficos superpuestos, no calidad de portafolio). **5 siguen sin usar, a propósito, no por descuido:** `posando1` (redundante con `foto_posando2`, se guarda como backup), `fotogrupal1` y `grupal2` (fotos de grupo con las caras de otros atletas en primer plano — mejor no publicarlas sin confirmar con ellos, no es solo una foto de Juan), `foto_secuencial` (secuencia multi-exposición vistosa, pero no se pudo confirmar que sea Juan y no un compañero de equipo), `foto_nike` (foto genérica de entrenamiento, sin sección clara hoy — se deja para contenido futuro). Si alguna de estas 5 sigue sin usarse en la próxima fase de contenido, hay que decidir de nuevo qué hacer con ellas — no dejarlas ahí indefinidamente sin revisar.
9. **CSP** — **RESUELTO con la opción más estricta real (2026-09-10), en dos pasos.** Primer intento: `headers()` estático en `next.config.ts` con `'unsafe-inline'` en `script-src`. Segundo paso, el definitivo: nonce por request vía `proxy.ts` (`script-src 'nonce-X' 'strict-dynamic'`, sin `unsafe-inline`) — para que el nonce llegue a los `<script>` inline que el propio Next genera (streaming de RSC), la página tuvo que dejar de prerenderizarse como estática (`export const dynamic = "force-dynamic"` en `app/page.tsx`). Se verificó con `next build && next start` + `curl` que el nonce del header coincide exactamente con el de los `<script>` inline — antes de este cambio no coincidía (por eso el primer intento se había quedado en `'unsafe-inline'`). `style-src` sigue necesitando `'unsafe-inline'` (los `<style nonce>` sí soportan nonce, pero los atributos `style=""` sueltos no, según la spec de CSP) — sigue habiendo `style="--pos: X%"` inline en `.bar-marker` y los componentes mutan `.style.*` vía `motion`. El costo real de este endurecimiento está documentado en el ítem 12.
10. **JSON-LD `schema.org/Person`** — sigue sin implementar a propósito: depende de que existan las secciones Stack/Proyectos (ver brecha narrativa arriba), y no se quiso asumir esa estructura sin confirmar con Juan. No cambió con la migración a Next.js ni con el endurecimiento de CSP.
11. **Fallbacks JPEG sin comprimir — RESUELTO con la migración a Next.js.** `next/image` optimiza y sirve WebP/AVIF bajo demanda para cualquier imagen (se verificó: `pb2.04.jpeg` de 4.5MB baja a ~208KB servida a 1080px vía `/_next/image`), así que ya no hace falta comprimir manualmente ningún fallback ni mantener `.webp` a mano — por eso se borraron los `.webp` de las 5 fotos que sí se usan (quedaba duplicado con lo que ahora hace `next/image` solo). Las 15 fotos sin usar migraron intactas (ítem 8, decisión explícita de Juan de no tocarlas todavía).
12. **Nuevo — la CSP con nonce le quitó a `/` la cache estática de Vercel.** `export const dynamic = "force-dynamic"` (necesario para el ítem 9) hace que la home se renderice en el servidor en cada request en vez de servirse prerenderizada desde el edge — el build de Next ahora marca `/` como `ƒ (Dynamic)` en vez de `○ (Static)`. Es un trade-off real, tomado a propósito porque Juan pidió explícitamente la opción "más estricta que sea real y mantenible" para la CSP, sabiendo que la alternativa (hashes SHA-256 de los scripts que genera Next) es frágil — se rompe con cualquier cambio de versión de Next o de contenido, así que no calificaba como "mantenible". No es una regresión accidental, es la consecuencia conocida de la decisión — pero si en algún momento el sitio empieza a sentirse lento (esto es una landing casi 100% estática, el costo se nota más en tráfico alto), vale la pena reabrir la conversación: volver a `'unsafe-inline'` en `script-src` recupera la cache estática a cambio de una CSP menos estricta.

## Commits

Nunca incluyas atribución a Claude en los commits: nada de "Co-Authored-By: Claude", "🤖 Generated with Claude Code" ni menciones a esta sesión. El commit debe verse como si lo hubiera escrito y ejecutado Juan directamente.

Formato: tipo (`fix`/`feat`/`chore`/`refactor`/`docs`) + descripción corta en imperativo, y cuerpo opcional si el cambio no es obvio.

## Estructura de archivos

```
app/
  layout.tsx        — shell raíz, metadata (OG/Twitter/theme-color), aplica next/font + SmoothScroll
  page.tsx           — arma la home; export const dynamic = "force-dynamic" (lo pide la CSP, ítem 9)
  globals.css         — tokens (:root) + CSS portado del sitio viejo (ya sin .reveal, lo anima Motion)
  fonts.ts            — next/font/local (Archivo Black, Inter)
  fonts/               — los .woff2 que consume fonts.ts
  icon.svg, apple-icon.png  — favicon/apple-icon (convención de archivos especiales de Next)
components/            — una sección = un componente (Nav, Hero, SobreMi, Stack, Proyectos, Progresion,
                          MomentoEpico, Galeria, Logros, Formacion, Tecnica, Metas, Contacto, Footer,
                          BackToTop) + SmoothScroll.tsx (provider de Lenis + MotionConfig) +
                          AnimatedStat.tsx (contador de las stats del hero, usa motion)
hooks/                 — useActiveSection.ts: el único hook "a mano" que queda (scrollspy del nav,
                          usa IntersectionObserver porque no hay equivalente en Motion para eso)
lib/motion.ts           — variants/constantes de Motion compartidas (reveal, stagger, easing)
proxy.ts                — CSP con nonce por request (ex-middleware.ts, Next 16 renombró la convención)
public/images/          — todas las fotos (next/image las sirve optimizadas)
next.config.ts          — sin output:'export' (Vercel); la CSP ya no vive acá, ver proxy.ts
tailwind.config.ts        — tokens propios (ver Stack tecnológico)
```

Con build step (Next.js/npm) desde la migración del 2026-09-10 — antes era `index.html` + `css/style.css` + `js/script.js` + `assets/` sin bundler, ese sitio estático ya no existe en el repo (se eliminó, reemplazado por esta app).
