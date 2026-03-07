"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import type { NavSection } from "@/data/types";
import { pillTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { useActiveSection } from "./use-active-section";

type StickyNavProps = {
  sections: NavSection[];
};

export function StickyNav({ sections }: StickyNavProps) {
  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );
  const { activeSection, setActiveSection } = useActiveSection(sectionIds);

  return (
    <nav
      className="sticky top-4 z-30"
      aria-label="Section navigation"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-[1.5rem] border border-border/90 bg-background/88 px-3 py-3 shadow-[0_12px_40px_rgba(17,16,13,0.08)] backdrop-blur sm:px-4">
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "relative inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-text" : "text-muted hover:text-text",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive ? (
                  <motion.span
                    layoutId="active-nav-pill"
                    transition={pillTransition}
                    className="absolute inset-0 rounded-full border border-border bg-surface shadow-sm"
                  />
                ) : null}
                <span className="relative z-10">{section.label}</span>
              </a>
            );
          })}
        </div>
        <ThemeToggle className="shrink-0" />
      </div>
    </nav>
  );
}
