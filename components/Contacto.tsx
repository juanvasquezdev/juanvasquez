"use client";

import { motion } from "motion/react";
import { reveal, staggerContainer, revealViewport } from "@/lib/motion";

const CONTACTS = [
  {
    href: "mailto:juanjosevasquez1313@gmail.com",
    icon: "📧",
    label: "Email",
    value: "juanjosevasquez1313@gmail.com",
    external: false,
  },
  {
    href: "https://instagram.com/juanvasquezhj",
    icon: "📱",
    label: "Instagram",
    value: "@juanvasquezhj",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/juan-jos%C3%A9-vasquez-giraldo-93b25b304/",
    icon: "💼",
    label: "LinkedIn",
    value: "Juan José Vásquez Giraldo",
    external: true,
  },
];

export default function Contacto() {
  return (
    <section className="section section-dark" id="contacto">
      <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={revealViewport}>
        <motion.p className="eyebrow" variants={reveal}>
          08 — Hablemos
        </motion.p>
        <motion.h2 variants={reveal}>Contacto</motion.h2>
      </motion.div>

      <motion.div
        className="contact-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={revealViewport}
      >
        {CONTACTS.map((contact) => (
          <motion.a
            key={contact.href}
            href={contact.href}
            {...(contact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="contact-item"
            variants={reveal}
          >
            <div className="contact-icon">{contact.icon}</div>
            <div className="contact-label">{contact.label}</div>
            <span className="contact-value">{contact.value}</span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
