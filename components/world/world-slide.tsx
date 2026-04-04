"use client";

import { type ReactNode, createContext, useContext } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { motionEase, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

// Context so children can know if their world is active
const WorldActiveContext = createContext(false);
export function useWorldActive() {
  return useContext(WorldActiveContext);
}

type WorldSlideProps = {
  id: string;
  children: ReactNode;
  isActive: boolean;
  direction: "left" | "right" | null;
  exitLabel?: string;
  onExit?: () => void;
  className?: string;
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

  return (
    <WorldActiveContext value={isActive}>
      <motion.section
        id={id}
        className={cn(
          "absolute inset-0 overflow-y-auto overflow-x-hidden",
          !isActive && "pointer-events-none",
          className,
        )}
        animate={{
          opacity: isActive ? 1 : 0,
          x: isActive
            ? 0
            : direction === "left"
              ? "-30%"
              : direction === "right"
                ? "30%"
                : 0,
          scale: isActive ? 1 : 0.95,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.5, ease: motionEase }
        }
        style={{
          visibility: isActive ? "visible" : "hidden",
          willChange: isActive ? "auto" : "transform, opacity",
        }}
        aria-hidden={!isActive}
      >
        {children}

        {exitLabel && onExit && (
          <div className="pointer-events-none sticky bottom-0 z-10 flex justify-center pb-6 pt-2 sm:pb-10">
            <button
              type="button"
              onClick={onExit}
              className="pointer-events-auto group flex items-center gap-2 rounded-full border border-border/30 bg-background/80 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60 backdrop-blur-sm transition-all hover:border-border/60 hover:text-muted sm:text-xs"
            >
              {exitLabel}
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        )}
      </motion.section>
    </WorldActiveContext>
  );
}
