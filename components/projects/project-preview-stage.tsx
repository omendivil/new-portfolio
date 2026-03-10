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
        "preview-inner-stage relative overflow-hidden rounded-[1.7rem] px-4 py-5 sm:px-6 sm:py-7",
        className,
      )}
    >
      <div className="preview-inner-stage-glow pointer-events-none absolute inset-0" />
      <div className="preview-inner-stage-strip pointer-events-none absolute inset-y-0 left-[20%] w-[28%] blur-3xl" />
      {children}
    </div>
  );
}
