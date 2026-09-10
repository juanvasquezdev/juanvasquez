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

**Estado real hoy (2026-09-10):** el `index.html` actual solo cubre el lado atlético (Inicio, Sobre mí, Progresión/"La Barra", Galería, Logros, Formación, Técnica del salto, Metas, Contacto). No existen todavía las secciones "Stack" ni "Proyectos" (mundo técnico/dev), ni el color coral aparece en el CSS. Esto es una brecha conocida entre la visión completa y el código — no la cierres por tu cuenta, pregúntale a Juan si ya toca construir esas secciones o si van en otra fase.

## Stack tecnológico

**Hoy:** HTML / CSS / JS estático, sin build step, sin framework. Sistema de diseño con variables CSS en `:root` (`css/style.css`).

**Decisiones ya tomadas para cuando se migre (respétalas si tocas algo relacionado, no las implementes todas de golpe sin que se pida):**
- Next.js (export estático o ISR)
- Tailwind con tokens propios — nunca la paleta default de Tailwind
- Transiciones con **View Transitions API nativa** — nada de librerías de animación pesadas
- Imágenes optimizadas: WebP/AVIF + lazy load (hoy son JPEG sin comprimir, algunas de hasta 4-5MB)
- Fuentes autoalojadas (hoy se cargan desde `fonts.googleapis.com`, pendiente migrar)

## Reglas no negociables

1. **Design tokens:** todo color, spacing o valor reutilizable vive en variables CSS (`:root`), nunca hardcodeado. Si necesitas un color nuevo, créalo como variable primero, no lo escribas en hex directo en una regla.
2. **Cero librerías de animación pesadas.** Nada de Framer Motion, GSAP, AOS, ni similares como dependencia del proyecto. Las animaciones se implementan nativamente: CSS transitions/animations, Web Animations API, o View Transitions API cuando aplique (ver sección siguiente sobre cómo usar sitios de referencia).
3. **DRY:** si un patrón visual (gradiente, sombra, layout, easing) se repite 2 o más veces, se centraliza en una variable o clase utilitaria — no se copia y pega la declaración.
4. **No reescribas secciones completas** que no se te pidieron. Señala el problema, explica por qué está mal, propone el fix — deja que Juan decida si lo aplicas.
5. **No asumas estructura.** Si tienes dudas sobre dónde va algo o cómo encaja con la narrativa del salto, pregunta antes de mover cosas.

## Flujo de trabajo: sacar inspiración de Framer / Motion.dev / sitios de referencia

Cuando Juan pida traer ideas de headers, animaciones o tipografías desde sitios como framer.com (templates), motion.dev (librería de animación, antes Framer Motion) u otros:

1. Se navega el sitio de referencia solo para identificar el **patrón**: estructura del header, curva de easing, duración/timing, jerarquía tipográfica, pairing de fuentes, tipo de scroll-trigger. Nunca para copiar código, assets o textos literalmente.
2. El patrón se **re-implementa nativamente** en este stack — CSS puro hoy (Tailwind cuando se migre) + Web Animations API / View Transitions API. **Nunca se instala la librería del sitio de referencia** (ni `framer-motion`, ni `motion`, ni ninguna otra) como dependencia — el objetivo es entender y reproducir el patrón, no importar la dependencia.
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
8. **Nuevo — repo: ~19MB de imágenes sin usar.** `assets/images/` tiene 15 archivos (`foto_nike`, `fotogrupal1`, `posando1`, `salto1-3`, `vista_epica`, `epica_trasera`, `epica_trasera2`, `foto_salto1`, `foto_saltoperu1`, `grupal2`, `foto_secuencial`, `foto_blanconegro`, `foto_posando2`, jpeg+webp) que no se referencian en ningún `.html`/`.css`/`.js` — están trackeados en git, pesan el repo y no salen sobrantes en ningún build. Pendiente decidir con Juan si se usan en la sección Galería/Stack futura o se borran.
9. **CSP** — **RESUELTO.** Meta CSP agregada (`default-src 'self'`, `script-src` estricto, `style-src` con `'unsafe-inline'` porque `.bar-chart` posiciona sus marcadores vía `style="--pos: X%"` inline y `script.js` muta `.style.*` en varios puntos).
10. **JSON-LD `schema.org/Person`** — sigue sin implementar a propósito: depende de que existan las secciones Stack/Proyectos (ver brecha narrativa arriba), y no se quiso asumir esa estructura sin confirmar con Juan.

## Commits

Nunca incluyas atribución a Claude en los commits: nada de "Co-Authored-By: Claude", "🤖 Generated with Claude Code" ni menciones a esta sesión. El commit debe verse como si lo hubiera escrito y ejecutado Juan directamente.

Formato: tipo (`fix`/`feat`/`chore`/`refactor`/`docs`) + descripción corta en imperativo, y cuerpo opcional si el cambio no es obvio.

## Estructura de archivos

```
index.html
css/style.css
js/script.js
assets/
  images/
  fonts/
  icons/
```

Sin build step todavía — todo es directo, sin bundler ni preprocesador.
