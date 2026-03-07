"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { analyticsEvents, trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => {
        const nextTheme = isDark ? "light" : "dark";
        setTheme(nextTheme);
        trackEvent(analyticsEvents.themeToggle, { theme: nextTheme });
      }}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text shadow-sm transition-colors hover:bg-surface-2",
        className,
      )}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"}
      title="Toggle theme"
    >
      {mounted && isDark ? (
        <SunMedium className="h-4 w-4" aria-hidden="true" />
      ) : (
        <MoonStar className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
