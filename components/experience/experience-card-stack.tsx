"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useAnimate,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useCallback, useReducer } from "react";

import type { Experience } from "@/data/types";
import { cn } from "@/lib/utils";

const SWIPE_VELOCITY_THRESHOLD = 500;
const SWIPE_DISTANCE_THRESHOLD = 100;
const STACK_OFFSET = 8;
const STACK_SCALE_STEP = 0.03;

type CardTheme = {
  gradient: string;
  accentBorder: string;
  accentColor: string;
  stat?: { value: string; label: string };
  badge?: { label: string; rotation: number };
};

const CARD_THEMES: Record<string, CardTheme> = {
  "apple-triage": {
    gradient: "from-teal-500/8 to-cyan-500/4",
    accentBorder: "border-teal-500/20",
    accentColor: "#8ac9bd",
    badge: { label: "Top 10%", rotation: -3 },
    stat: { value: "Apple", label: "Career Experience" },
  },
  "aer-digital": {
    gradient: "from-blue-500/8 to-indigo-500/4",
    accentBorder: "border-blue-500/20",
    accentColor: "#61afef",
    stat: { value: "Client sites", label: "shipped" },
  },
  "independent-dev": {
    gradient: "from-purple-500/8 to-violet-500/4",
    accentBorder: "border-purple-500/20",
    accentColor: "#c678dd",
    badge: { label: "Current", rotation: -2 },
    stat: { value: "6+", label: "projects shipped" },
  },
};

// Reducer
type Action =
  | { type: "DISMISS"; direction: 1 | -1 }
  | { type: "REWIND" }
  | { type: "ANIMATION_DONE" }
  | { type: "WIGGLE_DONE" };

type State = {
  currentIndex: number;
  dismissHistory: Array<{ index: number; direction: 1 | -1 }>;
  hasWiggled: boolean;
  isAnimating: boolean;
};

const initialState: State = {
  currentIndex: 0,
  dismissHistory: [],
  hasWiggled: false,
  isAnimating: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "DISMISS":
      return {
        ...state,
        currentIndex: state.currentIndex + 1,
        dismissHistory: [
          ...state.dismissHistory,
          { index: state.currentIndex, direction: action.direction },
        ],
        isAnimating: true,
      };
    case "REWIND": {
      if (state.dismissHistory.length === 0) return state;
      return {
        ...state,
        currentIndex: state.currentIndex - 1,
        dismissHistory: state.dismissHistory.slice(0, -1),
        isAnimating: true,
      };
    }
    case "ANIMATION_DONE":
      return { ...state, isAnimating: false };
    case "WIGGLE_DONE":
      return { ...state, hasWiggled: true };
    default:
      return state;
  }
}

function getStackStyle(stackIndex: number) {
  return {
    y: stackIndex * STACK_OFFSET,
    scale: 1 - stackIndex * STACK_SCALE_STEP,
    opacity: stackIndex >= 2 ? 0.8 : 1,
  };
}

// Individual swipeable card
function SwipeCard({
  experience,
  stackIndex,
  isTop,
  showWiggle,
  onDismiss,
  onAnimationDone,
  onWiggleDone,
}: {
  experience: Experience;
  stackIndex: number;
  isTop: boolean;
  showWiggle: boolean;
  onDismiss: (direction: 1 | -1) => void;
  onAnimationDone: () => void;
  onWiggleDone: () => void;
}) {
  const [scope, animateCard] = useAnimate();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const theme = CARD_THEMES[experience.id];
  const target = getStackStyle(stackIndex);

  const handleDragEnd = useCallback(
    async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const shouldDismiss =
        Math.abs(info.offset.x) > SWIPE_DISTANCE_THRESHOLD ||
        Math.abs(info.velocity.x) > SWIPE_VELOCITY_THRESHOLD;

      if (shouldDismiss) {
        const direction: 1 | -1 = info.offset.x > 0 ? 1 : -1;
        await animateCard(scope.current, {
          x: direction * window.innerWidth * 1.2,
          rotate: direction * 18,
          opacity: 0,
        }, { duration: 0.35, ease: [0.32, 0.72, 0, 1] });
        onDismiss(direction);
      }
    },
    [animateCard, scope, onDismiss],
  );

  return (
    <motion.div
      ref={scope}
      className="absolute inset-x-0 top-0"
      animate={
        showWiggle
          ? { x: [0, -6, 6, -3, 3, 0], y: target.y, scale: target.scale, opacity: target.opacity }
          : { x: 0, y: target.y, scale: target.scale, opacity: target.opacity }
      }
      transition={
        showWiggle
          ? { x: { delay: 1.5, duration: 0.5, ease: "easeInOut" }, default: { type: "spring", stiffness: 300, damping: 25, mass: 0.8 } }
          : { type: "spring", stiffness: 300, damping: 25, mass: 0.8 }
      }
      onAnimationComplete={() => {
        if (showWiggle) onWiggleDone();
        else onAnimationDone();
      }}
      style={{
        zIndex: 30 - stackIndex * 10,
        ...(isTop ? { x, rotate } : {}),
      }}
      {...(isTop
        ? {
            drag: "x" as const,
            dragSnapToOrigin: true,
            dragElastic: 0.85,
            onDragEnd: handleDragEnd,
          }
        : {})}
    >
      <article
        className={cn(
          "overflow-hidden rounded-[1.6rem] border bg-gradient-to-br p-5 sm:p-6",
          "border-border/60 bg-background/80",
          theme?.gradient,
          isTop && "cursor-grab active:cursor-grabbing",
          !isTop && "pointer-events-none",
        )}
      >
        {/* Badge */}
        {theme?.badge && (
          <div
            className="absolute right-4 top-4 rounded-sm border-2 border-current px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase tracking-[0.2em] opacity-50"
            style={{ transform: `rotate(${theme.badge.rotation}deg)`, color: theme.accentColor }}
          >
            {theme.badge.label}
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-text">
              {experience.role}
            </h3>
            <p className="text-sm text-muted">
              {experience.organization} · {experience.location}
            </p>
          </div>
          <p className="w-fit rounded-full border border-border/70 bg-surface/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:text-xs">
            {experience.period}
          </p>
        </div>

        {/* Summary */}
        <p className="mt-4 max-w-3xl text-sm leading-6 text-muted">
          {experience.summary}
        </p>

        {/* Stat */}
        {theme?.stat && (
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight" style={{ color: theme.accentColor }}>
              {theme.stat.value}
            </span>
            <span className="text-xs uppercase tracking-[0.15em] text-muted">
              {theme.stat.label}
            </span>
          </div>
        )}

        {/* Bullets */}
        <ul className="mt-5 space-y-2">
          {experience.bullets.map((bullet) => (
            <li
              key={bullet}
              className="rounded-xl border border-border/40 bg-surface/50 px-4 py-3 text-sm leading-6 text-text"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </article>
    </motion.div>
  );
}

// Main component
type ExperienceCardStackProps = {
  experiences: Experience[];
};

export function ExperienceCardStack({ experiences }: ExperienceCardStackProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const [state, dispatch] = useReducer(reducer, initialState);
  const total = experiences.length;

  const handleDismiss = useCallback(
    (direction: 1 | -1) => dispatch({ type: "DISMISS", direction }),
    [],
  );

  const handleRewind = useCallback(() => {
    if (state.isAnimating || state.dismissHistory.length === 0) return;
    dispatch({ type: "REWIND" });
  }, [state.isAnimating, state.dismissHistory.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (state.isAnimating) return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          if (state.currentIndex < total) handleDismiss(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          if (state.currentIndex < total) handleDismiss(1);
          break;
        case "ArrowUp":
        case "Backspace":
          e.preventDefault();
          handleRewind();
          break;
      }
    },
    [state.isAnimating, state.currentIndex, total, handleDismiss, handleRewind],
  );

  // Reduced motion: simple list
  if (reduceMotion) {
    return (
      <div className="space-y-4">
        {experiences.map((exp) => (
          <article
            key={exp.id}
            className="rounded-[1.6rem] border border-border/60 bg-background/80 p-5 sm:p-6"
          >
            <h3 className="text-xl font-semibold text-text">{exp.role}</h3>
            <p className="mt-1 text-sm text-muted">
              {exp.organization} · {exp.period}
            </p>
            <p className="mt-3 text-sm text-muted">{exp.summary}</p>
          </article>
        ))}
      </div>
    );
  }

  return (
    <div
      role="group"
      aria-label="Experience cards. Swipe or use arrow keys to navigate."
      aria-roledescription="card stack"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="rounded-[1.6rem] outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
    >
      {/* Card stack */}
      <div className="relative" style={{ height: "calc(var(--card-height, 320px) + 20px)" }}>
        {experiences.map((exp, i) => {
          const stackIndex = i - state.currentIndex;
          const isVisible = stackIndex >= 0 && stackIndex < 3;
          if (!isVisible) return null;

          return (
            <SwipeCard
              key={exp.id}
              experience={exp}
              stackIndex={stackIndex}
              isTop={stackIndex === 0}
              showWiggle={!state.hasWiggled && stackIndex === 0 && i === 0}
              onDismiss={handleDismiss}
              onAnimationDone={() => dispatch({ type: "ANIMATION_DONE" })}
              onWiggleDone={() => dispatch({ type: "WIGGLE_DONE" })}
            />
          );
        })}

        {/* All dismissed state */}
        {state.currentIndex >= total && (
          <div className="flex h-full items-center justify-center">
            <p className="font-mono text-xs text-muted/40">swipe back or press ↑ to review</p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={handleRewind}
          disabled={state.dismissHistory.length === 0}
          className="flex items-center gap-1.5 rounded-full border border-border/50 px-3 py-1.5 font-mono text-xs text-muted transition-opacity disabled:opacity-20"
          aria-label="Go back to previous card"
        >
          <RotateCcw className="h-3 w-3" />
          back
        </button>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs tracking-[0.15em] text-muted/50">
            {Math.min(state.currentIndex + 1, total)}/{total}
          </span>
          <div className="flex gap-1">
            {experiences.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 w-4 rounded-full transition-colors duration-300",
                  i === state.currentIndex ? "bg-accent" : "bg-border/50",
                )}
              />
            ))}
          </div>
        </div>

        <div className="font-mono text-[10px] text-muted/30">
          ← swipe →
        </div>
      </div>

      {/* Screen reader */}
      <div aria-live="polite" className="sr-only">
        {state.currentIndex < total
          ? `Card ${state.currentIndex + 1} of ${total}: ${experiences[state.currentIndex].role} at ${experiences[state.currentIndex].organization}`
          : `All ${total} cards viewed. Press backspace to go back.`}
      </div>
    </div>
  );
}
