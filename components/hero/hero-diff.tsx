"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useSyncExternalStore, useState } from "react";

import { useMotionPreference } from "@/lib/motion";

import { BuildTerminal } from "./build-terminal";
import { DiffView } from "./diff-view";

const STORAGE_KEY = "portfolio-build-seen";

const emptySubscribe = () => () => {};

function useFirstVisit(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => {
      try {
        const seen = sessionStorage.getItem(STORAGE_KEY);
        if (!seen) {
          sessionStorage.setItem(STORAGE_KEY, "1");
          return true;
        }
        return false;
      } catch {
        return true;
      }
    },
    () => false,
  );
}

export function HeroDiff() {
  const isFirstVisit = useFirstVisit();
  const { reduceMotion } = useMotionPreference();
  const [dismissed, setDismissed] = useState(false);

  const terminalVisible = isFirstVisit && !reduceMotion && !dismissed;

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
