"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Terminal line definitions                                          */
/* ------------------------------------------------------------------ */

type TerminalLine = {
  text: string;
  color?: string;
  delay?: number; // ms before this line appears (after previous)
};

const ARCH_DRIFT_LINES: TerminalLine[] = [
  { text: "$ arch-drift init", color: "#e6edf3", delay: 400 },
  { text: "Scanning 847 files...", color: "#666", delay: 600 },
  { text: "Detected 4 layers: components, hooks, lib, data", color: "#666", delay: 500 },
  { text: "Generated architecture.yml", color: "#4ade80", delay: 400 },
  { text: "", delay: 300 },
  { text: "$ arch-drift check", color: "#e6edf3", delay: 500 },
  { text: "Checking boundaries...", color: "#666", delay: 700 },
  { text: "", delay: 200 },
  { text: "WARN  components \u2192 lib/db (boundary violation)", color: "#fbbf24", delay: 400 },
  { text: "  components/editor/index.tsx imports lib/db", color: "#666", delay: 200 },
  { text: "  Allowed: hooks, lib (not lib/db directly)", color: "#666", delay: 200 },
  { text: "", delay: 200 },
  { text: "Found 1 warning, 0 errors", color: "#fbbf24", delay: 300 },
];

const NOTIFIER_HOOK_LINES: TerminalLine[] = [
  { text: "[hook] PreToolUse \u2192 claude-1 needs permission", color: "#fbbf24", delay: 600 },
  { text: "[hook] Stop \u2192 claude-2 finished (3 tools, 12s)", color: "#4ade80", delay: 800 },
  { text: "[hook] PostToolUse \u2192 claude-3 working...", color: "#60a5fa", delay: 700 },
];

/* ------------------------------------------------------------------ */
/*  Kitty tab bar (Claude Notifier only)                              */
/* ------------------------------------------------------------------ */

type KittyTab = {
  label: string;
  indicator?: "amber" | "green" | "blue";
  active?: boolean;
};

const KITTY_TABS: KittyTab[] = [
  { label: "claude-1", indicator: "amber" },
  { label: "claude-2", indicator: "green" },
  { label: "claude-3", indicator: "blue" },
  { label: "zsh", active: true },
];

const INDICATOR_COLORS: Record<string, string> = {
  amber: "#fbbf24",
  green: "#4ade80",
  blue: "#60a5fa",
};

const INDICATOR_KEYFRAMES: Record<string, string> = {
  amber: "terminal-blink-amber",
  green: "terminal-pulse-green",
  blue: "terminal-flash-blue",
};

function KittyTabBar({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="flex items-stretch border-b border-[#222] bg-[#111]">
      {KITTY_TABS.map((tab) => (
        <div
          key={tab.label}
          className={cn(
            "relative flex items-center gap-2 px-4 py-2 font-mono text-[11px]",
            tab.active
              ? "bg-[#08090a] text-[#e6edf3]"
              : "text-[#666] hover:text-[#999]",
          )}
        >
          {tab.indicator && (
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: INDICATOR_COLORS[tab.indicator],
                animation: reduceMotion
                  ? "none"
                  : `${INDICATOR_KEYFRAMES[tab.indicator]} ${tab.indicator === "amber" ? "1.2s" : tab.indicator === "green" ? "2s" : "0.8s"} ease-in-out infinite`,
              }}
            />
          )}
          <span>{tab.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Typing engine hook                                                 */
/* ------------------------------------------------------------------ */

function useTerminalTyping(lines: TerminalLine[], reduceMotion: boolean) {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [currentTyped, setCurrentTyped] = useState("");
  const [lineIndex, setLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  // Show final state immediately for reduced motion
  useEffect(() => {
    if (reduceMotion) {
      setVisibleLines(lines);
      setLineIndex(lines.length);
      setIsTyping(false);
    }
  }, [reduceMotion, lines]);

  // Typing animation
  useEffect(() => {
    if (reduceMotion) return;
    if (lineIndex >= lines.length) {
      setIsTyping(false);
      return;
    }

    const line = lines[lineIndex];
    const delay = line.delay ?? 300;

    timerRef.current = setTimeout(() => {
      // Empty lines appear instantly
      if (line.text === "") {
        setVisibleLines((prev) => [...prev, line]);
        setLineIndex((prev) => prev + 1);
        return;
      }

      // Command lines (starting with $) get typed character by character
      const isCommand = line.text.startsWith("$");
      if (isCommand) {
        setIsTyping(true);
        let charIdx = 0;
        setCurrentTyped("");

        intervalRef.current = setInterval(() => {
          charIdx++;
          if (charIdx <= line.text.length) {
            setCurrentTyped(line.text.slice(0, charIdx));
          } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setIsTyping(false);
            setVisibleLines((prev) => [...prev, line]);
            setCurrentTyped("");
            setLineIndex((prev) => prev + 1);
          }
        }, 32 + Math.random() * 18);
      } else {
        // Non-command lines fade in instantly
        setVisibleLines((prev) => [...prev, line]);
        setLineIndex((prev) => prev + 1);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [lineIndex, lines, reduceMotion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { visibleLines, currentTyped, isTyping, isDone: lineIndex >= lines.length };
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

type TerminalPresentationProps = {
  projectId: string;
};

export function TerminalPresentation({ projectId }: TerminalPresentationProps) {
  const { reduceMotion } = useMotionPreference();

  const isNotifier = projectId === "claude-notifier";
  const lines = isNotifier ? NOTIFIER_HOOK_LINES : ARCH_DRIFT_LINES;
  const { visibleLines, currentTyped, isTyping, isDone } = useTerminalTyping(lines, reduceMotion);

  return (
    <>
      {/* Keyframe animations for tab indicators */}
      <style>{`
        @keyframes terminal-blink-amber {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
        @keyframes terminal-pulse-green {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes terminal-flash-blue {
          0%, 100% { opacity: 1; }
          30% { opacity: 0.3; }
          60% { opacity: 1; }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden rounded-lg border border-[#1a1a1a]"
        style={{ aspectRatio: "16 / 10" }}
      >
        {/* Background */}
        <div className="absolute inset-0 bg-[#08090a]" />

        <div className="relative flex h-full flex-col">
          {/* Top bar */}
          {isNotifier ? (
            <KittyTabBar reduceMotion={reduceMotion} />
          ) : (
            <div className="flex items-center gap-2 border-b border-[#1a1a1a] px-3 py-2">
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-[#f87171]/80" />
                <div className="h-2 w-2 rounded-full bg-[#fbbf24]/80" />
              </div>
              <span className="ml-1 font-mono text-[10px] text-[#444]">arch-drift</span>
            </div>
          )}

          {/* Terminal body */}
          <div className="flex-1 overflow-hidden p-4 font-mono text-[11px] leading-[1.7] sm:text-[13px]">
            {visibleLines.map((line, i) => (
              <motion.div
                key={`${i}-${line.text.slice(0, 20)}`}
                initial={reduceMotion ? false : { opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {line.text === "" ? (
                  <div className="h-[1em]" />
                ) : (
                  <div style={{ color: line.color ?? "#666" }}>
                    {line.text.startsWith("$") ? (
                      <>
                        <span className="text-[#4ade80]">$</span>
                        <span className="text-[#e6edf3]">{line.text.slice(1)}</span>
                      </>
                    ) : line.text.startsWith("WARN") ? (
                      <>
                        <span className="text-[#fbbf24]">WARN</span>
                        <span style={{ color: line.color }}>{line.text.slice(4)}</span>
                      </>
                    ) : (
                      line.text
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Currently typing line */}
            {isTyping && currentTyped && (
              <div className="flex items-center">
                <span className="text-[#4ade80]">$</span>
                <span className="text-[#e6edf3]">{currentTyped.slice(1)}</span>
                <span className="ml-0.5 inline-block h-[14px] w-[6px] animate-pulse bg-[#4ade80]/70" />
              </div>
            )}

            {/* Blinking cursor after completion */}
            {isDone && !isTyping && (
              <div className="mt-1 flex items-center">
                <span className="text-[#4ade80]">$</span>
                <span className="ml-1 inline-block h-[14px] w-[6px] animate-pulse bg-[#4ade80]/70" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
