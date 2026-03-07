"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { fadeInUp, useMotionPreference } from "@/lib/motion";

type FadeInProps = {
  as?: "div" | "section";
  children: ReactNode;
  className?: string;
};

export function FadeIn({ as = "div", children, className }: FadeInProps) {
  const { reduceMotion, viewport } = useMotionPreference();
  const Component = as === "section" ? motion.section : motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={fadeInUp(reduceMotion)}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
