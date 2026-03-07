"use client";

import { PanelsTopLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FeaturedProjects } from "@/components/projects/featured-projects";
import { ProjectPeekPanel } from "@/components/projects/project-peek-panel";
import { ProjectsBrowseDrawer } from "@/components/projects/projects-browse-drawer";
import { SectionHeading } from "@/components/sections/section-heading";
import {
  filterProjects,
  getFeaturedProjects,
  getProjectCategories,
  siteContent,
} from "@/data/site";
import type { ProjectCategory } from "@/data/types";
import { trackBrowseDrawer, trackProjectClose, trackProjectOpen } from "@/lib/analytics";

export function ProjectsSection() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const panelReturnFocusRef = useRef<HTMLElement | null>(null);

  const featuredProjects = useMemo(() => getFeaturedProjects(siteContent.projects).slice(0, 4), []);
  const categories = useMemo(() => ["All", ...getProjectCategories(siteContent.projects)], []);
  const filteredProjects = useMemo(
    () => filterProjects(siteContent.projects, query, selectedCategory),
    [query, selectedCategory],
  );
  const selectedProject = useMemo(
    () => siteContent.projects.find((project) => project.id === selectedProjectId) ?? null,
    [selectedProjectId],
  );

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    drawerTriggerRef.current?.focus();
    trackBrowseDrawer(false);
  }, []);

  const handleCloseProject = useCallback(() => {
    if (selectedProjectId) {
      trackProjectClose(selectedProjectId);
    }

    setSelectedProjectId(null);
    panelReturnFocusRef.current?.focus();
  }, [selectedProjectId]);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
    trackBrowseDrawer(true);
  }, []);

  const handleOpenProject = useCallback((projectId: string, trigger: HTMLElement | null) => {
    panelReturnFocusRef.current = trigger;
    setSelectedProjectId(projectId);
    trackProjectOpen(projectId);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      if (selectedProjectId) {
        event.preventDefault();
        handleCloseProject();
        return;
      }

      if (isDrawerOpen) {
        event.preventDefault();
        closeDrawer();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDrawer, handleCloseProject, isDrawerOpen, selectedProjectId]);

  return (
    <section id="projects" className="section-anchor section-grid gap-y-8 py-2 sm:py-4">
      <SectionHeading
        eyebrow="Projects"
        title="Featured work up front, deeper browsing on demand"
        description="The home view stays curated. A bottom drawer handles search and category filtering, while the right-side peek panel carries the deeper context and lazy video media."
      />

      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-border/70 bg-surface-2/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-2xl text-sm leading-7 text-muted">
            Start with the featured poster deck, then open the browse drawer for the full list. Videos stay out of the deck and list until a project is explicitly opened.
          </p>
          <button
            ref={drawerTriggerRef}
            type="button"
            onClick={openDrawer}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-text px-5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            <PanelsTopLeft className="h-4 w-4" />
            View all projects
          </button>
        </div>

        <FeaturedProjects onOpenProject={handleOpenProject} projects={featuredProjects} />
      </div>

      <ProjectsBrowseDrawer
        categories={categories}
        isOpen={isDrawerOpen}
        onCategoryChange={(category) => setSelectedCategory(category as ProjectCategory | "All")}
        onClose={closeDrawer}
        onOpenProject={handleOpenProject}
        onQueryChange={setQuery}
        projects={filteredProjects}
        query={query}
        selectedCategory={selectedCategory}
      />

      <ProjectPeekPanel
        key={selectedProject?.id ?? "project-panel"}
        isOpen={Boolean(selectedProject)}
        onClose={handleCloseProject}
        project={selectedProject}
      />
    </section>
  );
}
