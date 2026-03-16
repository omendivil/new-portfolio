"use client";

import { type MotionValue, motion, useMotionTemplate } from "framer-motion";

type DotGridBackgroundProps = {
  dotBgPosX: MotionValue<number>;
  dotBgPosY: MotionValue<number>;
  dotSize: MotionValue<number>;
  dotSpacing: MotionValue<number>;
};

export function DotGridBackground({
  dotBgPosX,
  dotBgPosY,
  dotSize,
  dotSpacing,
}: DotGridBackgroundProps) {
  const backgroundImage = useMotionTemplate`radial-gradient(circle, var(--dot-grid-color) ${dotSize}px, transparent ${dotSize}px)`;
  const backgroundSize = useMotionTemplate`${dotSpacing}px ${dotSpacing}px`;
  const backgroundPosition = useMotionTemplate`${dotBgPosX}px ${dotBgPosY}px`;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 [--dot-grid-color:rgba(0,0,0,0.08)] dark:[--dot-grid-color:rgba(255,255,255,0.07)]"
      style={{
        backgroundImage,
        backgroundSize,
        backgroundPosition,
      }}
    />
  );
}
