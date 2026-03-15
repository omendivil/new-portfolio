"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";

import { CODE_EDITOR_DWELL_TIME, CODE_SNIPPETS, type CodeSnippet } from "@/data/code-snippets";

import { TypedCode } from "./typed-code";
import { useTypingAnimation } from "./use-typing-animation";

function EditorContent({
  snippet,
  onComplete,
}: {
  snippet: CodeSnippet;
  onComplete: () => void;
}) {
  const { charIndex, isComplete } = useTypingAnimation(
    snippet.lines,
    snippet.typingSpeed ?? 15,
  );

  return (
    <>
      {/* Code area */}
      <div className="flex">
        <div
          className="select-none py-4 pl-3 pr-3 text-right font-mono text-[11px] leading-[1.7em] sm:pl-4 sm:pr-4 sm:text-xs"
          style={{ color: "#4b5263" }}
        >
          {snippet.lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <div className="flex-1 overflow-x-auto py-4 pr-4 font-mono text-[11px] leading-[1.7em] sm:text-xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TypedCode lines={snippet.lines} charIndex={charIndex} isComplete={isComplete} />
        </div>
      </div>

      {/* Progress bar + project label */}
      <div
        className="flex items-center justify-between px-3 py-2 sm:px-4"
        style={{ borderTop: "1px solid var(--editor-border, rgba(255,255,255,0.06))" }}
      >
        <span className="font-mono text-[10px] sm:text-[11px]" style={{ color: "#5c6370" }}>
          {snippet.projectName} / {snippet.filename}
        </span>
      </div>

      {/* Auto-advance progress bar */}
      <div className="h-[2px]" style={{ background: "var(--editor-border, rgba(255,255,255,0.06))" }}>
        <motion.div
          className="h-full"
          style={{ background: "linear-gradient(90deg, #528bff, #c678dd)" }}
          initial={{ width: "0%" }}
          animate={isComplete ? { width: "100%" } : { width: "0%" }}
          transition={
            isComplete
              ? { duration: CODE_EDITOR_DWELL_TIME / 1000, ease: "linear" }
              : { duration: 0 }
          }
          onAnimationComplete={() => {
            if (isComplete) onComplete();
          }}
        />
      </div>
    </>
  );
}

export function CodeEditorAnimation() {
  const [activeTab, setActiveTab] = useState(0);
  const snippet = CODE_SNIPPETS[activeTab];

  const advanceTab = useCallback(() => {
    setActiveTab((prev) => (prev + 1) % CODE_SNIPPETS.length);
  }, []);

  const selectTab = useCallback((index: number) => {
    setActiveTab(index);
  }, []);

  return (
    <div className="mx-auto w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl">
      <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/50">
        from my projects
      </div>

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
          className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            background: "var(--editor-tab-bg, #21252b)",
            borderBottom: "1px solid var(--editor-border, rgba(255,255,255,0.06))",
          }}
        >
          {CODE_SNIPPETS.map((s, i) => (
            <button
              key={s.filename}
              type="button"
              onClick={() => selectTab(i)}
              className="relative shrink-0 px-3 py-2 font-mono text-[11px] transition-colors sm:px-4 sm:text-xs"
              style={{
                color: i === activeTab ? "#abb2bf" : "#5c6370",
                background: i === activeTab ? "var(--editor-bg, #282c34)" : "transparent",
                borderRight: "1px solid var(--editor-border, rgba(255,255,255,0.06))",
              }}
            >
              {s.filename}
              {i === activeTab && (
                <motion.div
                  layoutId="editor-active-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{ background: "#528bff" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Key-based remount resets typing animation on tab switch */}
        <EditorContent
          key={activeTab}
          snippet={snippet}
          onComplete={advanceTab}
        />
      </div>
    </div>
  );
}
