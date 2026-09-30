/**
 * Lo que ven Google y las redes cuando alguien comparte el link: título,
 * descripción, la imagen de la tarjeta y los datos del JSON-LD. El layout lo
 * arma con esto; acá no hay ningún texto que se pinte en la página.
 */

import { PROFILE } from "./profile";
import type { Seo } from "./types";

// La tarjeta que piden Open Graph y Twitter para summary_large_image. Las dos
// imágenes las genera scripts/og-image.mjs con este tamaño.
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const SEO: Seo = {
  title: {
    es: "Juan José Vásquez · Desarrollador Full Stack y atleta de salto alto",
    en: "Juan José Vásquez · Full Stack Developer & High Jump Athlete",
  },
  description: {
    es: "Portafolio de Juan José Vásquez, desarrollador full stack en formación y atleta de salto alto de la Selección Colombia. Proyectos, stack y resultados oficiales.",
    en: "Portfolio of Juan José Vásquez, a full stack developer in training and high jumper for the Colombian national team. Projects, tech stack and official results.",
  },
  ogLocale: { es: "es_CO", en: "en_US" },
  ogImage: {
    src: { es: "/og/es.jpg?v=2", en: "/og/en.jpg?v=2" },
    alt: {
      es: "Juan José Vásquez, desarrollador full stack en formación y atleta de alto rendimiento",
      en: "Juan José Vásquez, full stack developer in training and high-performance athlete",
    },
  },
  person: {
    name: "Juan José Vásquez",
    // "Basquez" es como me tiene escrito World Athletics: lo dejo para que el
    // perfil de allá y este se reconozcan como la misma persona.
    alternateNames: [PROFILE.name, "Juan Jose Basquez"],
    jobTitle: {
      es: "Desarrollador Full Stack y atleta de salto alto",
      en: "Full Stack Developer and high jump athlete",
    },
    nationality: "Colombia",
    address: { locality: "Cali", region: "Valle del Cauca", country: "CO" },
  },
};
