/**
 * El lado atlético: marcas, trayectoria oficial, logros, galería y patrocinio.
 * Textos del mockup v2.
 *
 * Los resultados son los oficiales de mi perfil de World Athletics (ID
 * 15111188), del más nuevo al más viejo. Las marcas van en metros como número;
 * el "2,05 m" / "2.05 m" lo arma lib/format.ts según el idioma.
 */

import type { Athletics, Result } from "./types";

export const WORLD_ATHLETICS_ID = "15111188";
export const WORLD_ATHLETICS_URL = `https://worldathletics.org/athletes/colombia/juan-jose-basquez-${WORLD_ATHLETICS_ID}`;

const RESULTS: Result[] = [
  // 2026
  {
    date: "2026-07-05",
    mark: 2.05,
    place: 1,
    competition: { es: "Campeonato Nacional U20", en: "Colombian U20 Championships" },
    venue: "Pedro Grajales, Cali",
  },
  {
    date: "2026-06-21",
    mark: 2.04,
    place: 3,
    competition: { es: "Campeonato Iberoamericano U20", en: "Ibero-American U20 Championships" },
    venue: "VIDENA, Lima (PER)",
  },
  {
    date: "2026-05-09",
    mark: 1.98,
    place: 1,
    competition: { es: "Campeonato Nacional U23", en: "Colombian U23 Championships" },
    venue: "U. D. Centenario, Armenia",
  },
  {
    date: "2026-04-26",
    mark: 2.04,
    place: 4,
    competition: {
      es: "Nacional Interclubes y Municipios",
      en: "National Interclub & Municipal Championships",
    },
    venue: "El Salitre, Bogotá",
  },
  // 2025
  {
    date: "2025-09-28",
    mark: 1.9,
    place: 5,
    competition: { es: "Campeonato Nacional U20", en: "Colombian U20 Championships" },
    venue: "Rey Pelé, Villavicencio",
  },
  {
    date: "2025-08-03",
    mark: 2.04,
    place: 3,
    competition: { es: "Campeonato Nacional de Mayores", en: "Colombian Senior Championships" },
    venue: "U. D. Centenario, Armenia",
  },
  {
    date: "2025-04-05",
    mark: 1.93,
    place: 2,
    competition: {
      es: "Nacional de Velocidad y Saltos",
      en: "National Sprints & Jumps Championships",
    },
    venue: "El Salitre, Bogotá",
  },
  {
    date: "2025-03-15",
    mark: 2.01,
    place: 5,
    competition: {
      es: "Nacional de Clubes y Municipios Mayores",
      en: "National Senior Club & Municipal Championships",
    },
    venue: "El Salitre, Bogotá",
  },
  {
    date: "2025-03-08",
    mark: 1.92,
    place: 2,
    competition: {
      es: "Nacional de Pruebas Combinadas y Saltos (U20)",
      en: "National Combined Events & Jumps (U20)",
    },
    venue: "Parque Deportivo, Ibagué",
  },
  // 2024
  {
    date: "2024-11-15",
    mark: 2.0,
    place: 2,
    competition: { es: "Juegos Nacionales Juveniles", en: "National Youth Games" },
    venue: "U. D. Centenario, Armenia",
  },
  {
    date: "2024-09-21",
    mark: 1.89,
    place: 6,
    competition: { es: "Campeonato Nacional U23", en: "Colombian U23 Championships" },
    venue: "La Flora, Bucaramanga",
  },
  {
    date: "2024-06-29",
    mark: 1.93,
    place: 4,
    competition: { es: "Campeonato Nacional de Mayores", en: "Colombian Senior Championships" },
    venue: "Pedro Grajales, Cali",
  },
  {
    date: "2024-06-02",
    mark: 1.9,
    place: 4,
    competition: { es: "Campeonato Nacional U20", en: "Colombian U20 Championships" },
    venue: "U. D. Centenario, Armenia",
  },
  {
    date: "2024-03-10",
    mark: 1.96,
    place: 1,
    competition: {
      es: "Nacional de Pruebas Combinadas y Saltos (U18)",
      en: "National Combined Events & Jumps (U18)",
    },
    venue: "Parque Deportivo, Ibagué",
  },
  {
    date: "2024-02-24",
    mark: 1.89,
    place: 2,
    competition: {
      es: "Nacional de Municipios y Clubes U20/U18",
      en: "National Municipal & Club Championships U20/U18",
    },
    venue: "El Salitre, Bogotá",
  },
  // 2023
  {
    date: "2023-10-07",
    mark: 1.89,
    place: 3,
    competition: { es: "Nacional de Clubes", en: "Colombian Club Championships" },
    venue: "Francisco Rivera Escobar, Palmira",
  },
  {
    date: "2023-09-15",
    mark: 1.93,
    place: 5,
    competition: { es: "Campeonato Iberoamericano U18", en: "Ibero-American U18 Championships" },
    venue: "VIDENA, Lima (PER)",
  },
  {
    date: "2023-07-16",
    mark: 1.93,
    place: 1,
    competition: { es: "Campeonato Nacional U18", en: "Colombian U18 Championships" },
    venue: "Bogotá",
  },
];

/** La marca personal oficial sale de los resultados, no se escribe aparte. */
export const OFFICIAL_PB = Math.max(...RESULTS.map((r) => r.mark));

export const ATHLETICS: Athletics = {
  eyebrow: { es: "Atleta", en: "Athlete" },
  heading: { es: "Salto alto", en: "High jump" },
  intro: {
    es: "Represento a la Selección Valle y a la Selección Colombia. Campeón nacional U20 y U23, y bronce en el Iberoamericano U20 de Lima 2026.",
    en: "I represent the Valle del Cauca and Colombian national teams. National U20 and U23 champion, and bronze at the 2026 Ibero-American U20 Championships in Lima.",
  },
  image: {
    src: "/images/salto2.jpeg",
    alt: {
      es: "Juan José pasando la barra en un salto de competencia",
      en: "Juan José clearing the bar during a competition jump",
    },
  },

  stats: [
    {
      mark: OFFICIAL_PB,
      label: { es: "Marca personal", en: "Personal best" },
      tag: { es: "Oficial · World Athletics", en: "Official · World Athletics" },
      official: true,
    },
    {
      mark: 2.06,
      label: { es: "Mejor salto", en: "Best jump" },
      tag: { es: "Extraoficial", en: "Unofficial" },
      official: false,
    },
    {
      mark: 2.1,
      label: { es: "Próxima meta", en: "Next goal" },
      tag: { es: "Temporada 2027", en: "2027 season" },
      official: false,
    },
  ],

  worldAthletics: {
    label: {
      es: "Ver mi perfil oficial en World Athletics",
      en: "See my official World Athletics profile",
    },
    url: WORLD_ATHLETICS_URL,
    id: WORLD_ATHLETICS_ID,
  },

  trackRecord: {
    eyebrow: { es: "Resultados oficiales", en: "Official results" },
    heading: { es: "Trayectoria", en: "Track record" },
    source: {
      es: "Fuente: World Athletics. Actualizado a septiembre de 2026.",
      en: "Source: World Athletics. Updated September 2026.",
    },
    filters: {
      all: { es: "Todos", en: "All" },
      best: { es: "Mejor por temporada", en: "Season bests" },
    },
    columns: {
      date: { es: "Fecha", en: "Date" },
      competition: { es: "Competencia", en: "Competition" },
      place: { es: "Puesto", en: "Place" },
      mark: { es: "Marca", en: "Mark" },
    },
    results: RESULTS,
  },

  achievementsLabel: { es: "Logros", en: "Achievements" },
  achievements: [
    { title: { es: "Campeón Nacional U20", en: "Colombian U20 Champion" }, year: 2026, mark: 2.05 },
    { title: { es: "Campeón Nacional U23", en: "Colombian U23 Champion" }, year: 2026 },
    {
      title: { es: "Bronce Iberoamericano U20, Lima", en: "Bronze, Ibero-American U20, Lima" },
      year: 2026,
      mark: 2.04,
    },
    {
      title: {
        es: "Bronce Campeonato Nacional de Mayores",
        en: "Bronze, Colombian Senior Championships",
      },
      year: 2025,
      mark: 2.04,
    },
    {
      title: {
        es: "Subcampeón Juegos Nacionales Juveniles",
        en: "Runner-up, National Youth Games",
      },
      year: 2024,
    },
    { title: { es: "Campeón Nacional U18", en: "Colombian U18 Champion" }, year: 2023 },
  ],

  affiliationsLabel: { es: "Selecciones y clubes", en: "Teams and clubs" },
  affiliations: [
    {
      name: { es: "Selección Colombia", en: "Colombian national team" },
      note: { es: "Iberoamericanos U18 y U20", en: "Ibero-American U18 & U20" },
    },
    {
      name: { es: "Selección Valle del Cauca", en: "Valle del Cauca team" },
      note: { es: "Liga Vallecaucana", en: "Liga Vallecaucana" },
    },
    { name: { es: "Todomed", en: "Todomed" }, note: { es: "Club", en: "Club" } },
    { name: { es: "The Jumpers Club", en: "The Jumpers Club" }, note: { es: "Club", en: "Club" } },
  ],

  galleryLabel: { es: "Momentos", en: "Moments" },
  gallery: [
    {
      src: "/images/foto_secuencial.jpeg",
      alt: {
        es: "Secuencia de un salto completo, de la carrera a la barra",
        en: "Sequence of a full jump, from run-up to bar",
      },
      caption: { es: "Un salto, cuadro por cuadro", en: "One jump, frame by frame" },
    },
    {
      src: "/images/pb2.04.jpeg",
      alt: { es: "Junto al tablero que marca 2,04 m", en: "Next to the board showing 2.04 m" },
      caption: { es: "2,04 m en el tablero", en: "2.04 m on the board" },
    },
    {
      src: "/images/podio_u23.jpeg",
      alt: { es: "Podio en categoría U23", en: "Podium in the U23 category" },
      caption: { es: "En el podio, categoría U23", en: "On the podium, U23" },
    },
    {
      src: "/images/podio-mayores.jpeg",
      alt: { es: "Podio en categoría Mayores", en: "Podium in the Senior category" },
      caption: { es: "Podio con los mayores", en: "Podium among seniors" },
    },
    {
      src: "/images/foto_saltoperu1.jpeg",
      // El mockup decía "bajo techo", pero es un estadio abierto en Lima.
      alt: {
        es: "Pasando la barra en una competencia en Lima",
        en: "Clearing the bar at a competition in Lima",
      },
      caption: { es: "Pasando la barra", en: "Clearing the bar" },
    },
    {
      src: "/images/vista_epica.jpeg",
      alt: {
        es: "Aproximación al salto, vista desde la barra",
        en: "Approach to the jump, seen from the bar",
      },
      caption: { es: "Concentración antes de la carrera", en: "Focus before the run-up" },
    },
    {
      src: "/images/u18.jpeg",
      alt: { es: "Carrera en competencia U18", en: "Running in a U18 competition" },
      caption: { es: "La carrera de aproximación", en: "The run-up" },
    },
    {
      src: "/images/foto_blanconegro.jpeg",
      alt: {
        es: "Entrenamiento nocturno de vallas en blanco y negro",
        en: "Night hurdle training in black and white",
      },
      caption: { es: "Vallas, entrenamiento nocturno", en: "Hurdles, night training" },
    },
    {
      src: "/images/epica_trasera.jpeg",
      alt: {
        es: "Celebración de espaldas con los brazos arriba",
        en: "Celebrating with arms raised, back to the camera",
      },
      caption: { es: "Después del salto", en: "After the jump" },
    },
  ],
  instagramMore: {
    es: "Más momentos en Instagram · @juanvasquezhj",
    en: "More moments on Instagram · @juanvasquezhj",
  },

  sponsorship: {
    eyebrow: { es: "Patrocinio", en: "Sponsorship" },
    heading: { es: "Mi camino hacia las grandes ligas", en: "My road to the big leagues" },
    intro: {
      es: "Busco marcas que quieran acompañarme temporada a temporada: más competencias internacionales, mejor preparación y la meta de llegar a la élite mundial.",
      en: "I am looking for brands that want to back me season after season: more international competitions, better preparation and the goal of reaching the world elite.",
    },
    points: [
      {
        es: "Atleta de Selección Colombia con resultados oficiales verificables en World Athletics.",
        en: "Colombian national team athlete with official results verifiable on World Athletics.",
      },
      {
        es: "Contenido propio de entrenamiento y competencia en Instagram (@juanvasquezhj).",
        en: "Original training and competition content on Instagram (@juanvasquezhj).",
      },
      {
        es: "Perfil doble, deporte y tecnología: una historia distinta para contar con tu marca.",
        en: "A dual profile, sport and tech: a different story to tell with your brand.",
      },
    ],
    cta: { es: "Súmate a mi camino", en: "Join my journey" },
    mailSubject: { es: "Patrocinio deportivo", en: "Sports sponsorship" },
    instagram: {
      bio: { es: "Salto alto · Selección Colombia", en: "High jump · Colombia national team" },
      follow: { es: "Seguir", en: "Follow" },
      ariaLabel: { es: "Ver mi perfil de Instagram", en: "View my Instagram profile" },
      // Mezcla fotos que no están en la galería (entrenamiento, grupo) para que
      // la vista previa no repita lo de arriba.
      grid: [
        "/images/salto2.jpeg",
        "/images/foto_nike.jpeg",
        "/images/epica_trasera.jpeg",
        "/images/podio_u23.jpeg",
        "/images/posando1.jpeg",
        "/images/foto_blanconegro.jpeg",
        "/images/vista_epica.jpeg",
        "/images/fotogrupal1.jpeg",
        "/images/foto_saltoperu1.jpeg",
      ],
    },
  },
};
