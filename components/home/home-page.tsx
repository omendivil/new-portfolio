"use client";

import { useMemo } from "react";

import { VercelGrid } from "@/components/ambient/vercel-grid";
import { WebflowGradient } from "@/components/ambient/webflow-gradient";
import { CodeEditorSection } from "@/components/code-editor/code-editor-section";
import { ExperienceThemeSwitcher } from "@/components/experience/experience-theme-switcher";
import { SiteFooter } from "@/components/footer/site-footer";
import { HeroDiff } from "@/components/hero/hero-diff";
import { StickyNav } from "@/components/navigation/sticky-nav";
import { ProjectsSection } from "@/components/sections/projects-section";
import { TerminalTransition } from "@/components/world/terminal-transition";
import { useWorldNavigation } from "@/components/world/use-world-navigation";
import { WorldEntrance } from "@/components/world/world-entrance";
import { WorldSlide } from "@/components/world/world-slide";
import { experience, navSections } from "@/data/site";
import type { NavSectionId } from "@/data/types";

const SECTION_ORDER: NavSectionId[] = ["hero", "projects", "code", "experience", "contact"];

export function HomePage() {
  const world = useWorldNavigation(SECTION_ORDER);
  const navSectionsFiltered = useMemo(
    () => navSections.filter((s) => SECTION_ORDER.includes(s.id)),
    [],
  );

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      <a
        href="#hero"
        className="sr-only absolute left-3 top-3 z-40 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text focus:not-sr-only sm:left-4 sm:top-4"
      >
        Skip to content
      </a>
      <StickyNav sections={navSectionsFiltered} onNavigate={world.goToSection} />
      <TerminalTransition
        isTransitioning={world.isTransitioning}
        target={world.transitionTarget}
      />

      {/* Each WorldSlide is absolutely positioned — only the active one renders */}
      <div className="relative h-[calc(100vh-41px)] w-full">
        <WorldSlide
          id="hero"
          isActive={world.activeSection === "hero"}
          direction={world.direction}
          exitLabel="Merge & continue"
          onExit={world.goNext}
        >
          <WebflowGradient>
            <HeroDiff onMergeComplete={world.goNext} />
          </WebflowGradient>
        </WorldSlide>

        <WorldSlide
          id="projects"
          isActive={world.activeSection === "projects"}
          direction={world.direction}
          exitLabel="Next"
          onExit={world.goNext}
        >
          <div className="mx-auto max-w-6xl px-2.5 py-8 sm:px-4 sm:py-12">
            <ProjectsSection />
          </div>
        </WorldSlide>

        <WorldSlide
          id="code"
          isActive={world.activeSection === "code"}
          direction={world.direction}
          exitLabel="Continue"
          onExit={world.goNext}
        >
          <CodeEditorSection />
        </WorldSlide>

        <WorldSlide
          id="experience"
          isActive={world.activeSection === "experience"}
          direction={world.direction}
          exitLabel="Continue"
          onExit={world.goNext}
        >
          <div className="mx-auto max-w-2xl px-4 py-16 sm:max-w-3xl sm:py-24 lg:max-w-4xl">
            <WorldEntrance delay={0.1}>
              <div className="mb-6">
                <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/50">
                  Experience
                </div>
              </div>
            </WorldEntrance>
            <WorldEntrance delay={0.3}>
              <ExperienceThemeSwitcher experiences={experience} />
            </WorldEntrance>
          </div>
        </WorldSlide>

        <WorldSlide
          id="contact"
          isActive={world.activeSection === "contact"}
          direction={world.direction}
        >
          <VercelGrid>
            <SiteFooter />
          </VercelGrid>
        </WorldSlide>
      </div>
    </div>
  );
}
