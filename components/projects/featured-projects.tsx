"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PanelsTopLeft } from "lucide-react";
import { type RefObject, useMemo, useState } from "react";

import type { Project } from "@/data/types";
import { motionEase, pillTransition, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { ProjectLivePreview } from "./project-live-preview";

const headingVariants = {
  enter: { opacity: 0, y: 8 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const headingTransition = {
  duration: 0.3,
  ease: motionEase,
};

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
      <div className="h-[11rem] overflow-hidden sm:h-[9.5rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProject.id}
            variants={reduceMotion ? undefined : headingVariants}
            initial={reduceMotion ? false : "enter"}
            animate="center"
            exit={reduceMotion ? undefined : "exit"}
            transition={reduceMotion ? { duration: 0 } : headingTransition}
            className="space-y-2.5 sm:space-y-3"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted sm:text-xs">
                Projects
              </p>
              <span className="text-[0.62rem] text-muted/50">·</span>
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-muted sm:text-xs">
                {activeProject.role}
              </p>
            </div>

            <h2 className="max-w-3xl text-balance text-[clamp(1.9rem,7vw,3rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-text sm:text-4xl">
              {activeProject.title}
            </h2>

            <p className="max-w-2xl text-pretty text-[0.98rem] leading-7 text-muted sm:text-lg sm:leading-8">
              {activeProject.oneLiner}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <ProjectLivePreview project={activeProject} />

      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.28em] text-muted">
          Projects
        </p>

        <div className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-x-visible sm:px-0">
          {projects.map((project) => {
            const isActive = project.id === activeProject.id;

            return (
              <button
                key={project.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveProjectId(project.id)}
                className={cn(
                  "relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors",
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
      </div>
    </div>
  );
}
