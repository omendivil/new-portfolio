"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";

import type { Project } from "@/data/types";
import { filterProjects, getFeaturedProjects, getProjectCategories } from "@/data/project-utils";
import { trackBrowseDrawer, trackProjectClose, trackProjectOpen } from "@/lib/analytics";
import { useProjectStore } from "@/lib/use-project-store";

import dynamic from "next/dynamic";

import { ProjectsCanvasSection } from "./projects-canvas-section";

const ProjectPeekPanel = dynamic(() =>
  import("./project-peek-panel").then((mod) => ({ default: mod.ProjectPeekPanel })),
);
const ProjectsBrowseDrawer = dynamic(() =>
  import("./projects-browse-drawer").then((mod) => ({ default: mod.ProjectsBrowseDrawer })),
);

type ProjectsSectionClientProps = {
  projects: Project[];
};

export function ProjectsSectionClient({ projects }: ProjectsSectionClientProps) {
  const drawerTriggerRef = useRef<HTMLButtonElement>(null);
  const panelReturnFocusRef = useRef<HTMLElement | null>(null);

  // Store selectors — each component only re-renders for the slice it reads
  const isDrawerOpen = useProjectStore((s) => s.isDrawerOpen);
  const query = useProjectStore((s) => s.query);
  const selectedCategory = useProjectStore((s) => s.selectedCategory);
  const selectedProjectId = useProjectStore((s) => s.selectedProjectId);
  const openDrawerAction = useProjectStore((s) => s.openDrawer);
  const closeDrawerAction = useProjectStore((s) => s.closeDrawer);
  const openProjectAction = useProjectStore((s) => s.openProject);
  const closeProjectAction = useProjectStore((s) => s.closeProject);
  const setQuery = useProjectStore((s) => s.setQuery);
  const setSelectedCategory = useProjectStore((s) => s.setSelectedCategory);

  const featuredProjects = useMemo(() => getFeaturedProjects(projects).slice(0, 4), [projects]);
  const categories = useMemo(
    () => ["All", ...getProjectCategories(projects)] as Array<typeof selectedCategory>,
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
    closeDrawerAction();
    drawerTriggerRef.current?.focus();
    trackBrowseDrawer(false);
  }, [closeDrawerAction]);

  const handleCloseProject = useCallback(() => {
    if (selectedProjectId) {
      trackProjectClose(selectedProjectId);
    }
    closeProjectAction();
    panelReturnFocusRef.current?.focus();
  }, [selectedProjectId, closeProjectAction]);

  const openDrawer = useCallback(() => {
    openDrawerAction();
    trackBrowseDrawer(true);
  }, [openDrawerAction]);

  const handleOpenProject = useCallback(
    (
      projectId: string,
      trigger: HTMLElement | null,
      source: "drawer" | "featured" = "featured",
    ) => {
      if (source === "drawer") {
        panelReturnFocusRef.current = drawerTriggerRef.current;
        trackBrowseDrawer(false);
      } else {
        panelReturnFocusRef.current = trigger;
      }
      openProjectAction(projectId);
      trackProjectOpen(projectId, { source });
    },
    [openProjectAction],
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

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
      <ProjectsCanvasSection
        drawerTriggerRef={drawerTriggerRef}
        onOpenDrawer={openDrawer}
        projectCount={projectCount}
        projects={featuredProjects}
      />

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
