"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";

import { ProjectFilterPills } from "@/components/projects/project-filter-pills";
import { ProjectRow } from "@/components/projects/project-row";
import { groupProjectsByCategory } from "@/data/project-utils";
import type { Project, ProjectCategory } from "@/data/types";
import { drawerMotion, useMotionPreference } from "@/lib/motion";
import { useModalBehavior } from "@/lib/use-modal-behavior";

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
  categories: Array<ProjectCategory | "All">;
  isOpen: boolean;
  onCategoryChange: (category: ProjectCategory | "All") => void;
  onClose: () => void;
  onOpenProject: (
    projectId: string,
    trigger: HTMLElement | null,
    source?: "drawer" | "featured",
  ) => void;
  onQueryChange: (query: string) => void;
  projects: Project[];
  query: string;
  selectedCategory: ProjectCategory | "All";
}) {
  const drawerRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const { reduceMotion } = useMotionPreference();
  const groupedProjects = groupProjectsByCategory(projects);
  const resultsLabel = `${projects.length} ${projects.length === 1 ? "result" : "results"}`;

  useModalBehavior({
    containerRef: drawerRef,
    isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.div
            onClick={onClose}
            className="fixed inset-0 z-30 bg-background/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.22 }}
          />

          <motion.section
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="projects-browse-title"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={drawerMotion(reduceMotion)}
            tabIndex={-1}
            className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-5 sm:pb-5"
          >
            <div className="surface-card mx-auto flex max-h-[78vh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem]">
              <div className="border-b border-border/70 px-4 py-4 sm:px-5 sm:py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.28em] text-muted">Browse projects</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3
                        id="projects-browse-title"
                        className="text-xl font-semibold tracking-[-0.03em] text-text"
                      >
                        Browse the full project shelf
                      </h3>
                      <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs text-muted">
                        {resultsLabel}
                      </span>
                    </div>
                    <p className="max-w-3xl text-sm leading-7 text-muted">
                      Search by title, summary, role, or tag, then open any result into the existing
                      peek panel. Posters and demo media stay out of the drawer itself.
                    </p>
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
              </div>

              <div className="grid min-h-0 gap-5 px-4 py-4 lg:grid-cols-[minmax(280px,0.78fr)_minmax(0,1fr)] sm:px-5 sm:py-5">
                <aside className="space-y-4 lg:sticky lg:top-0">
                  <label className="relative block">
                    <span className="sr-only">Search projects</span>
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    <input
                      ref={searchRef}
                      type="search"
                      value={query}
                      onChange={(event) => onQueryChange(event.target.value)}
                      placeholder="Search by title, summary, role, or tag"
                      className="h-12 w-full rounded-full border border-border/70 bg-background/76 pl-11 pr-4 text-sm text-text placeholder:text-muted"
                    />
                  </label>

                  <div className="rounded-[1.5rem] border border-border/70 bg-surface-2/55 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                          Active scope
                        </p>
                        <p className="mt-2 text-sm font-medium text-text">
                          {selectedCategory === "All" ? "All categories" : selectedCategory}
                        </p>
                      </div>
                      <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs text-muted">
                        {resultsLabel}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      Rows stay intentionally lightweight so the drawer remains fast. Rich media only
                      enters when a project is opened.
                    </p>
                  </div>

                  <ProjectFilterPills
                    categories={categories}
                    onChange={onCategoryChange}
                    selectedCategory={selectedCategory}
                  />
                </aside>

                <div className="min-h-0 overflow-y-auto pr-1">
                  {projects.length === 0 ? (
                    <div className="rounded-[1.4rem] border border-dashed border-border/70 bg-surface-2/60 px-5 py-8 text-sm leading-7 text-muted">
                      No projects match the current search and filter combination.
                    </div>
                  ) : (
                    <div className="space-y-5 pb-2">
                      {groupedProjects.map((group) => (
                        <section key={group.category} className="space-y-3">
                          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-full border border-border/70 bg-background/92 px-3 py-2 backdrop-blur">
                            <p className="text-xs uppercase tracking-[0.28em] text-muted">
                              {group.category}
                            </p>
                            <p className="text-xs text-muted">{group.projects.length} items</p>
                          </div>
                          <div className="grid gap-3">
                            {group.projects.map((project) => (
                              <ProjectRow key={project.id} project={project} onOpen={onOpenProject} />
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.section>
        </>
      ) : null}
    </AnimatePresence>
  );
}
