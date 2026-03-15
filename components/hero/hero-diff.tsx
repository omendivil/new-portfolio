"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";

import { useMotionPreference } from "@/lib/motion";

import { BuildTerminal } from "./build-terminal";
import { DiffView } from "./diff-view";

const STORAGE_KEY = "portfolio-build-seen";

let firstVisitChecked = false;
let isFirstVisit = false;

function getIsFirstVisit(): boolean {
  if (firstVisitChecked) return isFirstVisit;
  firstVisitChecked = true;
  if (typeof window === "undefined") return false;
  try {
    const seen = sessionStorage.getItem(STORAGE_KEY);
    if (!seen) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      isFirstVisit = true;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function HeroDiff() {
  const { reduceMotion } = useMotionPreference();
  const shouldShowTerminal = getIsFirstVisit() && !reduceMotion;
  const [dismissed, setDismissed] = useState(false);
  const terminalVisible = shouldShowTerminal && !dismissed;

  const handleTerminalComplete = useCallback(() => {
    setDismissed(true);
  }, []);

  return (
    <section
      id="hero"
      className="section-anchor relative flex min-h-[70vh] items-center justify-center px-4 py-16 sm:min-h-[80vh] sm:py-24"
    >
      <DiffView startAnimation={!terminalVisible} />

      <AnimatePresence>
        {terminalVisible && (
          <BuildTerminal onComplete={handleTerminalComplete} />
        )}
      </AnimatePresence>
    </section>
  );
}
