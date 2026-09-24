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
 * El `[lang]` de la ruta, ya con su tipo.
 *
 * Con `dynamicParams = false` en el layout solo se generan /es y /en, y
 * cualquier otro primer segmento es 404 antes de llegar acá (lo dibuja
 * `app/global-not-found.tsx`). Esto es solo para que TypeScript sepa que es
 * un `Locale`; el fallback al idioma por defecto no debería pasar nunca.
 */
export function toLocale(lang: string): Locale {
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
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
