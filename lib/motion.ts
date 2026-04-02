"use client";

import {
  type TargetAndTransition,
  type Transition,
  type Variants,
  type ViewportOptions,
  useReducedMotion,
} from "framer-motion";

export const motionEase: NonNullable<Transition["ease"]> = [0.16, 1, 0.3, 1];
const gentleMotionEase: NonNullable<Transition["ease"]> = [0.22, 1, 0.36, 1];

type MotionPreferenceOptions = {
  amount?: number;
  margin?: string;
  once?: boolean;
};

type MotionPreference = {
  reduceMotion: boolean;
  viewport: ViewportOptions;
};

type HoverMotionOptions = {
  hoverScale?: number;
  hoverY?: number;
  tapScale?: number;
};

export function useMotionPreference(
  { amount = 0.18, margin, once = true }: MotionPreferenceOptions = {},
): MotionPreference {
  const reduceMotion = Boolean(useReducedMotion());

  return {
    reduceMotion,
    viewport: reduceMotion ? { once, margin } : { once, amount, margin },
  };
}

export function drawerMotion(reduceMotion = false): Variants {
  if (reduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0 },
      },
    };
  }

  return {
    hidden: { opacity: 0, y: 32, scale: 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.38,
        ease: motionEase,
      },
    },
    exit: {
      opacity: 0,
      y: 24,
      scale: 0.992,
      transition: {
        duration: 0.24,
        ease: gentleMotionEase,
      },
    },
  };
}

export function panelMotion(reduceMotion = false): Variants {
  if (reduceMotion) {
    return {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0 },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0 },
      },
    };
  }

  return {
    hidden: { opacity: 0, x: 36, scale: 0.985 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: motionEase,
      },
    },
    exit: {
      opacity: 0,
      x: 24,
      scale: 0.992,
      transition: {
        duration: 0.24,
        ease: gentleMotionEase,
      },
    },
  };
}

export function overlayMotion(reduceMotion = false): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            duration: 0.18,
            ease: "linear",
          },
    },
    exit: {
      opacity: 0,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            duration: 0.16,
            ease: "linear",
          },
    },
  };
}

export function createHoverMotion(
  reduceMotion = false,
  {
    hoverScale = 1.02,
    hoverY = -2,
    tapScale = 0.985,
  }: HoverMotionOptions = {},
): {
  transition: Transition;
  whileHover?: TargetAndTransition;
  whileTap?: TargetAndTransition;
} {
  const transition: Transition = {
    duration: 0.22,
    ease: gentleMotionEase,
  };

  if (reduceMotion) {
    return { transition };
  }

  return {
    transition,
    whileHover: {
      y: hoverY,
      scale: hoverScale,
    },
    whileTap: {
      scale: tapScale,
    },
  };
}

export const iconTransition: Transition = {
  duration: 0.24,
  ease: gentleMotionEase,
};

export const pillTransition: Transition = {
  type: "spring",
  stiffness: 360,
  damping: 30,
  mass: 0.82,
  restDelta: 0.001,
};
