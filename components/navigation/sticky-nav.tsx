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
      className="sticky top-3 z-30 sm:top-4"
      aria-label="Section navigation"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-start gap-3 rounded-[1.35rem] border border-border/90 bg-background/88 px-2.5 py-2.5 shadow-[0_12px_40px_rgba(17,16,13,0.08)] backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-4 sm:rounded-[1.5rem] sm:px-4 sm:py-3">
        <div className="nav-scroll-edge flex min-w-0 flex-wrap items-center gap-1.5 sm:flex-nowrap sm:overflow-x-auto sm:pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "relative inline-flex min-h-11 shrink-0 items-center rounded-full px-3.5 py-2 text-[0.8rem] font-medium whitespace-nowrap transition-colors sm:px-4 sm:text-sm",
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
        <ThemeToggle className="h-11 w-11 shrink-0 justify-self-end self-start sm:self-auto" />
      </div>
    </nav>
  );
}
