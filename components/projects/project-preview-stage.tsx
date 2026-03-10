import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ProjectPreviewStageProps = {
  children: ReactNode;
  className?: string;
};

/**
 * The frosted background stage that sits behind project content.
 * Every project gets this — it provides the warm grey gradient,
 * center glow, and blurred light strip.
 */
export function ProjectPreviewStage({ children, className }: ProjectPreviewStageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.7rem] bg-[linear-gradient(135deg,#a0a8a4,#948874)] px-4 py-5 sm:px-6 sm:py-7",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent_38%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-[20%] w-[28%] bg-white/8 blur-3xl" />
      {children}
    </div>
  );
}
