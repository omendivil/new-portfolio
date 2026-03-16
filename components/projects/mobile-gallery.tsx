"use client";

import Image from "next/image";

import type { Project } from "@/data/types";

type MobileGalleryProps = {
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  projects: Project[];
};

export function MobileGallery({
  activeProjectId,
  onSelectProject,
  projects,
}: MobileGalleryProps) {
  return (
    <div className="sm:hidden">
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => onSelectProject(project.id)}
            className={`w-[85vw] max-w-[20rem] flex-shrink-0 snap-center rounded-2xl border p-3 text-left transition-colors ${
              project.id === activeProjectId
                ? "border-text/20 bg-surface/80"
                : "border-border/40 bg-surface/30"
            }`}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-black">
              <Image
                src={project.poster.url}
                alt={project.poster.alt}
                fill
                sizes="85vw"
                className="object-cover"
              />
            </div>
            <div className="mt-3 space-y-1.5">
              <h3 className="text-sm font-semibold text-text">{project.title}</h3>
              <p className="line-clamp-2 text-xs leading-relaxed text-muted">{project.oneLiner}</p>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {project.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-border/60 bg-surface/50 px-2 py-0.5 text-[0.6rem] font-medium text-muted"
                  >
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
