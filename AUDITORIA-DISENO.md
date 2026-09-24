# Auditoría de diseño: portafolio

**Fecha:** 2026-09-24 · **Estado auditado:** `31b638c` más el trabajo de PORT-001b sin commitear
(rutas `/es` y `/en`). Visualmente es idéntico a `31b638c`, salvo por la negrita de Metas.

**Método.** Leí el código y miré las 17 fotos de `public/images/` una por una. Tomé capturas
de las 11 secciones a 1440 px y a 390 px con Playwright, sobre `next build && next start`. Medí
las alineaciones y el JS servido en el navegador. **No modifiqué código.** Lo que no pude medir
lo marco como límite del método.

**Sin decidir.** Nada de este documento está decidido. Las direcciones visuales (§3) y el
alcance de v1 (§7) son propuestas. Las preguntas de §8 son las que bloquean.

---

## Resumen

1. **El sitio no se ve genérico por un error puntual.** Se ve así porque ninguna decisión
   visual sale de la tesis "programador en formación + saltador de alto". Hay una sola
   plantilla de sección repetida 11 veces, 44 bloques entran con la misma animación, hay 7
   grillas de tarjetas y el azul está en todas partes. Lo único con identidad propia es La
   Barra, y D9 ya la sacó.
2. **Las fotos no protagonizan: están tapadas.** El hero las pasa a 55 % de gris, con 60 % de
   brillo y un velo que llega al 95 %. Eso contradice D8, que pide ver la foto.
3. **Encontré un defecto de layout que ningún test mide.** A partir de ~1140 px de ancho, en
   las 5 secciones oscuras el título queda 150 px a la izquierda del contenido.
4. **El presupuesto de JS de D4 (150 KB gzip) está por debajo del piso de Next.** Una página
   sin ninguna sección nuestra ya carga 168,6 KiB gzip. Lo nuestro suma ~60 KiB encima. El
   presupuesto hay que redefinirlo; recortar no alcanza.
5. **Recomendación:** la dirección **A, "Planilla de competencia"**, con un solo elemento de la
   B (el hero con la foto grande, sin velo). Es la más propia, la que funciona con las fotos que
   ya existen y la de menor riesgo técnico.

---

## 1. Inventario actual

### 1.1 Secciones, en orden de pantalla

Todas las secciones son client components (`"use client"`), salvo `Footer`. La página mide
**11.252 px a 1440** (~12,5 pantallas) y **15.758 px a 390** (~18,7 pantallas de un iPhone).

| # | Sección | Componente | Lo real | Placeholder o pendiente |
|---|---|---|---|---|
| — | Hero | `Hero.tsx` + `AnimatedStat.tsx` | Nombre, PB 2.06, estatura 2.01 | La frase sale **dos veces** (`h2` + cita con ✈️, N5). La 3.ª capa `hero-nueva.jpeg` es placeholder y además es la imagen de OG. La edad `19` está escrita a mano (P14) |
| 01 | Sobre Mí | `SobreMi.tsx` | Foto `foto_posando2`, bio | La bio es **solo atlética** y suena a CV ("he demostrado ser un competidor de alto nivel") |
| 02 | Stack | `Stack.tsx` | Dos grupos de chips | PostgreSQL, Prisma y Docker figuran como "Profundizando ahora", pero en D12 Juan dijo que ya son parte de su stack |
| 03 | Proyectos | `Proyectos.tsx` | Fast Inventory, Athletics Hub, Portafolio | `tagline`, `stack` y `demo` con `❓ PENDIENTE JUAN`. La solución del portafolio dice "Tailwind", que D4 elimina. La 4.ª tarjeta, "+ siguiente proyecto", es placeholder a propósito. Los 3 sistemas de D12 (ERP, gestión de atletas, estadísticas) no se publican sin su detalle |
| 04 | La Barra | `Progresion.tsx` | 2.06 → 2.10 → 2.19 → 2.20–2.25 | **Sale del sitio (D9)** y se reemplaza por el gráfico SVG de PORT-013b |
| 05 | Momento Épico | `MomentoEpico.tsx` | Tríptico B/N real | — |
| 06 | Galería | `Galeria.tsx` | 7 fotos reales | La etiqueta **"Legado Lima 2019" es incorrecta** (D12.6: es el Iberoamericano U18, Lima 2023). `salto2.jpeg` trae un marco blanco horneado en el archivo |
| 07 | Logros | `Logros.tsx` | 4 hitos, clubes | El **entrenador no se publica** (D10). Clubes: solo Todomed, más "Atleta de la Liga Vallecaucana" y "Atleta Selección Colombia" (D12.1). Íconos emoji |
| 08 | Formación | `Formacion.tsx` | 2 títulos 2023, 2 certificados | Mucho espacio para 4 datos. Emoji 📜 |
| 09 | Técnica | `Tecnica.tsx` | 4 tarjetas con copy propio | **El mejor texto del sitio** ("cada intento es un experimento controlado"), enterrado en la posición 9 |
| 10 | Metas | `Metas.tsx` | 3 deportivas, 2 tecnológicas | Las tecnológicas duplican a Proyectos con otro formato |
| 11 | Contacto | `Contacto.tsx` | Email, GitHub, Instagram, LinkedIn | 3 de los 4 íconos son emoji. A 1440, el email se parte en dos renglones dentro de su tarjeta ("…1313@gm / ail.com") |
| — | Footer | `Footer.tsx` (server) | Nombre | El año `2026` está escrito a mano y el rol dice solo "Atleta de Salto Alto" |

**Soporte:** `Nav.tsx` es un pill fijo abajo con 6 links. **A 390 px solo se ven 4**: "Deportivo" y
"Contacto" quedan fuera (N3, se ve en la captura). `BackToTop.tsx` tapa texto en móvil (capturas
de Sobre Mí, Técnica y Metas). También están `SmoothScroll.tsx` (Lenis + `MotionConfig`),
`Reveal.tsx` (44 usos) y `hooks/useActiveSection.ts` y `useBelowFold.ts`.

### 1.2 Imágenes (`public/images/`, 22 MB en JPEG + 2,7 MB en WebP)

| Archivo | px | Dónde se usa | Qué es / calidad |
|---|---|---|---|
| `pb2.04.jpeg` | 3024×4032 | Galería | Junto al tablero "PERFORMANCE 1 2.04". **La foto con más relato del set**, hoy es una miniatura más |
| `podio_u23.jpeg` | 3024×4032 | Hero (capa 1, LCP) + Galería | Podio con bandera. Buena, vertical |
| `u18.jpeg` | 1537×2048 | Hero (capa 2) + Galería | Carrera de aproximación. Buena |
| `hero-nueva.jpeg` | 2268×4032 | Hero (capa 3) + **OG** | **Placeholder**: figura diminuta en una pista vacía |
| `vista_epica.jpeg` | 1639×2048 | Momento Épico | Aproximación con la barra en primer plano. **Es literalmente la fase "aproximación"** |
| `foto_blanconegro.jpeg` | 2774×4160 | Momento Épico | Vallas de noche, B/N |
| `epica_trasera2.jpeg` | 1639×2048 | Momento Épico | Silueta de espaldas, B/N |
| `epica_trasera.jpeg` | 1639×2048 | Galería | Silueta celebrando, a contraluz. Muy buena |
| `podio-mayores.jpeg` | 3024×4032 | Galería | Podio de mayores |
| `salto2.jpeg` | 2108×1425 | Galería | Franqueo de la barra. **Marco blanco horneado**: hay que recortarlo del archivo, porque no se puede tapar con CSS a todos los anchos |
| `foto_saltoperu1.jpeg` | **1080×1620** | Galería | Franqueo en Lima 2023. **Baja resolución**: a sangre en 1440 se ve blanda |
| `foto_posando2.jpeg` | 3024×4032 | Sobre Mí | Con la camiseta de Colombia |
| `posando1.jpeg` | 3024×4032 | **sin uso** | Tirado en la colchoneta, relajado. Buena para un "Sobre mí" menos acartonado |
| `foto_nike.jpeg` | 3024×4032 | **sin uso** | Pose de entrenamiento. La marca de ropa se ve en primer plano |
| `foto_secuencial.jpeg` | 1290×1612 | **sin uso** | Multiexposición del salto completo. **Si es Juan, ilustra la técnica mejor que cualquier texto.** No está confirmado |
| `fotogrupal1.jpeg`, `grupal2.jpeg` | 3720×2480, 2048×1365 | **sin uso** | Grupo con otros atletas: no se publican sin su permiso |

Hay 4 `.webp` que sobran (`foto_nike`, `foto_secuencial`, `fotogrupal1`, `posando1`, **2,7 MB**).
Son de fotos sin uso y `next/image` ya genera sus propios formatos.

**Lo que falta en el set, y condiciona §3:** no hay **ninguna foto de salto horizontal en alta
resolución y sin defectos**. Las tres de franqueo son `salto2` (con marco), `foto_saltoperu1`
(1080 px de ancho) y `foto_secuencial` (sin confirmar). Todo lo demás es podio, retrato o
aproximación.

### 1.3 Medidas de base

| Medida | Valor | Cómo |
|---|---|---|
| JS inicial de `/es` | **229,1 KiB gzip · 198,7 KiB brotli** | Chunks del HTML servido, `zlib` nivel 9 |
| Piso del framework (la 404, sin secciones nuestras) | **168,6 KiB gzip · 145,6 KiB brotli** | Misma medición sobre `/es/no-existe` |
| Lo nuestro (`/es` − piso) | **~60 KiB gzip** | De eso, el chunk de `motion` pesa ~54 KiB y el de Lenis ~6,4 KiB |
| Bloques con `<Reveal>` | 44 | `grep` en `components/` |
| `globals.css` | 961 líneas | — |

El chunk de `motion` incluye la maquinaria de `layoutId` (18 apariciones), aunque el sitio no
usa layout animations. Eso es lo que `LazyMotion` recorta (PORT-003a).

---

## 2. Por qué se ve genérico

**El diagnóstico de fondo:** si al sitio le sacás el texto, no queda nada que diga "salto alto"
ni "código". Hoy la tesis vive solo en el copy. El lenguaje visual es el de una plantilla
oscura de portafolio: título grande azul, secciones numeradas, tarjetas con hover.

### 2.1 Tipografía

- **Una sola fuente de display, con un solo peso, para todo.** Archivo Black (`app/fonts.ts:3`)
  se usa en el `h1` y en los 11 `h2`. Es una fuente muy vista y no tiene variantes: no hay
  condensada, ni peso medio, ni cifras tabulares para las marcas.
- **No hay escala tipográfica.** El `h1` va a `clamp(3.2rem, 11vw, 7.5rem)`
  (`globals.css:235`) y el siguiente nivel, el `h2` de sección, a `clamp(1.6rem, 3.5vw, 2.2rem)`
  (`:337`). Entre los dos hay un salto de ×3,4 sin nada en el medio. Todo lo demás vive entre
  0,7 y 1,1 rem. El resultado es un título enorme seguido de un sitio entero en letra chica.
- **Las marcas no se tratan como dato.** 2.06, 2.10 y 2.19 son el corazón del lado atlético y
  salen en 1,4 rem (`.stat-value`, `:274`), al pie del hero y con `opacity: 0.82` (`:259`).
- **El `h1` va en azul con `text-shadow`** (`:237-238`). El nombre compite con el azul de los
  links, y la sombra paralela fecha el diseño.

### 2.2 Jerarquía

- **La misma cabecera 11 veces:** eyebrow "0X — ETIQUETA" en 0,8 rem, mayúsculas y 3 px de
  espaciado (`:326-333`), más un `h2` con un filete de 2 px debajo (`:335-343`). Es la firma más
  reconocible de plantilla.
- **La numeración 01–11 no significa nada para quien visita.** Tampoco coincide con el nav, que
  tiene 6 links, ni con la narrativa de las fases del salto de `CLAUDE.md`. Esas fases
  (aproximación, impulso, curva, despegue, vuelo, aterrizaje) **no aparecen en ningún lugar del
  sitio**.

### 2.3 Espaciado

- **Hay dos tokens de espacio en todo el sistema:** `--space-sm: 10px` y `--space-lg: 30px`
  (`:67-68`). El resto son píxeles sueltos: 90/60 px de padding por sección (`:312`, `:942`), y
  14, 18, 20, 22, 26, 36, 44 y 50 px repartidos. Sin escala no hay ritmo vertical, y todas las
  secciones pesan lo mismo.
- **Todo tiene la misma densidad.** Formación (4 datos) ocupa lo mismo que Proyectos. Por eso
  la página mide 18,7 pantallas en móvil.

### 2.4 Layout

- **7 grillas `repeat(auto-fit, minmax(…))` de tarjetas:** galería, logros, certificados,
  proyectos, técnica, metas y contacto (`:603`, `:643`, `:697`, `:718`, `:770`, `:804`, `:867`).
  Todas tienen el mismo radio de 12 px y el mismo hover `translateY(-6px)`.
- **Filas huérfanas:** a 1440, la galería queda 3 + 3 + **1**, y Proyectos queda 3 + **1**
  (el placeholder solo, en su propia fila).
- **Todo centrado.** El hero es texto centrado sobre una foto centrada, y cada sección es una
  columna de 1100 px. D8 pide "títulos bien orientados, no centrados por defecto".
- **⚠️ Defecto medido, fuera de todo test:** a partir de ~1140 px, en las secciones oscuras
  (Progresión, Épico, Logros, Técnica, Contacto) el eyebrow y el `h2` quedan en **x=20**
  mientras el contenido arranca en **x=170**. En las claras todo arranca en x=190. **La causa:**
  `.section h2 { margin: 0 0 20px }` (`:338`) y `.eyebrow { margin: 0 0 10px }` (`:332`) pisan el
  `margin: auto` de `.section-dark > *` (`:320-324`). Medido a 1440, 1024 y 768: solo aparece a
  1440. Lo anoto y no lo arreglo: el rediseño reescribe estas reglas.

### 2.5 Color

- **El azul está en todo:** el nombre, los 8 `h2` no atléticos, eyebrows, chips, links, la cita,
  el indicador de scroll y el nav activo. Así deja de significar "mundo técnico". Galería,
  Momento Épico y Técnica son atléticas y **van en azul**: el coral se aplica solo a 3 de las 6
  secciones deportivas, pisando por `#id` (`:836-861`).
- **Logros son tarjetas blancas** (degradado `--silver-light` → `--white`, `:647-648`). Son la
  única superficie clara de un sitio oscuro, y se leen como un error.
- **Emojis como iconografía:** 🥇🥈📈 en Logros, 📜 en Formación, 📧📱💼 en Contacto, 🏆💻 en
  Metas, ✈️ en la cita del hero, 🇨🇴 en el footer y los de respaldo de la Galería. Es lo que más
  grita "generado", y los lectores de pantalla los leen en voz alta.

### 2.6 Uso de fotos

- **El hero apaga sus propias fotos:** `grayscale(55%) contrast(1.08) brightness(0.6)`
  (`:196`), más un velo de `0.45 → 0.95` de negro y un halo azul (`:199-207`). En la captura
  apenas se adivina el podio. **Esto contradice D8** ("poca difuminación, quiero ver la foto").
- **Las fotos son tarjetas, no protagonistas.** En la galería van las 7 del mismo tamaño, con
  radio y sombra. Nada dice cuál importa más, y la del tablero 2.04 queda como una miniatura.
- **Las fotos no tienen pie.** Ninguna dice dónde, cuándo ni qué marca. Con eso una foto de
  podio pasa de "foto linda" a evidencia.
- **Defectos del material:** `salto2` con marco blanco, `hero-nueva` como placeholder y OG,
  `foto_saltoperu1` en baja resolución.

### 2.7 Animación

- **Todo entra igual:** los 44 `<Reveal>` usan `opacity 0→1, y 30→0, 0.7 s` (`lib/motion.ts:17-24`),
  incluido cada chip del Stack uno por uno. Cuando todo se anima igual, nada se siente
  intencional.
- **Los hovers son genéricos:** `translateY(-6px)` en 5 tipos de tarjeta y `scale(1.04)` con
  zoom en la galería. Ninguno dice nada.
- **Solo un movimiento tiene intención:** el crossfade del hero con `useScroll`. Pero ocupa
  **320vh** (260vh en móvil, `:163`, `:937`): son 2,6 pantallas de scroll antes de ver el primer
  contenido (P9).
- **El indicador de scroll** tiene forma de mouse animado (`:286-308`). Es un cliché, y en
  táctil no significa nada.

---

## 3. Direcciones visuales

Las tres respetan lo que no se negocia: tokens en `:root`, gris universal / azul técnico /
coral atlético, fuentes autoalojadas, `motion` + `lenis` y `prefers-reduced-motion`. Además,
las tres dejan fuera los emojis y los velos sobre las fotos (D8).

### A. "Planilla de competencia": editorial de datos, oscuro ★ recomendada

- **Idea:** el salto alto ya tiene un lenguaje visual propio y nadie lo usa: la planilla de
  resultados. Tiene alturas en columnas, la notación de intentos (`O`, `XO`, `XXO`, `XXX`), la
  barra como línea horizontal y el tablero. El código tiene uno paralelo: logs, versiones,
  estados. El sitio se arma como un documento de datos bien tipografiado.
- **Referencia de estilo:** planillas de resultados de atletismo, tipografía suiza, editoriales
  deportivos de datos. Es un patrón que se traduce, no algo que se copia.
- **Tipografía:**
  - **Archivo** variable (OFL; tiene eje de ancho de 62 a 125 y peso de 100 a 900), que es la
    familia de la Archivo Black actual. Va condensada y pesada para nombre y marcas, y normal
    para títulos.
  - **JetBrains Mono** (OFL) para datos, etiquetas y estados.
  - **Inter** sigue para el texto corrido.
  - Las cifras van tabulares; hay que verificar `tnum` en el archivo.
- **Color:**
  - El fondo sigue oscuro. El **gris** pasa a ser el color dominante: texto, filetes, grilla.
  - El **azul** aparece solo donde algo es técnico: estados de proyecto, stack, links a código.
  - El **coral** solo en marcas, barra e hitos deportivos.
  - El nombre va en blanco, no en azul.
- **Fotos:**
  - Documentales, en color, recortadas con intención en una grilla de 12 columnas.
  - Cada una lleva un pie en mono (`LIMA · 2023 · 1.95 m`).
  - El texto va **al lado** de la foto, nunca encima. Eso resuelve D8 sin velos.
  - `pb2.04` (el tablero) pasa a ser una imagen central.
- **Movimiento: "medición".**
  - Filetes y la barra que se dibujan de izquierda a derecha.
  - Marcas que cuentan una sola vez, bajo el pliegue.
  - En Deportivo, una regla de altura que se llena con el scroll (scrub).
  - Los intentos `O`/`X` que aparecen en secuencia.
  - Hovers: subrayado que se desliza y flecha que avanza.
  - Duraciones de 200–600 ms, con el `--ease` actual para las entradas y lineal para el scrub.
- **Distancia al sitio actual: media.** Se conservan el fondo oscuro, los tokens de color, el
  tríptico B/N y la estructura server/client del plan. Cambian la tipografía, el layout, la
  cabecera de sección y el sistema de fotos.

### B. "Vuelo": cinemático, con la foto a sangre

- **Idea:** el sitio se recorre como las fases de un salto. Cada fase (aproximación, impulso,
  curva, despegue, vuelo, aterrizaje) es un capítulo con una foto a pantalla completa fija
  (sticky) y el texto pasando por encima de la zona vacía de la imagen.
- **Referencia de estilo:** documentales deportivos, longform editorial con scrollytelling,
  páginas de producto con capítulos por scroll.
- **Tipografía:** **Instrument Serif** (OFL; solo regular e itálica) en display, contra
  **Inter** en texto. El contraste serif/sans es lo que hace "editorial".
- **Color:**
  - Las fotos ponen el color.
  - El gris queda para la interfaz.
  - El azul y el coral se usan solo como marcador de capítulo: técnico o atlético.
- **Fotos:** a sangre y protagonistas absolutas. **Necesita 3–4 fotos horizontales de salto de
  ≥2400 px que hoy no existen** (ver §1.2).
- **Movimiento: "trayectoria".**
  - Capítulos sticky con parallax de ±40 px.
  - Revelado de fotos con `clip-path` de abajo hacia arriba, como el cuerpo subiendo.
  - Líneas de texto que entran con máscara.
  - La foto del hero que se achica con el scroll.
  - Casi todo es scrub.
- **Distancia al sitio actual: lejos.** Se reescribe el layout completo.
- **Riesgo:** es la dirección que más carga el riesgo #1 del proyecto (sticky + Lenis en Safari
  real, nunca probado) y la que más depende de fotos nuevas.

### C. "Papel y pista": minimal suizo, claro

- **Idea:** invertir el tema. Fondo de papel (blanco cálido) y tipografía negra, con el azul y
  el coral como las únicas señales de color. Mucho aire y una grilla asimétrica. Se lee como un
  documento de ingeniería bien hecho, y se diferencia de la mayoría de portafolios de
  developers, que son oscuros.
- **Referencia de estilo:** diseño suizo, documentación técnica y changelogs bien
  tipografiados.
- **Tipografía:** **Inter**, que ya está en el repo y cuesta 0 KB extra, en display y texto,
  más **IBM Plex Mono** (OFL) para los datos. La personalidad sale de la escala y del peso, no de
  una fuente nueva.
- **Color:**
  - El gris y el negro llevan todo.
  - El azul solo en links y estados técnicos.
  - El coral solo en marcas.
  - Hay que re-verificar todo el contraste AA sobre fondo claro: el coral actual (`#ff6b5e`)
    **no llega a 4.5:1 sobre blanco** y necesitaría una variante oscura para texto.
- **Fotos:**
  - En color, a tamaño medio, recortadas en formatos distintos según la grilla, con mucho
    blanco alrededor.
  - Funciona con el set actual.
- **Movimiento: "precisión".**
  - Casi nada entra al hacer scroll: solo la cabecera de cada sección.
  - Microinteracciones de 150–300 ms: foco, hover y copiar el email.
  - Un solo gesto propio: la barra del hero, que sube con el progreso de lectura.
- **Distancia al sitio actual: lejos.** Cambian todos los tokens de superficie y hay que
  revalidar el contraste. Puede chocar con la foto B/N de Momento Épico, pensada para oscuro.

### Comparación

| | A · Planilla | B · Vuelo | C · Papel |
|---|---|---|---|
| Cuánto dice "salto alto + código" | **Alto**: la planilla y los logs son los dos lenguajes | Alto en lo atlético, bajo en lo técnico | Medio: dice "ingeniero", el salto queda en el contenido |
| ¿Sirve con las fotos de hoy? | **Sí** | No, necesita sesión de fotos | Sí |
| Riesgo técnico | Bajo | **Alto** (sticky + Lenis + Safari) | Bajo |
| JS extra estimado | ~0 (lo actual, recortado) | Igual, más uso de `useScroll` | ~0 |
| D8 (ver la foto, sin velos) | Texto al lado de la foto | Texto sobre zonas vacías de la foto | Texto al lado |

**Recomendación: A, con el hero de la B.** El hero va partido: en escritorio, una foto vertical
grande (`vista_epica`, que *es* la aproximación, o `pb2.04`) ocupa media pantalla sin velo,
con un parallax sutil. En la otra mitad van el nombre y la línea de rol, alineados a la foto.
En móvil, la foto arriba y el texto abajo. B completa conviene recién si hay una sesión de
fotos; se puede subir en v1.1 sin rehacer A, porque las dos comparten tokens y componentes.

---

## 4. Plan de movimiento

### 4.1 Restricciones que valen para cualquier opción

- **R2: nada de lo que está sobre el pliegue se anima al entrar.** El hero no puede tener una
  animación de carga en el `h1` ni en los datos. Sí puede moverse **con el scroll** (parallax,
  salida). Si alguna dirección quiere una entrada animada del hero, hay que reabrir R2 (§8).
- **CSP con nonce.** `motion`, Lenis y GSAP animan con `element.style` (CSSOM), y la CSP no lo
  bloquea: `style-src` solo restringe atributos `style=""` en el markup y `<style>` sin nonce.
  Ninguna de las tres inyecta `<script>` inline. **No hay conflicto** con ninguna.
- **`prefers-reduced-motion`.** `MotionConfig reducedMotion="user"` cubre los `motion.*`, pero
  **no cubre los hooks de scroll** (`useScroll`/`useTransform`): un parallax sigue moviéndose
  con reduce. Cada isla de scrub necesita su rama explícita con `useReducedMotion()`. Hoy el
  crossfade del hero no la tiene, y debería.

### 4.2 El presupuesto de 150 KB gzip, medido

| Qué | gzip | brotli (lo que sirve Vercel) |
|---|---|---|
| Piso del framework: la 404, sin secciones nuestras | **168,6 KiB** | 145,6 KiB |
| `/es` hoy | 229,1 KiB | 198,7 KiB |
| Lo nuestro (`motion` ~54 + Lenis ~6,4 + componentes) | ~60 KiB | ~53 KiB |

**150 KB gzip no se puede cumplir con Next 16 + React 19**, aunque se saquen `motion` y Lenis.
Propuesta: redefinirlo como **"JS propio sobre el piso ≤ 60 KiB gzip"**, medido como `/es`
menos la 404. Hoy da justo en el límite, y `LazyMotion` debería bajarlo. Es una decisión de D4,
así que va a §8.

**Límite del método:** medí sobre el build local con Turbopack. El reviewer midió HEAD con
webpack y los números no son comparables entre bundlers.

### 4.3 Opciones

| Opción | Costo de JS | Qué cubre | Veredicto |
|---|---|---|---|
| **`motion` con `LazyMotion` + `m`** | Según la documentación de Motion, ~4,6 KB más ~15 KB de `domAnimation`, contra los ~54 KiB de hoy. **Hay que medirlo acá (PORT-003a)**; los hooks no se achican | Reveals, scrub, parallax, sticky con `useScroll`, contadores, `layoutId` para case studies (necesita `domMax`) | **Sí.** Cubre todo lo de las tres direcciones |
| **Lenis** | ~6,4 KiB | Scroll suave. Hace scroll nativo, así que no rompe `position: sticky` ni las scroll timelines de CSS | **Sí**, ya está |
| **CSS scroll-driven animations** (`animation-timeline: view()`) | **0 KB** | Filetes que se dibujan, barra de progreso, parallax simple | **Sí, solo como mejora progresiva.** Chrome/Edge 115+, Safari recién desde la versión 26 (2025) y Firefox sin activar por defecto. **Verificar en caniuse antes de usarlo** (regla 5 del flujo de referencias). Sin soporte, el elemento queda en su estado final |
| **View Transitions API** | 0 KB | Transición entre la home y un case study | **v1.1**, junto con los case studies. Compite con `layoutId`; se decide ahí |
| **GSAP + ScrollTrigger** | ~27 KB (core) + ~17 KB (ScrollTrigger) gzip. Son cifras publicadas y aproximadas, no las medí acá. **Se suman** a `motion` salvo que lo reemplacen | Pin con spacer automático, timelines con scrub y snap, SplitText. Desde 2025 es gratis con todos sus plugins | **No.** Está **prohibido por D4** y por la regla #2 de `CLAUDE.md`. Todo lo que piden A, B y C sale con `useScroll` + `position: sticky`. Lo único que agregaría (el snap entre capítulos de B) va contra "nada de secuestrar el scroll". El reduced-motion habría que cablearlo a mano con `gsap.matchMedia()` |

### 4.4 Vocabulario de movimiento para la dirección A

| Movimiento | Dónde | Implementación | Con reduce |
|---|---|---|---|
| Filete o barra que se dibuja | Cabecera de sección, divisores | `scaleX` 0→1 con `whileInView`, o CSS `view()` | Aparece dibujado |
| Marca que cuenta una vez | Deportivo, bajo el pliegue | `AnimatedStat` actual | Valor final |
| Regla de altura con scrub | Deportivo: 1.95 → 2.06 → 2.10 | `useScroll` + `useTransform` sobre la sección | Regla estática y llena |
| Intentos `O`/`X` en secuencia | Tabla de competencias | Stagger corto, solo esa tabla | Todo visible |
| Parallax de ±30 px | Foto del hero, fotos grandes | `useScroll` + `useTransform` | Sin desplazamiento |
| Subrayado que se desliza + flecha | Links y tarjetas de proyecto | CSS `transition` | Instantáneo |
| **Se elimina** | El fade-up en 44 bloques, el stagger de chips, `translateY(-6px)`, el zoom de la galería, el mouse de scroll | — | — |

---

## 5. Sección por sección

**Ojo antes de leer esta sección:** la lista que pediste (hero, sobre mí, stack, proyectos,
galería, deportivo, contacto) tiene **7 secciones**. El plan (AUDIT-V2 §6, PORT-006) tiene
**8**: Identidad, Historia, Forma de pensar, Proyectos, Engineering, Athletics, Evolución y
Contacto. Esta sección sigue tu lista y marca dónde cae cada pieza del plan. **Cuál de las dos
manda es la pregunta 1 de §8.**

| Sección | Se mantiene | Cambia | Se construye nuevo |
|---|---|---|---|
| **Hero** (aproximación) | Nombre como `h1` en texto plano (R3). Stats 2.06 / 2.01 / edad. `priority` en la foto LCP | 1 foto en vez del crossfade de 3 capas y 320vh: queda en 100svh. Sin velo ni gris. Nombre en blanco, alineado a la foto. La frase va una sola vez (N5). Edad derivada de la fecha de nacimiento (P14) | Línea de rol: *"Full stack developer en formación · Saltador de alto"* (de la `description` aprobada en D12). 2 CTAs: Proyectos y Contacto. Parallax con scroll. OG image propia (`next/og` o la foto elegida) |
| **Sobre mí** (impulso) | La foto de retrato | La bio actual (solo atlética, suena a CV) se reemplaza por un texto en primera persona sobre cómo se cruzan pista y código. **El texto lo escribe Juan** (pregunta F del plan). Formación se pliega acá como 2 renglones de datos, no como sección | La frase de Técnica ("cada intento es un experimento controlado…") como puente entre los dos mundos. Candidata a foto: `posando1` |
| **Stack** (curva) | La separación honesta "uso hoy / estoy aprendiendo" | Chips sueltos → **por capa** (frontend, backend, datos, infraestructura, herramientas). PostgreSQL, Prisma, Docker y Git pasan a "uso hoy" (D12.7) | Cada tecnología enlazada a los proyectos donde se usó, derivado de `project.stack`, que hoy está vacío (❓) |
| **Proyectos** (despegue) | Los 3 actuales, con problema → solución. Estados honestos. Badge "Repositorio privado" (D7) | Tarjetas iguales → 1 destacado grande + el resto en lista. Sin el placeholder "+ siguiente proyecto" solo en una fila. La solución del portafolio deja de decir Tailwind | Una lista corta "En construcción" con los 3 sistemas de D12, **solo con título y una línea que escriba Juan**, sin inventar arquitectura. Capturas propias como evidencia. Los case studies son v1.1 |
| **Galería** | Las fotos reales y el tríptico B/N de Momento Épico (la única sección en B/N, a propósito) | 7 fotos iguales en grilla → 5–6 curadas en layout editorial: una grande y las demás en otros formatos. `salto2` recortada. Etiqueta de Lima corregida (Iberoamericano U18, 2023) | Pie de foto con dato (lugar · año · marca) en mono |
| **Deportivo** (vuelo) | Hitos reales: campeón nacional U18 ×2 y subcampeonatos. El copy de Técnica | La Barra sale (D9). Logros sin emojis ni tarjetas blancas. Sin entrenador (D10). Clubes y afiliaciones según D12.1. Metas deportivas como "siguiente barra": 2.10 → 2.19 → 2.20–2.25 | Gráfico de progresión SVG con tabla accesible (PORT-013b) y datos de World Athletics. Tabla de competencias con notación de intentos. "2.06 m mejor marca · 2.05 m registrada en World Athletics" (D12.5). `foto_secuencial` como ilustración de la técnica, si es Juan |
| **Contacto** (aterrizaje) | Los 4 links reales. `SHOW_GITHUB_PROFILE` | Íconos SVG en vez de emoji. El email como CTA principal en tipografía grande, sin partirse en dos renglones | Botón "copiar email" con confirmación accesible (`aria-live`). Footer con año derivado y rol dev + atleta |
| **Fuera de la lista** | — | **Metas tecnológicas:** duplican Proyectos → se eliminan. **Nav:** con 7 secciones sigue sin entrar en móvil (N3) → se rediseña | — |

---

## 6. Impacto técnico

### 6.1 Tests E2E (suite actual: 156 pruebas, chromium + webkit)

| Archivo | ¿Se rompe con el rediseño? | Por qué |
|---|---|---|
| `a-ssr.spec.ts` | **Sí, 1 de 3.** "Solo 2 `opacity:0`" está atado al crossfade de 3 capas. El `h1` y el contenido profundo sobreviven si el contenido se queda | El número 2 es literalmente "las capas 2 y 3 del hero" |
| `b-images.spec.ts` | **Parcial.** "Ninguna `<img>` en 0×0" sobrevive. El test N1 usa `.sobre-mi-photo` | Selector de clase de la sección actual |
| `f-aria-current.spec.ts` | **Sí.** Usa `#inicio`, `#stack`, `#proyectos`, `#progresion`, `#logros`, `#contacto` y `.nav-pill-link` | Ids y nav nuevos |
| `g-reduced-motion.spec.ts` | **Sí.** `.achievement-item`, `.card-wide`, `.galeria-item` | Clases que desaparecen |
| `h-marker-label-overlap.spec.ts` | **Sobra entero.** Mide La Barra | D9 la elimina |
| `j-lang-en.spec.ts` | **Parcial.** La parte de `.marker-label` sobra; status, lang, nonce, consola y overflow sobreviven | Idem |
| `c`, `d`, `e`, `i`, `k` | **No.** Overflow horizontal, consola, nonce, redirect/404 y barrido es/en no dependen de la estructura | — |

**Propuesta:** antes de rediseñar, pasar los selectores a roles y `data-testid` estables
(`data-section="proyectos"`), para que el rediseño cambie clases sin tocar los tests. Y sumar
un test por cada defecto de §2 que hoy no se mide: la alineación de cabeceras a 1440, el email
que no se parte y los links del nav visibles a 390.

**Nota de arnés, de esta sesión:** `npm run test:e2e`, que hace el build y el start dentro de
Playwright, dio **9 timeouts de WebKit**. Con el server levantado a mano dio **156/156**, y
`31b638c` mostró los mismos timeouts en las mismas condiciones (22 en la primera corrida, 59/59
en la segunda). No es una regresión, pero la suite no es confiable en ese modo en esta máquina.
Está registrado en la bitácora.

### 6.2 Retiro de Tailwind y el patrón server/client

- **PORT-005a va antes del rediseño, sin discusión.** Todo estilo nuevo nace como CSS Module.
  `globals.css` queda con reset, tokens y base tipográfica. Hoy mide 961 líneas; el rediseño lo
  deja en una fracción y **absorbe PORT-005b**.
- **Tokens nuevos que el rediseño necesita en `:root`:** escala tipográfica (6–7 pasos con
  `clamp`), escala de espacio (4–8 pasos), grilla (columnas y gutter), radios, duraciones y
  easings de movimiento (espejados en `lib/motion.ts`), y el color de texto sobre foto. Ninguno
  en hex suelto (regla #1).
- **Server/client (R4, PORT-003a):**
  - Hoy son 17 client de 18.
  - Con el rediseño, cada sección pasa a ser un server component.
  - Solo quedan client las islas de `components/motion/` (`Reveal` con menos usos, `Parallax`,
    `ScrubRule`) más `Nav`, `CopyEmail` y `SmoothScroll`. Son unas **6–7 islas client**.
  - Los textos ya llegan desde `content/` resueltos por idioma (PORT-001b).
- **i18n:** todo copy nuevo entra por `content/` con `es` y `en`. El barrido de claves
  (`k-bilingual-coverage`) lo vigila solo. El inglés en primera persona lo revisa Juan (R5).

### 6.3 Qué pasa con el plan

| Tarea | Qué pasa |
|---|---|
| PORT-001b | **Se mantiene y es lo primero.** Hoy tiene 1 regresión abierta: `/%FF` da 500 (ver el resumen de la sesión) |
| PORT-005a (Tailwind) | **Se mantiene**, antes que cualquier pixel nuevo |
| PORT-003a (server/client + `LazyMotion`) | **Se mantiene.** Las 2 secciones piloto conviene que sean las primeras del rediseño, no `Galeria` y `Contacto` viejas |
| PORT-006 (IA, GATE 2) | **Cambia.** Se parte en **006a: sistema visual** (tokens, tipografía, grilla y cabecera de sección, con capturas) y **006b: IA** (7 u 8 secciones, según la pregunta 1). El checklist de contenido migrado sigue siendo obligatorio |
| PORT-007 (hero) | **Cambia** según la dirección elegida |
| PORT-008 (historia) | **Cambia:** pasa a ser "Sobre mí" |
| PORT-009 (forma de pensar, sticky) | **Sobra en v1** si gana tu lista de 7. Su copy (Técnica) se reparte entre Sobre mí y Deportivo. Si gana el plan de 8, se queda |
| PORT-010 (proyectos) | **Se mantiene** |
| PORT-011a / 011b (case studies, `layoutId`) | **Pasan a v1.1** |
| PORT-013a / 013b (datos deportivos, gráfico) | **Se mantienen.** 013b se diseña con el vocabulario de la dirección elegida |
| PORT-014 (engineering) | **Se funde** con Stack |
| PORT-015 (evolución + contacto) | **Se reduce** a Contacto. Evolución se reparte entre Proyectos ("en construcción") y Deportivo ("siguiente barra") |
| PORT-005b (limpieza de CSS) | **Sobra:** la absorbe el rediseño |
| PORT-016 / 017 / 018 / 020, GATE 4 | **Se mantienen.** 018 con el presupuesto de JS redefinido (§4.2). La 404 sin diseño ni bilingüe entra en 016 o 017 |
| **Nueva: preparación de fotos** | Recortar `salto2`, borrar los `.webp` sobrantes, elegir la foto definitiva del hero y de OG, y decidir la dirección de arte por breakpoint |

---

## 7. Definición de v1

**v1 es lo mínimo para desplegar en Vercel sin que nada del sitio sea placeholder ni esté mal
dicho.** Es lo que verifica el GATE 4.

### Entra en v1

1. Las 7 secciones de §5 con la dirección elegida, en `/es` y `/en`, con el inglés revisado por
   Juan.
2. Hero con la foto definitiva, sin placeholder. Una sola frase y la edad derivada.
3. Proyectos: los 3 actuales con estados honestos y capturas, más la lista "en construcción"
   sin detalles inventados. **Sin páginas de case study.**
4. Deportivo con datos de World Athletics, la tabla de competencias y el gráfico SVG con su
   tabla accesible. Sin entrenador, con clubes y afiliaciones según D12.
5. Contacto con íconos SVG y el botón de copiar email.
6. Cero emojis como iconografía y cero `// ❓ PENDIENTE JUAN` en `content/`.
7. SEO base: metadata por idioma, OG image definitiva, `sitemap.ts`, `robots.ts` y JSON-LD
   `Person`. Canonical con el dominio, o la URL de Vercel anotada.
8. Pasada de accesibilidad (PORT-017) y performance con el presupuesto redefinido (PORT-018).
9. El checklist del GATE 4 completo, **incluido Safari en un iPhone real**.
10. La regresión `/%FF` → 500 resuelta.

### Queda para v1.1

- Case studies en `/[lang]/proyectos/[slug]` y la transición `layoutId` o View Transitions.
- La sección "Forma de pensar" con sticky, si Juan la quiere.
- La dirección B completa, si hay sesión de fotos.
- Datos de GitHub por API (hoy descartado por D7).
- OG image dinámica por página.
- 404 con diseño y bilingüe, si no entra en v1 por tiempo.
- Recuperar `○ Static` (spike de `experimental.sri`), solo si el tráfico lo justifica.

---

## 8. Preguntas para Juan

### Decisiones de diseño (bloquean el arranque del rediseño)

1. **¿Qué IA manda: tu lista de 7 secciones o las 8 del plan?** La diferencia son "Forma de
   pensar" y "Evolución". Cambia PORT-009 y PORT-015 (§6.3).
2. **¿Qué dirección: A, B, C o una mezcla?** Mi recomendación es A con el hero de B.
3. **¿Oscuro o claro?** Si te interesa C, conviene decidirlo antes de escribir un solo token.
4. **Presupuesto de JS:** ¿aceptás redefinirlo como "JS propio ≤ 60 KiB gzip sobre el piso del
   framework"? El número actual (150 KB total) es imposible con Next 16 (§4.2).
5. **R2:** ¿el hero puede tener una entrada animada al cargar, o se queda solo con movimiento
   de scroll? Hoy está prohibido.

### Referencias que necesito que me muestres

6. **2 o 3 sitios o plantillas que te gusten**, y **qué te gusta de cada uno** (la tipografía,
   cómo entra el contenido, cómo usan las fotos). Me sirven más que la URL sola. Si son de
   framer.com o de motion.dev, mejor: es el flujo que ya tiene `CLAUDE.md`.
7. **1 sitio que se vea como NO querés que se vea el tuyo.** Delimita tanto como las
   referencias.
8. **Tipografía:** ¿te gusta la Archivo Black actual, o querés salir de ella?

### Contenido pendiente

9. **La frase del hero** (pregunta E del plan). Una sola, que no se repita.
10. **La foto definitiva del hero y de OG.** ¿`vista_epica`, `pb2.04`, `podio_u23`, o hay
    originales en mejor resolución de los fotógrafos? ¿Es viable una sesión con 3–4 fotos
    horizontales de salto? Sin eso, B no se puede hacer.
11. **`foto_secuencial`: ¿sos vos?** Si sí, es la mejor ilustración de la técnica que tiene el
    sitio.
12. **Dominio final** (pregunta G). Bloquea canonical y OG absolutas.
13. **World Athletics:** la lista de marcas con fecha, competencia y puesto, para el gráfico y
    la tabla. Y el puesto en Lima 2023: ¿4.º, 5.º o empate?
14. **Tu texto de "Sobre mí"** (pregunta F): cómo se cruzan pista y código, en tu voz.
15. **Los 3 sistemas en construcción:** para v1 alcanza con un título y una línea tuya por
    cada uno. El detalle completo (problema → decisión → arquitectura → resultado) es para los
    case studies de v1.1.
