"use client";

import { motion } from "framer-motion";

import { pillTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ProjectFilterPills({
  categories,
  onChange,
  selectedCategory,
}: {
  categories: string[];
  onChange: (category: string) => void;
  selectedCategory: string;
}) {
  return (
    <div
      role="toolbar"
      aria-label="Filter projects by category"
      className="rounded-[1.35rem] border border-border/70 bg-surface-2/55 p-1.5"
    >
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = category === selectedCategory;

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange(category)}
              className={cn(
                "relative inline-flex h-10 items-center rounded-[0.95rem] px-4 text-sm font-medium transition-colors",
                isActive
                  ? "text-text"
                  : "border border-transparent text-muted hover:border-border/70 hover:bg-background/72 hover:text-text",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId="project-filter-pill"
                  transition={pillTransition}
                  className="surface-pill absolute inset-0 rounded-[0.95rem] border border-border/70 bg-background/90"
                />
              ) : null}
              <span className="relative z-10">{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
