"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { createHoverMotion, iconTransition, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { reduceMotion } = useMotionPreference();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";
  const iconKey = mounted && isDark ? "light" : "dark";
  const hoverMotion = createHoverMotion(reduceMotion, {
    hoverScale: 1.03,
    hoverY: -1.5,
    tapScale: 0.96,
  });

  return (
    <motion.button
      type="button"
      onClick={() => {
        const nextTheme = isDark ? "light" : "dark";
        setTheme(nextTheme);
        trackEvent(analyticsEvents.themeToggle, { theme: nextTheme });
      }}
      {...hoverMotion}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-surface text-text shadow-sm transition-[border-color,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-accent/25 hover:bg-surface-2 hover:shadow-[0_16px_32px_-24px_rgba(17,16,13,0.34)] motion-reduce:transition-none",
        className,
      )}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      title="Toggle theme"
    >
      <motion.span
        aria-hidden="true"
        className="absolute inset-1 rounded-full bg-accent-soft/70"
        initial={false}
        animate={
          mounted
            ? {
                opacity: isDark ? 0.92 : 0.56,
                scale: isDark ? 1 : 0.9,
              }
            : {
                opacity: 0,
                scale: 0.85,
              }
        }
        transition={reduceMotion ? { duration: 0 } : iconTransition}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={iconKey}
          className="relative z-10 inline-flex items-center justify-center"
          initial={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 0, rotate: isDark ? -20 : 20, scale: 0.78, y: 1 }
          }
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1, y: 0 }}
          exit={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 0, rotate: isDark ? 18 : -18, scale: 0.8, y: -1 }
          }
          transition={reduceMotion ? { duration: 0 } : iconTransition}
        >
          {mounted && isDark ? (
            <SunMedium className="h-4 w-4" aria-hidden="true" />
          ) : (
            <MoonStar className="h-4 w-4" aria-hidden="true" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
