import type { ReactNode } from "react";

import type { ProjectPresentation } from "@/data/types";
import { cn } from "@/lib/utils";

type ProjectShowcaseFrameProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  screenClassName?: string;
  variant?: ProjectPresentation;
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
          "relative mx-auto w-full max-w-[10rem] rounded-[1.6rem] bg-[#181512] p-1.5 shadow-[0_32px_100px_-56px_rgba(17,16,13,0.5)] sm:max-w-[15rem] sm:rounded-[2.3rem] sm:p-2.5 dark:bg-[#0b0b0b]",
          className,
        )}
      >
        <div className="pointer-events-none absolute -left-px top-16 h-8 w-0.5 rounded-l-full bg-black/14 sm:top-24 sm:h-12 sm:w-1 dark:bg-white/8" />
        <div className="pointer-events-none absolute -right-px top-20 h-10 w-0.5 rounded-r-full bg-black/12 sm:top-28 sm:h-16 sm:w-1 dark:bg-white/7" />

        <div
          className={cn(
            "relative aspect-[9/19.5] overflow-hidden rounded-[1.4rem] bg-black sm:rounded-[1.8rem]",
            screenClassName,
          )}
        >
            <div className="pointer-events-none absolute left-1/2 top-1.5 z-20 h-[1rem] w-[4rem] -translate-x-1/2 rounded-full bg-black sm:top-2.5 sm:h-[1.4rem] sm:w-[5.5rem]" />
            {label ? (
              <span className="absolute left-3 top-12 z-20 rounded-full border border-white/10 bg-black/68 px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.24em] text-white/72 backdrop-blur">
                {label}
              </span>
            ) : null}
            {children}
          </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[28rem] rounded-[1.2rem] bg-[#181512] p-1.5 shadow-[0_32px_100px_-56px_rgba(17,16,13,0.5)] sm:max-w-[35rem] dark:bg-[#0b0b0b]",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-[0.8rem] bg-black",
          screenClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
