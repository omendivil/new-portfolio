import { CodeEditorSection } from "@/components/code-editor/code-editor-section";
import { HeroDiff } from "@/components/hero/hero-diff";
import { StickyNav } from "@/components/navigation/sticky-nav";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { navSections } from "@/data/site";

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
      <HeroDiff />
      <div className="mx-auto max-w-6xl px-2.5 sm:px-4">
        <ProjectsSection />
      </div>
      <CodeEditorSection />
      <div className="mx-auto max-w-6xl px-2.5 sm:px-4">
        <ExperienceSection />
      </div>
    </main>
  );
}
