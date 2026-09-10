const ACHIEVEMENTS = [
  { emoji: "🥇", html: <>Campeón Nacional U18<br /><small>(2 veces)</small></> },
  { emoji: "🥈", html: "Subcampeón Juegos Nacionales Juveniles" },
  { emoji: "🥈", html: "Subcampeón Interclubes U20" },
  { emoji: "📈", html: "Marca Personal: 2.06 m" },
];

export default function Logros() {
  return (
    <section className="section section-dark" id="logros">
      <p className="eyebrow reveal">04 — Trayectoria</p>
      <h2 className="reveal">Logros Destacados</h2>

      <div className="achievements">
        {ACHIEVEMENTS.map((item, i) => (
          <div className="achievement-item reveal" key={i}>
            <div className="achievement-emoji">{item.emoji}</div>
            <p>{item.html}</p>
          </div>
        ))}
      </div>

      <div className="card card-wide reveal mt-lg">
        <p>
          <strong>👤 Entrenador:</strong> José Arturo Posada
        </p>
        <p className="mt-sm">
          <strong>🏃 Clubes:</strong> Todomed, The Jumpers Club
        </p>
      </div>
    </section>
  );
}
