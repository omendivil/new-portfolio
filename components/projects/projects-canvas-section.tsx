"use client";

import { type RefObject, useState } from "react";
import { motion } from "framer-motion";
import { PanelsTopLeft } from "lucide-react";

import type { Project } from "@/data/types";
import { pillTransition, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { CanvasViewport } from "./canvas-viewport";
import { MobileGallery } from "./mobile-gallery";

type ProjectsCanvasSectionProps = {
  drawerTriggerRef: RefObject<HTMLButtonElement | null>;
  onOpenDrawer: () => void;
  projectCount: number;
  projects: Project[];
};

export function ProjectsCanvasSection({
  drawerTriggerRef,
  onOpenDrawer,
  projectCount,
  projects,
}: ProjectsCanvasSectionProps) {
  const { reduceMotion } = useMotionPreference();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(
    projects[0]?.id ?? null,
  );

  return (
    <div className="space-y-5">
      <div className="space-y-2.5">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted sm:text-xs">
          Projects
        </p>
        <p className="max-w-2xl text-pretty text-[0.92rem] leading-7 text-muted sm:text-base">
          Pan, zoom, and explore — or pick a project below.
        </p>
      </div>

      <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-x-visible sm:px-0">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;

          return (
            <button
              key={project.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveProjectId(project.id)}
              className={cn(
                "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive ? "text-text" : "text-muted hover:text-text",
              )}
            >
              {isActive && !reduceMotion ? (
                <motion.span
                  layoutId="canvas-pill-active"
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

        <span className="mx-1 h-4 w-px shrink-0 bg-border/70" />

        <button
          ref={drawerTriggerRef}
          type="button"
          onClick={onOpenDrawer}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-text"
        >
          <PanelsTopLeft className="h-3.5 w-3.5" />
          All {projectCount}
        </button>
      </div>

      <CanvasViewport
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        projects={projects}
      />

      <MobileGallery
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        projects={projects}
      />
    </div>
  );
}
