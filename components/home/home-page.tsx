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
    <div className="world-scroll-container">
      <a
        href="#hero"
        className="sr-only absolute left-3 top-3 z-40 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text focus:not-sr-only sm:left-4 sm:top-4"
      >
        Skip to content
      </a>
      <StickyNav sections={navSectionsFiltered} />
      <TerminalTransition
        isTransitioning={world.isTransitioning}
        target={world.transitionTarget}
      />

      <WorldSlide id="hero" exitLabel="Merge & continue" nextSectionId="projects">
        <WebflowGradient>
          <HeroDiff />
        </WebflowGradient>
      </WorldSlide>

      <WorldSlide id="projects" exitLabel="Next" nextSectionId="code" allowOverflow>
        <div className="mx-auto max-w-6xl px-2.5 py-8 sm:px-4 sm:py-12">
          <ProjectsSection />
        </div>
      </WorldSlide>

      <WorldSlide id="code" exitLabel="Continue" nextSectionId="experience">
        <CodeEditorSection />
      </WorldSlide>

      <WorldSlide id="experience" exitLabel="Continue" nextSectionId="contact" allowOverflow>
        <div className="mx-auto max-w-2xl px-4 py-16 sm:max-w-3xl sm:py-24 lg:max-w-4xl">
          <div className="mb-6">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/50">
              Experience
            </div>
          </div>
          <ExperienceThemeSwitcher experiences={experience} />
        </div>
      </WorldSlide>

      <WorldSlide id="contact">
        <VercelGrid>
          <SiteFooter />
        </VercelGrid>
      </WorldSlide>
    </div>
  );
}
