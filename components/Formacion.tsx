"use client";

import Reveal from "./Reveal";

const TIMELINE = [
  {
    year: "2023",
    title: "Técnico Laboral por Competencias en Asistente en Programación de Software",
    place: "ITA Profesional – Universidad Pontificia Bolivariana (UPB)",
  },
  {
    year: "2023",
    title: "Bachiller Técnico, especialidad en Informática",
    place: "Institución Educativa de Rozo",
  },
];

const CERTS = [
  "Certificado de Aptitud Laboral en Desarrollo de Software",
  "Certificado de Aptitud Ocupacional – Técnico Laboral por Competencias en Asistente en Programación de Software",
];

export default function Formacion() {
  return (
    <section className="section" id="formacion">
      <Reveal as="p" className="eyebrow">
        08 — Formación
      </Reveal>
      <Reveal as="h2" index={1}>
        Formación Académica
      </Reveal>

      <div className="timeline">
        {TIMELINE.map((item, i) => (
          <Reveal className="timeline-item" index={i} key={item.title}>
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-content">
              <h3>{item.title}</h3>
              <p>{item.place}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal as="h3" className="sub-heading">
        Certificaciones
      </Reveal>
      <div className="cert-grid">
        {CERTS.map((cert, i) => (
          <Reveal className="cert-item" index={i} key={cert}>
            <div className="cert-icon">📜</div>
            <p>{cert}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
