import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import SobreMi from "@/components/SobreMi";
import Habilidades from "@/components/Habilidades";
import Stack from "@/components/Stack";
import Proyectos from "@/components/Proyectos";
import Herramientas from "@/components/Herramientas";
import Atleta from "@/components/Atleta";
import Patrocinio from "@/components/Patrocinio";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import { PROFILE } from "@/content/profile";
import { PROJECTS, TOOLS } from "@/content/projects";
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

  // Herramientas solo existe si hay alguna con repo publicado; si no, se va
  // también su link del nav para que no apunte a nada.
  const tools = localize(TOOLS, lang);
  const publishedTools = tools.items.filter((tool) => tool.repoUrl);
  const nav = publishedTools.length
    ? ui.nav
    : ui.nav.filter((link) => link.id !== "herramientas");

  return (
    <>
      <a href="#contenido" className="skip-link">
        {ui.skipLink}
      </a>

      <Nav
        lang={lang}
        labels={{
          navLabel: ui.navLabel,
          nav,
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
        <Stack content={localize(STACK, lang)} />
        <Proyectos content={localize(PROJECTS, lang)} />
        {publishedTools.length > 0 && (
          <Herramientas content={{ ...tools, items: publishedTools }} />
        )}
        <Atleta content={athletics} lang={lang} />
        <Patrocinio content={athletics.sponsorship} />
        <Contacto content={profile.contact} />
      </main>

      <Footer lang={lang} />
    </>
  );
}
