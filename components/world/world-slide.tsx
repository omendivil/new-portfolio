"use client";

import { type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { motionEase, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

type WorldSlideProps = {
  id: string;
  children: ReactNode;
  isActive: boolean;
  direction: "left" | "right" | null;
  exitLabel?: string;
  onExit?: () => void;
  className?: string;
};

const slideVariants = {
  enterFromRight: { x: "100%", opacity: 0 },
  enterFromLeft: { x: "-100%", opacity: 0 },
  center: { x: 0, opacity: 1 },
  exitToLeft: { x: "-100%", opacity: 0 },
  exitToRight: { x: "100%", opacity: 0 },
};

export function WorldSlide({
  id,
  children,
  isActive,
  direction,
  exitLabel,
  onExit,
  className,
}: WorldSlideProps) {
  const { reduceMotion } = useMotionPreference();

  const initial = reduceMotion
    ? false
    : direction === "left"
      ? "enterFromRight"
      : "enterFromLeft";

  const exit = reduceMotion
    ? undefined
    : direction === "left"
      ? "exitToLeft"
      : "exitToRight";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isActive && (
        <motion.section
          key={id}
          id={id}
          className={cn(
            "absolute inset-0 overflow-y-auto overflow-x-hidden",
            className,
          )}
          variants={reduceMotion ? undefined : slideVariants}
          initial={initial}
          animate="center"
          exit={exit}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 0.6, ease: motionEase }
          }
        >
          {children}

          {exitLabel && onExit && (
            <div className="sticky bottom-0 z-10 flex justify-center pb-6 pt-2 sm:pb-10">
              <button
                type="button"
                onClick={onExit}
                className="group flex items-center gap-2 rounded-full border border-border/30 bg-background/80 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60 backdrop-blur-sm transition-all hover:border-border/60 hover:text-muted sm:text-xs"
              >
                {exitLabel}
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </motion.section>
      )}
    </AnimatePresence>
  );
}
