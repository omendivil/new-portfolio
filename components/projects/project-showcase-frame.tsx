import type { ReactNode } from "react";

import type { ProjectPresentation } from "@/data/types";
import { cn } from "@/lib/utils";

export type ProjectShowcaseVariant = ProjectPresentation;

type ProjectShowcaseFrameProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  screenClassName?: string;
  variant?: ProjectShowcaseVariant;
};

export function ProjectShowcaseFrame({
  children,
  className,
  label,
  screenClassName,
  variant = "canvas",
}: ProjectShowcaseFrameProps) {
  if (variant === "device") {
    return (
      <div
        className={cn(
          "relative mx-auto w-full max-w-[20rem] rounded-[2.55rem] border border-border/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.56),rgba(255,255,255,0.12))] p-2.5 shadow-[0_32px_100px_-56px_rgba(17,16,13,0.5)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))]",
          className,
        )}
      >
        <div className="pointer-events-none absolute -left-px top-24 h-12 w-1 rounded-l-full bg-black/14 dark:bg-white/8" />
        <div className="pointer-events-none absolute -right-px top-28 h-16 w-1 rounded-r-full bg-black/12 dark:bg-white/7" />

        <div className="rounded-[2.15rem] border border-black/10 bg-[#181512] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] dark:border-white/6 dark:bg-[#0b0b0b]">
          <div
            className={cn(
              "relative aspect-[9/19.5] overflow-hidden rounded-[1.8rem] border border-white/10 bg-black",
              screenClassName,
            )}
          >
            <div className="pointer-events-none absolute inset-x-5 top-3 z-20 flex items-center justify-between text-[0.62rem] font-medium tracking-[0.12em] text-white/78">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/62" />
                <span className="h-2 w-5 rounded-full border border-white/40" />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-x-1/2 top-3 z-20 h-7 w-[7.5rem] -translate-x-1/2 rounded-full bg-black/92 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]" />
            {label ? (
              <span className="absolute left-3 top-12 z-20 rounded-full border border-white/10 bg-black/68 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-white/72 backdrop-blur">
                {label}
              </span>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
      <div
        className={cn(
          "surface-card overflow-hidden rounded-[1.65rem] p-2.5",
          className,
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-text/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-text/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/50" />
        </div>
        {label ? (
          <span className="font-mono text-[0.64rem] uppercase tracking-[0.22em] text-muted">
            {label}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-[1.2rem] border border-border/70 bg-surface-2",
          screenClassName,
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[4.5rem] bg-gradient-to-b from-white/24 via-transparent to-transparent" />
        {children}
      </div>
    </div>
  );
}
