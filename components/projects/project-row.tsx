import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/data/types";

export function ProjectRow({
  project,
  onOpen,
}: {
  onOpen: (projectId: string, trigger: HTMLElement | null) => void;
  project: Project;
}) {
  return (
    <button
      type="button"
      onClick={(event) => onOpen(project.id, event.currentTarget)}
      className="group grid w-full gap-4 rounded-[1.35rem] border border-border/70 bg-background/74 px-4 py-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent-soft/45 sm:grid-cols-[84px_minmax(0,1fr)] sm:px-5"
    >
      <div className="relative hidden h-20 w-20 overflow-hidden rounded-[1rem] border border-border/70 bg-surface sm:block">
        <Image
          src={project.poster.url}
          alt={project.poster.alt}
          fill
          sizes="80px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
            <span>{project.category}</span>
            <span className="h-1 w-1 rounded-full bg-border" aria-hidden="true" />
            <span>{project.year}</span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-base font-semibold tracking-[-0.03em] text-text sm:text-lg">
                {project.title}
              </p>
              <span className="rounded-full border border-border/70 bg-surface px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-muted">
                {project.status}
              </span>
            </div>
            <p className="max-w-3xl text-sm leading-7 text-muted">{project.oneLiner}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-surface px-3 py-1 text-xs text-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:min-w-[15rem] lg:flex-col lg:items-end">
          <p className="max-w-sm text-sm leading-6 text-muted lg:text-right">{project.role}</p>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-surface text-text transition-colors group-hover:border-accent/30 group-hover:bg-background">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </button>
  );
}
