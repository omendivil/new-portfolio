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
    <div className="relative flex min-h-[55vh] items-center justify-center px-4 py-10 sm:min-h-[70vh] sm:py-16 lg:min-h-[80vh] lg:py-24">
      <DiffView startAnimation={!terminalVisible} />

      <AnimatePresence>
        {terminalVisible && (
          <BuildTerminal onComplete={handleTerminalComplete} />
        )}
      </AnimatePresence>
    </div>
  );
}
