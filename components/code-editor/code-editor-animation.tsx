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
    tag: "groundworks",
    message: "Text that reveals itself word by word as you scroll down the page",
    detail: "built for the Groundworks Studio website · watches when elements enter the screen",
  },
  "MessageRow.swift": {
    level: "INFO",
    tag: "atlas-chat",
    message: "A chat bubble that flips sides depending on who sent the message",
    detail: "part of an iOS chat app · user messages go right, AI responses go left",
  },
  "List.js": {
    level: "INFO",
    tag: "anime-browser",
    message: "Loads more content automatically as you scroll to the bottom",
    detail: "built for an anime browsing app · prevents loading the same data twice",
  },
  "NetworkManager.swift": {
    level: "INFO",
    tag: "appetizer",
    message: "Saves images locally so the app doesn't re-download them every time",
    detail: "checks memory first, then disk, then fetches from the network as a last resort",
  },
  "config.sh": {
    level: "INFO",
    tag: "claude-notifier",
    message: "Reads settings from a config file and validates each value before using it",
    detail: "a terminal tool I built to get notifications from Claude Code sessions",
  },
  "Order.swift": {
    level: "INFO",
    tag: "appetizer",
    message: "A shopping cart that instantly updates the total when items are added or removed",
    detail: "part of a food ordering app · uses SwiftUI's reactive state system",
  },
  "Slot.js": {
    level: "INFO",
    tag: "anime-browser",
    message: "Shows placeholder shapes while real content loads from the API",
    detail: "prevents layout jumping · swaps to real images once data arrives",
  },
  "ChatViewModel.swift": {
    level: "INFO",
    tag: "atlas-chat",
    message: "Sends a message and waits for the AI to respond, rolls back if it fails",
    detail: "optimistic UI update · appends message immediately, removes on error",
  },
  "blink.sh": {
    level: "INFO",
    tag: "claude-notifier",
    message: "Flashes the terminal tab different colors based on what Claude is doing",
    detail: "permission requests blink fast · completed tasks blink slow · PID-tracked",
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

function PixelBattle() {
  return (
    <div className="flex flex-col items-center py-10">
      {/* Battle scene */}
      <div className="relative flex w-full max-w-xs items-center justify-between px-6 py-8">
        {/* Stormtrooper (left) */}
        <div className="flex flex-col items-center gap-1" style={{ imageRendering: "pixelated" as React.CSSProperties["imageRendering"] }}>
          <div className="grid grid-cols-5 gap-px">
            {[
              "WWWWW", ".WBW.", "WWWWW", ".GGG.", "GGGGG", "G.G.G", ".G.G.",
            ].map((row, y) =>
              row.split("").map((c, x) => (
                <div key={`s1-${y}-${x}`} className="h-[4px] w-[4px]" style={{
                  background: c === "W" ? "#e8e8e8" : c === "B" ? "#222" : c === "G" ? "#888" : "transparent",
                }} />
              ))
            )}
          </div>
        </div>

        {/* Laser bolts flying right → left, some deflected */}
        <div className="absolute inset-x-16 top-1/2 flex flex-col gap-3 -translate-y-1/2">
          <motion.div
            className="h-[2px] w-5 rounded bg-red-500"
            style={{ boxShadow: "0 0 6px rgba(255,0,0,0.5)" }}
            animate={{ x: [0, 60, 60], opacity: [1, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="h-[2px] w-4 rounded bg-red-500/80"
            style={{ boxShadow: "0 0 4px rgba(255,0,0,0.4)" }}
            animate={{ x: [0, 40, 40], y: [0, 0, -20], opacity: [1, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
          <motion.div
            className="h-[2px] w-6 rounded bg-red-500/90"
            style={{ boxShadow: "0 0 5px rgba(255,0,0,0.5)" }}
            animate={{ x: [0, 50, 50], y: [0, 0, 15], opacity: [1, 1, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: 0.8 }}
          />
        </div>

        {/* Jedi (right) with lightsaber */}
        <div className="flex flex-col items-center gap-1" style={{ imageRendering: "pixelated" as React.CSSProperties["imageRendering"] }}>
          <div className="grid grid-cols-5 gap-px">
            {[
              ".HHH.", "HHHHH", "H.H.H", ".BBB.", "BBBBB", "B.B.B", ".B.B.",
            ].map((row, y) =>
              row.split("").map((c, x) => (
                <div key={`j-${y}-${x}`} className="h-[4px] w-[4px]" style={{
                  background: c === "H" ? "#c8a87a" : c === "B" ? "#4a6fa5" : "transparent",
                }} />
              ))
            )}
          </div>
          {/* Lightsaber */}
          <motion.div
            className="absolute -left-2 h-[2px] w-8 rounded"
            style={{ background: "#28c840", boxShadow: "0 0 8px rgba(40,200,64,0.6)", top: "50%" }}
            animate={{ rotate: [-10, 10, -10] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        </div>

        {/* Second stormtrooper (far left, smaller) */}
        <div className="absolute left-2 top-2 opacity-40" style={{ imageRendering: "pixelated" as React.CSSProperties["imageRendering"] }}>
          <div className="grid grid-cols-3 gap-px">
            {["WWW", "WBW", "WWW", ".G.", "GGG"].map((row, y) =>
              row.split("").map((c, x) => (
                <div key={`s2-${y}-${x}`} className="h-[3px] w-[3px]" style={{
                  background: c === "W" ? "#e8e8e8" : c === "B" ? "#222" : c === "G" ? "#888" : "transparent",
                }} />
              ))
            )}
          </div>
        </div>
      </div>

      <p className="mt-2 font-mono text-[10px] text-muted/30">all tabs closed — open one to continue</p>
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
          <PixelBattle />
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
