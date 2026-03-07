"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

import { fadeInUp, motionEase } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SectionReveal({ children, className, delay = 0 }: SectionRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      initial={shouldReduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={shouldReduceMotion ? undefined : fadeInUp}
      transition={shouldReduceMotion ? undefined : { duration: 0.48, ease: motionEase, delay }}
    >
      {children}
    </motion.div>
  );
}
