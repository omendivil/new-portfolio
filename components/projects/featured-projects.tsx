"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CircleDot } from "lucide-react";
import { useMemo, useState } from "react";

import type { Project } from "@/data/types";
import { createHoverMotion, pillTransition, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { ProjectLivePreview } from "./project-live-preview";

export function FeaturedProjects({
  onOpenProject,
  projects,
}: {
  onOpenProject: (
    projectId: string,
    trigger: HTMLElement | null,
    source?: "drawer" | "featured",
  ) => void;
  projects: Project[];
}) {
  const { reduceMotion } = useMotionPreference();
  const [activeProjectId, setActiveProjectId] = useState<string | null>(projects[0]?.id ?? null);
  const hoverMotion = createHoverMotion(reduceMotion, {
    hoverScale: 1.008,
    hoverY: -2,
    tapScale: 0.992,
  });

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
    <div className="space-y-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(320px,0.46fr)_minmax(0,0.54fr)] xl:items-stretch">
        <div className="surface-card rounded-[1.9rem] p-5 sm:p-6">
          <div className="flex h-full flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                Active showcase
              </span>
              <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-muted">
                {activeProject.year}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                {activeProject.demo.eyebrow}
              </p>
              <h3 className="text-balance text-2xl font-semibold tracking-[-0.04em] text-text sm:text-3xl">
                {activeProject.title}
              </h3>
              <p className="text-sm leading-7 text-muted sm:text-[0.96rem]">
                {activeProject.demo.summary}
              </p>
            </div>

            <div className="rounded-[1.35rem] border border-border/70 bg-surface-2/56 p-4">
              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                Why this preview matters
              </p>
              <p className="mt-2 text-sm leading-6 text-text">{activeProject.story[0].description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeProject.technicalThemes.slice(0, 3).map((theme) => (
                <span
                  key={theme}
                  className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs text-muted"
                >
                  {theme}
                </span>
              ))}
            </div>

            <div className="mt-auto">
              <button
                type="button"
                onClick={(event) => onOpenProject(activeProject.id, event.currentTarget, "featured")}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-text px-5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
              >
                Open project details
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <ProjectLivePreview project={activeProject} />
      </div>

      <div className="-mx-1 overflow-x-auto pb-1">
        <div className="flex min-w-max gap-3 px-1 xl:min-w-0 xl:flex-wrap">
          {projects.map((project) => {
            const isActive = project.id === activeProject.id;
            const hasVideo = project.videos.length > 0;

            return (
              <motion.button
                key={project.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveProjectId(project.id)}
                transition={hoverMotion.transition}
                whileHover={hoverMotion.whileHover}
                whileTap={hoverMotion.whileTap}
                className={cn(
                  "relative min-w-[17rem] overflow-hidden rounded-[1.4rem] border border-border/70 bg-surface/78 p-3.5 text-left xl:min-w-[15rem] xl:flex-1",
                  isActive && "bg-accent-soft/58",
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="featured-project-active-card"
                    transition={pillTransition}
                    className="absolute inset-0 rounded-[1.4rem] border border-accent/18 bg-accent-soft/66"
                  />
                ) : null}

                <div className="relative z-10 flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[0.95rem] border border-border/70 bg-surface">
                    <Image
                      src={project.poster.url}
                      alt={project.poster.alt}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-base font-semibold tracking-[-0.03em] text-text">
                        {project.title}
                      </p>
                      <span className="rounded-full border border-border/70 bg-background/70 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-muted">
                        {project.category}
                      </span>
                    </div>

                    <p className="mt-1.5 truncate text-sm leading-6 text-muted">{project.demo.title}</p>

                    <div className="mt-2.5 flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-muted">
                      {hasVideo ? <CircleDot className="h-3.5 w-3.5" /> : null}
                      <span>{hasVideo ? "Autoplay preview" : "Poster fallback"}</span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
