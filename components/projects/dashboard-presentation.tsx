"use client";

import { motion } from "framer-motion";

import { motionEase, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Workspace", active: true },
  { label: "Agents", active: false },
  { label: "Library", active: false },
  { label: "Atlas", active: false },
];

const AGENT_DOTS = [
  { color: "bg-emerald-400", delay: 0 },
  { color: "bg-orange-400", delay: 0.4 },
  { color: "bg-violet-400", delay: 0.8 },
  { color: "bg-sky-400", delay: 1.2 },
];

type DomainCard = {
  name: string;
  count: number;
  accent: string;
  glowColor: string;
  items: string[];
};

const DOMAINS: DomainCard[] = [
  {
    name: "Jobs",
    count: 60,
    accent: "text-orange-400",
    glowColor: "bg-orange-400/80",
    items: ["Staff Frontend — Stripe", "Senior Full-Stack — Linear"],
  },
  {
    name: "Dev Research",
    count: 127,
    accent: "text-emerald-400",
    glowColor: "bg-emerald-400/80",
    items: ["React Server Components deep-dive", "Edge runtime benchmarks"],
  },
  {
    name: "Marketing",
    count: 83,
    accent: "text-sky-400",
    glowColor: "bg-sky-400/80",
    items: ["Brand positioning analysis", "Content calendar Q2"],
  },
  {
    name: "Business",
    count: 50,
    accent: "text-pink-400",
    glowColor: "bg-pink-400/80",
    items: ["Revenue model comparison", "Competitor landscape"],
  },
  {
    name: "Security",
    count: 32,
    accent: "text-violet-400",
    glowColor: "bg-violet-400/80",
    items: ["CVE triage pipeline", "Dependency audit report"],
  },
  {
    name: "Video",
    count: 8,
    accent: "text-yellow-400",
    glowColor: "bg-yellow-400/80",
    items: ["Demo reel storyboard"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.3 + i * 0.07,
      duration: 0.45,
      ease: motionEase,
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.4,
      ease: motionEase,
    },
  }),
};

export function DashboardPresentation() {
  const { reduceMotion } = useMotionPreference();

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#08090a]">
      {/* Subtle radial ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(120,119,198,0.05),transparent)]" />

      <div className="relative flex h-full flex-col px-3 py-2.5 sm:px-5 sm:py-3.5">
        {/* Top bar */}
        <motion.div
          className="flex items-center justify-between border-b border-white/[0.06] pb-2"
          variants={fadeUp}
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          custom={0.1}
        >
          {/* Tabs */}
          <div className="flex items-center gap-0.5">
            {TABS.map((tab) => (
              <span
                key={tab.label}
                className={cn(
                  "rounded px-1.5 py-0.5 font-mono text-[8px] tracking-wide transition-colors sm:px-2 sm:text-[10px]",
                  tab.active
                    ? "bg-white/[0.08] text-white/90"
                    : "text-white/30 hover:text-white/50",
                )}
              >
                {tab.label}
              </span>
            ))}
          </div>

          {/* Agent dots */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="mr-1 hidden font-mono text-[7px] tracking-wider text-white/20 sm:inline sm:text-[8px]">
              AGENTS
            </span>
            {AGENT_DOTS.map((dot, i) => (
              <motion.span
                key={i}
                className={cn("block size-1.5 rounded-full sm:size-2", dot.color)}
                animate={
                  reduceMotion
                    ? {}
                    : {
                        opacity: [0.4, 1, 0.4],
                        scale: [0.85, 1.1, 0.85],
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        duration: 2.4,
                        repeat: Infinity,
                        delay: dot.delay,
                        ease: "easeInOut",
                      }
                }
              />
            ))}
          </div>
        </motion.div>

        {/* Cards grid */}
        <div className="mt-2 grid flex-1 grid-cols-3 gap-1.5 sm:mt-3 sm:gap-2">
          {DOMAINS.map((domain, i) => (
            <motion.div
              key={domain.name}
              className="relative overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
              variants={cardVariants}
              initial={reduceMotion ? "visible" : "hidden"}
              animate="visible"
              custom={i}
            >
              {/* Colored top glow line */}
              <div
                className={cn(
                  "absolute left-0 right-0 top-0 h-px",
                  domain.glowColor,
                )}
              />
              {/* Softer glow bleed below the line */}
              <div
                className={cn(
                  "pointer-events-none absolute left-1/2 top-0 h-4 w-3/4 -translate-x-1/2 opacity-20 blur-md",
                  domain.glowColor,
                )}
              />

              <div className="relative p-1.5 sm:p-2.5">
                {/* Domain header */}
                <div className="flex items-baseline justify-between">
                  <span className="text-[8px] font-medium tracking-wide text-white/70 sm:text-[10px]">
                    {domain.name}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[9px] font-semibold tabular-nums sm:text-xs",
                      domain.accent,
                    )}
                  >
                    {domain.count}
                  </span>
                </div>

                {/* Preview items */}
                <div className="mt-1 space-y-0.5 sm:mt-1.5">
                  {domain.items.map((item) => (
                    <p
                      key={item}
                      className="truncate text-[6px] leading-tight text-white/25 sm:text-[8px]"
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Status bar */}
        <motion.div
          className="mt-auto flex items-center justify-center gap-1.5 border-t border-white/[0.04] pt-1.5 sm:gap-2.5 sm:pt-2"
          variants={fadeUp}
          initial={reduceMotion ? "visible" : "hidden"}
          animate="visible"
          custom={0.8}
        >
          <span className="font-mono text-[6px] tracking-wider text-white/20 sm:text-[8px]">
            Atlas
          </span>
          <span className="text-[5px] text-white/10 sm:text-[7px]">
            /
          </span>
          <span className="font-mono text-[6px] tabular-nums text-white/15 sm:text-[8px]">
            357 research
          </span>
          <span className="text-[5px] text-white/10 sm:text-[7px]">
            /
          </span>
          <span className="font-mono text-[6px] tabular-nums text-white/15 sm:text-[8px]">
            86 jobs
          </span>
          <span className="text-[5px] text-white/10 sm:text-[7px]">
            /
          </span>
          <span className="font-mono text-[6px] tabular-nums text-white/15 sm:text-[8px]">
            795 actions
          </span>
        </motion.div>
      </div>
    </div>
  );
}
