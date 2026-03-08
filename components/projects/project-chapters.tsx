"use client";

import type { ProjectChapter } from "@/data/types";
import { cn } from "@/lib/utils";

function formatTimestamp(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
}

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
      <p className="text-xs uppercase tracking-[0.28em] text-muted">Guided scenes</p>
      <div className="grid gap-3">
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === activeChapterId;

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => onSelect(chapter)}
              aria-pressed={isActive}
              className={cn(
                "rounded-[1.25rem] border px-4 py-4 text-left transition-colors",
                isActive
                  ? "border-accent/35 bg-accent-soft/78"
                  : "border-border/70 bg-surface/74 hover:border-accent/20 hover:bg-accent-soft/44",
              )}
            >
              <div className="flex items-start gap-3.5">
                <span
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-medium uppercase tracking-[0.18em]",
                    isActive
                      ? "border-accent/35 bg-background/72 text-text"
                      : "border-border/70 bg-background/70 text-muted",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                        Scene {String(index + 1).padStart(2, "0")}
                      </p>
                      <p className="mt-1 text-sm font-medium text-text">{chapter.label}</p>
                    </div>
                    <span className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-muted">
                      {formatTimestamp(chapter.atSeconds)}
                    </span>
                  </div>
                  {chapter.description ? (
                    <p className="mt-1 text-sm leading-6 text-muted">{chapter.description}</p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
