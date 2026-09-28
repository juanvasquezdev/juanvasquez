import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import { DEFAULT_LOCALE } from "@/content/types";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
import "./globals.css";

/**
 * El 404 de todo el sitio: /xx, /contacto, /es/foo.
 *
 * Next lo sirve sin pasar por ningún layout, así que acá va el documento
 * entero, con las fuentes y los estilos importados a mano. No recibe la URL,
 * así que no sabe en qué idioma estaba el visitante: sale en el idioma por
 * defecto. El texto es el mismo del 404 que trae Next; todavía no le di diseño
 * ni traducción propios.
 */
export const metadata: Metadata = {
  title: "404: This page could not be found.",
};

export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <main className="section wrap">
          <h1>404</h1>
          <p>This page could not be found.</p>
        </main>
      </body>
    </html>
  );
}
