"use client";

import { motion } from "framer-motion";
import { Children, isValidElement, type ReactNode } from "react";

import { createRevealVariants, createStaggerVariants, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerGroupProps = {
  as?: "div" | "section" | "ul";
  children: ReactNode;
  className?: string;
  itemAs?: "div" | "li";
  itemClassName?: string;
  amount?: number;
  delayChildren?: number;
  itemDistance?: number;
  stagger?: number;
};

const containerComponents = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
} as const;

const itemComponents = {
  div: motion.div,
  li: motion.li,
} as const;

export function StaggerGroup({
  as = "div",
  children,
  className,
  itemAs = "div",
  itemClassName,
  amount = 0.14,
  delayChildren = 0.06,
  itemDistance = 16,
  stagger = 0.08,
}: StaggerGroupProps) {
  const { reduceMotion, viewport } = useMotionPreference({ amount });
  const items = Children.toArray(children);
  const Container = containerComponents[as];
  const Item = itemComponents[itemAs];

  return (
    <Container
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={viewport}
      variants={createStaggerVariants(reduceMotion, {
        delayChildren,
        staggerChildren: stagger,
      })}
      className={cn(className)}
    >
      {items.map((child, index) => (
        <Item
          key={isValidElement(child) && child.key != null ? child.key : `stagger-item-${index}`}
          variants={createRevealVariants(reduceMotion, {
            distance: itemDistance,
            duration: 0.4,
            scale: 0.99,
          })}
          className={cn(itemClassName)}
        >
          {child}
        </Item>
      ))}
    </Container>
  );
}
