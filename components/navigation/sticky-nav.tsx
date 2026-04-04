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
  onNavigate?: (id: NavSectionId) => void;
};

export function StickyNav({ sections, onNavigate }: StickyNavProps) {
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
      onNavigate?.(id);
    },
    [setActiveSection, onNavigate],
  );

  return (
    <nav
      className="sticky -top-px z-30"
      aria-label="Section navigation"
    >
      {/* Terminal bar */}
      <div className="border-b border-border/30 bg-background/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6">

          {/* Left: terminal prompt + nav links (desktop) */}
          <div className="flex items-center">
            {/* Desktop breadcrumb */}
            <div className="hidden items-center font-mono text-[13px] sm:flex">
              <span className="font-medium text-accent">~/omar</span>
              <span className="mx-2 text-muted/40">›</span>

              {sections.map((section, i) => {
                const isActive = activeSection === section.id;

                return (
                  <span key={section.id} className="flex items-center">
                    {i > 0 && (
                      <span className="mx-2 text-muted/25">/</span>
                    )}
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => {
                        if (onNavigate) e.preventDefault();
                        handleNavClick(section.id);
                      }}
                      className={cn(
                        "transition-colors",
                        isActive
                          ? "font-medium text-text"
                          : "text-muted/45 hover:text-text",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {section.label.toLowerCase()}
                    </a>
                    {isActive && (
                      <span className="ml-0.5 inline-block h-[14px] w-[1.5px] bg-accent animate-[blink_1s_step-end_infinite]" />
                    )}
                  </span>
                );
              })}
            </div>

            {/* Mobile: prompt only */}
            <span className="font-mono text-[13px] font-medium text-accent sm:hidden">~/omar</span>
          </div>

          {/* Right: theme toggle + hamburger */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle className="h-7 w-7 shrink-0" />

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-7 w-7 items-center justify-center text-muted transition-colors hover:text-text sm:hidden"
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
            transition={{ duration: 0.2, ease: motionEase }}
            className="overflow-hidden border-b border-border/20 bg-background/95 backdrop-blur-lg sm:hidden"
          >
            <div className="px-4 py-3 font-mono text-[13px]">
              <div className="mb-2 text-[11px] text-muted/30">$ ls sections/</div>
              {sections.map((section, i) => {
                const isActive = activeSection === section.id;

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.15, ease: motionEase }}
                  >
                    <a
                      href={`#${section.id}`}
                      onClick={(e) => {
                        if (onNavigate) e.preventDefault();
                        handleNavClick(section.id);
                      }}
                      className={cn(
                        "flex items-center gap-2 py-2.5 transition-colors",
                        isActive
                          ? "font-medium text-text"
                          : "text-muted/50 hover:text-text",
                      )}
                    >
                      <span className="text-accent/50">›</span>
                      {section.label.toLowerCase()}
                      {isActive && (
                        <span className="inline-block h-[13px] w-[1.5px] bg-accent animate-[blink_1s_step-end_infinite]" />
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
