"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, Plus, X } from "lucide-react";
import { useCallback, useState } from "react";

import {
  CODE_EDITOR_DWELL_TIME,
  CODE_SNIPPETS,
  BONUS_SNIPPETS,
  type CodeSnippet,
} from "@/data/code-snippets";

import { TypedCode } from "./typed-code";
import { useTypingAnimation } from "./use-typing-animation";

const VISIBLE_LANGUAGES = ["TypeScript", "Swift", "JavaScript", "Python"];
const HIDDEN_LANGUAGES = ["C", "Java", "SQL", "HTML/CSS", "Bash"];

const SNIPPET_LANGUAGE_MAP: Record<string, string[]> = {
  tsx: ["TypeScript"],
  swift: ["Swift"],
  jsx: ["JavaScript"],
  bash: ["Bash"],
};

const SNIPPET_LOGS: Record<string, { level: string; tag: string; message: string; detail: string }> = {
  "AnimatedText.tsx": {
    level: "INFO",
    tag: "scroll-reveal",
    message: "IntersectionObserver triggers word-by-word animation",
    detail: "stagger delay computed per word index · cubic-bezier easing · once-fire observer",
  },
  "MessageRow.swift": {
    level: "INFO",
    tag: "swiftui-layout",
    message: "Chat bubble mirrors layout based on message role",
    detail: "conditional Spacer + ternary modifiers · theme-driven colors · shadow depth",
  },
  "List.js": {
    level: "INFO",
    tag: "infinite-scroll",
    message: "IntersectionObserver pagination with cooldown guard",
    detail: "ref callback pattern · prevents duplicate fetches · debounce via Date.now()",
  },
  "NetworkManager.swift": {
    level: "INFO",
    tag: "image-cache",
    message: "Three-tier cache: memory → disk → network",
    detail: "NSCache + URLCache + async/await fetch · guard-based error flow",
  },
  "config.sh": {
    level: "INFO",
    tag: "shell-parser",
    message: "Safe key=value config reader — no eval",
    detail: "regex validation for booleans + hex colors · case-based type dispatch",
  },
  "Order.swift": {
    level: "INFO",
    tag: "state-model",
    message: "ObservableObject cart with reduce-computed total",
    detail: "IndexSet deletion for SwiftUI list · @Published reactive updates",
  },
  "Slot.js": {
    level: "INFO",
    tag: "skeleton-ui",
    message: "Early-return skeleton with shimmer placeholders",
    detail: "conditional branch renders loading state · deep property access on API response",
  },
};

const INITIAL_TAB_COUNT = 3;

function EditorContent({
  snippet,
  onComplete,
}: {
  snippet: CodeSnippet;
  onComplete: () => void;
}) {
  const { charIndex, isComplete, totalChars, skip } = useTypingAnimation(
    snippet.lines,
    snippet.typingSpeed ?? 25,
  );

  return (
    <>
      <div className="flex">
        <div
          className="select-none py-4 pl-3 pr-3 text-right font-mono text-[11px] leading-[1.7em] sm:pl-4 sm:pr-4 sm:text-xs"
          style={{ color: "#4b5263" }}
        >
          {snippet.lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="relative flex-1 overflow-x-auto py-4 pr-4 font-mono text-[11px] leading-[1.7em] sm:text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TypedCode
            lines={snippet.lines}
            charIndex={charIndex}
            isComplete={isComplete}
            showGhost={!isComplete}
          />
        </div>
      </div>

      <div
        className="flex items-center justify-between px-3 py-2 sm:px-4"
        style={{ borderTop: "1px solid var(--editor-border, rgba(255,255,255,0.06))" }}
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] sm:text-[11px]" style={{ color: "#5c6370" }}>
            {snippet.projectName}
          </span>
          {!isComplete && (
            <button
              type="button"
              onClick={() => skip(totalChars)}
              className="rounded px-2 py-0.5 font-mono text-[9px] animate-[blink_2s_ease-in-out_infinite] sm:text-[10px]"
              style={{
                background: "rgba(82, 139, 255, 0.1)",
                border: "1px solid rgba(82, 139, 255, 0.2)",
                color: "#528bff",
              }}
            >
              tab ⇥ autofill
            </button>
          )}
        </div>

        <div className="relative h-5 w-5">
          <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
            <motion.circle
              cx="10" cy="10" r="8" fill="none" stroke="#528bff" strokeWidth="2" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 8}
              initial={{ strokeDashoffset: 2 * Math.PI * 8 }}
              animate={isComplete ? { strokeDashoffset: 0 } : { strokeDashoffset: 2 * Math.PI * 8 }}
              transition={isComplete ? { duration: CODE_EDITOR_DWELL_TIME / 1000, ease: "linear" } : { duration: 0 }}
              onAnimationComplete={() => { if (isComplete) onComplete(); }}
            />
          </svg>
        </div>
      </div>
    </>
  );
}

function PixelJedi() {
  // Simple CSS pixel art — a jedi deflecting lasers
  const rows = [
    "..........RR..........",
    "........RRRRRR........",
    ".......RR.RR.RR.......",
    ".......RRRRRRRR.......",
    "........BBBBBB........",
    ".......BBBBBBBB.......",
    "GGGG..BBBB.BBBBB.....",
    ".GGGG.BBB...BBBB.....",
    "..GGGBBBB...BBBB.....",
    "...GGBBBB..BBBBB.....",
    "........BBBBBB........",
    ".......BB....BB.......",
    "......BB......BB......",
  ];
  const colors: Record<string, string> = { R: "#c8a87a", B: "#4a6fa5", G: "#28c840" };
  const px = 3;

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div style={{ imageRendering: "pixelated" }}>
        {rows.map((row, y) => (
          <div key={y} className="flex">
            {row.split("").map((cell, x) => (
              <div
                key={x}
                style={{
                  width: px,
                  height: px,
                  background: colors[cell] ?? "transparent",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Laser bolts */}
      <div className="flex items-center gap-1">
        <div className="h-[2px] w-6 animate-pulse bg-red-500/60" />
        <div className="h-[2px] w-4 animate-pulse bg-red-500/40" style={{ animationDelay: "0.3s" }} />
        <div className="h-[2px] w-8 animate-pulse bg-red-500/50" style={{ animationDelay: "0.6s" }} />
      </div>
      <p className="font-mono text-[10px] text-muted/30">all tabs closed — open one to continue</p>
    </div>
  );
}

export function CodeEditorAnimation() {
  const [activeTab, setActiveTab] = useState(0);
  const [revealedBonusCount, setRevealedBonusCount] = useState(0);
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const [closedTabs, setClosedTabs] = useState<Set<number>>(new Set());

  // Compute visible snippets
  const allAvailable = [...CODE_SNIPPETS, ...BONUS_SNIPPETS];
  const displaySnippets = allAvailable
    .slice(0, INITIAL_TAB_COUNT + revealedBonusCount)
    .map((s, i) => ({ ...s, globalIndex: i }))
    .filter((_, i) => !closedTabs.has(i));

  const currentSnippet = displaySnippets.find((_, i) => i === activeTab) ?? displaySnippets[0];
  const hasMore = INITIAL_TAB_COUNT + revealedBonusCount < allAvailable.length;
  const allClosed = displaySnippets.length === 0;
  const snippetCount = displaySnippets.length;

  const advanceTab = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % Math.max(snippetCount, 1));
  }, [snippetCount]);

  const selectTab = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  const handleRevealNext = useCallback(() => {
    setRevealedBonusCount((prev) => prev + 1);
    // Navigate to the new tab
    setActiveTab(displaySnippets.length);
  }, [displaySnippets.length]);

  const handleCloseTab = useCallback((displayIndex: number) => {
    const snippet = displaySnippets[displayIndex];
    if (!snippet) return;
    setClosedTabs((prev) => new Set(prev).add(snippet.globalIndex));
    if (activeTab >= displaySnippets.length - 1) {
      setActiveTab(Math.max(0, displaySnippets.length - 2));
    } else if (displayIndex <= activeTab) {
      setActiveTab((prev) => Math.max(0, prev - 1));
    }
  }, [displaySnippets, activeTab]);

  const activeSkills = currentSnippet ? (SNIPPET_LANGUAGE_MAP[currentSnippet.language] ?? []) : [];
  const logEntry = currentSnippet ? SNIPPET_LOGS[currentSnippet.filename] : null;

  return (
    <div className="mx-auto w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl">
      {/* Section heading */}
      <div className="mb-4">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/50">
          Languages
        </div>

        {/* Language badges */}
        <div className="flex flex-wrap items-center gap-2">
          {VISIBLE_LANGUAGES.map((lang) => {
            const isActive = activeSkills.includes(lang);
            return (
              <span
                key={lang}
                className="rounded-md px-2.5 py-1 font-mono text-[11px] transition-all sm:text-xs"
                style={{
                  background: isActive ? "rgba(82, 139, 255, 0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "rgba(82, 139, 255, 0.3)" : "rgba(255,255,255,0.06)"}`,
                  color: isActive ? "#528bff" : "#666",
                }}
              >
                {lang}
              </span>
            );
          })}

          <AnimatePresence>
            {showAllLanguages && HIDDEN_LANGUAGES.map((lang) => {
              const isActive = activeSkills.includes(lang);
              return (
                <motion.span
                  key={lang}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="rounded-md px-2.5 py-1 font-mono text-[11px] transition-all sm:text-xs"
                  style={{
                    background: isActive ? "rgba(82, 139, 255, 0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isActive ? "rgba(82, 139, 255, 0.3)" : "rgba(255,255,255,0.06)"}`,
                    color: isActive ? "#528bff" : "#555",
                  }}
                >
                  {lang}
                </motion.span>
              );
            })}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setShowAllLanguages((v) => !v)}
            className="flex items-center gap-0.5 rounded-md px-2 py-1 font-mono text-[11px] transition-colors hover:text-text sm:text-xs"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              color: "#555",
            }}
          >
            {showAllLanguages ? (
              <><ChevronUp className="h-3 w-3" />less</>
            ) : (
              <>+{HIDDEN_LANGUAGES.length}<ChevronDown className="h-3 w-3" /></>
            )}
          </button>
        </div>
      </div>

      {/* Log entry — terminal style */}
      {logEntry && !allClosed && (
        <div
          className="mb-4 rounded-md px-3 py-2 font-mono text-[10px] leading-relaxed sm:text-[11px]"
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div className="flex items-start gap-2">
            <span style={{ color: "#5c6370" }}>
              {new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
            <span style={{ color: "#28c840" }}>{logEntry.level}</span>
            <span style={{ color: "#5c6370" }}>[</span>
            <span style={{ color: "#528bff" }}>{logEntry.tag}</span>
            <span style={{ color: "#5c6370" }}>]</span>
            <span style={{ color: "#abb2bf" }}>{logEntry.message}</span>
          </div>
          <div className="mt-0.5 pl-[4.5rem]">
            <span style={{ color: "#5c6370" }}>↳ </span>
            <span style={{ color: "#666" }}>{logEntry.detail}</span>
          </div>
        </div>
      )}

      {/* Editor container */}
      <div
        className="overflow-hidden rounded-xl"
        style={{
          background: "var(--editor-bg, #282c34)",
          border: "1px solid var(--editor-border, rgba(255,255,255,0.06))",
          boxShadow: "0 0 20px rgba(82, 139, 255, 0.08), 0 0 40px rgba(82, 139, 255, 0.04)",
        }}
      >
        {/* Tab bar */}
        <div
          className="flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            background: "var(--editor-tab-bg, #21252b)",
            borderBottom: "1px solid var(--editor-border, rgba(255,255,255,0.06))",
          }}
        >
          {displaySnippets.map((s, i) => (
            <div
              key={s.filename}
              className="group relative flex shrink-0 items-center"
              style={{
                background: i === activeTab ? "var(--editor-bg, #282c34)" : "transparent",
                borderRight: "1px solid var(--editor-border, rgba(255,255,255,0.06))",
              }}
            >
              <button
                type="button"
                onClick={() => selectTab(i)}
                className="px-3 py-2 font-mono text-[11px] transition-colors sm:px-4 sm:text-xs"
                style={{ color: i === activeTab ? "#abb2bf" : "#5c6370" }}
              >
                {s.filename}
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleCloseTab(i); }}
                className="mr-1 flex h-4 w-4 items-center justify-center rounded opacity-0 transition-opacity hover:bg-white/10 group-hover:opacity-100"
                style={{ color: "#5c6370" }}
                aria-label={`Close ${s.filename}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
              {i === activeTab && (
                <motion.div
                  layoutId="editor-active-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: "#528bff" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </div>
          ))}

          {hasMore && (
            <button
              type="button"
              onClick={handleRevealNext}
              className="flex shrink-0 items-center gap-1 px-3 py-2 font-mono text-[11px] transition-colors animate-[blink_3s_ease-in-out_infinite] hover:text-[#abb2bf] sm:text-xs"
              style={{ color: "#528bff" }}
              title="Open another code example"
            >
              <Plus className="h-3 w-3" />
              <span className="hidden sm:inline">more</span>
            </button>
          )}
        </div>

        {/* Editor content or easter egg */}
        {allClosed ? (
          <PixelJedi />
        ) : currentSnippet ? (
          <EditorContent
            key={`${currentSnippet.filename}-${activeTab}`}
            snippet={currentSnippet}
            onComplete={advanceTab}
          />
        ) : null}
      </div>
    </div>
  );
}
