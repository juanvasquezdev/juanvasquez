import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SobreMi from "@/components/SobreMi";
import Stack from "@/components/Stack";
import Proyectos from "@/components/Proyectos";
import Progresion from "@/components/Progresion";
import MomentoEpico from "@/components/MomentoEpico";
import Galeria from "@/components/Galeria";
import Logros from "@/components/Logros";
import Formacion from "@/components/Formacion";
import Tecnica from "@/components/Tecnica";
import Metas from "@/components/Metas";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { PROFILE } from "@/content/profile";
import { PROJECTS } from "@/content/projects";
import { ATHLETICS } from "@/content/athletics";
import { TIMELINE } from "@/content/timeline";
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
  const { achievements } = athletics;

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
        <Hero
          content={{
            name: profile.name,
            eyebrow: profile.eyebrow,
            heroSubtitle: profile.heroSubtitle,
            heroQuote: profile.heroQuote,
            heroImages: profile.heroImages,
            stats: profile.stats,
          }}
        />
        <SobreMi content={{ about: profile.about, photo: profile.photo, bio: profile.bio }} />
        <Stack content={localize(STACK, lang)} />
        <Proyectos content={localize(PROJECTS, lang)} labels={ui.projects} />
        <Progresion content={athletics.progression} />
        <MomentoEpico content={athletics.epicMoment} />
        <Galeria content={athletics.gallery} />
        <Logros
          content={{
            eyebrow: achievements.eyebrow,
            heading: achievements.heading,
            items: achievements.items,
            clubsLabel: achievements.clubsLabel,
            clubs: achievements.clubs,
          }}
        />
        <Formacion content={localize(TIMELINE, lang)} />
        <Tecnica content={athletics.technique} />
        <Metas content={athletics.goals} />
        <Contacto content={{ contact: profile.contact, contacts: profile.contacts }} />
      </main>

      <Footer lang={lang} />
      <BackToTop label={ui.backToTopLabel} />
    </>
  );
}
