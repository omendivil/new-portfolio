import type { Project } from "@/data/types";

import { ProjectPoster } from "./project-poster";

export function FeaturedProjects({
  onOpenProject,
  projects,
}: {
  onOpenProject: (projectId: string, trigger: HTMLElement | null) => void;
  projects: Project[];
}) {
  return (
    <div className="-mx-1 overflow-x-auto pb-2">
      <div className="grid min-w-max auto-cols-[minmax(280px,1fr)] grid-flow-col gap-4 px-1 sm:auto-cols-[minmax(360px,1fr)] lg:auto-cols-[minmax(420px,1fr)]">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={(event) => onOpenProject(project.id, event.currentTarget)}
            className="group surface-card flex h-full min-h-[22rem] snap-start flex-col overflow-hidden rounded-[1.8rem] text-left transition-transform hover:-translate-y-1"
          >
            <ProjectPoster
              project={project}
              priority={index === 0}
              sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 36vw, (min-width: 640px) 54vw, 100vw"
            />
            <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.28em] text-muted">{project.category}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-muted">{project.year}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold tracking-tight text-text">{project.title}</h3>
                <p className="text-sm leading-7 text-muted">{project.oneLiner}</p>
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                {project.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-border/70 bg-surface-2/80 px-3 py-1 text-xs text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
