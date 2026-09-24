/**
 * Formas del contenido bilingüe. PORT-001a.
 *
 * Esto es lo que congela cómo se ven los datos para todo el proyecto — por
 * eso se paró en el GATE 1 con `profile.ts` como única muestra poblada.
 *
 * **GATE 1 aprobado el 2026-09-23.** De las cuatro preguntas de forma que se
 * llevaron a revisión, tres quedaron como estaban (`ProgressionMarker` con
 * `pos` y sin `date`, `Goal.text` plano sin el `<strong>`, y el cableado a los
 * componentes recién en PORT-001b) y una cambió: los clubes se parten en dos
 * campos, ver la nota en `Athletics["achievements"]`. Al poblar los otros
 * cinco archivos aparecieron cuatro agregados más, todos por texto o
 * estructura del sitio que no tenía dónde caer: `Profile.about` /
 * `Profile.contact`, `UI.navLabel`, `Project.statusLabel` y el tipo nuevo
 * `Projects` (la cabecera de la sección + la lista, porque el plan da la forma
 * de un proyecto suelto pero no la del archivo), cada uno explicado en su
 * lugar. Ningún campo que Juan aprobó cambió de nombre, de tipo ni de
 * opcionalidad.
 *
 * El esqueleto (`LOCALES`, `Locale`, `DEFAULT_LOCALE`, `L<T>`, `ProjectStatus`,
 * `Project`) es el que trae el plan en la arquitectura objetivo (§4) — lo dejo
 * tal cual está escrito ahí. Todo lo demás lo agrego yo, mirando lo que hoy
 * vive en cada componente de `components/*.tsx`, para que `athletics.ts`,
 * `timeline.ts`, `stack.ts`, `ui.ts` y `profile.ts` tengan dónde caer sin
 * inventar estructura nueva.
 */

// ---------------------------------------------------------------------------
// Primitivas bilingües
// ---------------------------------------------------------------------------

export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "es";

/** Texto que existe en los dos idiomas. */
export type L<T = string> = Record<Locale, T>;

// ---------------------------------------------------------------------------
// Proyectos (P) — forma dada por el plan, con un campo agregado (`statusLabel`)
// ---------------------------------------------------------------------------

export type ProjectStatus = "planned" | "building" | "mvp" | "active" | "completed";

export type Project = {
  slug: string; // NO se traduce: la URL es la misma en ambos idiomas
  title: string; // nombre propio, no se traduce
  tagline: L;
  status: ProjectStatus;
  /**
   * La etiqueta que hoy imprime la tarjeta (`.proyecto-status` en
   * `Proyectos.tsx`): "En consolidación", "En construcción", "Vivo".
   *
   * Va como campo aparte y no derivada de `status` porque **no se puede
   * derivar sin perder texto**: hoy dos proyectos distintos caen en el mismo
   * `status` ('active') y muestran palabras distintas ("En consolidación" y
   * "Vivo"). Un mapa `ProjectStatus -> L` los imprimiría iguales, y eso rompe
   * R1, que manda conservar el texto del sitio carácter por carácter. Cuando
   * PORT-010 reconcilie los proyectos con las respuestas de ❓1–4, puede
   * decidir si la etiqueta vuelve a salir del enum; hasta entonces el enum es
   * para lógica (filtrar, ordenar) y este campo es lo que se lee en pantalla.
   */
  statusLabel: L;
  featured: boolean;
  problem: L;
  solution: L;
  /**
   * Nombres de tecnologías tal como los escribe `content/stack.ts`. El plan
   * dice "ids de content/stack.ts", pero `StackGroup` no tiene ids: sus
   * `items` son los nombres. O sea que el id **es** el nombre escrito igual
   * ("Next.js", no "nextjs"). Lo dejo dicho acá porque es justo el tipo de
   * cosa que se hereda mal: si mañana alguien le agrega un `id` a
   * `StackGroup`, este campo hay que migrarlo a mano.
   */
  stack: string[];
  architecture?: L;
  links: { demo?: string; repo?: string; caseStudy: boolean };
  repoVisibility: "private" | "public"; // D7
  evolution: { date: string; note: L; status: ProjectStatus }[];
  cover?: { src: string; alt: L };
  confidential?: boolean;
};

/**
 * Lo que exporta `content/projects.ts`: la cabecera de la sección Proyectos
 * ("03 — Casos" / "Proyectos") más la lista. El plan da la forma de un
 * proyecto suelto pero no la del archivo, y la cabecera tiene que caer en
 * algún lado para que la mudanza sea completa. La tarjeta placeholder
 * ("+ siguiente proyecto") NO vive acá: no es un proyecto, es una etiqueta de
 * interfaz, y por eso está en `UI["projects"].nextPlaceholder`.
 */
export type Projects = SectionHeader & {
  items: Project[];
};

// ---------------------------------------------------------------------------
// Compartido entre archivos de contenido
// ---------------------------------------------------------------------------

/**
 * Cabecera repetida al principio de cada sección hoy: el "eyebrow" numerado
 * (ej. "02 — Herramientas"), el título y a veces un párrafo de intro. La
 * armo una vez acá porque athletics.ts va a tener varias secciones con esta
 * misma forma (Progresión, Momento Épico, Galería, Logros, Técnica, Metas) y
 * no tiene sentido repetir los tres campos en cada una.
 */
export type SectionHeader = {
  eyebrow: L;
  heading: L;
  intro?: L;
};

/** Una foto con su alt. Para galerías — no confundir con `Project.cover`,
 * que ya viene con esta misma forma dada por el plan y no la toco. */
export type Photo = {
  src: string;
  alt: L;
};

// ---------------------------------------------------------------------------
// profile.ts — quién es Juan, cómo se lo contacta
// ---------------------------------------------------------------------------

export type HeroStat = {
  value: number;
  decimals: number;
  label: L;
};

/**
 * Un link de contacto. `icon` queda como string libre a propósito: hoy son
 * emoji sueltos salvo GitHub, que es un SVG inline (`GitHubMark` en
 * `Contacto.tsx`, porque no hay glifo de GitHub como emoji). El componente
 * que consuma esto decide si `icon` es literal o una clave que resuelve a un
 * SVG — el dato no puede cargar JSX.
 */
export type SocialLink = {
  id: string;
  href: string;
  icon: string;
  label: L;
  value: string; // lo que se muestra (usuario, email, nombre) — no se traduce
  external: boolean;
};

export type Profile = {
  name: string; // nombre propio
  eyebrow: L; // "Salto Alto · Atletismo" — la bandera la dibuja el componente, no el dato
  heroSubtitle: L; // el <h2> del hero
  heroQuote: L; // la cita del hero — hoy repite heroSubtitle, ver nota en profile.ts
  heroImages: { src: string }[]; // capas del crossfade, decorativas (alt="")
  /**
   * Cabeceras de las dos secciones cuyo contenido cae en este archivo: Sobre
   * Mí ("01 — Quién soy") y Contacto ("11 — Hablemos"). Las agregué al poblar
   * los otros cinco archivos, cuando quedó claro que eran los dos únicos
   * textos visibles del sitio que no tenían dónde caer: todas las demás
   * secciones traen su `SectionHeader` dentro de `Athletics`, `Timeline`,
   * `Stack` o `Projects`, y sin estos dos campos PORT-001b tendría que dejar
   * cuatro strings escritos a mano dentro de los componentes — justo lo que
   * esta capa existe para evitar. No cambié ningún campo de los que ya
   * estaban; esto es puro agregado.
   */
  about: SectionHeader;
  contact: SectionHeader;
  photo: { src: string; alt: string };
  bio: L; // el párrafo largo de Sobre Mí
  stats: HeroStat[];
  contacts: SocialLink[];
  footer: { year: number; roleTag: L }; // el nombre sale de `name`, la bandera la dibuja el componente
};

// ---------------------------------------------------------------------------
// athletics.ts — todo lo que hoy cuelga del grupo "Deportivo" del nav
// ---------------------------------------------------------------------------
// Nav.tsx agrupa Progresión + Momento Épico + Galería + Logros + Formación +
// Técnica + Metas bajo un solo link, "Deportivo". De esas siete, Formación es
// la única que se siente distinta (es historial académico, no deportivo) y
// por eso es la que se va a timeline.ts. Las otras seis quedan acá.

/**
 * Esto describe La Barra de hoy (`Progresion.tsx`) — la línea con marcadores
 * a lo largo de un track, `pos` 0–100. D9 (2026-09-23) la saca del sitio: la
 * progresión pasa a ser el gráfico SVG de PORT-013b, alimentado con marcas
 * fechadas del perfil de World Athletics de Juan (todavía sin confirmar). Esa
 * forma NO es esta — `pos` no le sirve a un gráfico de fecha vs. marca, y no
 * le agrego un campo `date` a ciegas porque hoy no hay de dónde poblarlo. La
 * define PORT-013a cuando lleguen los datos reales. Este tipo se queda nada
 * más para que la mudanza de PORT-001a tenga dónde caer el texto que hoy
 * sigue en el sitio (R1) — no lo hereden como la forma del gráfico.
 */
export type ProgressionMarker = {
  pos: number; // 0–100, posición sobre la barra
  value: string; // "2.06 m" — la unidad es universal, no se traduce
  label: L;
  current?: boolean;
};

export type Achievement = {
  icon: string;
  title: L;
  note?: L; // el "(2 veces)" que hoy va en un <small> aparte
};

export type TechniqueCard = {
  num: string;
  title: L;
  text: L;
};

/**
 * `text` aplana el `<strong>` que hoy resalta la marca dentro de la frase
 * (`Metas.tsx`: "romper la barrera de los **2.10 m**"...). No se pierde
 * texto — sigue estando la marca completa — pero sí se pierde el énfasis
 * visual sobre ella. Queda como trade-off registrado, no como pérdida
 * silenciosa: el dato no puede cargar JSX, así que resaltar la marca de
 * nuevo es decisión de quien consuma esto más adelante.
 */
export type Goal = {
  tag: L;
  title: L;
  text: L;
  primary?: boolean;
};

export type Athletics = {
  progression: SectionHeader & { markers: ProgressionMarker[] };
  epicMoment: SectionHeader & { photos: Photo[] };
  gallery: SectionHeader & {
    // La galería principal muestra un ícono + label como fallback si la foto
    // no carga (`GaleriaItem` en Galeria.tsx); Momento Épico no lo necesita
    // (si falla, el ítem se oculta entero). Por eso van opcionales acá y no
    // en `Photo`, que se reusa para las dos.
    photos: (Photo & { fallbackIcon: string; fallbackLabel: L })[];
  };
  achievements: SectionHeader & {
    items: Achievement[];
    // Sin entrenador a propósito: D10 (2026-09-23) dice que no se publica, y
    // se quita el que hoy aparece en el sitio (José Arturo Posada, en
    // `Logros.tsx`). No dejo el campo listo para poblar en contra de una
    // decisión ya cerrada.
    clubsLabel: L;
    // Los clubes propiamente dichos, los dos que el sitio muestra hoy:
    // Todomed y The Jumpers Club. Sigue siendo `string[]` y no una tupla de
    // dos: no quiero endurecer esa forma hoy, alcanza con la nota.
    clubs: string[]; // nombres propios
    /**
     * Liga Vallecaucana de Atletismo y Federación Colombiana de Atletismo.
     *
     * **Van en un campo aparte, no dentro de `clubs`, y esto no se vuelve a
     * fusionar.** D10 (2026-09-23) pedía "publicar esos dos"; al revisar la
     * forma en el GATE 1 Juan cerró que **no reemplazan a los clubes: se
     * suman**, porque una liga departamental y una federación nacional no son
     * clubes y meterlas bajo la etiqueta "Clubes" sería inexacto. Las cuatro
     * entidades se publican, en dos grupos con su propia etiqueta.
     *
     * Quedan poblados acá desde PORT-001a, pero el sitio todavía no los
     * muestra: la presentación de estos dos entra con el resto de D10 en
     * PORT-013a (#14 del plan).
     */
    governingBodiesLabel: L;
    governingBodies: string[]; // nombres propios
  };
  technique: SectionHeader & { cards: TechniqueCard[] };
  goals: SectionHeader & {
    sportsLabel: L; // "🏆 Deportivos"
    sports: Goal[];
    techLabel: L; // "💻 Tecnológicos"
    tech: Goal[];
  };
};

// ---------------------------------------------------------------------------
// timeline.ts — Formación Académica
// ---------------------------------------------------------------------------

export type TimelineEntry = {
  year: string;
  title: L;
  place: string; // nombre de institución, no se traduce
};

export type Timeline = SectionHeader & {
  entries: TimelineEntry[];
  certsHeading: L;
  certs: L[];
};

// ---------------------------------------------------------------------------
// stack.ts — tecnologías
// ---------------------------------------------------------------------------

export type StackGroup = {
  title: L;
  items: string[]; // nombres de tecnologías — no se traducen
};

export type Stack = SectionHeader & {
  groups: StackGroup[];
};

// ---------------------------------------------------------------------------
// ui.ts — etiquetas de interfaz reusadas en más de un lugar
// ---------------------------------------------------------------------------
// Ojo: acá van solo las etiquetas que se repiten (regla DRY, #3 de CLAUDE.md)
// o que son de navegación global. Las que hoy aparecen una sola vez en una
// sección (como "Clubes" en Logros) se quedan junto a su contenido en
// `athletics.ts` — centralizarlas acá sería la indirección sin el beneficio.

export type NavLink = {
  id: string; // clave estable, no se traduce — hoy es el primer id de sectionIds
  label: L;
  sectionIds: string[]; // ids del DOM que agrupa este link
};

export type UI = {
  skipLink: L;
  backToTopLabel: L; // aria-label del botón volver arriba
  navLabel: L; // aria-label del <nav> ("Navegación principal")
  nav: NavLink[];
  projects: {
    problemLabel: L; // "Problema" — se repite por cada tarjeta de proyecto
    solutionLabel: L; // "Solución" — ídem
    nextPlaceholder: L; // "+ siguiente proyecto"
  };
};
