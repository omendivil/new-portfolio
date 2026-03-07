"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { ProjectFilterPills } from "@/components/projects/project-filter-pills";
import { ProjectRow } from "@/components/projects/project-row";
import { groupProjectsByCategory } from "@/data/site";
import type { Project } from "@/data/types";
import { drawerMotion, useMotionPreference } from "@/lib/motion";

export function ProjectsBrowseDrawer({
  categories,
  isOpen,
  onCategoryChange,
  onClose,
  onOpenProject,
  onQueryChange,
  projects,
  query,
  selectedCategory,
}: {
  categories: string[];
  isOpen: boolean;
  onCategoryChange: (category: string) => void;
  onClose: () => void;
  onOpenProject: (projectId: string, trigger: HTMLElement | null) => void;
  onQueryChange: (query: string) => void;
  projects: Project[];
  query: string;
  selectedCategory: string;
}) {
  const searchRef = useRef<HTMLInputElement>(null);
  const { reduceMotion } = useMotionPreference();
  const groupedProjects = groupProjectsByCategory(projects);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.section
          role="region"
          aria-label="Project browser"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={drawerMotion(reduceMotion)}
          className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 sm:px-5 sm:pb-5"
        >
          <div className="surface-card mx-auto flex max-h-[72vh] w-full max-w-6xl flex-col overflow-hidden rounded-[1.9rem] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/70 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-muted">Browse projects</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-text">Lightweight rows, full project context on demand</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="surface-pill inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:text-accent"
              >
                <span className="sr-only">Close project browser</span>
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(280px,0.8fr)_minmax(0,1fr)] lg:items-start">
              <div className="space-y-4">
                <label className="relative block">
                  <span className="sr-only">Search projects</span>
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="Search by title, summary, or tag"
                    className="h-12 w-full rounded-full border border-border/70 bg-surface-2/80 pl-11 pr-4 text-sm text-text placeholder:text-muted"
                  />
                </label>
                <ProjectFilterPills
                  categories={categories}
                  onChange={onCategoryChange}
                  selectedCategory={selectedCategory}
                />
              </div>

              <div className="min-h-0 overflow-y-auto pr-1">
                {projects.length === 0 ? (
                  <div className="rounded-[1.4rem] border border-dashed border-border/70 bg-surface-2/70 px-5 py-8 text-sm leading-7 text-muted">
                    No projects match the current search and filter combination.
                  </div>
                ) : (
                  <div className="space-y-5 pb-2">
                    {groupedProjects.map((group) => (
                      <div key={group.category} className="space-y-3">
                        <div className="flex items-center justify-between gap-3 px-1">
                          <p className="text-xs uppercase tracking-[0.28em] text-muted">{group.category}</p>
                          <p className="text-xs text-muted">{group.projects.length} items</p>
                        </div>
                        <div className="grid gap-3">
                          {group.projects.map((project) => (
                            <ProjectRow key={project.id} project={project} onOpen={onOpenProject} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}
