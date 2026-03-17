"use client";

import { motion } from "framer-motion";

import { useMotionPreference } from "@/lib/motion";

/**
 * Mesh-gradient-style aurora blobs — inspired by Webflow's hero.
 * 6 overlapping blobs with varied shapes, sizes, and speeds
 * create a rich, layered color wash effect.
 */

interface AuroraBlob {
  className: string;
  color: string;
  // Secondary color for richer gradients (mesh-gradient effect)
  color2?: string;
  duration: number;
  path: { x: number[]; y: number[] };
  // Scale animation for organic breathing
  scale?: number[];
}

const blobs: AuroraBlob[] = [
  // Large dominant blob — top left, slow drift
  {
    className: "left-[-18%] top-[-18%] h-[900px] w-[900px]",
    color: "var(--aurora-1)",
    color2: "var(--aurora-2)",
    duration: 22,
    path: { x: [0, 50, -40, 20, 0], y: [0, -40, 30, -20, 0] },
    scale: [1, 1.08, 0.95, 1.05, 1],
  },
  // Purple wash — top right, counter-drift
  {
    className: "right-[-12%] top-[2%] h-[750px] w-[750px]",
    color: "var(--aurora-2)",
    duration: 28,
    path: { x: [0, -35, 25, -18, 0], y: [0, 30, -25, 15, 0] },
    scale: [1, 0.94, 1.06, 0.98, 1],
  },
  // Accent blob — center left, tighter path
  {
    className: "left-[12%] top-[35%] h-[700px] w-[700px]",
    color: "var(--aurora-3)",
    color2: "var(--aurora-1)",
    duration: 25,
    path: { x: [0, 25, -40, 15, 0], y: [0, -20, 30, -25, 0] },
    scale: [1, 1.1, 0.92, 1.04, 1],
  },
  // Deep blob — bottom right
  {
    className: "right-[8%] bottom-[5%] h-[600px] w-[600px]",
    color: "var(--aurora-1)",
    duration: 32,
    path: { x: [0, -30, 20, -25, 0], y: [0, 20, -30, 15, 0] },
  },
  // Small bright accent — mid-page, fast
  {
    className: "left-[45%] top-[55%] h-[500px] w-[500px]",
    color: "var(--aurora-2)",
    color2: "var(--aurora-3)",
    duration: 18,
    path: { x: [0, 35, -25, 30, 0], y: [0, -35, 15, -20, 0] },
    scale: [1, 1.12, 0.88, 1.06, 1],
  },
  // Subtle edge blob — bottom left warmth
  {
    className: "left-[-8%] bottom-[15%] h-[550px] w-[550px]",
    color: "var(--aurora-3)",
    duration: 35,
    path: { x: [0, 18, -22, 12, 0], y: [0, -18, 22, -12, 0] },
  },
];

export function AuroraBlobs() {
  const { reduceMotion } = useMotionPreference();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[2] overflow-hidden"
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${blob.className}`}
          style={{
            background: blob.color2
              ? `radial-gradient(ellipse at 40% 40%, ${blob.color} 0%, ${blob.color2} 50%, transparent 70%)`
              : `radial-gradient(circle, ${blob.color}, transparent 70%)`,
            filter: "blur(var(--aurora-blur))",
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  ...blob.path,
                  ...(blob.scale ? { scale: blob.scale } : {}),
                }
          }
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 3,
                }
          }
        />
      ))}
    </div>
  );
}
