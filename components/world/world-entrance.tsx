"use client";

import { type ReactNode, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { motionEase, useMotionPreference } from "@/lib/motion";

import { useWorldActive } from "./world-slide";

type WorldEntranceProps = {
  children: ReactNode;
  /** Delay in seconds before this element enters */
  delay?: number;
  /** Direction to enter from */
  from?: "bottom" | "left" | "right" | "fade";
  /** Distance to travel in pixels */
  distance?: number;
  className?: string;
};

/**
 * Wrap any content to make it build-in when its parent WorldSlide becomes active.
 * Resets when the world becomes inactive so it re-animates on return.
 */
export function WorldEntrance({
  children,
  delay = 0,
  from = "bottom",
  distance = 20,
  className,
}: WorldEntranceProps) {
  const isActive = useWorldActive();
  const { reduceMotion } = useMotionPreference();
  const [hasEntered, setHasEntered] = useState(false);

  // Reset entrance when world becomes inactive
  useEffect(() => {
    if (!isActive) {
      setHasEntered(false);
    } else {
      // Small delay to let the slide animation start first
      const timer = setTimeout(() => setHasEntered(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const shouldAnimate = hasEntered && isActive;

  const initialOffset = {
    bottom: { y: distance, x: 0 },
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    fade: { x: 0, y: 0 },
  }[from];

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        opacity: shouldAnimate ? 1 : 0,
        x: shouldAnimate ? 0 : initialOffset.x,
        y: shouldAnimate ? 0 : initialOffset.y,
      }}
      transition={{
        duration: 0.5,
        delay: shouldAnimate ? delay : 0,
        ease: motionEase,
      }}
    >
      {children}
    </motion.div>
  );
}

type WorldStaggerProps = {
  children: ReactNode[];
  /** Base delay before the first item */
  baseDelay?: number;
  /** Delay between each item */
  stagger?: number;
  from?: "bottom" | "left" | "right" | "fade";
  distance?: number;
  className?: string;
  itemClassName?: string;
};

/**
 * Automatically stagger a list of children with WorldEntrance.
 */
export function WorldStagger({
  children,
  baseDelay = 0.1,
  stagger = 0.08,
  from = "bottom",
  distance = 16,
  className,
  itemClassName,
}: WorldStaggerProps) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <WorldEntrance
          key={i}
          delay={baseDelay + i * stagger}
          from={from}
          distance={distance}
          className={itemClassName}
        >
          {child}
        </WorldEntrance>
      ))}
    </div>
  );
}
