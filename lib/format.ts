import type { Locale } from "@/content/types";

/**
 * Cómo se escriben los números en cada idioma. Todas las marcas pasan por acá
 * para que ninguna quede con el separador equivocado.
 */

// Una instancia por idioma: armar un Intl.NumberFormat es caro y se usa en
// cada fila de la trayectoria.
const MARK_FORMAT: Record<Locale, Intl.NumberFormat> = {
  es: new Intl.NumberFormat("es", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  en: new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

/** 2.05 → "2,05 m" en español, "2.05 m" en inglés. */
export function formatMark(meters: number, lang: Locale): string {
  return `${MARK_FORMAT[lang].format(meters)} m`;
}

// A mano y no con Intl: Intl da "jul" en minúscula y "sept" en español, y el
// diseño usa siempre tres letras en mayúscula.
const MONTHS: Record<Locale, string[]> = {
  es: ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"],
  en: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
};

/** "2026-07-05" → "05 JUL 2026" (y "05 AGO 2025" en español). */
export function formatDate(iso: string, lang: Locale): string {
  const [year, month, day] = iso.split("-");
  return `${day} ${MONTHS[lang][Number(month) - 1]} ${year}`;
}

/** El año de una fecha ISO, sin pasar por Date (que la leería en UTC). */
export function yearOf(iso: string): number {
  return Number(iso.slice(0, 4));
}

/** Puesto en la competencia: "1°". Igual en los dos idiomas, como en el mockup. */
export function formatPlace(place: number): string {
  return `${place}°`;
}
