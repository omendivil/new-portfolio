"use client";

import { motion } from "framer-motion";
import { PanelsTopLeft } from "lucide-react";
import { type RefObject, useMemo, useState } from "react";

import type { Project } from "@/data/types";
import { pillTransition, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { ProjectLivePreview } from "./project-live-preview";

export function FeaturedProjects({
  drawerTriggerRef,
  onOpenDrawer,
  projectCount,
  projects,
}: {
  drawerTriggerRef: RefObject<HTMLButtonElement | null>;
  onOpenDrawer: () => void;
  projectCount: number;
  projects: Project[];
}) {
  const { reduceMotion } = useMotionPreference();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects[0]?.id ?? null);

  const activeProject = useMemo(() => {
    if (!projects.length) {
      return null;
    }

    return projects.find((project) => project.id === activeProjectId) ?? projects[0];
  }, [activeProjectId, projects]);

  if (!activeProject) {
    return null;
  }

  return (
    <div className="space-y-6">
      <ProjectLivePreview project={activeProject} />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">
          Projects
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {projects.map((project) => {
            const isActive = project.id === activeProject.id;

            return (
              <button
                key={project.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveProjectId(project.id)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-text"
                    : "text-muted hover:text-text",
                )}
              >
                {isActive && !reduceMotion ? (
                  <motion.span
                    layoutId="project-pill-active"
                    transition={pillTransition}
                    className="absolute inset-0 rounded-full border border-border bg-surface"
                  />
                ) : isActive ? (
                  <span className="absolute inset-0 rounded-full border border-border bg-surface" />
                ) : null}
                <span className="relative z-10">{project.title}</span>
              </button>
            );
          })}

          <span className="mx-1 h-4 w-px bg-border/70" />

          <button
            ref={drawerTriggerRef}
            type="button"
            onClick={onOpenDrawer}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-text"
          >
            <PanelsTopLeft className="h-3.5 w-3.5" />
            All {projectCount}
          </button>
        </div>
      </div>
    </div>
  );
}
