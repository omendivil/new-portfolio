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
  const projectCount = siteContent.projects.length;
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
        <div className="surface-card overflow-hidden rounded-[1.9rem] p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)] xl:items-start">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                Curated showcase
              </span>
              <p className="max-w-3xl text-sm leading-7 text-muted sm:text-[0.96rem]">
                Featured work is presented like a product shelf: deliberate posters up front,
                structured browsing behind a drawer, and demo video only after a project is opened.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-border/70 bg-surface-2/70 px-3 py-1 text-xs text-muted">
                  {featuredProjects.length} featured projects
                </span>
                <span className="rounded-full border border-border/70 bg-surface-2/70 px-3 py-1 text-xs text-muted">
                  {categories.length - 1} categories
                </span>
                <span className="rounded-full border border-border/70 bg-surface-2/70 px-3 py-1 text-xs text-muted">
                  Video stays inside the peek panel
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[1.35rem] border border-border/70 bg-surface-2/55 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">Default view</p>
                <p className="mt-2 text-sm leading-6 text-text">Poster-first and intentionally curated.</p>
              </div>
              <div className="rounded-[1.35rem] border border-border/70 bg-surface-2/55 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">Browse mode</p>
                <p className="mt-2 text-sm leading-6 text-text">
                  Lightweight rows with search and category filtering.
                </p>
              </div>
              <button
                ref={drawerTriggerRef}
                type="button"
                onClick={openDrawer}
                className="inline-flex min-h-[5.5rem] items-center justify-center gap-2 rounded-[1.35rem] bg-text px-5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
              >
                <PanelsTopLeft className="h-4 w-4" />
                Browse all {projectCount} projects
              </button>
            </div>
          </div>
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
