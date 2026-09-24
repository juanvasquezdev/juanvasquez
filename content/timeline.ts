/**
 * Formación académica: la línea de tiempo y las certificaciones.
 *
 * Mudanza literal de `components/Formacion.tsx` (R1). Es la única de las siete
 * secciones que el nav agrupa bajo "Deportivo" que no es deportiva —
 * es historial académico — y por eso vive en su propio archivo y no en
 * `athletics.ts`.
 *
 * Los nombres de las instituciones no se traducen (`place` es `string`, no
 * `L`): "Institución Educativa de Rozo" se llama así en cualquier idioma. Los
 * títulos y los certificados sí, porque son descripciones de lo que son, y van
 * listados en el reporte para que Juan los revise: la traducción de un título
 * técnico colombiano no tiene equivalente oficial en inglés y es una decisión
 * suya, no mía.
 */

import type { Timeline } from "./types";

export const TIMELINE: Timeline = {
  eyebrow: { es: "08 — Formación", en: "08 — Education" },
  heading: { es: "Formación Académica", en: "Academic Background" },

  entries: [
    {
      year: "2023",
      title: {
        es: "Técnico Laboral por Competencias en Asistente en Programación de Software",
        en: "Competency-Based Vocational Technician in Software Programming Assistance",
      },
      place: "ITA Profesional – Universidad Pontificia Bolivariana (UPB)",
    },
    {
      year: "2023",
      title: {
        es: "Bachiller Técnico, especialidad en Informática",
        en: "Technical High School Diploma, specialization in Computing",
      },
      place: "Institución Educativa de Rozo",
    },
  ],

  certsHeading: { es: "Certificaciones", en: "Certifications" },

  // El `📜` que `Formacion.tsx` imprime arriba de cada certificado NO está acá,
  // y es a propósito: es el mismo ícono decorativo para los dos, escrito una
  // sola vez en el markup. `certs` es `L[]` —texto y nada más— y darle ícono
  // querría decir convertirlo en objetos con un campo que ningún componente
  // lee todavía: dato muerto, y encima un glifo que no cambia por idioma ni
  // por certificado. Se queda en el componente y el HTML servido sale
  // idéntico. Si algún día cada certificado lleva ícono propio, ahí sí le toca
  // campo (y le toca a quien cambie el componente, no a esta mudanza).
  certs: [
    {
      es: "Certificado de Aptitud Laboral en Desarrollo de Software",
      en: "Certificate of Vocational Aptitude in Software Development",
    },
    {
      es: "Certificado de Aptitud Ocupacional – Técnico Laboral por Competencias en Asistente en Programación de Software",
      en: "Certificate of Occupational Aptitude – Competency-Based Vocational Technician in Software Programming Assistance",
    },
  ],
};
