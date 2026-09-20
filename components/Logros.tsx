"use client";

import Reveal from "./Reveal";

const ACHIEVEMENTS = [
  { emoji: "🥇", html: <>Campeón Nacional U18<br /><small>(2 veces)</small></> },
  { emoji: "🥈", html: "Subcampeón Juegos Nacionales Juveniles" },
  { emoji: "🥈", html: "Subcampeón Interclubes U20" },
  { emoji: "📈", html: "Marca Personal: 2.06 m" },
];

export default function Logros() {
  return (
    <section className="section section-dark" id="logros">
      <Reveal as="p" className="eyebrow">
        07 — Trayectoria
      </Reveal>
      <Reveal as="h2" index={1}>
        Logros Destacados
      </Reveal>

      <div className="achievements">
        {ACHIEVEMENTS.map((item, i) => (
          <Reveal className="achievement-item" index={i} key={i}>
            <div className="achievement-emoji">{item.emoji}</div>
            <p>{item.html}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="card card-wide mt-lg">
        <p>
          <strong>👤 Entrenador:</strong> José Arturo Posada
        </p>
        <p className="mt-sm">
          <strong>🏃 Clubes:</strong> Todomed, The Jumpers Club
        </p>
      </Reveal>
    </section>
  );
}
