import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SobreMi from "@/components/SobreMi";
import Habilidades from "@/components/Habilidades";
import Stack from "@/components/Stack";
import Proyectos from "@/components/Proyectos";
import Galeria from "@/components/Galeria";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { PROFILE } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { ATHLETICS } from "@/content/athletics";
import { STACK } from "@/content/stack";
import { UI_LABELS } from "@/content/ui";
import { toLocale, localize } from "@/lib/i18n";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = toLocale((await params).lang);

  // Cada sección recibe solo su parte y solo en este idioma (el porqué está en
  // lib/i18n.ts). Lo resuelvo una vez acá y no en cada componente.
  const profile = localize(PROFILE, lang);
  const athletics = localize(ATHLETICS, lang);
  const ui = localize(UI_LABELS, lang);

  // Herramientas, Atleta y Patrocinio entran en lo que queda de la Fase 3; su
  // contenido ya está en content/.
  return (
    <>
      <a href="#contenido" className="skip-link">
        {ui.skipLink}
      </a>

      <Nav
        lang={lang}
        labels={{
          navLabel: ui.navLabel,
          nav: ui.nav,
          homeLabel: ui.homeLabel,
          langLabel: ui.langLabel,
          themeToLight: ui.themeToLight,
          themeToDark: ui.themeToDark,
        }}
      />

      <main id="contenido">
        <Hero content={profile.hero}>
          <SobreMi content={profile.about} />
        </Hero>
        <Habilidades content={profile.skills} />

        {/* TEMPORAL: las secciones que todavía usan app/legacy.css. El
            envoltorio acota sus reglas genéricas (.section, .eyebrow) para que
            no pisen a las nuevas; cada sección sale de acá al reescribirse. */}
        <div className="legacy">
          <Stack content={localize(STACK, lang)} />
          <Proyectos content={localize(PROJECTS, lang)} />
          <Galeria label={athletics.galleryLabel} photos={athletics.gallery} />
          <Contacto content={profile.contact} />
        </div>
      </main>

      <Footer lang={lang} />
      <BackToTop label={ui.backToTopLabel} />
    </>
  );
}
