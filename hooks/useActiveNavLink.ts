"use client";

import { useEffect } from "react";

/** Resalta el link de nav activo según la sección visible. */
export function useActiveNavLink() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section[id], header[id]");
    const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav-link");
    if (!sections.length || !navLinks.length) return;

    const linkMap: Record<string, HTMLAnchorElement> = {};
    navLinks.forEach((link) => {
      const id = link.getAttribute("href")?.replace("#", "") ?? "";
      linkMap[id] = link;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const link = linkMap[id];
          if (!link) return;
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove("active"));
            link.classList.add("active");
          }
        });
      },
      { threshold: 0.4, rootMargin: "-80px 0px -50% 0px" }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}
