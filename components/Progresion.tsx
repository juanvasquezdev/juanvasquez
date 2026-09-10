type Marker = { pos: number; value: string; label: string; variant?: "current" | "elite" };

const MARKERS: Marker[] = [
  { pos: 0, value: "2.06 m", label: "PB actual", variant: "current" },
  { pos: 30, value: "2.10 m", label: "Próxima meta · Nacional Mayores" },
  { pos: 78, value: "2.19 m", label: "Récord Nacional U20" },
  { pos: 100, value: "2.20 – 2.25 m", label: "Élite mundial · Road to LA 2028", variant: "elite" },
];

export default function Progresion() {
  return (
    <section className="section section-dark" id="progresion">
      <p className="eyebrow reveal">02 — El objetivo</p>
      <h2 className="reveal">La Barra</h2>
      <p className="section-intro reveal">
        Cada centímetro es una temporada de trabajo. Esta es mi hoja de ruta hacia la élite mundial.
      </p>

      <div className="bar-chart reveal" id="barChart">
        <div className="bar-track">
          <div className="bar-fill" id="barFill"></div>

          {MARKERS.map((marker) => (
            <div
              key={marker.label}
              className={`bar-marker${marker.variant === "current" ? " marker-current" : ""}${
                marker.variant === "elite" ? " marker-elite" : ""
              }`}
              style={{ "--pos": `${marker.pos}%` } as React.CSSProperties}
            >
              <div className="marker-dot"></div>
              <div className="marker-label">
                <strong>{marker.value}</strong>
                <span>{marker.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
