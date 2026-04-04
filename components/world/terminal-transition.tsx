"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { NavSectionId } from "@/data/types";
import { motionEase, useMotionPreference } from "@/lib/motion";

const TERMINAL_COMMANDS: Record<string, { command: string; response: string }> = {
  hero: { command: "cd ~/home", response: "ready" },
  projects: { command: "cd ~/projects", response: "5 projects loaded" },
  code: { command: "vim languages.ts", response: "opening..." },
  experience: { command: "cat experience.log", response: "3 entries" },
  contact: { command: 'echo "let\'s talk"', response: "let's talk." },
  skills: { command: "cd ~/skills", response: "loaded" },
  writing: { command: "cd ~/writing", response: "loaded" },
};

type TerminalTransitionProps = {
  isTransitioning: boolean;
  target: NavSectionId | null;
};

export function TerminalTransition({ isTransitioning, target }: TerminalTransitionProps) {
  const { reduceMotion } = useMotionPreference();
  const [typedText, setTypedText] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [phase, setPhase] = useState<"idle" | "typing" | "response" | "exit">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const frameRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isTransitioning || !target) {
      setPhase("idle");
      setTypedText("");
      setShowResponse(false);
      return;
    }

    const entry = TERMINAL_COMMANDS[target] ?? { command: `cd ~/${target}`, response: "loaded" };
    const fullCommand = `> ${entry.command}`;

    if (reduceMotion) {
      setTypedText(fullCommand);
      setShowResponse(true);
      setPhase("response");
      timerRef.current = setTimeout(() => setPhase("exit"), 400);
      return;
    }

    setPhase("typing");
    setShowResponse(false);
    let charIndex = 0;
    setTypedText("");

    function typeNext() {
      if (charIndex < fullCommand.length) {
        setTypedText(fullCommand.slice(0, charIndex + 1));
        charIndex++;
        frameRef.current = setTimeout(typeNext, 25 + Math.random() * 20);
      } else {
        timerRef.current = setTimeout(() => {
          setShowResponse(true);
          setPhase("response");
          timerRef.current = setTimeout(() => {
            setPhase("exit");
          }, 400);
        }, 200);
      }
    }

    typeNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [isTransitioning, target, reduceMotion]);

  const isVisible = phase === "typing" || phase === "response";
  const entry = target ? TERMINAL_COMMANDS[target] ?? { command: "", response: "loaded" } : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: motionEase }}
        >
          <div className="font-mono text-sm sm:text-base">
            <div className="flex items-center">
              <span className="text-muted/60">{typedText}</span>
              {phase === "typing" && (
                <span className="ml-0.5 inline-block h-4 w-[7px] bg-accent/70 animate-[blink_1s_step-end_infinite]" />
              )}
            </div>
            <AnimatePresence>
              {showResponse && entry && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mt-1 text-muted/40"
                >
                  {entry.response}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
