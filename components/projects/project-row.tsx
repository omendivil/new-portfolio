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
      className="group grid w-full gap-3 rounded-[1.2rem] border border-border/70 bg-surface-2/80 px-4 py-4 text-left transition-colors hover:border-accent/35 hover:bg-accent-soft/60"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-text">{project.title}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{project.oneLiner}</p>
        </div>
        <span className="rounded-full border border-border/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-muted">
          {project.category}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {project.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-background/70 px-3 py-1 text-xs text-muted">
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}
