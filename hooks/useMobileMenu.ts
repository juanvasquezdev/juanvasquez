"use client";

import { useEffect } from "react";

/** Menú hamburguesa (móvil): abre/cierra y se cierra al elegir un link. */
export function useMobileMenu() {
  useEffect(() => {
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");
    if (!navToggle || !navLinks) return;

    const onToggleClick = () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
    };
    navToggle.addEventListener("click", onToggleClick);

    const links = navLinks.querySelectorAll<HTMLAnchorElement>(".nav-link");
    const closeMenu = () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };
    links.forEach((link) => link.addEventListener("click", closeMenu));

    return () => {
      navToggle.removeEventListener("click", onToggleClick);
      links.forEach((link) => link.removeEventListener("click", closeMenu));
    };
  }, []);
}
