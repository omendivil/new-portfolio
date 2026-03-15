"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";

import { CODE_EDITOR_DWELL_TIME, CODE_SNIPPETS, type CodeSnippet } from "@/data/code-snippets";

import { TypedCode } from "./typed-code";
import { useTypingAnimation } from "./use-typing-animation";

const LANGUAGE_LABELS: Record<string, string> = {
  tsx: "TypeScript",
  swift: "Swift",
  jsx: "JavaScript",
  bash: "Bash",
};

function EditorContent({
  snippet,
  onComplete,
}: {
  snippet: CodeSnippet;
  onComplete: () => void;
}) {
  const { charIndex, isComplete } = useTypingAnimation(
    snippet.lines,
    snippet.typingSpeed ?? 25,
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

      {/* Bottom bar: project name left, circular timer right */}
      <div
        className="flex items-center justify-between px-3 py-2 sm:px-4"
        style={{ borderTop: "1px solid var(--editor-border, rgba(255,255,255,0.06))" }}
      >
        <span className="font-mono text-[10px] sm:text-[11px]" style={{ color: "#5c6370" }}>
          {snippet.projectName}
        </span>

        {/* Circular timer */}
        <div className="relative h-5 w-5">
          <svg className="h-5 w-5 -rotate-90" viewBox="0 0 20 20">
            <circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="2"
            />
            <motion.circle
              cx="10"
              cy="10"
              r="8"
              fill="none"
              stroke="#528bff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 8}
              initial={{ strokeDashoffset: 2 * Math.PI * 8 }}
              animate={
                isComplete
                  ? { strokeDashoffset: 0 }
                  : { strokeDashoffset: 2 * Math.PI * 8 }
              }
              transition={
                isComplete
                  ? { duration: CODE_EDITOR_DWELL_TIME / 1000, ease: "linear" }
                  : { duration: 0 }
              }
              onAnimationComplete={() => {
                if (isComplete) onComplete();
              }}
            />
          </svg>
        </div>
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

  // Collect unique languages from snippets
  const languages = CODE_SNIPPETS.map((s) => ({
    key: s.language,
    label: LANGUAGE_LABELS[s.language] ?? s.language,
  })).filter((v, i, a) => a.findIndex((t) => t.key === v.key) === i);

  return (
    <div className="mx-auto w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl">
      {/* Section heading */}
      <div className="mb-6">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/50">
          Skills & Languages
        </div>

        {/* Language badges */}
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => {
            const isActive = snippet.language === lang.key;
            return (
              <span
                key={lang.key}
                className="rounded-md px-2.5 py-1 font-mono text-[11px] transition-all sm:text-xs"
                style={{
                  background: isActive ? "rgba(82, 139, 255, 0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? "rgba(82, 139, 255, 0.3)" : "rgba(255,255,255,0.06)"}`,
                  color: isActive ? "#528bff" : "#5c6370",
                }}
              >
                {lang.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Editor container with glow */}
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

      {/* Subtle context line */}
      <div className="mt-3 text-center font-mono text-[10px] text-muted/30 sm:text-[11px]">
        real code from real projects
      </div>
    </div>
  );
}
