"use client";

import { motion } from "framer-motion";

import { useMotionPreference } from "@/lib/motion";

/**
 * Vercel-inspired light grid — section-level background.
 * Grid + colored light rays + drifting sun/aura glow.
 * Fades in at top, fades out at bottom — no hard cutoffs.
 */
export function VercelGrid({ children }: { children?: React.ReactNode }) {
  const { reduceMotion } = useMotionPreference();

  return (
    <div className="relative overflow-hidden">
      {/* Fade-in at top */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-32"
        aria-hidden="true"
        style={{
          background: "linear-gradient(to top, transparent, var(--background))",
        }}
      />

      {/* Grid lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(0deg, var(--grid-line-color) 1px, transparent 1px),
            linear-gradient(90deg, var(--grid-line-color) 1px, transparent 1px)
          `,
          backgroundSize: "var(--grid-gap) var(--grid-gap)",
          backgroundPosition: "center center",
          maskImage: `radial-gradient(ellipse 85% 75% at 50% 50%, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(ellipse 85% 75% at 50% 50%, black 0%, transparent 100%)`,
        }}
      />

      {/* Colored light rays — prism spectrum */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: `conic-gradient(
            from 200deg at 50% 45%,
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
          maskImage: `radial-gradient(ellipse 90% 80% at 50% 45%, black 0%, black 15%, transparent 65%)`,
          WebkitMaskImage: `radial-gradient(ellipse 90% 80% at 50% 45%, black 0%, black 15%, transparent 65%)`,
          animation: reduceMotion ? undefined : "ray-pulse 12s ease-in-out infinite alternate",
        }}
      />

      {/* Fine ray lines */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: `repeating-conic-gradient(
            from 180deg at 50% 45%,
            transparent 0deg,
            var(--ray-line-color) 0.3deg,
            transparent 0.8deg,
            transparent 3deg
          )`,
          maskImage: `radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 75%)`,
          WebkitMaskImage: `radial-gradient(ellipse 70% 60% at 50% 45%, black 0%, transparent 75%)`,
          mixBlendMode: "screen",
          opacity: 0.6,
        }}
      />

      {/* Drifting sun/aura glow — the warm light that slowly moves */}
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute z-[1]"
          aria-hidden="true"
          style={{
            width: "500px",
            height: "500px",
            left: "30%",
            top: "20%",
            borderRadius: "50%",
            background: `radial-gradient(circle, var(--ray-center-glow), transparent 60%)`,
            filter: "blur(40px)",
          }}
          animate={{
            x: [0, 60, -40, 30, 0],
            y: [0, -30, 20, -15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Central glow hotspot */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: `radial-gradient(circle 250px at 50% 45%, var(--ray-center-glow), transparent 100%)`,
        }}
      />

      {/* Fade-out at bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-24"
        aria-hidden="true"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--background))",
        }}
      />

      {/* Content */}
      <div className="relative z-[2]">{children}</div>

      <style jsx>{`
        @keyframes ray-pulse {
          0% { opacity: var(--ray-opacity-min); transform: scale(1) rotate(0deg); }
          50% { opacity: var(--ray-opacity-max); }
          100% { opacity: var(--ray-opacity-min); transform: scale(1.03) rotate(2deg); }
        }
      `}</style>
    </div>
  );
}
