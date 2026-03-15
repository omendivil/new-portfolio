"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { motionEase } from "@/lib/motion";

type BuildStep = {
  label: string;
  result: string;
};

const BUILD_STEPS: BuildStep[] = [
  { label: "compiling hero", result: "done" },
  { label: "loading projects", result: "5 found" },
  { label: "indexing code", result: "5 languages" },
  { label: "mapping experience", result: "3 entries" },
  { label: "applying motion system", result: "✓" },
];

const TYPING_SPEED = 28;
const RESULT_DELAY = 220;
const STEP_GAP = 100;

type BuildTerminalProps = {
  onComplete: () => void;
};

export function BuildTerminal({ onComplete }: BuildTerminalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isDone, setIsDone] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (isDone) return;
    if (currentStep >= BUILD_STEPS.length) {
      const t = setTimeout(() => {
        setIsDone(true);
        setTimeout(onComplete, 400);
      }, 250);
      return () => clearTimeout(t);
    }

    const step = BUILD_STEPS[currentStep];
    let charIndex = 0;

    function typeChar() {
      if (charIndex < step.label.length) {
        setTypedText(step.label.slice(0, charIndex + 1));
        charIndex++;
        timeoutRef.current = setTimeout(typeChar, TYPING_SPEED + Math.random() * 15);
      } else {
        timeoutRef.current = setTimeout(() => {
          setCompletedSteps((prev) => [...prev, currentStep]);
          timeoutRef.current = setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
            setTypedText("");
          }, STEP_GAP);
        }, RESULT_DELAY);
      }
    }

    const startDelay = currentStep === 0 ? 400 : 100;
    timeoutRef.current = setTimeout(typeChar, startDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentStep, isDone, onComplete]);

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center"
      exit={{
        opacity: 0,
        scale: 0.96,
        y: -20,
        filter: "blur(6px)",
        transition: { duration: 0.5, ease: motionEase },
      }}
    >
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-xl border border-[#30363d] bg-[#0d1117] shadow-2xl sm:mx-0 sm:max-w-lg">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-[#30363d] px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-2 font-mono text-[10px] text-[#8b949e]">~/portfolio</span>
        </div>

        {/* Terminal body */}
        <div className="p-4 font-mono text-[12px] leading-[1.8] sm:text-[13px]">
          {/* Initial command */}
          <div className="text-[#8b949e]">
            <span className="text-[#3fb950]">❯</span> npm run build
          </div>
          <div className="mt-1 text-[#6e7681]">
            &gt; omar-mendivil@1.0.0 build
            <br />
            &gt; assembling portfolio...
          </div>

          {/* Build steps */}
          <div className="mt-3 space-y-0.5">
            {BUILD_STEPS.map((step, i) => {
              const isActive = i === currentStep;
              const isCompleted = completedSteps.includes(i);
              const isVisible = i <= currentStep;

              if (!isVisible) return null;

              return (
                <div key={i} className="flex items-center gap-1">
                  <span className="text-[#6e7681]">[{i + 1}/{BUILD_STEPS.length}]</span>
                  <span className="text-[#e6edf3]">
                    {isActive ? typedText : isCompleted ? step.label : ""}
                  </span>
                  {isActive && !isCompleted && (
                    <span className="inline-block h-[14px] w-[2px] animate-pulse bg-[#3fb950]" />
                  )}
                  {isCompleted && (
                    <span className="ml-auto text-[#3fb950]">{step.result}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Completion */}
          {isDone && (
            <div className="mt-3 space-y-0.5 text-[#6e7681]">
              <div>
                <span className="text-[#3fb950]">✓</span> Build complete
              </div>
              <div>
                <span className="text-[#3fb950]">❯</span>
                <span className="ml-1 inline-block h-[14px] w-[2px] animate-pulse bg-[#3fb950]" />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
