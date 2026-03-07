"use client";

import type { ProjectChapter } from "@/data/types";
import { cn } from "@/lib/utils";

export function ProjectChapters({
  activeChapterId,
  chapters,
  onSelect,
}: {
  activeChapterId?: string;
  chapters: ProjectChapter[];
  onSelect: (chapter: ProjectChapter) => void;
}) {
  if (chapters.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.28em] text-muted">Chapters</p>
      <div className="grid gap-2">
        {chapters.map((chapter) => {
          const isActive = chapter.id === activeChapterId;

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelect(chapter)}
              className={cn(
                "rounded-[1.1rem] border px-4 py-3 text-left transition-colors",
                isActive
                  ? "border-accent/35 bg-accent-soft"
                  : "border-border/70 bg-surface-2/80 hover:border-accent/20 hover:bg-accent-soft/60",
              )}
            >
              <p className="text-sm font-medium text-text">{chapter.label}</p>
              {chapter.description ? (
                <p className="mt-1 text-sm leading-6 text-muted">{chapter.description}</p>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
