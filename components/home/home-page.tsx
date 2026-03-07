import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { WritingSection } from "@/components/sections/writing-section";
import { StickyNav } from "@/components/navigation/sticky-nav";
import { siteContent } from "@/data/site";

export function HomePage() {
  return (
    <main className="overflow-x-clip px-2.5 pb-14 pt-3 sm:px-4 sm:pb-16 sm:pt-4">
      <a
        href="#hero"
        className="sr-only absolute left-3 top-3 z-40 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text focus:not-sr-only sm:left-4 sm:top-4"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl space-y-4 sm:space-y-5 lg:space-y-6">
        <StickyNav sections={siteContent.navSections} />
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <ExperienceSection />
        <WritingSection />
        <ContactSection config={siteContent.contact} />
      </div>
    </main>
  );
}
