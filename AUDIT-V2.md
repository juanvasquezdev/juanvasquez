# Auditoría V2 — Portafolio como experiencia personal

Estado auditado: `main` en `150fbeb` (2026-09-18). Verificado leyendo el código y corriendo `next build && next start` + inspección del HTML servido — no asumido desde commits ni desde CLAUDE.md.
Cada tarea `PORT-XXX` espera aprobación una por una.

**Avance:** PORT-002 resuelto (`d859b9c`, 2026-09-20). El resto sigue sin implementar.

Leyenda de estado de proyectos/contenido usada en todo el documento: **COMPLETED · BUILDING · PLANNED** (y para proyectos además **MVP · ACTIVE**). Donde no tengo el dato real, lo marco como **❓ Pregunta para Juan** — no se inventa.

---

## 1. Estado actual

- **Stack:** Next.js 16.3 (App Router) + React 19 + TypeScript + Tailwind 3 + `motion` 13 + `lenis` 1.3. Deploy pensado para Vercel.
- **Una sola ruta (`/`)** con 12 secciones: Hero, Sobre Mí, Stack, Proyectos, Progresión ("La Barra"), Momento Épico, Galería, Logros, Formación, Técnica, Metas, Contacto. Nav tipo pill fijo abajo con 6 links agrupados.
- **Código:** ~2.170 líneas. `app/globals.css` tiene **869 líneas** (todo el estilo del sitio en un archivo). 17 componentes, **16 son `"use client"`** (solo `Footer` es server component).
- **Datos:** todo el contenido (proyectos, logros, marcas, formación, metas, stack) está **hardcodeado dentro de cada componente** como arrays locales.
- **Render:** `/` es `ƒ Dynamic` (forzado por la CSP con nonce, ver CLAUDE.md ítem 9/12).
- **Peso JS medido:** 7 chunks, **~766 KB sin comprimir / ~237 KB gzip** para una página de contenido.
- **HTML inicial medido:** **87 nodos con `opacity:0`** en el HTML servido, incluido el `<h1>`.

## 2. Lo que funciona

- **Base técnica sana:** Next 16 sin vulnerabilidades (`npm audit` 0), TypeScript estricto, fuentes autoalojadas con `next/font/local`, `next/image` en todas las fotos (`pb2.04.jpeg` de 4,5 MB se sirve en ~208 KB).
- **CSP estricta real** con nonce (verificada), y `unsafe-eval` solo en dev.
- **Sistema de tokens** con significado (gris/azul/coral) y contraste AA verificado; coral ya aplicado al mundo atlético.
- **Motion y Lenis bien integrados:** `lib/motion.ts` centraliza variants/easing; `prefers-reduced-motion` respetado en los dos (MotionConfig + Lenis se desactiva).
- **Crossfade del hero con `useScroll`/`useTransform`** — es el único momento del sitio con movimiento "con intención" real.
- **"La Barra" (Progresión)** es el mejor elemento del sitio: propio, no genérico, cuenta una historia (2.06 → 2.10 → 2.19 → élite). Es la semilla de lo que pides.
- **Técnica del salto:** "cada intento es un experimento controlado: ajusto una variable a la vez y evalúo con datos" — es literalmente tu forma de pensar como ingeniero, ya escrita. Hoy está enterrada como sección 9.
- **Fotos reales** de calidad (retrato Colombia, triptico B/N, saltos en competencia).
- **Accesibilidad de base:** skip-link, `:focus-visible`, zonas táctiles, jerarquía de headings, alt text en fotos de contenido.

## 3. Problemas encontrados

Ordenados por impacto. Todos verificados.

| # | Problema | Dónde | Por qué importa |
|---|---|---|---|
| ~~P1~~ | ~~**El `<h1>` y 86 nodos más salen del servidor con `opacity:0`**~~ — **RESUELTO** (PORT-002) | `components/Reveal.tsx` + `hooks/useBelowFold.ts` | Quedan 2 nodos con `opacity:0` y son las capas decorativas del crossfade del hero, donde corresponde. |
| ~~P2~~ | ~~**Las stats salen del servidor como `0.00`, `0.00`, `0`**~~ — **RESUELTO** (PORT-002) | `components/AnimatedStat.tsx` | El SSR imprime 2.06 / 2.01 / 19. Costo asumido: las stats del hero ya no cuentan desde 0, porque están arriba del pliegue y reiniciarlas mostraría una marca falsa delante del usuario. |
| ~~P3~~ | ~~**"Inicio" nunca se marca activo en el nav**~~ — **RESUELTO** (PORT-002) | `hooks/useActiveSection.ts` | Pasó de umbral por fracción a una banda fina en el medio de la pantalla; funciona con secciones de cualquier alto. |
| ~~P4~~ | ~~**Nav sin `aria-current`**~~ — **RESUELTO** (PORT-002) | `components/Nav.tsx` | — |
| P5 | **16 de 17 componentes son client components** | `components/*.tsx` | Todo el contenido estático (textos, listas) se envía como JS y se hidrata. Es gran parte de los ~237 KB gzip. |
| P6 | **Tailwind instalado pero prácticamente sin uso** | `tailwind.config.ts`, componentes | Ninguna utilidad de Tailwind en los componentes; todo es CSS clásico en `globals.css`. Tokens duplicados a mano en dos lugares (`:root` y config) sin sincronización automática. Dos sistemas, uno muerto. |
| P7 | **`globals.css` monolítico (869 líneas)** | `app/globals.css` | Escala mal para lo que pides (case studies, más secciones). Estilos de una sección y de otra mezclados; overrides por `#id` para el coral. |
| P8 | **Datos acoplados a la UI** | todos los componentes | Agregar un proyecto = editar JSX. Imposible reusar el mismo dato en home + página de case study + JSON-LD + sitemap. |
| P9 | **Hero de 320vh / 260vh** | `app/globals.css:151,845` | En mobile son ~2,6 pantallas de scroll antes de ver cualquier contenido. Bonito la primera vez, costoso para un reclutador con prisa. |
| P10 | **Placeholder visible en producción** | `components/Hero.tsx` (`hero-nueva.jpeg`, comentario "pendiente reemplazar") | La 3ª capa del hero es una foto marcada como provisional. También es la imagen de OG/Twitter. |
| P11 | **Identidad de dev casi ausente** | `layout.tsx` metadata, `Footer.tsx`, Hero, Sobre Mí | Title, description, footer y el texto de Sobre Mí hablan solo de atleta ("Atleta de Salto Alto"). Al compartir el link, nadie sabe que eres developer. |
| P12 | **Sin GitHub en ninguna parte** | `Contacto.tsx`, `Proyectos.tsx` | La única aparición de "GitHub" es el chip "Git & GitHub" del Stack. Ningún link a repo ni perfil. |
| P13 | **Proyectos sin stack, sin links, sin estado estructurado** | `Proyectos.tsx` | Estado como string libre ("En consolidación", "Vivo"); no hay tech stack, demo, repo, arquitectura. |
| P14 | **Datos que caducan escritos a mano** | `Hero.tsx` (`19` años), `Footer.tsx` (`© 2026`) | Se van a quedar viejos sin que nadie lo note. |
| P15 | **Sin linter, sin CI** | `package.json` | `next lint`/ESLint se quitó en la migración. Nada revisa un PR antes de desplegar. |
| P16 | **SEO incompleto** | `layout.tsx` | `metadataBase` cae a `localhost` si no hay env var; sin `sitemap`, `robots`, canonical, JSON-LD. OG image = foto placeholder (P10). |
| P17 | **`README.md` roto** | `README.md` | Contiene una frase cortada, sin instrucciones. Es lo primero que ve alguien que abre tu GitHub. |

## 4. Qué se siente básico / genérico

Honesto, sección por sección:

- **Todo aparece con el mismo fade-up.** 87 elementos con el mismo `opacity 0→1, y 30→0`. Cuando todo se anima igual, nada se siente intencional — es la firma más reconocible de "plantilla".
- **Emojis como iconografía** (📸 🥇 🏅 📧 📱 💼 📜 🏆 💻 👤 🏃). Es lo que más grita "generado". Además los lectores de pantalla los leen en voz alta ("trofeo Deportivos").
- **Tarjetas en grilla para todo:** logros, formación, certificaciones, técnica, metas, proyectos, contacto — mismo patrón `grid auto-fit + card`. Siete grillas de tarjetas seguidas.
- **Stack como chips de tecnologías.** Es mejor que barras, pero sigue siendo "una lista de logos" — no dice qué construiste con cada cosa.
- **"Sobre Mí"** es un párrafo de CV en tercera persona encubierta ("he demostrado ser un competidor de alto nivel"), solo atlético.
- **Hero repite su propia frase** ("Aprendiendo a volar más alto" como `h2` y otra vez como quote).
- **Metas "Tecnológicos"** duplica a Proyectos con otro formato.
- **Formación** son 2 ítems del mismo año + 2 certificados en tarjetas separadas: mucho espacio para poca información.

Lo que **no** es genérico y hay que potenciar: La Barra, el triptico B/N, la foto de Colombia, y la idea "cada intento es un experimento controlado".

## 5. Qué conservar

- Stack técnico completo (Next 16, TS, motion, lenis, next/image, next/font) — **no hace falta ninguna librería nueva obligatoria.**
- CSP con nonce (salvo lo que decida PORT-004), tokens y código de color, contraste verificado.
- `lib/motion.ts` como único lugar de variants/easing (se amplía, no se reemplaza).
- Crossfade del hero con `useScroll` (se acorta, no se elimina).
- **La Barra** (evoluciona a gráfico de progresión real).
- Triptico Momento Épico y la galería con fotos reales.
- Nav pill abajo, skip-link, focus visible, reduced-motion.
- Copy de Técnica (se reubica como puente entre atleta y dev).

## 6. Nueva estructura propuesta

Tu referencia (IDENTIDAD → HISTORIA → FORMA DE PENSAR → PROYECTOS → ENGINEERING → ATHLETICS → EVOLUCIÓN → CONTACTO) funciona. Propongo dos ajustes:

```
00  IDENTIDAD        Nombre + 4 roles (Developer · Athlete · Problem Solver · Builder), 1 frase, 2 CTAs (Proyectos / GitHub)
01  HISTORIA         Dos caminos que se cruzan: pista + código. Absorbe "Sobre Mí". Corta, con foto.
02  FORMA DE PENSAR  PROBLEM → ANALYZE → DESIGN → BUILD → TEST → IMPROVE, contado con un ejemplo de la pista
                     y uno de software lado a lado. Absorbe "Técnica del salto". ← el diferencial del sitio
03  PROYECTOS        Destacados con preview + grilla del resto + link a case study. Estados visibles.
04  ENGINEERING      Cómo construyes: stack por capa (no chips sueltos), principios, actividad GitHub.
05  ATHLETICS        Marcas y progresión real (La Barra evolucionada), competencias, hitos, Momento Épico, galería.
06  EVOLUCIÓN        Timeline hacia adelante: qué estás construyendo y hacia dónde vas en los dos mundos.
                     Absorbe "Metas" (deportivas + técnicas) y "Formación".
07  CONTACTO         Email, GitHub, LinkedIn, Instagram. Sin emojis.
```

**Por qué este orden:** "Forma de pensar" antes de Proyectos hace que los proyectos se lean como evidencia del método, no como lista. Proyectos antes de Engineering: primero la prueba, después las herramientas. Athletics después de Engineering cierra el arco con la parte más emocional del sitio antes de mirar al futuro.

**Secciones que desaparecen como tales:** Sobre Mí, Técnica, Metas, Formación, Logros (se funden en Historia / Forma de pensar / Athletics / Evolución). Pasas de 12 secciones a 8 con más densidad y menos repetición.

**Rutas nuevas:** `/proyectos/[slug]` para case studies. Opcional más adelante: `/athletics` si la sección crece con historial completo.

## 7. Experiencia de scroll

- **Lenis se queda** (ya bien configurado).
- **Hero:** bajar de 320vh/260vh a ~180vh/140vh. Mantener el crossfade pero con 2 capas bien elegidas, no 3 (una es placeholder).
- **Sticky con propósito, solo en 2 lugares:**
  1. *Forma de pensar:* título + indicador de paso fijos a la izquierda, los 6 pasos pasan a la derecha. El paso activo se ilumina (`useScroll` sobre el contenedor).
  2. *Athletics / progresión:* el gráfico de marcas queda fijo mientras pasan las competencias que lo explican; cada competencia enciende su punto.
- **Parallax sutil solo en fotos** (±30–60 px con `useTransform`), nunca en texto.
- **Todo lo demás, scroll normal.** Nada de secciones que secuestren el scroll.
- **Progress indicator** discreto en el nav pill (una línea de progreso de lectura) — reemplaza la necesidad del botón "volver arriba" como elemento separado (el pill ya lleva a Identidad).

## 8. Animaciones e interacciones

Regla nueva: **cada animación tiene que responder "¿qué me está diciendo?"**. Si la respuesta es "que aparece", sobra.

- **Contenido visible por defecto** (arregla P1): el `h1`, textos y datos llegan visibles desde el servidor. Se anima solo `transform`/`clip-path` de entrada en bloques clave, y solo si hay JS (patrón "progressive enhancement").
- **Stats:** renderizar el valor final en el servidor y animar solo el conteo en cliente (arregla P2).
- **Reveals por jerarquía**, no en todo: encabezado de sección + primer bloque. Listas largas sin stagger.
- **Microinteracciones con significado:**
  - Tarjeta de proyecto: hover revela stack + estado + "Ver caso →" (en táctil, visible siempre).
  - Badge de estado con indicador vivo sutil solo para `BUILDING`/`ACTIVE`.
  - Chips de engineering: hover muestra en qué proyecto se usó.
  - Links externos (GitHub, demo): flecha que se desplaza, estado de foco igual al hover.
  - Email: botón "copiar" con confirmación.
- **Transición a case study:** `layoutId` de Motion para que la imagen/título de la tarjeta "viaje" a la página del proyecto (ya está en la librería, no requiere nada nuevo).
- **Eliminar:** emojis, stagger en listas, fade-up genérico en cada párrafo, doble frase del hero.

## 9. Projects system

Un solo origen de datos tipado, usado por home, case study, sitemap y JSON-LD.

```ts
// content/projects.ts (propuesto)
type ProjectStatus = "planned" | "building" | "mvp" | "active" | "completed";
type Project = {
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  featured: boolean;
  problem: string;
  solution: string;
  stack: string[];                  // ids de content/stack.ts
  architecture?: string;            // texto corto; diagrama opcional
  links: { demo?: string; repo?: string; caseStudy: boolean };
  evolution: { date: string; note: string; status: ProjectStatus }[];
  cover?: { src: string; alt: string };
  confidential?: boolean;           // ej. trabajo para un cliente/empleador
};
```

- **Estados visibles y honestos:** badge por estado; `planned` sin link a demo; `evolution` muestra el historial real (ej. `planned → building`).
- **Home:** 2–3 destacados grandes con preview + grilla compacta del resto + la tarjeta "+ siguiente proyecto" que ya existe.
- **Case study** (`/proyectos/[slug]`): Problem · Solution · Stack · Architecture · Status · Demo · GitHub · Evolution. Generada con `generateStaticParams` desde el mismo array.
- **Contenido largo:** empezar con TS. Si un case study necesita texto largo con imágenes/código, evaluar MDX (`@next/mdx`, oficial de Next) en ese momento — no ahora.

**❓ Preguntas para Juan (no invento nada):**
1. Hoy el sitio tiene *Fast Inventory*, *Athletics Hub* y *Portafolio*. Tu lista nueva es *Enterprise ERP*, *ERP + IA + automatizaciones*, *Sports Management Platform*, *Athlete Intelligence*, *Mini ERP / Business Management*, *Personal Finance Intelligence*. ¿*Fast Inventory* = *Mini ERP*? ¿*Athletics Hub* = *Sports Management Platform*? ¿Cuáles son nuevos?
2. Estado real de cada uno (planned / building / mvp / active / completed).
3. ¿Cuáles tienen repo público, cuáles privado, cuáles demo desplegada?
4. *Enterprise ERP* y *ERP + IA*: ¿son para un empleador/cliente? Si hay confidencialidad, el case study se escribe sin nombres ni capturas (campo `confidential`).

## 10. Athletics

Deja de ser "hobby" si se presenta **como datos y trayectoria**, igual de serio que los proyectos.

- **Progresión real:** gráfico propio en SVG (sin librería de charts) con cada marca fechada; La Barra actual se convierte en la cabecera de este gráfico (marca actual → próxima meta → récord U20 → élite).
- **Competencias:** tabla/timeline con fecha, competencia, categoría, marca, puesto.
- **Hitos:** campeón nacional U18 x2, subcampeonatos, 2.06 m (datos que ya están en el sitio).
- **Entrenamiento / Forma de pensar:** el contenido de Técnica, conectado con la sección 02.
- **Conexión futura:** "Estos datos los va a gestionar mi Sports Management Platform / Athlete Intelligence" — con estado `planned`/`building`, sin afirmar que ya existe.
- Todos los datos en `content/athletics.ts` con el mismo criterio que proyectos.

**❓ Preguntas para Juan:**
5. Historial de marcas con fecha y competencia (hoy solo existen 2.06 m PB, la foto del 2.04 m y un 1.98 m visible en un screenshot).
6. Competencias con fecha, categoría y puesto — ¿las tienes en algún registro?
7. ¿La foto de Perú es de Lima 2019 (banner "Legado")? ¿Qué competencia exacta y resultado?
8. ¿Quieres publicar entrenador y clubes (hoy están) y algo de entrenamiento (volumen, bloques) o eso queda privado?

## 11. Engineering / Problem Solving

- **Sección 02 (Forma de pensar)** con los 6 pasos. Cada paso muestra **dos ejemplos reales lado a lado**: uno de la pista (ya tienes el copy: ángulo de despegue, "una variable a la vez") y uno de un proyecto (a completar con tus datos reales).
- **Sección 04 (Engineering):** stack **por capa** (frontend / backend / datos / infraestructura / herramientas), cada tecnología enlazada a los proyectos donde la usaste (derivado automáticamente de `project.stack`). Mantiene la separación honesta "Con esto construyo hoy / Profundizando ahora" que ya validamos.
- **Principios** (3–4 frases tuyas, no genéricas). **❓ Pregunta 9:** ¿qué principios sigues al construir? Los escribes tú, yo los estructuro.

## 12. GitHub

Recorrido: **Portfolio → Proyecto → Live Demo → GitHub → Case Study**, sin complejidad innecesaria. Dos niveles:

1. **Ahora (sin API):** link a tu perfil en Identidad y Contacto; `links.repo` y `links.demo` por proyecto; botones consistentes en tarjeta y case study. Cero dependencias, cero tokens.
2. **Después (opcional):** datos del repo (último commit, lenguaje, estrellas) leídos **en el servidor** con `fetch` a la API REST de GitHub y `next: { revalidate: 86400 }`. Sin librería (`fetch` nativo), sin exponer tokens al cliente, 1 request/día por repo. Si un repo es privado, se muestra solo "Repositorio privado".
   - Descartado: widgets de terceros, gráficos de contribuciones embebidos (pesados y genéricos).

**❓ Pregunta 10:** usuario de GitHub y qué repos son públicos.

## 13. Performance

- **Medido hoy:** ~237 KB gzip de JS; TTFB local ~20 ms (en Vercel hay que sumar render dinámico por request); LCP bloqueado por `opacity:0` en el `h1` (P1).
- **Acciones:**
  - Server components para todo el contenido; solo los wrappers de animación como client (P5). Esperable: bajar el JS de manera importante.
  - `LazyMotion` + `m` de Motion (en vez de `motion.*`) para cargar solo las features usadas — está en la misma librería, no es dependencia nueva.
  - Revisar si la CSP puede volver a permitir página estática (PORT-004): la home es contenido 100% estático, y `force-dynamic` es el precio más caro del sitio.
  - Hero: 2 capas en vez de 3 y `sizes` ajustado.
- **Presupuesto propuesto:** LCP < 2,0 s en 4G, JS inicial < 150 KB gzip, CLS < 0,05, INP < 200 ms. Medir con Lighthouse + Vercel Speed Insights (nativo de Vercel, opcional).

## 14. Responsive

- Hero de 260vh en mobile (P9) → reducir.
- Nombre de 4 palabras a 3,4 rem en 768 px ocupa 3–4 líneas; revisar escala y `text-wrap: balance`.
- **La Barra en mobile:** labels de 100 px en 0 % y 30 % de un track de ~340 px quedan a ~100 px de distancia → se tocan. En el rediseño, en mobile pasa a vertical.
- Pill nav: 6 links con scroll horizontal y scrollbar oculta → no se ve que hay más. Opción: iconos + label solo en el activo en < 480 px, o indicador de overflow.
- Sticky sections (Forma de pensar, Athletics) **se desactivan en mobile** y pasan a flujo normal.
- Probar en 360 px, 390 px, 768 px, 1024 px, 1440 px y landscape bajo (ya hay media query `max-height: 500px`).

## 15. Accessibility

- P1, P2, P3, P4 (contenido oculto, stats en 0, nav sin estado activo real ni `aria-current`).
- Emojis en encabezados y tarjetas → iconos SVG con `aria-hidden` o texto.
- Pill nav con overflow oculto: foco de teclado debe hacer scroll al link enfocado (`scrollIntoView` en focus).
- Gráfico de progresión: tabla accesible equivalente (no solo SVG).
- Mantener lo ya resuelto: skip-link, focus-visible, reduced-motion, contraste AA, zonas táctiles.
- Revisar `lang`: si el sitio pasa a bilingüe (ver pregunta 12), `lang` por página.

## 16. SEO

- **Identidad en metadata:** title y description hoy dicen solo "Atleta de Salto Alto". Deben decir developer + atleta.
- `sitemap.ts` y `robots.ts` (archivos especiales de Next, sin librería).
- **OG image dinámica** con `next/og` (incluido en Next): una por página y por proyecto, sin depender de la foto placeholder.
- **JSON-LD** `Person` en home y `CreativeWork`/`SoftwareSourceCode` por proyecto, generado desde `content/` — se destraba justo ahora que existen Stack y Proyectos (CLAUDE.md ítem 10).
- Canonical: **bloqueado por dominio** (❓ Pregunta 11: ¿dominio final?).
- **❓ Pregunta 12:** ¿el sitio queda solo en español o bilingüe ES/EN? Tus etiquetas (PROBLEM, BUILDING…) están en inglés; afecta rutas, `lang` y SEO. Recomendación: decidirlo antes de PORT-006, porque cambia la estructura de rutas.

## 17. Arquitectura recomendada

```
app/
  layout.tsx                 metadata base, fonts, SmoothScroll
  page.tsx                   compone secciones (server)
  proyectos/[slug]/page.tsx  case study (generateStaticParams)
  sitemap.ts, robots.ts, opengraph-image.tsx
content/                     ← NUEVO: única fuente de datos tipada
  profile.ts                 roles, bio, links (GitHub, LinkedIn, email)
  projects.ts                Project[] (ver §9)
  athletics.ts               marcas, competencias, hitos, objetivos
  timeline.ts                historia + evolución
  stack.ts                   tecnologías por capa + nivel honesto
  types.ts
components/
  sections/                  una sección = un server component
  ui/                        Badge, Button, ProjectCard, SectionHeader…
  motion/                    Reveal, Parallax, StickySteps (client, pequeños)
lib/motion.ts                se conserva y amplía
styles/ o CSS Modules        partir globals.css por sección
```

**Decisión pendiente de CSS (PORT-005):** o **(a)** adoptar Tailwind de verdad para lo nuevo y migrar sección por sección, o **(b)** quitar Tailwind y usar CSS Modules + tokens en `:root`. Recomendación: **(b)**. Todo el sistema actual ya es CSS con tokens, Tailwind hoy no aporta nada y duplica tokens a mano. CSS Modules viene con Next (sin dependencia). Si prefieres Tailwind, lo correcto sería migrar a v4 (tokens en CSS con `@theme`) para eliminar la duplicación.

**Sin librerías nuevas obligatorias.** Todo lo propuesto sale de Next (`next/og`, `sitemap`, CSS Modules, `generateStaticParams`), Motion (`LazyMotion`, `layoutId`, `useScroll`) o `fetch` nativo. Únicas evaluaciones opcionales y futuras: `@next/mdx` para case studies largos; ESLint (`eslint-config-next`) para calidad.

## 18. Plan de implementación

Por fases, cada una desplegable sola:

- **Fase A — Cimientos (sin cambio visual grande):** PORT-001 → 002 → 003 → 004 → 005 → 019
- **Fase B — Narrativa:** PORT-006 → 007 → 008 → 009
- **Fase C — Proyectos + GitHub:** PORT-010 → 011 → 012
- **Fase D — Athletics + Evolución:** PORT-013 → 014 → 015
- **Fase E — Pulido:** PORT-016 → 017 → 018 → 020

Las preguntas ❓ 1–12 bloquean contenido (Fases B–D), no los cimientos. La Fase A puede arrancar hoy.

---

## Tareas

### PORT-001 — Capa de contenido tipada
- **Objetivo:** mover todo el contenido hardcodeado a `content/*.ts` con tipos; componentes solo renderizan.
- **Archivos:** nuevo `content/` (profile, projects, athletics, timeline, stack, types); todos los `components/*.tsx`.
- **Resultado:** agregar un proyecto o una marca = editar un archivo de datos. Sitio visualmente idéntico.
- **Dependencias:** ninguna.
- **Riesgos:** bajo. Regresión de copy al mover textos (se compara HTML antes/después).
- **Estimación:** 1 sesión.

### PORT-002 — Contenido visible desde el servidor + fixes de scrollspy/a11y — ✅ RESUELTA (`d859b9c`)
- **Objetivo:** arreglar P1–P4: nada crítico con `opacity:0` en el HTML inicial, stats con su valor real en SSR, "Inicio" activo en el nav, `aria-current`.
- **Cómo quedó:** `components/Reveal.tsx` reemplaza el trío `initial="hidden"` / `whileInView` / `variants` que estaba repetido en las 12 secciones. El primer render —servidor e hidratación— es siempre el estado final visible; solo después de hidratar se esconde lo que quedó debajo del pliegue, medido en `useLayoutEffect` (`hooks/useBelowFold.ts`) para que corra antes del primer paint. El hero pierde su fade de entrada a propósito: es lo que estaba retrasando el LCP.
- **Verificado** con `next build && next start` sobre el HTML servido: 87 nodos con `opacity:0` → 2 (las capas del crossfade del hero); `<h1>` visible; stats en 2.06 / 2.01 / 19; nonce de la CSP sigue coincidiendo con los 11 `<script>` inline en el mismo request.
- **Lo que no cambió:** el peso del JS sigue en ~235 KB gzip — bajarlo es PORT-003, no esta tarea.
- **Decisión tomada acá:** la regla "lo que ya está en pantalla no se anima" vale para todo el sitio; por eso el contador del hero dejó de contar desde 0.

### PORT-003 — Server components + Motion ligero
- **Objetivo:** secciones como server components; animación en wrappers client pequeños (`components/motion/`); `LazyMotion` + `m`.
- **Archivos:** `components/*`, nuevo `components/motion/`, `lib/motion.ts`, `SmoothScroll.tsx`.
- **Resultado:** menos JS enviado (objetivo < 150 KB gzip inicial), mismo comportamiento.
- **Dependencias:** PORT-002.
- **Riesgos:** medio: límites server/client en Next 16; se mide el bundle antes/después.
- **Estimación:** 1,5 sesiones.

### PORT-004 — Revisar CSP vs. página estática (spike)
- **Objetivo:** investigar si Next 16 permite CSP estricta en páginas estáticas (hashes/SRI integrados) para quitar `force-dynamic`. Si no, documentar y conservar.
- **Archivos:** `proxy.ts`, `next.config.ts`, `app/page.tsx`, CLAUDE.md (ítems 9/12).
- **Resultado:** decisión documentada con evidencia; si es viable, home estática + CSP sin `unsafe-inline` en scripts.
- **Dependencias:** ninguna; conviene antes de PORT-011 (las páginas de case study heredan la misma decisión).
- **Riesgos:** medio: una CSP mal configurada rompe la hidratación en producción sin error visible en dev → se verifica con build + start.
- **Estimación:** 0,5–1 sesión.

### PORT-005 — Decisión de CSS y partición de `globals.css`
- **Objetivo:** elegir (a) Tailwind v4 real o (b) CSS Modules + tokens y quitar Tailwind; partir las 869 líneas por sección.
- **Archivos:** `app/globals.css`, `tailwind.config.ts`, `postcss.config.mjs`, `package.json`, componentes.
- **Resultado:** un solo sistema de estilos, tokens en un solo lugar, estilos junto a su componente.
- **Dependencias:** tu decisión (a/b). Mejor después de PORT-003.
- **Riesgos:** medio: regresiones visuales; se compara con capturas por sección antes/después.
- **Estimación:** 1,5–2 sesiones.

### PORT-006 — Nueva arquitectura de información y navegación
- **Objetivo:** reordenar a las 8 secciones de §6 con componentes base vacíos/mínimos; nav con los nuevos anchors; progreso de lectura.
- **Archivos:** `app/page.tsx`, `components/sections/*`, `Nav.tsx`, `hooks/useActiveSection.ts`.
- **Resultado:** esqueleto narrativo navegable; contenido actual reubicado, sin contenido inventado.
- **Dependencias:** PORT-001; decisión de idioma (❓12).
- **Riesgos:** bajo-medio: secciones que se fusionan pueden perder contenido → checklist de contenido migrado.
- **Estimación:** 1 sesión.

### PORT-007 — Identidad (Hero)
- **Objetivo:** hero con los 4 roles, una frase propia, CTAs a Proyectos y GitHub; hero más corto; foto definitiva en vez del placeholder.
- **Archivos:** `components/sections/Identity*`, `content/profile.ts`, `public/images/`.
- **Resultado:** en 5 segundos se entiende "developer + atleta que construye sistemas reales".
- **Dependencias:** PORT-006; tu copy (frase) y foto definitiva.
- **Riesgos:** bajo. Riesgo real: copy genérico si no sale de ti.
- **Estimación:** 1 sesión.

### PORT-008 — Historia
- **Objetivo:** reemplazar "Sobre Mí" por una historia corta en primera persona de cómo se cruzan pista y código, con foto y parallax sutil.
- **Archivos:** `components/sections/Story*`, `content/timeline.ts`.
- **Resultado:** una sección que no se lee como CV.
- **Dependencias:** PORT-006; tu relato (yo estructuro, no invento).
- **Riesgos:** bajo.
- **Estimación:** 1 sesión.

### PORT-009 — Forma de pensar (sticky)
- **Objetivo:** PROBLEM → ANALYZE → DESIGN → BUILD → TEST → IMPROVE con ejemplo de pista + ejemplo de proyecto por paso, sticky en desktop.
- **Archivos:** `components/sections/Method*`, `components/motion/StickySteps.tsx`, `content/`.
- **Resultado:** el diferencial del sitio; conecta atleta y developer con evidencia.
- **Dependencias:** PORT-006; ejemplos reales de proyectos (❓1–2, ❓9).
- **Riesgos:** medio: sticky + Lenis en Safari; se prueba en Safari iOS antes de dar por cerrado.
- **Estimación:** 1,5 sesiones.

### PORT-010 — Sistema de proyectos (home)
- **Objetivo:** `ProjectCard`, `StatusBadge`, destacados + grilla + placeholder, previews, hover con stack y estado.
- **Archivos:** `content/projects.ts`, `components/ui/*`, `components/sections/Projects*`.
- **Resultado:** proyectos con estado honesto (planned/building/mvp/active/completed) y links consistentes.
- **Dependencias:** PORT-001, PORT-006; datos reales (❓1–4).
- **Riesgos:** bajo.
- **Estimación:** 1,5 sesiones.

### PORT-011 — Case studies `/proyectos/[slug]`
- **Objetivo:** página por proyecto con Problem · Solution · Stack · Architecture · Status · Demo · GitHub · Evolution; transición con `layoutId`; metadata y OG por proyecto.
- **Archivos:** `app/proyectos/[slug]/page.tsx`, `opengraph-image.tsx`, `content/projects.ts`.
- **Resultado:** cada proyecto enlazable y compartible por sí solo.
- **Dependencias:** PORT-010, PORT-004.
- **Riesgos:** medio: proyectos confidenciales (❓4) y contenido largo (posible MDX, se decide ahí).
- **Estimación:** 2 sesiones.

### PORT-012 — GitHub
- **Objetivo:** nivel 1 (links perfil + repo + demo); nivel 2 opcional (metadatos del repo en servidor con `revalidate` diario).
- **Archivos:** `content/profile.ts`, `content/projects.ts`, nuevo `lib/github.ts` (solo nivel 2).
- **Resultado:** recorrido Portfolio → Proyecto → Demo → GitHub → Case Study completo.
- **Dependencias:** PORT-010; ❓10.
- **Riesgos:** bajo. Nivel 2: rate limit y repos privados (se degradan a "privado").
- **Estimación:** 0,5 (nivel 1) + 0,5 (nivel 2).

### PORT-013 — Athletics
- **Objetivo:** progresión real en SVG propio (evolución de La Barra), competencias, hitos, entrenamiento, Momento Épico y galería integrados; conexión futura a Sports Platform / Athlete Intelligence con estado honesto.
- **Archivos:** `content/athletics.ts`, `components/sections/Athletics*`, `components/ui/ProgressionChart.tsx`.
- **Resultado:** athletics como identidad con datos, no como hobby.
- **Dependencias:** PORT-006; datos reales (❓5–8).
- **Riesgos:** medio: accesibilidad del gráfico (tabla equivalente) y mobile.
- **Estimación:** 2 sesiones.

### PORT-014 — Engineering
- **Objetivo:** stack por capa enlazado a proyectos, principios propios, (opcional) actividad GitHub.
- **Archivos:** `content/stack.ts`, `components/sections/Engineering*`.
- **Resultado:** "cómo construyo" en vez de "qué logos conozco".
- **Dependencias:** PORT-010 (para enlazar tecnologías ↔ proyectos); ❓9.
- **Riesgos:** bajo.
- **Estimación:** 1 sesión.

### PORT-015 — Evolución + Contacto
- **Objetivo:** timeline hacia adelante (fusiona Metas + Formación); contacto con GitHub, copiar email, sin emojis.
- **Archivos:** `content/timeline.ts`, `content/profile.ts`, secciones Evolution/Contact.
- **Resultado:** cierre del recorrido; nada duplicado con Proyectos.
- **Dependencias:** PORT-006.
- **Riesgos:** bajo.
- **Estimación:** 1 sesión.

### PORT-016 — SEO
- **Objetivo:** metadata con doble identidad, `sitemap.ts`, `robots.ts`, OG dinámica con `next/og`, JSON-LD desde `content/`; canonical cuando haya dominio.
- **Archivos:** `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, `content/`.
- **Resultado:** previews correctos al compartir, resultados de búsqueda con tu doble perfil.
- **Dependencias:** PORT-001, PORT-011; ❓11 (dominio) para canonical.
- **Riesgos:** bajo.
- **Estimación:** 1 sesión.

### PORT-017 — Pasada de accesibilidad
- **Objetivo:** emojis → SVG/texto, foco en pill con overflow, tabla accesible del gráfico, revisión teclado + lector + reduced-motion completa.
- **Archivos:** transversal.
- **Resultado:** WCAG 2.1 AA verificado en la nueva estructura.
- **Dependencias:** Fases B–D.
- **Riesgos:** bajo.
- **Estimación:** 1 sesión.

### PORT-018 — Performance y responsive final
- **Objetivo:** cumplir el presupuesto de §13; QA en los 6 anchos de §14 + Safari iOS.
- **Archivos:** transversal.
- **Resultado:** LCP < 2 s, JS < 150 KB gzip, sin regresiones mobile.
- **Dependencias:** Fases B–D.
- **Riesgos:** bajo-medio.
- **Estimación:** 1 sesión.

### PORT-019 — Tooling mínimo
- **Objetivo:** ESLint (`eslint-config-next`) y un workflow de GitHub Actions que corra `lint` + `build` en cada push/PR.
- **Archivos:** `package.json`, `eslint.config.*`, `.github/workflows/ci.yml`.
- **Resultado:** nada roto llega a Vercel sin que te enteres.
- **Justificación de la dependencia:** ESLint es la herramienta oficial de Next para calidad; se quitó en la migración solo por velocidad.
- **Dependencias:** ninguna.
- **Riesgos:** bajo (primer lint puede marcar muchos avisos; se arreglan o se ajusta la regla, no se ignoran en bloque).
- **Estimación:** 0,5 sesión.

### PORT-020 — Limpieza y datos que caducan
- **Objetivo:** README real (qué es, stack, cómo correrlo), edad y año del footer derivados de datos en vez de escritos a mano, decisión sobre las 5 fotos reservadas (CLAUDE.md ítem 8), actualizar CLAUDE.md/AUDIT.md.
- **Archivos:** `README.md` (hoy tienes una edición tuya sin commitear), `components/Footer.tsx`, `content/profile.ts`, `public/images/`, docs.
- **Resultado:** repo presentable para quien llegue desde GitHub.
- **Dependencias:** al final.
- **Riesgos:** bajo.
- **Estimación:** 0,5 sesión.

**Total estimado:** ~20–22 sesiones de 5 h. Fase A (cimientos) ≈ 6 sesiones y no depende de ninguna pregunta.
