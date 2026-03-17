import { VercelGrid } from "@/components/ambient/vercel-grid";
import { WebflowGradient } from "@/components/ambient/webflow-gradient";
import { CodeEditorSection } from "@/components/code-editor/code-editor-section";
import { ExperienceThemeSwitcher } from "@/components/experience/experience-theme-switcher";
import { SiteFooter } from "@/components/footer/site-footer";
import { HeroDiff } from "@/components/hero/hero-diff";
import { StickyNav } from "@/components/navigation/sticky-nav";
import { ProjectsSection } from "@/components/sections/projects-section";
import { experience, navSections } from "@/data/site";

export function HomePage() {
  return (
    <main className="overflow-x-clip pb-14 sm:pb-16">
      <a
        href="#hero"
        className="sr-only absolute left-3 top-3 z-40 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text focus:not-sr-only sm:left-4 sm:top-4"
      >
        Skip to content
      </a>
      <StickyNav sections={navSections} />

      {/* Hero — Webflow blue/lavender gradient wash */}
      <WebflowGradient>
        <HeroDiff />
      </WebflowGradient>

      <div className="mx-auto mt-16 max-w-6xl px-2.5 sm:mt-24 sm:px-4">
        <ProjectsSection />
      </div>
      <CodeEditorSection />
      <section id="experience" className="section-anchor mx-auto max-w-2xl px-4 py-16 sm:max-w-3xl sm:py-24 lg:max-w-4xl">
        <div className="mb-6">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/50">
            Experience
          </div>
        </div>
        <ExperienceThemeSwitcher experiences={experience} />
      </section>

      {/* Footer — Vercel grid + light rays */}
      <VercelGrid>
        <SiteFooter />
      </VercelGrid>
    </main>
  );
}
