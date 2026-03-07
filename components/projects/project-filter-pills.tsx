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
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category === selectedCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={cn(
              "relative inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors",
              isActive ? "text-text" : "surface-pill text-muted hover:text-text",
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="project-filter-pill"
                transition={pillTransition}
                className="absolute inset-0 rounded-full border border-border/70 bg-accent-soft"
              />
            ) : null}
            <span className="relative z-10">{category}</span>
          </button>
        );
      })}
    </div>
  );
}
