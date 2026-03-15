"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { motionEase } from "@/lib/motion";

import { DIFF_ADDITIONS, DIFF_DELETIONS, DIFF_FILENAME, DIFF_LINES, type DiffLine, type Token } from "./diff-data";

const TOKEN_COLORS: Record<Token["type"], string> = {
  keyword: "var(--syn-keyword)",
  string: "var(--syn-string)",
  type: "var(--syn-type)",
  function: "var(--syn-function)",
  number: "var(--syn-number)",
  comment: "var(--syn-comment)",
  property: "var(--syn-property)",
  punctuation: "var(--syn-punctuation)",
  plain: "var(--syn-plain)",
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: motionEase },
  },
};

function SyntaxTokens({ tokens }: { tokens: Token[] }) {
  return (
    <>
      {tokens.map((token, i) => (
        <span key={i} style={{ color: TOKEN_COLORS[token.type] }}>
          {token.text}
        </span>
      ))}
    </>
  );
}

function DiffLineRow({ line }: { line: DiffLine }) {
  const markerChar = line.type === "deletion" ? "−" : line.type === "addition" ? "+" : " ";
  const isDeletion = line.type === "deletion";
  const isAddition = line.type === "addition";

  return (
    <div
      className="flex font-mono text-[11px] leading-[22px] sm:text-[13px] sm:leading-[26px] lg:text-[14px] lg:leading-[28px]"
      style={{
        backgroundColor: isDeletion
          ? "var(--diff-del-bg)"
          : isAddition
            ? "var(--diff-add-bg)"
            : undefined,
        borderLeft: `3px solid ${isDeletion ? "var(--diff-del-text)" : isAddition ? "var(--diff-add-text)" : "transparent"}`,
      }}
      role="text"
      aria-label={
        isDeletion
          ? `Removed: ${line.plainText}`
          : isAddition
            ? `Added: ${line.plainText}`
            : line.plainText
      }
    >
      <span
        className="w-6 shrink-0 select-none px-1 text-center sm:w-8 sm:px-2"
        style={{ color: isDeletion ? "var(--diff-del-text)" : isAddition ? "var(--diff-add-text)" : "transparent" }}
        aria-hidden="true"
      >
        {line.type !== "blank" ? markerChar : ""}
      </span>
      <span
        className="flex-1 px-3 sm:px-4"
        style={isDeletion ? { textDecoration: "line-through", opacity: 0.7 } : undefined}
      >
        <SyntaxTokens tokens={line.tokens} />
      </span>
    </div>
  );
}

type DiffViewProps = {
  startAnimation: boolean;
};

export function DiffView({ startAnimation }: DiffViewProps) {
  const [reviewed, setReviewed] = useState(false);

  return (
    <div
      className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border sm:max-w-3xl lg:max-w-4xl"
      style={{
        borderColor: "var(--diff-border)",
        background: "var(--diff-bg)",
      }}
      role="region"
      aria-label={`Code changes: ${DIFF_FILENAME}`}
    >
      {/* File header */}
      <div
        className="flex items-center justify-between border-b px-3 py-2.5 sm:px-5"
        style={{
          borderColor: "var(--diff-border)",
          background: "var(--diff-header-bg)",
        }}
        aria-hidden="true"
      >
        <span className="font-mono text-xs sm:text-sm" style={{ color: "var(--syn-plain)" }}>
          📄 {DIFF_FILENAME}
        </span>
        <span className="text-xs sm:text-sm">
          <span style={{ color: "var(--diff-del-text)" }}>−{DIFF_DELETIONS}</span>
          {" "}
          <span style={{ color: "var(--diff-add-text)" }}>+{DIFF_ADDITIONS}</span>
        </span>
      </div>

      {/* Diff lines */}
      <motion.div
        className="py-1 sm:py-2"
        variants={containerVariants}
        initial="hidden"
        animate={startAnimation ? "visible" : "hidden"}
      >
        {DIFF_LINES.map((line, i) => (
          <motion.div key={i} variants={lineVariants}>
            <DiffLineRow line={line} />
          </motion.div>
        ))}
      </motion.div>

      {/* Review bar */}
      <div
        className="flex items-center justify-between border-t px-3 py-3 sm:px-5"
        style={{ borderColor: "var(--diff-border)" }}
      >
        <button
          type="button"
          onClick={() => setReviewed((r) => !r)}
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <div
            className="flex h-4 w-4 items-center justify-center rounded-sm border text-[10px] transition-colors"
            style={{
              borderColor: "var(--diff-add-text)",
              color: reviewed ? "var(--diff-bg)" : "var(--diff-add-text)",
              background: reviewed ? "var(--diff-add-text)" : "transparent",
            }}
          >
            ✓
          </div>
          <span className="text-xs sm:text-sm" style={{ color: "var(--syn-comment)" }}>
            {reviewed ? "Reviewed — looks good" : "Mark as reviewed"}
          </span>
        </button>
        <a
          href="#projects"
          className="rounded-md px-3 py-1.5 text-xs font-medium transition-all hover:brightness-110 hover:shadow-md sm:px-4 sm:py-2 sm:text-sm"
          style={{
            background: "var(--diff-add-bg)",
            color: "var(--diff-add-text)",
            border: "1px solid var(--diff-add-text)",
          }}
        >
          Merge &amp; continue ↓
        </a>
      </div>
    </div>
  );
}
