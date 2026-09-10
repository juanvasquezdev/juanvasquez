import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SobreMi from "@/components/SobreMi";
import Stack from "@/components/Stack";
import Progresion from "@/components/Progresion";
import Galeria from "@/components/Galeria";
import Logros from "@/components/Logros";
import Formacion from "@/components/Formacion";
import Tecnica from "@/components/Tecnica";
import Metas from "@/components/Metas";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

// Requerido por la CSP con nonce (ver proxy.ts): el nonce es por request, así
// que esta página no puede quedar prerenderizada como estática — el costo es
// perder la cache estática de Vercel para esta ruta. Ver CLAUDE.md, deuda
// técnica ítem 9, para el detalle completo de esta decisión.
export const dynamic = "force-dynamic";

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
        <Stack />
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
    </>
  );
}
