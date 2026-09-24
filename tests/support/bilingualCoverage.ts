import ts from "typescript";

/**
 * D12 (BITACORA, 2026-09-24), punto 2: el barrido de claves `es`/`en` entra
 * como prueba permanente. Motivo de Juan: que al traducir la página se vea
 * todo bien, sin textos en blanco.
 *
 * Esto NO recorre el objeto en tiempo de ejecución con `import` — recorre el
 * TEXTO FUENTE con el compilador de TypeScript (`typescript`, ya es
 * devDependency del repo). Adrede: si esto importara `content/*.ts` como
 * módulo y leyera el objeto ya construido, cualquier vacío que hoy está
 * marcado a propósito con un comentario `❓ PENDIENTE JUAN` (ver
 * content/projects.ts) se vería exactamente igual que un vacío por accidente
 * — el comentario ya no existe en el valor en tiempo de ejecución, solo en
 * el código fuente. Por eso el chequeo vive a nivel de AST: es el único nivel
 * donde "vacío marcado" y "vacío sin marcar" siguen siendo cosas distintas.
 */

const MARKER = "PENDIENTE JUAN";

export type Violation = {
  /** Etiqueta del archivo (para el mensaje), no necesariamente una ruta real en disco. */
  file: string;
  /** Línea 1-indexed donde arranca el nodo bilingüe con el problema. */
  line: number;
  kind: "falta-clave" | "vacio-sin-marcador" | "valor-no-string";
  detail: string;
};

function propNameText(name: ts.PropertyName): string | null {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) return name.text;
  return null;
}

/**
 * Reduce un valor de texto a su string efectivo, incluso si está armado con
 * concatenación (`"a" + "b"`, el patrón real de `Profile.bio` en
 * profile.ts). Devuelve `null` si el nodo no es (ni se arma con) literales de
 * texto — eso se reporta aparte como `valor-no-string`, no se asume vacío.
 */
function resolveStringText(node: ts.Expression): string | null {
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isParenthesizedExpression(node)) return resolveStringText(node.expression);
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    const left = resolveStringText(node.left);
    const right = resolveStringText(node.right);
    if (left !== null && right !== null) return left + right;
  }
  return null;
}

/**
 * Recorre el AST de un archivo de `content/*.ts` (pasado como TEXTO, no como
 * ruta — así se puede sabotear una COPIA en memoria sin tocar el archivo
 * real) y devuelve los nodos bilingües con problema.
 *
 * "Nodo bilingüe" usa el mismo criterio que `isBilingual` en `lib/i18n.ts`:
 * un objeto cuyas claves son EXACTAMENTE las de `locales`, ni una más ni una
 * menos — mismo código de producción que resuelve el idioma en runtime, para
 * no medir con una definición distinta de la que se sirve.
 *
 * Dos formas de problema:
 * 1. `falta-clave` — el objeto tiene ALGUNA de las claves de `locales` (o
 *    sea, se nota que "quería" ser bilingüe) pero no todas. En una posición
 *    tipada como `L`, esto ya lo atrapa `tsc` — pero si alguna vez se escribe
 *    fuera de una posición tipada (un `as any`, un literal suelto), `tsc` dejaría
 *    pasar exactamente el defecto que un texto en blanco en producción necesita.
 * 2. `vacio-sin-marcador` — las dos claves están, pero alguna resuelve a
 *    string vacío (o solo espacios — `.trim()`, no `=== ""`: un texto de
 *    puros espacios se ve tan en blanco como uno de longitud 0, y el motivo
 *    de Juan para esta prueba es justo "que no se vea en blanco") y no hay
 *    un comentario con "PENDIENTE JUAN" pegado al nodo (directamente arriba
 *    del nodo, o arriba de la propiedad que lo contiene — el patrón real de
 *    `content/projects.ts`).
 *
 * Si el valor de una clave no es un string ni una concatenación de strings,
 * se reporta `valor-no-string` en vez de asumir que está bien: hoy todo `L<T>`
 * real en `content/types.ts` es `L<string>` (T por defecto), así que esta
 * forma no debería aparecer — si aparece, es una forma que este chequeo no
 * conoce y no se calla.
 */
export function checkBilingualCoverage(
  sourceText: string,
  fileLabel: string,
  locales: readonly string[]
): Violation[] {
  const sourceFile = ts.createSourceFile(fileLabel, sourceText, ts.ScriptTarget.Latest, true);
  const violations: Violation[] = [];
  const localeSet = new Set(locales);

  function lineOf(node: ts.Node): number {
    return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
  }

  function commentAt(node: ts.Node): boolean {
    const ranges = ts.getLeadingCommentRanges(sourceFile.text, node.getFullStart()) ?? [];
    return ranges.some((r) => sourceFile.text.slice(r.pos, r.end).includes(MARKER));
  }

  /**
   * Busca el marcador pegado al nodo bilingüe: arriba del nodo mismo (el
   * caso de un elemento suelto en un array, ej. `certs: L[]`), o arriba de la
   * propiedad que lo contiene (el caso real de `tagline: { es: "", en: "" }`
   * en content/projects.ts — el comentario está sobre `tagline:`, no sobre el
   * `{ ... }`, porque están en la misma línea).
   *
   * Límite de diseño, a propósito: esto no distingue POR QUÉ está el
   * marcador, solo que está. Un `❓ PENDIENTE JUAN` puesto por cualquier otro
   * motivo — no porque el texto esté vacío, sino porque el texto lo escribió
   * el agente y falta que Juan lo confirme — también apaga el chequeo de
   * vacío para ese nodo. Ejemplo real: `governingBodiesLabel` en
   * `content/athletics.ts:221` lleva el marcador porque la etiqueta no es
   * copy del sitio, no porque falte texto (hoy tiene los dos idiomas
   * completos). Si ese valor se vaciara mañana sin que nadie toque el
   * comentario, este chequeo lo dejaría pasar igual — el marcador ya estaba
   * ahí por una razón distinta. No hay forma de distinguir esto solo mirando
   * "hay un comentario con PENDIENTE JUAN cerca": habría que parsear la
   * intención del comentario, y eso ya no es un chequeo mecánico.
   */
  function hasMarkerComment(node: ts.Node): boolean {
    if (commentAt(node)) return true;
    const parent = node.parent;
    if (parent && ts.isPropertyAssignment(parent) && parent.initializer === node) {
      if (commentAt(parent)) return true;
    }
    return false;
  }

  function visit(node: ts.Node) {
    if (ts.isObjectLiteralExpression(node)) {
      const namedProps = node.properties.filter(
        (p): p is ts.PropertyAssignment => ts.isPropertyAssignment(p) && propNameText(p.name) !== null
      );
      // Solo se analizan objetos donde TODAS las propiedades son
      // `PropertyAssignment` con nombre legible (nada de spreads ni
      // shorthand) — si no, no es candidato a nodo bilingüe reconocible.
      if (namedProps.length === node.properties.length && namedProps.length > 0) {
        const names = namedProps.map((p) => propNameText(p.name)!);
        const nameSet = new Set(names);
        const looksBilingual = names.some((n) => localeSet.has(n));

        if (looksBilingual) {
          const missing = locales.filter((l) => !nameSet.has(l));
          const isExactMatch = missing.length === 0 && nameSet.size === localeSet.size;

          if (missing.length > 0) {
            // Le falta alguna clave de `locales` — el defecto que D12 pide
            // medir aunque `tsc` ya lo atrape en una posición tipada. Si
            // además tiene claves de más, eso no es lo que esta prueba
            // vigila (no es el defecto "texto en blanco"), así que no se
            // reporta aparte.
            violations.push({
              file: fileLabel,
              line: lineOf(node),
              kind: "falta-clave",
              detail: `faltan las claves: ${missing.join(", ")} (tiene: ${names.join(", ") || "(vacío)"})`,
            });
          } else if (isExactMatch) {
            // Calza exacto: es un nodo bilingüe real. Revisar contenido.
            for (const locale of locales) {
              const prop = namedProps.find((p) => propNameText(p.name) === locale)!;
              const text = resolveStringText(prop.initializer);
              if (text === null) {
                violations.push({
                  file: fileLabel,
                  line: lineOf(node),
                  kind: "valor-no-string",
                  detail: `${locale}: el valor no es un string literal ni una concatenación de literales (${ts.SyntaxKind[prop.initializer.kind]})`,
                });
              } else if (text.trim() === "" && !hasMarkerComment(node)) {
                // `.trim()`, no `=== ""`: un texto hecho solo de espacios
                // ("  ") es tan "en blanco" en pantalla como una cadena
                // vacía — el motivo de Juan para esta prueba (D12) es
                // justamente "que no se vea en blanco", no "que el string
                // tenga longitud 0". Medido por el reviewer en la ronda 2 de
                // T6, por mutación en los seis archivos: con `=== ""` un
                // valor `" "` pasaba en verde.
                violations.push({
                  file: fileLabel,
                  line: lineOf(node),
                  kind: "vacio-sin-marcador",
                  detail: `"${locale}" vacío (o solo espacios) sin comentario "❓ ${MARKER}" pegado al nodo`,
                });
              }
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return violations;
}
