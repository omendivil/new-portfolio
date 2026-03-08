"use client";

import { PanelsTopLeft } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { Project, ProjectCategory } from "@/data/types";
import { filterProjects, getFeaturedProjects, getProjectCategories } from "@/data/project-utils";
import { trackBrowseDrawer, trackProjectClose, trackProjectOpen } from "@/lib/analytics";

import { FeaturedProjects } from "./featured-projects";
import { ProjectPeekPanel } from "./project-peek-panel";
import { ProjectsBrowseDrawer } from "./projects-browse-drawer";

type ProjectsSectionClientProps = {
  projects: Project[];
};

export function ProjectsSectionClient({ projects }: ProjectsSectionClientProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | "All">("All");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const panelReturnFocusRef = useRef<HTMLElement | null>(null);
  const featuredProjects = useMemo(() => getFeaturedProjects(projects).slice(0, 4), [projects]);
  const categories = useMemo(
    () => ["All", ...getProjectCategories(projects)] as Array<ProjectCategory | "All">,
    [projects],
  );
  const projectCount = projects.length;

  const filteredProjects = useMemo(
    () => filterProjects(projects, query, selectedCategory),
    [projects, query, selectedCategory],
  );
  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
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

  const handleOpenProject = useCallback(
    (
      projectId: string,
      trigger: HTMLElement | null,
      source: "drawer" | "featured" = "featured",
    ) => {
      if (source === "drawer") {
        panelReturnFocusRef.current = drawerTriggerRef.current;
        setIsDrawerOpen(false);
        trackBrowseDrawer(false);
      } else {
        panelReturnFocusRef.current = trigger;
      }

      setSelectedProjectId(projectId);
      trackProjectOpen(projectId, { source });
    },
    [],
  );

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
    <>
      <div className="space-y-5">
        <div className="surface-card overflow-hidden rounded-[1.9rem] p-5 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(300px,0.92fr)] xl:items-start">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                Curated showcase
              </span>
              <p className="max-w-3xl text-sm leading-7 text-muted sm:text-[0.96rem]">
                The first layer is now about motion and presence. If a featured project has a demo,
                it starts playing in the stage as soon as the preview is on screen. Projects
                without video fall back to a designed still.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border border-border/70 bg-surface-2/70 px-3 py-1 text-xs text-muted">
                  {featuredProjects.length} featured projects
                </span>
                <span className="rounded-full border border-border/70 bg-surface-2/70 px-3 py-1 text-xs text-muted">
                  {categories.length - 1} categories
                </span>
                <span className="rounded-full border border-border/70 bg-surface-2/70 px-3 py-1 text-xs text-muted">
                  Only the active stage loads preview media
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[1.35rem] border border-border/70 bg-surface-2/55 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                  Stage behavior
                </p>
                <p className="mt-2 text-sm leading-6 text-text">
                  Select a project to swap the live stage and immediately change the preview.
                </p>
              </div>
              <div className="rounded-[1.35rem] border border-border/70 bg-surface-2/55 p-4">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                  Panel behavior
                </p>
                <p className="mt-2 text-sm leading-6 text-text">
                  Open the panel for the full case-study breakdown, chapters, and deeper technical
                  framing.
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
        onCategoryChange={setSelectedCategory}
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
    </>
  );
}
