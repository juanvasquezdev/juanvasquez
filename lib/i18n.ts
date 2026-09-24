import { redirect } from "next/navigation";
import { DEFAULT_LOCALE, LOCALES, type L, type Locale } from "@/content/types";

/**
 * El puente entre `content/` (que tiene los dos idiomas) y los componentes (que
 * pintan uno solo).
 *
 * Resuelvo el idioma en el servidor, en `app/[lang]/page.tsx`, y no dentro de
 * cada componente con un `lang` de prop: casi todas las secciones son client
 * components, y un client component que importa `content/*.ts` se lleva los dos
 * idiomas al JS de cada visitante. Así a cada sección le llega solo el texto
 * del idioma de la ruta, ya plano, y `content/` no sale del servidor. Una
 * sección que sea server component puede leer `content/` directo y no necesita
 * la prop.
 */

/** Para validar el segmento `[lang]` de la URL antes de usarlo. */
export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * El idioma de la ruta, o una redirección si el primer segmento no es uno.
 *
 * `[lang]` agarra cualquier primer segmento, así que /contacto o /xx llegan
 * acá con `lang = "contacto"`. No corto con notFound(): mi layout raíz vive
 * debajo de `[lang]`, y un 404 tirado durante el render ya no tiene ningún
 * layout arriba que lo dibuje — Next responde un <html> vacío que sin JS no
 * muestra nada. En cambio le antepongo el idioma por defecto (/contacto →
 * /es/contacto): si esa ruta existe, llega; si no, es una ruta que no coincide
 * con nada y la atiende `app/global-not-found.tsx`, con 404 y texto visible.
 */
export function localeOrRedirect(lang: string): Locale {
  if (isLocale(lang)) return lang;
  // Sin encodeURIComponent: el segmento ya llega codificado (/%3Cx%3E trae
  // `lang = "%3Cx%3E"`), y codificarlo de nuevo lo dejaba en %253C. Tampoco
  // puede traer una "/" suelta, así que el destino siempre empieza en /es/.
  redirect(`/${DEFAULT_LOCALE}/${lang}`);
}

/**
 * La forma de un dato de `content/` una vez elegido el idioma: cada `L<T>`
 * pasa a ser `T`, y todo lo demás queda igual (recursivo en objetos y listas).
 * Así el componente tipa contra `Localized<Stack>` y no hay que escribir a
 * mano una segunda versión "plana" de cada tipo de `content/types.ts`.
 */
export type Localized<T> =
  T extends L<infer U>
    ? U
    : T extends readonly (infer E)[]
      ? Localized<E>[]
      : T extends object
        ? { [K in keyof T]: Localized<T[K]> }
        : T;

/**
 * Un `L<T>` en tiempo de ejecución: un objeto plano cuyas claves son
 * exactamente los idiomas de `LOCALES`, ni una más ni una menos. Si mañana
 * entra un tercer idioma, esto se entera solo porque lee de `LOCALES`.
 */
function isBilingual(value: object): value is L<unknown> {
  const keys = Object.keys(value);
  return keys.length === LOCALES.length && LOCALES.every((locale) => keys.includes(locale));
}

/** Recorre un dato de `content/` y se queda con el idioma pedido. */
export function localize<T>(data: T, lang: Locale): Localized<T> {
  if (Array.isArray(data)) {
    return data.map((item) => localize(item, lang)) as Localized<T>;
  }
  if (data !== null && typeof data === "object") {
    if (isBilingual(data)) return data[lang] as Localized<T>;
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, localize(value, lang)])
    ) as Localized<T>;
  }
  return data as Localized<T>;
}
