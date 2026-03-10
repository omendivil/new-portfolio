import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AnimatedBorderGlowProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Wraps children with an animated gradient border.
 *
 * Structure: outer shell (overflow-hidden, padding = border thickness)
 * contains a spinning conic gradient at z-0. Children sit at z-[1]
 * and cover the center, so the gradient is only visible through
 * the padding gap — creating an animated glowing border.
 */
export function AnimatedBorderGlow({ children, className }: AnimatedBorderGlowProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.7rem] p-[1.5px]",
        className,
      )}
    >
      {/* Spinning conic gradient — only visible through the border gap */}
      <div className="preview-border-glow pointer-events-none absolute left-1/2 top-1/2 z-0" />

      {/* Dark base behind the gradient for transparent gaps */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-black/80" />

      {/* Children cover the center */}
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
