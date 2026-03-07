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
    <main className="px-3 pb-12 pt-4 sm:px-4 sm:pb-16">
      <a
        href="#hero"
        className="sr-only absolute left-4 top-4 z-40 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text focus:not-sr-only"
      >
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl space-y-5 sm:space-y-6">
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
