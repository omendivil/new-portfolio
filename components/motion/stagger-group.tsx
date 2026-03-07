"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { staggerChildren, useMotionPreference } from "@/lib/motion";

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
};

export function StaggerGroup({ children, className }: StaggerGroupProps) {
  const { reduceMotion, viewport } = useMotionPreference();

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={staggerChildren(reduceMotion)}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
