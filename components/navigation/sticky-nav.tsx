"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import type { NavSection, NavSectionId } from "@/data/types";
import { motionEase } from "@/lib/motion";
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = useCallback(
    (id: NavSectionId) => {
      setActiveSection(id);
      setMobileOpen(false);
    },
    [setActiveSection],
  );

  return (
    <nav
      className="sticky top-0 z-30"
      aria-label="Section navigation"
    >
      <div className="bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          {/* Desktop: Terminal breadcrumb */}
          <div className="hidden items-center gap-0 font-mono text-sm sm:flex">
            <span className="text-accent font-medium">~/omar</span>
            <span className="mx-2 text-muted/40">›</span>

            {sections.map((section, i) => {
              const isActive = activeSection === section.id;

              return (
                <span key={section.id} className="flex items-center">
                  {i > 0 && (
                    <span className="mx-2 text-muted/30">/</span>
                  )}
                  <a
                    href={`#${section.id}`}
                    onClick={() => handleNavClick(section.id)}
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
                    <span className="ml-0.5 inline-block h-[15px] w-[1.5px] animate-pulse bg-accent" />
                  )}
                </span>
              );
            })}
          </div>

          {/* Mobile: Logo + hamburger */}
          <div className="flex items-center sm:hidden">
            <span className="font-mono text-sm font-medium text-accent">~/omar</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle className="h-8 w-8 shrink-0" />

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border/40 text-muted transition-colors hover:text-text sm:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: motionEase }}
            className="overflow-hidden border-b border-border/30 bg-background/95 backdrop-blur-md sm:hidden"
          >
            <div className="px-4 py-3 font-mono text-sm">
              <div className="mb-2 text-[11px] text-muted/40">$ ls sections/</div>
              {sections.map((section, i) => {
                const isActive = activeSection === section.id;

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.2, ease: motionEase }}
                  >
                    <a
                      href={`#${section.id}`}
                      onClick={() => handleNavClick(section.id)}
                      className={cn(
                        "flex items-center gap-2 py-2 transition-colors",
                        isActive
                          ? "font-medium text-text"
                          : "text-muted/60 hover:text-text",
                      )}
                    >
                      <span className="text-accent/60">›</span>
                      {section.label.toLowerCase()}
                      {isActive && (
                        <span className="inline-block h-[13px] w-[1.5px] animate-pulse bg-accent" />
                      )}
                    </a>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
