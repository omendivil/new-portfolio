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
  const [paused, setPaused] = useState(false);

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
            charIndex={paused ? totalChars : charIndex}
            isComplete={paused || isComplete}
            showGhost={!paused && !isComplete}
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
          {!isComplete && !paused && (
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

        <div className="flex items-center gap-2">
          {/* Show & pause / resume button */}
          <button
            type="button"
            onClick={() => {
              if (!paused) {
                skip(totalChars);
                setPaused(true);
              } else {
                setPaused(false);
              }
            }}
            className="rounded px-2 py-0.5 font-mono text-[9px] transition-colors hover:brightness-125 sm:text-[10px]"
            style={{
              background: paused ? "rgba(40, 200, 64, 0.1)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${paused ? "rgba(40, 200, 64, 0.25)" : "rgba(255,255,255,0.08)"}`,
              color: paused ? "#28c840" : "#5c6370",
            }}
          >
            {paused ? "▸ resume" : "⏸ pause"}
          </button>

          {/* Circular timer */}
          <div className="relative h-5 w-5">
            <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
              {!paused && (
                <motion.circle
                  cx="10" cy="10" r="8" fill="none" stroke="#528bff" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 8}
                  initial={{ strokeDashoffset: 2 * Math.PI * 8 }}
                  animate={isComplete ? { strokeDashoffset: 0 } : { strokeDashoffset: 2 * Math.PI * 8 }}
                  transition={isComplete ? { duration: CODE_EDITOR_DWELL_TIME / 1000, ease: "linear" } : { duration: 0 }}
                  onAnimationComplete={() => { if (isComplete && !paused) onComplete(); }}
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}

function PixelSprite({ pixels, scale = 4 }: { pixels: string[]; scale?: number }) {
  const colors: Record<string, string> = {
    W: "#e0e0e0", w: "#c0c0c0", B: "#111", b: "#333",
    G: "#666", g: "#888", K: "#1a1a1a", k: "#2d2d2d",
    R: "#cc2020", H: "#c8a87a", C: "#444", D: "#222",
  };
  return (
    <div style={{ imageRendering: "pixelated" }}>
      {pixels.map((row, y) => (
        <div key={y} className="flex">
          {row.split("").map((c, x) => (
            <div key={x} style={{ width: scale, height: scale, background: colors[c] ?? "transparent" }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function PixelBattle() {
  // Stormtrooper: white helmet, T-visor, armor, black blaster extending right
  const trooper = [
    "..WWW......",
    ".WWWWW.....",
    ".WB.BW.....",
    ".WBBBW.....",
    "..WWW......",
    "..GGG......",
    ".WWWWW.....",
    ".WWWWWBBBB.",
    ".WW.WW.....",
    ".WW..WW....",
    "..W...W....",
  ];

  // Back trooper: same but slightly different pose
  const trooperBack = [
    "..WWW......",
    ".WWWWW.....",
    ".WB.BW.....",
    ".WBBBW.....",
    "..WWW......",
    "..GGG......",
    ".WWWWW.....",
    ".WWWWWBBB..",
    ".WW.WW.....",
    ".WW..WW....",
    "..W...W....",
  ];

  // Darth Vader: black dome, angular mask, chest panel, cape flowing
  const vader = [
    "...KKK...",
    "..KKKKK..",
    ".KKKKKKK.",
    ".KKbKbKK.",
    ".KKKKKKK.",
    "..KgggK..",
    "DKKKKKKK.",
    "DKKRKRKK.",
    "DKKKKKKK.",
    "DKK..KKD.",
    ".KK..KK..",
    "..K...K..",
  ];

  return (
    <div className="flex flex-col items-center py-8">
      <div className="relative flex w-full max-w-md items-center justify-center gap-24 px-8" style={{ minHeight: 80 }}>

        {/* Back stormtrooper (faded, offset up-left) */}
        <div className="absolute left-6 -top-1 opacity-30">
          <PixelSprite pixels={trooperBack} scale={3} />
          {/* Back trooper bolt */}
          <motion.div
            className="absolute rounded-full"
            style={{
              height: 2, width: 8,
              background: "#ff2020",
              boxShadow: "0 0 6px rgba(255,32,32,0.6)",
              right: -12, top: 18,
            }}
            animate={{ x: [0, 70, 70], opacity: [1, 1, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.4, times: [0, 0.7, 1] }}
          />
        </div>

        {/* Front stormtrooper */}
        <div className="relative z-10">
          <PixelSprite pixels={trooper} scale={4} />
          {/* Front trooper bolt — starts at blaster tip */}
          <motion.div
            className="absolute rounded-full"
            style={{
              height: 3, width: 12,
              background: "#ff2020",
              boxShadow: "0 0 10px rgba(255,32,32,0.8), 0 0 20px rgba(255,32,32,0.3)",
              right: -16, top: 28,
            }}
            animate={{ x: [0, 55, 55], opacity: [1, 1, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0, times: [0, 0.7, 1] }}
          />
        </div>

        {/* Darth Vader with red lightsaber */}
        <div className="relative z-10">
          {/* Red lightsaber — between Vader and troopers, blocking bolts */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 36,
              background: "#ff2020",
              boxShadow: "0 0 14px rgba(255,32,32,0.8), 0 0 28px rgba(255,32,32,0.3)",
              left: -6,
              top: -4,
              transformOrigin: "50% 90%",
            }}
            animate={{ rotate: [-35, -10, -35] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <PixelSprite pixels={vader} scale={4} />
        </div>
      </div>

      <p className="mt-6 font-mono text-[10px] text-muted/30">all tabs closed — open one to continue</p>
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
          <div>
            <span style={{ color: "#28c840" }}>{logEntry.level}</span>
            <span style={{ color: "#5c6370" }}> [</span>
            <span style={{ color: "#528bff" }}>{logEntry.tag}</span>
            <span style={{ color: "#5c6370" }}>] </span>
            <span style={{ color: "#abb2bf" }}>{logEntry.message}</span>
          </div>
          <div className="mt-0.5">
            <span style={{ color: "#5c6370" }}>  ↳ </span>
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
                className="mr-1.5 flex h-5 w-5 items-center justify-center rounded opacity-60 transition-opacity hover:bg-white/10 hover:opacity-100"
                style={{ color: i === activeTab ? "#ffffff" : "#5c6370" }}
                aria-label={`Close ${s.filename}`}
              >
                <X className="h-3 w-3" />
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
