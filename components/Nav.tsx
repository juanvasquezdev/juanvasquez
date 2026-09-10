"use client";

import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";
import { useActiveSection } from "@/hooks/useActiveSection";

const LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "progresion", label: "Progresión" },
  { id: "galeria", label: "Galería" },
  { id: "logros", label: "Logros" },
  { id: "formacion", label: "Formación" },
  { id: "tecnica", label: "Técnica" },
  { id: "metas", label: "Metas" },
  { id: "contacto", label: "Contacto" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const activeId = useActiveSection(LINKS.map((l) => l.id));
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (latest) => setScrolled(latest > 40));

  const goTo = (id: string) => (e: React.MouseEvent) => {
    // Sin Lenis (prefers-reduced-motion) se deja el <a href="#id"> nativo:
    // salto instantáneo, sin animación — es lo correcto para ese caso.
    if (lenis) {
      e.preventDefault();
      lenis.scrollTo(`#${id}`);
    }
    setOpen(false);
  };

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`} id="navbar">
      <div className="nav-inner">
        <a href="#inicio" className="nav-logo" onClick={goTo("inicio")}>
          JV<span>.</span>
        </a>
        <button
          className={`nav-toggle${open ? " open" : ""}`}
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links${open ? " open" : ""}`}>
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={`nav-link${activeId === link.id ? " active" : ""}`}
                onClick={goTo(link.id)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
