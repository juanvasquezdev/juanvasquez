"use client";

import Reveal from "./Reveal";

const DEPORTIVAS = [
  {
    tag: "Próxima competencia",
    title: "Campeonato Nacional Mayores",
    text: (
      <>
        Meta: romper la barrera de los <strong>2.10 m</strong> — mi próximo salto de nivel sobre mi PB
        actual de 2.06 m.
      </>
    ),
    primary: true,
  },
  {
    tag: "Meta mayor",
    title: "Récord Nacional U20",
    text: (
      <>
        Superar los <strong>2.19 m</strong> que hoy marcan el récord nacional en categoría U20.
      </>
    ),
  },
  {
    tag: "Meta máxima",
    title: "Élite Mundial · Road to LA 2028",
    text: (
      <>
        Alcanzar entre <strong>2.20 m y 2.25 m</strong> de altura y competir al nivel de la élite mundial,
        con la mira puesta en Los Ángeles 2028.
      </>
    ),
  },
];

const TECNOLOGICAS = [
  {
    tag: "En desarrollo",
    title: "Plataforma de registro y monitoreo",
    text: "Una web + app para registrar competencias, marcas y perfiles de atletas, y hacer seguimiento del rendimiento a lo largo del tiempo.",
  },
  {
    tag: "En desarrollo",
    title: "APIs y sistemas de optimización",
    text: "Construcción de APIs y sistemas propios que mejoren y optimicen procesos del día a día, aplicando lo aprendido en programación de software.",
  },
];

export default function Metas() {
  return (
    <section className="section" id="metas">
      <Reveal as="p" className="eyebrow">
        10 — Lo que viene
      </Reveal>
      <Reveal as="h2" index={1}>
        Próximos Proyectos
      </Reveal>

      <Reveal as="h3" className="sub-heading">
        🏆 Deportivos
      </Reveal>
      <div className="goal-grid">
        {DEPORTIVAS.map((goal, i) => (
          <Reveal
            className={`goal-card${goal.primary ? " goal-primary" : ""}`}
            index={i}
            key={goal.title}
          >
            <span className="goal-tag">{goal.tag}</span>
            <h4>{goal.title}</h4>
            <p>{goal.text}</p>
          </Reveal>
        ))}
      </div>

      <Reveal as="h3" className="sub-heading">
        💻 Tecnológicos
      </Reveal>
      <div className="goal-grid">
        {TECNOLOGICAS.map((goal, i) => (
          <Reveal className="goal-card" index={i} key={goal.title}>
            <span className="goal-tag">{goal.tag}</span>
            <h4>{goal.title}</h4>
            <p>{goal.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
