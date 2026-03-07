"use client";

import {
  type TargetAndTransition,
  type Transition,
  type Variants,
  type ViewportOptions,
  useReducedMotion,
} from "framer-motion";

export const motionEase: NonNullable<Transition["ease"]> = [0.16, 1, 0.3, 1];
export const gentleMotionEase: NonNullable<Transition["ease"]> = [0.22, 1, 0.36, 1];

type MotionPreferenceOptions = {
  amount?: number;
  margin?: string;
  once?: boolean;
};

type MotionPreference = {
  reduceMotion: boolean;
  viewport: ViewportOptions;
};

type RevealOptions = {
  delay?: number;
  distance?: number;
  duration?: number;
  scale?: number;
};

type StaggerOptions = {
  delayChildren?: number;
  staggerChildren?: number;
};

type HoverMotionOptions = {
  hoverScale?: number;
  hoverY?: number;
  tapScale?: number;
};

type VariantFactory = ((reduceMotion?: boolean) => Variants) & Variants;

function withDefaultVariants(factory: (reduceMotion?: boolean) => Variants): VariantFactory {
  return Object.assign(factory, factory(false));
}

export function createRevealVariants(
  reduceMotion = false,
  {
    delay = 0,
    distance = 18,
    duration = 0.44,
    scale = 0.985,
  }: RevealOptions = {},
): Variants {
  if (reduceMotion) {
    return {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: { duration: 0 },
      },
      exit: {
        opacity: 1,
        transition: { duration: 0 },
      },
    };
  }

  return {
    hidden: { opacity: 0, y: distance, scale },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: motionEase,
      },
    },
    exit: {
      opacity: 0,
      y: Math.max(10, Math.round(distance * 0.7)),
      scale: 0.992,
      transition: {
        duration: 0.22,
        ease: gentleMotionEase,
      },
    },
  };
}

export function createStaggerVariants(
  reduceMotion = false,
  {
    delayChildren = 0.04,
    staggerChildren = 0.08,
  }: StaggerOptions = {},
): Variants {
  return {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? { duration: 0 }
        : {
            delayChildren,
            staggerChildren,
          },
    },
  };
}

export function useMotionPreference(
  { amount = 0.18, margin, once = true }: MotionPreferenceOptions = {},
): MotionPreference {
  const reduceMotion = Boolean(useReducedMotion());

  return {
    reduceMotion,
    viewport: reduceMotion ? { once, margin } : { once, amount, margin },
  };
}

export const fadeInUp = withDefaultVariants((reduceMotion = false) =>
  createRevealVariants(reduceMotion, {
    distance: 22,
    duration: 0.48,
    scale: 0.982,
  }),
);

export const sectionMotion = withDefaultVariants((reduceMotion = false) =>
  createRevealVariants(reduceMotion, {
    distance: 26,
    duration: 0.54,
    scale: 0.985,
  }),
);

export const staggerChildren = withDefaultVariants((reduceMotion = false) =>
  createStaggerVariants(reduceMotion),
);

export const staggerItem = withDefaultVariants((reduceMotion = false) =>
  createRevealVariants(reduceMotion, {
    distance: 16,
    duration: 0.4,
    scale: 0.99,
  }),
);

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

export function subtleHover(
  reduceMotion = false,
  y = -2,
  scale = 1.02,
): TargetAndTransition | undefined {
  return createHoverMotion(reduceMotion, {
    hoverScale: scale,
    hoverY: y,
  }).whileHover;
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
