"use client";

import { useMotionPreference } from "@/lib/motion";

/**
 * Full-page perspective grid — inspired by Vercel's hero.
 * Thin lines that catch ambient light, creating depth and structure.
 * Uses CSS gradients for zero DOM overhead.
 */
export function GlowGrid() {
  const { reduceMotion } = useMotionPreference();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1]"
      aria-hidden="true"
      style={{
        // Horizontal lines
        backgroundImage: `
          linear-gradient(
            0deg,
            var(--grid-line-color) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            var(--grid-line-color) 1px,
            transparent 1px
          )
        `,
        backgroundSize: "var(--grid-gap) var(--grid-gap)",
        backgroundPosition: "center center",
        // Fade out grid at edges with radial mask
        maskImage: `radial-gradient(
          ellipse 70% 60% at 50% 40%,
          black 0%,
          transparent 100%
        )`,
        WebkitMaskImage: `radial-gradient(
          ellipse 70% 60% at 50% 40%,
          black 0%,
          transparent 100%
        )`,
        opacity: reduceMotion ? 0.5 : undefined,
        animation: reduceMotion
          ? undefined
          : "grid-breathe 8s ease-in-out infinite",
      }}
    >
      {/* Glow hotspot — simulates light hitting the grid from aurora blobs */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            ellipse 50% 40% at 50% 35%,
            var(--grid-glow-color),
            transparent 70%
          )`,
          mixBlendMode: "screen",
        }}
      />

      <style jsx>{`
        @keyframes grid-breathe {
          0%,
          100% {
            opacity: var(--grid-opacity-min);
          }
          50% {
            opacity: var(--grid-opacity-max);
          }
        }
      `}</style>
    </div>
  );
}
