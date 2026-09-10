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
      <p className="eyebrow reveal">05 — Formación</p>
      <h2 className="reveal">Formación Académica</h2>

      <div className="timeline">
        {TIMELINE.map((item) => (
          <div className="timeline-item reveal" key={item.title}>
            <div className="timeline-year">{item.year}</div>
            <div className="timeline-content">
              <h3>{item.title}</h3>
              <p>{item.place}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="sub-heading reveal">Certificaciones</h3>
      <div className="cert-grid">
        {CERTS.map((cert) => (
          <div className="cert-item reveal" key={cert}>
            <div className="cert-icon">📜</div>
            <p>{cert}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
