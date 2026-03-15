"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { CodeLine } from "@/data/code-snippets";

export function useTypingAnimation(lines: CodeLine[], speed = 25) {
  const [charIndex, setCharIndex] = useState(0);

  const totalChars = useMemo(
    () =>
      lines.reduce(
        (sum, line) => sum + line.reduce((s, token) => s + token.text.length, 0) + 1,
        0,
      ),
    [lines],
  );

  const isComplete = charIndex >= totalChars;

  const skip = useCallback(
    (to: number) => setCharIndex(to),
    [],
  );

  useEffect(() => {
    if (isComplete) return;
    const timer = setTimeout(
      () => setCharIndex((i) => i + 1),
      speed + Math.random() * 8,
    );
    return () => clearTimeout(timer);
  }, [charIndex, isComplete, speed]);

  return { charIndex, isComplete, totalChars, skip };
}
