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
}: FadeInProps) {
  const { reduceMotion, viewport } = useMotionPreference({ amount });
  const Component = components[as];

  return (
    <Component
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={viewport}
      variants={createRevealVariants(reduceMotion, {
        delay,
        distance,
        duration: 0.48,
        scale: 0.982,
      })}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
