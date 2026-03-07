"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import type { Project } from "@/data/types";
import { useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { getProjectPresentation, ProjectPoster } from "./project-poster";

export function FeaturedProjects({
  onOpenProject,
  projects,
}: {
  onOpenProject: (projectId: string, trigger: HTMLElement | null) => void;
  projects: Project[];
}) {
  const { reduceMotion } = useMotionPreference();
  const [leadProject, ...supportingProjects] = projects;

  if (!leadProject) {
    return null;
  }

  const leadPresentation = getProjectPresentation(leadProject);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
      <motion.button
        type="button"
        onClick={(event) => onOpenProject(leadProject.id, event.currentTarget)}
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.005 }}
        className="group relative overflow-hidden rounded-[2rem] border border-border/70 bg-surface/78 p-4 text-left shadow-[0_24px_80px_-52px_rgba(17,16,13,0.34)] transition duration-300 hover:-translate-y-0.5 hover:border-accent/30 sm:p-5"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,111,102,0.08),transparent_42%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(138,201,189,0.12),transparent_42%)]" />
        <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1.02fr)_minmax(280px,0.98fr)] lg:items-stretch">
          <div className="order-2 flex h-full flex-col gap-4 lg:order-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                Featured selection
              </span>
              <span className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                {leadProject.category}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-text sm:text-3xl">
                  {leadProject.title}
                </h3>
                <span className="font-mono text-xs uppercase tracking-[0.22em] text-muted">
                  {leadProject.year}
                </span>
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted sm:text-[0.96rem]">
                {leadProject.summary}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.2rem] border border-border/70 bg-background/72 px-4 py-3">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">Role</p>
                <p className="mt-2 text-sm leading-6 text-text">{leadProject.role}</p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-background/72 px-4 py-3">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">Status</p>
                <p className="mt-2 text-sm leading-6 text-text">{leadProject.status}</p>
              </div>
              <div className="rounded-[1.2rem] border border-border/70 bg-background/72 px-4 py-3">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">Media</p>
                <p className="mt-2 text-sm leading-6 text-text">Poster here, demo in the peek panel.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {leadProject.highlights.slice(0, 2).map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-[1.2rem] border border-border/70 bg-surface-2/55 px-4 py-3 text-sm leading-6 text-muted"
                >
                  {highlight}
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {leadProject.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-text">
                Open project
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>

          <ProjectPoster
            className={cn(
              "order-1 h-full lg:order-2",
              leadPresentation === "device" && "justify-self-center lg:w-full lg:max-w-[20rem]",
            )}
            label="Curated preview"
            mediaClassName={leadPresentation === "canvas" ? "min-h-[18rem] lg:h-full lg:aspect-auto" : undefined}
            presentation={leadPresentation}
            priority
            project={leadProject}
            sizes="(min-width: 1280px) 34vw, (min-width: 1024px) 42vw, 100vw"
          />
        </div>
      </motion.button>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        {supportingProjects.map((project, index) => (
          <motion.button
            key={project.id}
            type="button"
            onClick={(event) => onOpenProject(project.id, event.currentTarget)}
            whileHover={reduceMotion ? undefined : { y: -4, scale: 1.005 }}
            className={cn(
              "group relative overflow-hidden rounded-[1.7rem] border border-border/70 bg-surface/72 p-4 text-left transition duration-300 hover:-translate-y-0.5 hover:border-accent/28",
              index === supportingProjects.length - 1 ? "xl:min-h-[18.75rem]" : undefined,
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,111,102,0.06),transparent_40%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(138,201,189,0.1),transparent_40%)]" />
            <div className="relative grid gap-4 sm:grid-cols-[minmax(150px,0.85fr)_minmax(0,1fr)] xl:grid-cols-1">
              <ProjectPoster
                className={cn(
                  "border-0 bg-transparent p-0 shadow-none",
                  getProjectPresentation(project) === "device" && "sm:max-w-[11rem] xl:max-w-[13rem]",
                )}
                label="Poster"
                mediaClassName={
                  getProjectPresentation(project) === "canvas"
                    ? "aspect-[4/3] sm:aspect-[1.08] xl:aspect-[4/3]"
                    : undefined
                }
                presentation={getProjectPresentation(project)}
                project={project}
                sizes="(min-width: 1280px) 24vw, (min-width: 640px) 30vw, 100vw"
              />

              <div className="flex h-full flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                    {project.category}
                  </p>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    {project.year}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold tracking-[-0.03em] text-text">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted">{project.oneLiner}</p>
                </div>

                <div className="rounded-[1.1rem] border border-border/70 bg-background/68 px-4 py-3 text-sm leading-6 text-muted">
                  {project.highlights[0]}
                </div>

                <div className="mt-auto flex flex-wrap items-center gap-2">
                  {project.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-text">
                    Open
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
