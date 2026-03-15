"use client";

import { motion } from "framer-motion";

import { useMotionPreference } from "@/lib/motion";

const blobs = [
  {
    className: "left-[-10%] top-[-20%] h-[600px] w-[600px]",
    color: "var(--aurora-1)",
    duration: 22,
    path: { x: [0, 30, -20, 10, 0], y: [0, -25, 15, -10, 0] },
  },
  {
    className: "right-[-5%] top-[10%] h-[500px] w-[500px]",
    color: "var(--aurora-2)",
    duration: 28,
    path: { x: [0, -20, 15, -10, 0], y: [0, 20, -15, 10, 0] },
  },
  {
    className: "left-[20%] top-[30%] h-[450px] w-[450px]",
    color: "var(--aurora-3)",
    duration: 25,
    path: { x: [0, 15, -25, 5, 0], y: [0, -10, 20, -15, 0] },
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
