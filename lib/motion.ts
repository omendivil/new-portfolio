"use client";

import {
  type Transition,
  type Variants,
  type ViewportOptions,
  useReducedMotion,
} from "framer-motion";

export const motionEase: NonNullable<Transition["ease"]> = [0.16, 1, 0.3, 1];

type MotionPreference = {
  reduceMotion: boolean;
  viewport: ViewportOptions;
};

type VariantFactory = ((reduceMotion?: boolean) => Variants) & Variants;

function withDefaultVariants(factory: (reduceMotion?: boolean) => Variants): VariantFactory {
  return Object.assign(factory, factory(false));
}

function createFadeInUp(reduceMotion = false): Variants {
  return {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
    visible: reduceMotion
      ? {
          opacity: 1,
          transition: { duration: 0 },
        }
      : {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.42,
            ease: motionEase,
          },
        },
  };
}

function createStaggerChildren(reduceMotion = false): Variants {
  return {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { duration: 0 }
        : {
            staggerChildren: 0.08,
            delayChildren: 0.04,
          },
    },
  };
}

export function useMotionPreference(): MotionPreference {
  const reduceMotion = Boolean(useReducedMotion());

  return {
    reduceMotion,
    viewport: reduceMotion ? { once: true } : { once: true, amount: 0.24 },
  };
}

export const fadeInUp = withDefaultVariants(createFadeInUp);

export const staggerChildren = withDefaultVariants(createStaggerChildren);

export function drawerMotion(reduceMotion = false): Variants {
  return {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 },
    visible: reduceMotion
      ? {
          opacity: 1,
          transition: { duration: 0 },
        }
      : {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.36,
            ease: motionEase,
          },
        },
    exit: reduceMotion
      ? {
          opacity: 0,
          transition: { duration: 0 },
        }
      : {
          opacity: 0,
          y: 40,
          transition: {
            duration: 0.24,
            ease: motionEase,
          },
        },
  };
}

export function panelMotion(reduceMotion = false): Variants {
  return {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, x: 32 },
    visible: reduceMotion
      ? {
          opacity: 1,
          transition: { duration: 0 },
        }
      : {
          opacity: 1,
          x: 0,
          transition: {
            duration: 0.34,
            ease: motionEase,
          },
        },
    exit: reduceMotion
      ? {
          opacity: 0,
          transition: { duration: 0 },
        }
      : {
          opacity: 0,
          x: 32,
          transition: {
            duration: 0.22,
            ease: motionEase,
          },
        },
  };
}

export const pillTransition: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.7,
};
