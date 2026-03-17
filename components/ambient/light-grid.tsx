"use client";

import { useMotionPreference } from "@/lib/motion";

/**
 * Vercel-inspired light grid — perspective grid lines with colored light rays
 * emanating from center. The rays create a spectrum (teal → green → amber → red)
 * that lights up the grid, giving the whole page a dramatic depth effect.
 */
export function LightGrid() {
  const { reduceMotion } = useMotionPreference();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* Layer 1: Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(0deg, var(--grid-line-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line-color) 1px, transparent 1px)
          `,
          backgroundSize: "var(--grid-gap) var(--grid-gap)",
          backgroundPosition: "center center",
          maskImage: `radial-gradient(
            ellipse 80% 70% at 50% 50%,
            black 0%,
            transparent 100%
          )`,
          WebkitMaskImage: `radial-gradient(
            ellipse 80% 70% at 50% 50%,
            black 0%,
            transparent 100%
          )`,
        }}
      />

      {/* Layer 2: Colored light rays from center — the Vercel prism effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(
            from 200deg at 50% 55%,
            var(--ray-color-1) 0deg,
            var(--ray-color-2) 30deg,
            var(--ray-color-3) 60deg,
            var(--ray-color-4) 90deg,
            var(--ray-color-5) 120deg,
            transparent 160deg,
            transparent 240deg,
            var(--ray-color-6) 280deg,
            var(--ray-color-7) 310deg,
            var(--ray-color-1) 340deg,
            var(--ray-color-1) 360deg
          )`,
          maskImage: `radial-gradient(
            ellipse 90% 80% at 50% 55%,
            black 0%,
            black 20%,
            transparent 70%
          )`,
          WebkitMaskImage: `radial-gradient(
            ellipse 90% 80% at 50% 55%,
            black 0%,
            black 20%,
            transparent 70%
          )`,
          animation: reduceMotion
            ? undefined
            : "ray-pulse 12s ease-in-out infinite alternate",
        }}
      />

      {/* Layer 3: Fine ray lines (repeating conic for that thin-line ray look) */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-conic-gradient(
            from 180deg at 50% 55%,
            transparent 0deg,
            var(--ray-line-color) 0.3deg,
            transparent 0.8deg,
            transparent 3deg
          )`,
          maskImage: `radial-gradient(
            ellipse 70% 60% at 50% 55%,
            black 0%,
            transparent 80%
          )`,
          WebkitMaskImage: `radial-gradient(
            ellipse 70% 60% at 50% 55%,
            black 0%,
            transparent 80%
          )`,
          mixBlendMode: "screen",
          opacity: 0.6,
        }}
      />

      {/* Layer 4: Central glow hotspot where rays converge */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(
            circle 200px at 50% 55%,
            var(--ray-center-glow),
            transparent 100%
          )`,
        }}
      />

      <style jsx>{`
        @keyframes ray-pulse {
          0% {
            opacity: var(--ray-opacity-min);
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: var(--ray-opacity-max);
          }
          100% {
            opacity: var(--ray-opacity-min);
            transform: scale(1.03) rotate(2deg);
          }
        }
      `}</style>
    </div>
  );
}
