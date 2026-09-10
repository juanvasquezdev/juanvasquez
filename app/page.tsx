import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SobreMi from "@/components/SobreMi";
import Progresion from "@/components/Progresion";
import Galeria from "@/components/Galeria";
import Logros from "@/components/Logros";
import Formacion from "@/components/Formacion";
import Tecnica from "@/components/Tecnica";
import Metas from "@/components/Metas";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Interactivity from "@/components/Interactivity";

export default function Home() {
  return (
    <>
      <a href="#inicio" className="skip-link">
        Saltar al contenido
      </a>

      <Nav />

      <main>
        <Hero />
        <SobreMi />
        <Progresion />
        <Galeria />
        <Logros />
        <Formacion />
        <Tecnica />
        <Metas />
        <Contacto />
      </main>

      <Footer />
      <BackToTop />
      <Interactivity />
    </>
  );
}
