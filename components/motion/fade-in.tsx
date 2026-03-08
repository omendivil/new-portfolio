"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { createRevealVariants, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FadeInProps = {
  as?: "article" | "div" | "section";
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  amount?: number;
  duration?: number;
  margin?: string;
  scale?: number;
};

const components = {
  article: motion.article,
  div: motion.div,
  section: motion.section,
} as const;

export function FadeIn({
  as = "div",
  children,
  className,
  delay = 0,
  distance = 22,
  amount = 0.18,
  duration = 0.48,
  margin,
  scale = 0.982,
}: FadeInProps) {
  const { reduceMotion, viewport } = useMotionPreference({ amount, margin });
  const Component = components[as];

  return (
    <Component
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={viewport}
      variants={createRevealVariants(reduceMotion, {
        delay,
        distance,
        duration,
        scale,
      })}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
