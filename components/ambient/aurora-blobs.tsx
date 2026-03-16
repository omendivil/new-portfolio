"use client";

import { motion } from "framer-motion";

import { useMotionPreference } from "@/lib/motion";

const blobs = [
  {
    className: "left-[-15%] top-[-15%] h-[800px] w-[800px]",
    color: "var(--aurora-1)",
    duration: 20,
    path: { x: [0, 40, -30, 15, 0], y: [0, -30, 20, -15, 0] },
  },
  {
    className: "right-[-10%] top-[5%] h-[700px] w-[700px]",
    color: "var(--aurora-2)",
    duration: 26,
    path: { x: [0, -30, 20, -15, 0], y: [0, 25, -20, 12, 0] },
  },
  {
    className: "left-[15%] top-[40%] h-[650px] w-[650px]",
    color: "var(--aurora-3)",
    duration: 24,
    path: { x: [0, 20, -35, 10, 0], y: [0, -15, 25, -20, 0] },
  },
  {
    className: "right-[10%] bottom-[10%] h-[550px] w-[550px]",
    color: "var(--aurora-1)",
    duration: 30,
    path: { x: [0, -25, 15, -20, 0], y: [0, 15, -25, 10, 0] },
  },
];

export function AuroraBlobs() {
  const { reduceMotion } = useMotionPreference();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${blob.className}`}
          style={{
            background: `radial-gradient(circle, ${blob.color}, transparent 70%)`,
            filter: "blur(var(--aurora-blur))",
          }}
          animate={reduceMotion ? undefined : blob.path}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 4,
                }
          }
        />
      ))}
    </div>
  );
}
