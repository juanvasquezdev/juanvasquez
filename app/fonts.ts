import localFont from "next/font/local";

// Las tres fuentes son variables y vienen solo con el subconjunto latino de
// Google Fonts (cubre tildes, ñ, ¿ y ¡). Viven en app/fonts/ para no depender
// de Google en el build ni en el navegador.

// Archivo trae dos ejes: peso (400-900) y ancho (62%-125%). El ancho solo se
// activa si el @font-face declara el rango de font-stretch; sin eso el
// navegador toma la fuente como de ancho fijo y los títulos angostos
// (font-stretch: 72%) salen al 100%.
export const archivo = localFont({
  src: "./fonts/archivo-variable.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  variable: "--font-display",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  fallback: ["Arial Narrow", "sans-serif"],
});

export const geist = localFont({
  src: "./fonts/geist-variable.woff2",
  weight: "300 700",
  style: "normal",
  display: "swap",
  variable: "--font-body",
  fallback: ["system-ui", "sans-serif"],
});

// Sin preload: son etiquetas chicas, y no quiero que compitan con la foto del
// hero y con los títulos en la primera carga.
export const geistMono = localFont({
  src: "./fonts/geist-mono-variable.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
  variable: "--font-mono",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
});

export const fontVariables = `${archivo.variable} ${geist.variable} ${geistMono.variable}`;
