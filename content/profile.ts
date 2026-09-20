/**
 * Datos de perfil.
 *
 * Por ahora este es el único archivo de `content/`: la capa de contenido
 * completa —tipada y bilingüe— es PORT-001a. Acá vive solo lo que PORT-000
 * necesita, para no congelar la forma de los datos antes de tiempo.
 */

/** Mi perfil de GitHub. */
export const GITHUB_URL = "https://github.com/juanjosevasquez1313-ai";

/**
 * Interruptor del link al perfil de GitHub en Contacto.
 *
 * Tengo todos los repos privados, y un perfil así se ve vacío a menos que esté
 * activo *Settings → Profile → "Include private contributions on my profile"*.
 * Si no lo activo, el link juega en contra: manda a alguien a un perfil sin
 * nada. Mientras lo decido, esto se apaga en un renglón y el link desaparece
 * de la sección sin tocar el componente.
 */
export const SHOW_GITHUB_PROFILE = true;
