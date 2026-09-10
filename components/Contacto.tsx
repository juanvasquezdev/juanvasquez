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
      <p className="eyebrow reveal">08 — Hablemos</p>
      <h2 className="reveal">Contacto</h2>

      <div className="contact-grid">
        {CONTACTS.map((contact) => (
          <a
            key={contact.href}
            href={contact.href}
            {...(contact.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="contact-item reveal"
          >
            <div className="contact-icon">{contact.icon}</div>
            <div className="contact-label">{contact.label}</div>
            <span className="contact-value">{contact.value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
