"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useLenis } from "lenis/react";

/** `label` es el aria-label, ya en el idioma de la ruta (`UI.backToTopLabel`). */
export default function BackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (latest) => setVisible(latest > 600));

  return (
    <motion.button
      className={`back-to-top${visible ? " visible" : ""}`}
      aria-label={label}
      tabIndex={visible ? 0 : -1}
      onClick={() =>
        lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "auto" })
      }
    >
      ↑
    </motion.button>
  );
}
