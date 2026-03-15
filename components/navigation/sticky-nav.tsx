"use client";

import { useMemo } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import type { NavSection } from "@/data/types";
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
      className="sticky top-0 z-30"
      aria-label="Section navigation"
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5">
        {/* Terminal breadcrumb */}
        <div className="flex items-center gap-0 font-mono text-[12px] sm:text-[13px]">
          <span className="text-accent">~/omar</span>
          <span className="mx-2 text-muted/40">›</span>

          {sections.map((section, i) => {
            const isActive = activeSection === section.id;

            return (
              <span key={section.id} className="flex items-center">
                {i > 0 && (
                  <span className="mx-1.5 text-muted/30 sm:mx-2">/</span>
                )}
                <a
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "font-medium text-text"
                      : "text-muted/50 hover:text-text",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {section.label.toLowerCase()}
                </a>
                {isActive && (
                  <span className="ml-0.5 inline-block h-[14px] w-[1.5px] animate-pulse bg-accent" />
                )}
              </span>
            );
          })}
        </div>

        {/* Theme toggle */}
        <ThemeToggle className="h-8 w-8 shrink-0 rounded-md border border-border/40 font-mono text-[10px]" />
      </div>
    </nav>
  );
}
