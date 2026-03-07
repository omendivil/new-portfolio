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
      <p className="text-xs uppercase tracking-[0.28em] text-muted">Chapters</p>
      <div className="grid gap-2">
        {chapters.map((chapter, index) => {
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
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[0.68rem] font-medium uppercase tracking-[0.18em]",
                    isActive
                      ? "border-accent/35 bg-background/72 text-text"
                      : "border-border/70 bg-background/70 text-muted",
                  )}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-text">{chapter.label}</p>
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
