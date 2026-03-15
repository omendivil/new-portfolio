"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";

import { useMotionPreference } from "@/lib/motion";

import { BuildTerminal } from "./build-terminal";
import { DiffView } from "./diff-view";

export function HeroDiff() {
  const { reduceMotion } = useMotionPreference();
  const [dismissed, setDismissed] = useState(false);
  const terminalVisible = !reduceMotion && !dismissed;

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
