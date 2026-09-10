"use client";

import { useNavbarScroll } from "@/hooks/useNavbarScroll";
import { useMobileMenu } from "@/hooks/useMobileMenu";
import { useHeroCrossfade } from "@/hooks/useHeroCrossfade";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCounters } from "@/hooks/useCounters";
import { useBarChart } from "@/hooks/useBarChart";
import { useActiveNavLink } from "@/hooks/useActiveNavLink";
import { useBackToTop } from "@/hooks/useBackToTop";

/**
 * Sin salida visual: engancha toda la interactividad de la página (equivalente
 * al DOMContentLoaded de script.js) una vez que todas las secciones ya están
 * montadas en el DOM. El fallback de imágenes rotas quedó como estado local
 * en Hero/Galeria (onError de next/image) en vez de un listener delegado
 * global, ya no hace falta acá.
 */
export default function Interactivity() {
  useNavbarScroll();
  useMobileMenu();
  useHeroCrossfade();
  useScrollReveal();
  useCounters();
  useBarChart();
  useActiveNavLink();
  useBackToTop();
  return null;
}
