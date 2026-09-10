const LINKS = [
  { href: "#inicio", label: "Inicio" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#progresion", label: "Progresión" },
  { href: "#galeria", label: "Galería" },
  { href: "#logros", label: "Logros" },
  { href: "#formacion", label: "Formación" },
  { href: "#tecnica", label: "Técnica" },
  { href: "#metas", label: "Metas" },
  { href: "#contacto", label: "Contacto" },
];

export default function Nav() {
  return (
    <nav className="navbar" id="navbar">
      <div className="nav-inner">
        <a href="#inicio" className="nav-logo">
          JV<span>.</span>
        </a>
        <button
          className="nav-toggle"
          id="navToggle"
          aria-label="Abrir menú"
          aria-expanded="false"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className="nav-links" id="navLinks">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="nav-link" data-nav>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
