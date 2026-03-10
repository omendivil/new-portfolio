"use client";

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
      <FeaturedProjects
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
