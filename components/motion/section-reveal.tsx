"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { createRevealVariants, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
  distance?: number;
}

export function SectionReveal({
  children,
  className,
  delay = 0,
  amount = 0.12,
  distance = 26,
}: SectionRevealProps) {
  const { reduceMotion, viewport } = useMotionPreference({
    amount,
    margin: "0px 0px -10% 0px",
  });

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={viewport}
      variants={createRevealVariants(reduceMotion, {
        delay,
        distance,
        duration: 0.54,
        scale: 0.985,
      })}
    >
      {children}
    </motion.div>
  );
}
