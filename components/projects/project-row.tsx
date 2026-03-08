import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/data/types";

export function ProjectRow({
  project,
  onOpen,
}: {
  onOpen: (
    projectId: string,
    trigger: HTMLElement | null,
    source?: "drawer" | "featured",
  ) => void;
  project: Project;
}) {
  return (
    <button
      type="button"
      onClick={(event) => onOpen(project.id, event.currentTarget, "drawer")}
      className="group w-full rounded-[1.35rem] border border-border/70 bg-background/74 px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent-soft/45 sm:px-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
            <span>{project.category}</span>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
            <span>{project.year}</span>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
            <span>{project.status}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-base font-semibold tracking-[-0.03em] text-text sm:text-lg">
                  {project.title}
                </p>
                <p className="mt-1 text-sm leading-6 text-text/85">{project.demo.title}</p>
              </div>

              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-surface text-text transition-colors group-hover:border-accent/30 group-hover:bg-background">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>

            <p className="max-w-3xl text-sm leading-7 text-muted">{project.oneLiner}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
            <p className="truncate">{project.role}</p>
            {project.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-border/70 bg-surface px-3 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
