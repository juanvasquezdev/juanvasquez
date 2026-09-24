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
import { localeOrRedirect, localize } from "@/lib/i18n";

// Requerido por la CSP con nonce (ver proxy.ts): el nonce es por request, así
// que esta página no puede quedar prerenderizada como estática — el costo es
// perder la cache estática de Vercel para esta ruta. Ver CLAUDE.md, deuda
// técnica ítem 9, para el detalle completo de esta decisión. Por lo mismo, el
// `generateStaticParams` del layout no prerenderiza nada: /es y /en se
// renderizan en cada request.
export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const lang = localeOrRedirect((await params).lang);

  // Cada sección recibe solo su parte y solo en este idioma (el porqué está en
  // lib/i18n.ts). Lo resuelvo una vez acá y no en cada componente.
  const profile = localize(PROFILE, lang);
  const athletics = localize(ATHLETICS, lang);
  const ui = localize(UI_LABELS, lang);
  const { achievements } = athletics;

  return (
    <>
      <a href="#inicio" className="skip-link">
        {ui.skipLink}
      </a>

      <main>
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
      {/* Al final del DOM a propósito: es un nav fijo abajo, no uno tradicional
          arriba — así el tab order llega primero al contenido, y el skip-link
          sigue funcionando igual para saltar directo a #inicio. */}
      <Nav label={ui.navLabel} links={ui.nav} />
    </>
  );
}
