"use client";

import { type ReactNode, useRef } from "react";
import { useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

type WorldSlideProps = {
  id: string;
  children: ReactNode;
  exitLabel?: string;
  nextSectionId?: string;
  className?: string;
  allowOverflow?: boolean;
};

export function WorldSlide({
  id,
  children,
  exitLabel,
  nextSectionId,
  className,
  allowOverflow = false,
}: WorldSlideProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const { reduceMotion } = useMotionPreference();

  function handleExit() {
    if (!nextSectionId) return;
    const target = document.getElementById(nextSectionId);
    target?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
  }

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "section-anchor relative snap-start",
        allowOverflow ? "min-h-screen" : "flex min-h-screen flex-col",
        className,
      )}
    >
      <div className={cn("flex-1", allowOverflow ? "" : "flex flex-col")}>
        {children}
      </div>

      {exitLabel && nextSectionId && (
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center sm:bottom-10">
          <button
            type="button"
            onClick={handleExit}
            className="group flex flex-col items-center gap-1.5 text-muted/50 transition-colors hover:text-muted"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] sm:text-xs">
              {exitLabel}
            </span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      )}
    </section>
  );
}
