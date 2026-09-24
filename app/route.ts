import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/content/types";

/**
 * La raíz no tiene contenido propio: manda al idioma por defecto.
 *
 * Es un route handler y no un `app/page.tsx` a propósito. Con `<html lang>`
 * real, el root layout tiene que vivir en `app/[lang]/layout.tsx` (es el único
 * lugar donde se conoce el idioma), y entonces un `page.tsx` en la raíz se
 * queda sin layout arriba, y Next exige un root layout sobre cada página. Un
 * route handler no necesita layout, y `redirect()` funciona igual: responde
 * 307 hacia `/es`.
 *
 * Por ahora siempre a `/es`, sin mirar `Accept-Language`: elegir el idioma
 * según el navegador es una decisión de producto, no de enrutamiento.
 */
export function GET() {
  redirect(`/${DEFAULT_LOCALE}`);
}
