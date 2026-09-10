"use client";

import { useEffect } from "react";

/** Fondo del navbar al hacer scroll. */
export function useNavbarScroll() {
  useEffect(() => {
    const navbar = document.getElementById("navbar");
    if (!navbar) return;

    const toggle = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
    return () => window.removeEventListener("scroll", toggle);
  }, []);
}
