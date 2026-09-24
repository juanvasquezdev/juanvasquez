/**
 * Todo lo deportivo: la progresión, el momento épico, la galería, los logros,
 * la técnica y las metas. Son las seis secciones que el nav agrupa bajo
 * "Deportivo" menos Formación, que por ser historial académico se fue a
 * `content/timeline.ts`.
 *
 * Mudanza literal (R1) de `Progresion.tsx`, `MomentoEpico.tsx`, `Galeria.tsx`,
 * `Logros.tsx`, `Tecnica.tsx` y `Metas.tsx`: cada texto está copiado carácter
 * por carácter del sitio de hoy, incluidos los emoji que hacen de ícono y los
 * números del eyebrow. Donde el componente partía una frase en varias líneas
 * de JSX, acá queda la frase como se lee en pantalla (JSX colapsa el salto de
 * línea y la sangría en un solo espacio).
 *
 * El inglés es traducción mía y la parte en primera persona va listada en el
 * reporte (R5). Las unidades no se traducen: "2.06 m" es "2.06 m" en los dos
 * idiomas.
 *
 * Nada de esto lo consume todavía ningún componente — el cableado es PORT-001b.
 */

import type { Athletics } from "./types";

export const ATHLETICS: Athletics = {
  // -------------------------------------------------------------------------
  // Progresión — "La Barra"
  // -------------------------------------------------------------------------
  // D9 saca esta sección del sitio y la reemplaza por el gráfico SVG de
  // PORT-013b. Lo que sigue es el texto que hoy está en pantalla, con `pos`
  // como posición sobre la barra (0–100) — NO es la forma del gráfico, ver la
  // nota larga en `ProgressionMarker` en `types.ts`.
  //
  // ❓ PENDIENTE JUAN: el historial de marcas fechadas. D10 dice que sale del
  // perfil de World Athletics, pero todavía falta confirmar cuál es el perfil
  // y qué hacer con el hueco entre lo que ese perfil publica y el PB de
  // 2.06 m que muestra el sitio. Sin esas fechas, PORT-013a no puede definir
  // la forma del gráfico y estos cuatro marcadores son lo único que hay.
  progression: {
    eyebrow: { es: "04 — El objetivo", en: "04 — The goal" },
    heading: { es: "La Barra", en: "The Bar" },
    intro: {
      es: "Cada centímetro es una temporada de trabajo. Esta es mi hoja de ruta hacia la élite mundial.",
      en: "Every centimeter is a season of work. This is my road map to the world elite.",
    },
    markers: [
      {
        pos: 0,
        value: "2.06 m",
        label: { es: "PB actual", en: "Current PB" },
        current: true,
      },
      {
        pos: 30,
        value: "2.10 m",
        label: {
          es: "Próxima meta · Nacional Mayores",
          en: "Next goal · National Senior Championship",
        },
      },
      {
        pos: 78,
        value: "2.19 m",
        label: { es: "Récord Nacional U20", en: "U20 National Record" },
      },
      {
        pos: 100,
        value: "2.20 – 2.25 m",
        label: {
          es: "Élite mundial · Road to LA 2028",
          en: "World elite · Road to LA 2028",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Momento épico — el tríptico en blanco y negro
  // -------------------------------------------------------------------------
  epicMoment: {
    eyebrow: { es: "05 — Momento épico", en: "05 — Epic moment" },
    heading: {
      es: "El instante antes de la barra",
      en: "The instant before the bar",
    },
    intro: {
      es: "No siempre gana la marca — a veces gana el segundo exacto en que el cuerpo decide saltar.",
      en: "The mark does not always win — sometimes what wins is the exact second the body decides to jump.",
    },
    photos: [
      {
        src: "/images/vista_epica.jpeg",
        alt: {
          es: "Aproximación al salto, vista desde la barra",
          en: "Approach to the jump, seen from the bar",
        },
      },
      {
        src: "/images/foto_blanconegro.jpeg",
        alt: {
          es: "Salto de vallas en entrenamiento nocturno",
          en: "Hurdle jump during night training",
        },
      },
      {
        src: "/images/epica_trasera2.jpeg",
        alt: {
          es: "Celebración de espaldas frente al horizonte",
          en: "Celebrating with my back turned, facing the horizon",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Galería
  // -------------------------------------------------------------------------
  gallery: {
    eyebrow: { es: "06 — Momentos", en: "06 — Moments" },
    heading: { es: "Galería", en: "Gallery" },
    photos: [
      {
        src: "/images/pb2.04.jpeg",
        alt: { es: "Salto de 2.04m en competencia", en: "2.04m jump in competition" },
        fallbackIcon: "📸",
        fallbackLabel: { es: "Salto 2.04 m", en: "2.04 m jump" },
      },
      {
        src: "/images/podio_u23.jpeg",
        alt: { es: "Podio en categoría U23", en: "Podium in the U23 category" },
        fallbackIcon: "🥇",
        fallbackLabel: { es: "Podio U23", en: "U23 podium" },
      },
      {
        src: "/images/podio-mayores.jpeg",
        alt: { es: "Podio categoría Mayores", en: "Podium in the Senior category" },
        fallbackIcon: "🏅",
        fallbackLabel: { es: "Podio Mayores", en: "Senior podium" },
      },
      {
        src: "/images/u18.jpeg",
        alt: { es: "Competencia categoría U18", en: "U18 category competition" },
        fallbackIcon: "🏃",
        fallbackLabel: { es: "Competencia U18", en: "U18 competition" },
      },
      {
        src: "/images/salto2.jpeg",
        alt: { es: "Salto de altura en competencia", en: "High jump in competition" },
        fallbackIcon: "🤸",
        fallbackLabel: { es: "En el aire", en: "Mid-air" },
      },
      {
        // ❓ PENDIENTE JUAN (❓7): de qué competencia es esta foto, de qué año y
        // con qué resultado. El sitio hoy la rotula "Legado Lima 2019" y la
        // describe como "Competencia internacional en Perú"; lo copio literal
        // porque es el texto que está en pantalla (R1), pero ninguno de los dos
        // datos está confirmado y el alt tampoco dice qué se ve. Si el rótulo
        // está mal, se corrige acá y en el alt.
        src: "/images/foto_saltoperu1.jpeg",
        alt: {
          es: "Competencia internacional en Perú",
          en: "International competition in Peru",
        },
        fallbackIcon: "🌎",
        fallbackLabel: { es: "Legado Lima 2019", en: "Lima 2019 Legacy" },
      },
      {
        src: "/images/epica_trasera.jpeg",
        alt: { es: "Celebración tras una marca", en: "Celebrating after a mark" },
        fallbackIcon: "🙌",
        fallbackLabel: { es: "Celebración", en: "Celebration" },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Logros destacados
  // -------------------------------------------------------------------------
  // El sitio de hoy muestra además "👤 Entrenador: José Arturo Posada" y ese
  // texto NO se muda: D10 cerró que el entrenador no se publica. Es la única
  // excepción deliberada a R1 en este archivo, y la dejo escrita para que no se
  // lea como un olvido. Quitarlo de la pantalla es de PORT-013a, no de acá.
  achievements: {
    eyebrow: { es: "07 — Trayectoria", en: "07 — Track record" },
    heading: { es: "Logros Destacados", en: "Notable Achievements" },
    items: [
      {
        icon: "🥇",
        title: { es: "Campeón Nacional U18", en: "U18 National Champion" },
        note: { es: "(2 veces)", en: "(2 times)" },
      },
      {
        icon: "🥈",
        title: {
          es: "Subcampeón Juegos Nacionales Juveniles",
          en: "Runner-up at the National Youth Games",
        },
      },
      {
        icon: "🥈",
        title: {
          es: "Subcampeón Interclubes U20",
          en: "Runner-up at the U20 Interclub Championship",
        },
      },
      {
        icon: "📈",
        title: { es: "Marca Personal: 2.06 m", en: "Personal Best: 2.06 m" },
      },
    ],
    clubsLabel: { es: "🏃 Clubes:", en: "🏃 Clubs:" },
    clubs: ["Todomed", "The Jumpers Club"],
    // ❓ PENDIENTE JUAN: esta etiqueta la escribí yo — no es copy del sitio.
    // Hoy estas dos entidades no se muestran en ninguna parte (aparecen en
    // PORT-013a), así que no hay texto que mudar y lo de abajo es una
    // propuesta mía, no algo decidido: aprobala o cambiala antes de que
    // PORT-013a la imprima. La decisión concreta es el emoji. Su hermana
    // `clubsLabel` dice "🏃 Clubes:" y esta va sin ícono a propósito, porque el
    // precedente de la bandera que en Windows se leía como "co" (N4) me dejó
    // sin ganas de sumar iconografía nueva en emoji — si la querés simétrica
    // con los clubes, decime qué ícono va.
    governingBodiesLabel: { es: "Liga y federación:", en: "League and federation:" },
    governingBodies: ["Liga Vallecaucana de Atletismo", "Federación Colombiana de Atletismo"],
  },

  // -------------------------------------------------------------------------
  // Técnica & Ciencia del Salto
  // -------------------------------------------------------------------------
  technique: {
    eyebrow: { es: "09 — Mentalidad", en: "09 — Mindset" },
    // En el componente está escrito "Técnica &amp; Ciencia del Salto", que en
    // pantalla se lee con un "&" normal. Acá va el carácter, no la entidad: un
    // dato no se escapa para HTML, eso lo hace React cuando lo imprime.
    heading: {
      es: "Técnica & Ciencia del Salto",
      en: "Technique & Science of the Jump",
    },
    intro: {
      es: "Para mí el salto alto no es solo talento — es física aplicada. Cada ajuste de carrera, cada grado de despegue, cada milisegundo de tensión en el arco dorsal (Fosbury Flop) se puede medir, entender y mejorar.",
      en: "For me the high jump is not just talent — it is applied physics. Every adjustment to the run-up, every degree of takeoff, every millisecond of tension in the back arch (Fosbury Flop) can be measured, understood, and improved.",
    },
    cards: [
      {
        num: "01",
        title: { es: "Ángulo de despegue", en: "Takeoff angle" },
        text: {
          es: "Trabajo el ángulo óptimo de aproximación (curva de 5-6 zancadas) para maximizar la conversión de velocidad horizontal en impulso vertical, sin perder velocidad de carrera.",
          en: "I work on the optimal approach angle (a 5-6 stride curve) to maximize the conversion of horizontal speed into vertical drive, without losing run-up speed.",
        },
      },
      {
        num: "02",
        title: { es: "Centro de masa", en: "Center of mass" },
        text: {
          es: 'El objetivo técnico del Fosbury Flop es que el centro de masa pase por debajo de la barra mientras el cuerpo pasa por encima — cuanto mejor el arco dorsal, menos altura "desperdiciada".',
          en: 'The technical goal of the Fosbury Flop is for the center of mass to pass under the bar while the body passes over it — the better the back arch, the less height "wasted".',
        },
      },
      {
        num: "03",
        title: { es: "Fuerza reactiva", en: "Reactive strength" },
        text: {
          es: "El despegue depende de la fuerza reactiva de la pierna de batida en apenas ~0.15 segundos de contacto — de ahí el trabajo pliométrico y de potencia en cada bloque de entrenamiento.",
          en: "The takeoff depends on the reactive strength of the jumping leg in barely ~0.15 seconds of contact — hence the plyometric and power work in every training block.",
        },
      },
      {
        num: "04",
        title: { es: "Mentalidad de competencia", en: "Competition mindset" },
        text: {
          es: "Cada intento es un experimento controlado: ajusto una sola variable a la vez (marca de carrera, timing de brazos, ritmo de los últimos pasos) y evalúo el resultado con datos, no solo sensaciones.",
          en: "Every attempt is a controlled experiment: I adjust a single variable at a time (run-up mark, arm timing, rhythm of the last steps) and judge the result with data, not just feel.",
        },
      },
    ],
  },

  // -------------------------------------------------------------------------
  // Metas — "Próximos Proyectos"
  // -------------------------------------------------------------------------
  // Recordatorio del trade-off que ya está escrito en `Goal` (`types.ts`): el
  // `<strong>` que hoy resalta la marca dentro de la frase se pierde. El texto
  // completo sigue estando; el énfasis visual sobre el número, no.
  goals: {
    eyebrow: { es: "10 — Lo que viene", en: "10 — What comes next" },
    heading: { es: "Próximos Proyectos", en: "Next Projects" },

    sportsLabel: { es: "🏆 Deportivos", en: "🏆 Sports" },
    sports: [
      {
        tag: { es: "Próxima competencia", en: "Next competition" },
        title: {
          es: "Campeonato Nacional Mayores",
          en: "National Senior Championship",
        },
        text: {
          es: "Meta: romper la barrera de los 2.10 m — mi próximo salto de nivel sobre mi PB actual de 2.06 m.",
          en: "Goal: break the 2.10 m barrier — my next step up from my current PB of 2.06 m.",
        },
        primary: true,
      },
      {
        tag: { es: "Meta mayor", en: "Bigger goal" },
        title: { es: "Récord Nacional U20", en: "U20 National Record" },
        text: {
          es: "Superar los 2.19 m que hoy marcan el récord nacional en categoría U20.",
          en: "Clear the 2.19 m that currently stand as the national record in the U20 category.",
        },
      },
      {
        tag: { es: "Meta máxima", en: "Ultimate goal" },
        title: {
          es: "Élite Mundial · Road to LA 2028",
          en: "World Elite · Road to LA 2028",
        },
        text: {
          es: "Alcanzar entre 2.20 m y 2.25 m de altura y competir al nivel de la élite mundial, con la mira puesta en Los Ángeles 2028.",
          en: "Reach between 2.20 m and 2.25 m and compete at world-elite level, with my sights on Los Angeles 2028.",
        },
      },
    ],

    techLabel: { es: "💻 Tecnológicos", en: "💻 Technology" },
    tech: [
      {
        tag: { es: "En desarrollo", en: "In development" },
        title: {
          es: "Plataforma de registro y monitoreo",
          en: "Registration and monitoring platform",
        },
        text: {
          es: "Una web + app para registrar competencias, marcas y perfiles de atletas, y hacer seguimiento del rendimiento a lo largo del tiempo.",
          en: "A web app to register competitions, marks, and athlete profiles, and to track performance over time.",
        },
      },
      {
        tag: { es: "En desarrollo", en: "In development" },
        title: {
          es: "APIs y sistemas de optimización",
          en: "APIs and optimization systems",
        },
        text: {
          es: "Construcción de APIs y sistemas propios que mejoren y optimicen procesos del día a día, aplicando lo aprendido en programación de software.",
          en: "Building my own APIs and systems that improve and optimize day-to-day processes, applying what I have learned in software programming.",
        },
      },
    ],
  },
};
