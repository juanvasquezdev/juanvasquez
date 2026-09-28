/**
 * Tema claro/oscuro.
 *
 * Sin nada guardado manda el sistema: globals.css pinta oscuro por defecto y
 * pasa a claro con `prefers-color-scheme: light`. Cuando alguien usa el toggle,
 * la elección queda en `data-theme` sobre <html> y en localStorage, y le gana
 * al sistema.
 */

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

/**
 * Corre en el <head> antes de pintar nada: si hay un tema guardado, lo pone en
 * <html> para que la página no aparezca un instante en el tema equivocado.
 * El try es por Safari en modo privado, que puede tirar al leer localStorage.
 *
 * Es texto y no una función a propósito: lo que se inyecta en el HTML tiene
 * que ser exactamente este string, sin pasar por el bundler.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;
