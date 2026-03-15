"use client";

import { motion, useDragControls, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useRef, useState } from "react";

import type { Experience } from "@/data/types";

type RetroComputerProps = {
  experiences: Experience[];
};

type CardTheme = {
  badge?: string;
  badgeColor: string;
};

const THEMES: Record<string, CardTheme> = {
  "apple-triage": { badge: "TOP 10% — Career Experience Program", badgeColor: "#000080" },
  "aer-digital": { badge: "3+ YEARS — Client Delivery", badgeColor: "#000080" },
  "independent-dev": { badge: "6+ SHIPPED PROJECTS", badgeColor: "#000080" },
};

function ExperienceRecord({ experience }: { experience: Experience }) {
  const theme = THEMES[experience.id];

  return (
    <div>
      <h2 className="font-[Arial,sans-serif] text-[13px] font-bold sm:text-[15px]">
        {experience.role}
      </h2>
      <div className="text-[10px] italic text-[#444] sm:text-[11px]">
        {experience.organization} · {experience.location} · {experience.period}
      </div>
      {theme?.badge && (
        <div
          className="mt-1 inline-block px-1.5 py-px font-[Arial,sans-serif] text-[9px] font-bold text-white sm:text-[10px]"
          style={{ background: theme.badgeColor }}
        >
          {theme.badge}
        </div>
      )}
      <div className="mt-1.5 text-[11px] leading-[1.5] sm:text-[12px]">
        {experience.summary}
      </div>
      <ul className="mt-1.5 list-disc pl-4 text-[11px] leading-[1.5] sm:text-[12px]">
        {experience.bullets.map((b) => (
          <li key={b} className="mb-0.5">{b}</li>
        ))}
      </ul>
    </div>
  );
}

export function RetroComputer({ experiences }: RetroComputerProps) {
  const [currentRecord, setCurrentRecord] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = Boolean(useReducedMotion());

  const total = experiences.length;
  const exp = experiences[currentRecord];

  const next = useCallback(() => {
    setCurrentRecord((i) => Math.min(i + 1, total - 1));
  }, [total]);

  const prev = useCallback(() => {
    setCurrentRecord((i) => Math.max(i - 1, 0));
  }, []);

  return (
    <div ref={ref} className="mx-auto w-full max-w-3xl lg:max-w-4xl">
      {/* Monitor body */}
      <div
        className="relative rounded-2xl p-4 sm:p-6"
        style={{
          background: "linear-gradient(180deg, #e0d8c8 0%, #d4c8a0 3%, #c8b88a 50%, #b0a070 100%)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.4), inset 0 -2px 0 rgba(0,0,0,0.1)",
        }}
      >
        {/* Plastic texture */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)" }}
        />

        {/* Screen bezel */}
        <div
          className="rounded-lg p-1 sm:p-1.5"
          style={{
            background: "linear-gradient(145deg, rgba(0,0,0,0.35), rgba(0,0,0,0.15), rgba(255,255,255,0.03))",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.2)",
          }}
        >
          {/* CRT screen */}
          <div
            ref={constraintsRef}
            className="relative overflow-hidden rounded-md"
            style={{ boxShadow: "0 0 20px rgba(0,128,128,0.06)" }}
          >
            {/* Scanlines */}
            <div className="pointer-events-none absolute inset-0 z-[100]" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)" }} />
            {/* Glass reflection */}
            <div className="pointer-events-none absolute inset-0 z-[101]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 40%)" }} />

            {/* Windows 95 Desktop */}
            <motion.div
              className="relative flex bg-[#008080]"
              style={{ minHeight: 340 }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Desktop icons (hidden on small mobile) */}
              <div className="hidden flex-col gap-2 p-2 sm:flex" style={{ width: 56 }}>
                {[
                  { icon: "💻", label: "My Computer" },
                  { icon: "📁", label: "Projects" },
                  { icon: "🌐", label: "Portfolio" },
                  { icon: "🗑️", label: "Recycle Bin" },
                ].map((item) => (
                  <div key={item.label} className="flex cursor-default select-none flex-col items-center gap-px">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-center text-[8px] leading-tight text-white" style={{ textShadow: "1px 1px 1px #000" }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* WordPad Window */}
              <motion.div
                className="m-1 flex flex-1 flex-col sm:m-2"
                style={{
                  background: "#c0c0c0",
                  boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf, 2px 2px 6px rgba(0,0,0,0.2)",
                  padding: 3,
                  maxHeight: 316,
                }}
                drag={typeof window !== "undefined" && window.innerWidth >= 640}
                dragControls={dragControls}
                dragConstraints={constraintsRef}
                dragMomentum={false}
                dragElastic={0}
                dragListener={false}
              >
                {/* Title bar */}
                <div
                  className="flex select-none items-center justify-between px-1"
                  style={{
                    background: "linear-gradient(to right, #000080, #1084d0)",
                    height: 18,
                    cursor: "grab",
                    touchAction: "none",
                  }}
                  onPointerDown={(e) => {
                    if (window.innerWidth >= 640) dragControls.start(e);
                  }}
                >
                  <span className="flex items-center gap-1 overflow-hidden text-[10px] font-bold text-white sm:text-[11px]">
                    📝 resume.doc — WordPad
                  </span>
                  <div className="flex gap-px">
                    {["_", "□", "×"].map((btn) => (
                      <button
                        key={btn}
                        type="button"
                        className="flex h-3 w-3.5 items-center justify-center text-[7px] font-bold text-black sm:h-[14px] sm:w-4 sm:text-[8px]"
                        style={{
                          background: "#c0c0c0",
                          boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
                        }}
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Menu */}
                <div className="flex" style={{ background: "#c0c0c0", borderBottom: "1px solid #808080" }}>
                  {["File", "Edit", "View", "Help"].map((m) => (
                    <button key={m} type="button" className="cursor-default px-1.5 py-px text-[9px] sm:text-[10px]" style={{ background: "none", border: "none", fontFamily: "inherit" }}>
                      <u>{m[0]}</u>{m.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div
                  className="flex-1 overflow-y-auto p-2 sm:p-3"
                  style={{
                    margin: "2px 3px",
                    background: "#fff",
                    boxShadow: "inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080",
                    fontFamily: '"Times New Roman", Georgia, serif',
                    color: "#000",
                  }}
                >
                  <h1 className="mb-2 border-b-2 border-black pb-1 font-[Arial,sans-serif] text-[14px] font-bold sm:mb-3 sm:text-[17px]">
                    Omar Mendivil — Experience
                  </h1>

                  <ExperienceRecord experience={exp} />

                  {/* Record nav */}
                  <div className="mt-3 flex items-center justify-between border-t border-[#c0c0c0] pt-2">
                    <button
                      type="button"
                      onClick={prev}
                      disabled={currentRecord === 0}
                      className="cursor-default px-2 py-1 text-[10px] disabled:opacity-40 sm:px-3"
                      style={{
                        background: "#c0c0c0",
                        border: "none",
                        fontFamily: "Tahoma, Arial, sans-serif",
                        boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
                      }}
                    >
                      ◄ Previous
                    </button>
                    <span className="text-[10px] text-[#666]" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
                      Record {currentRecord + 1} of {total}
                    </span>
                    <button
                      type="button"
                      onClick={next}
                      disabled={currentRecord === total - 1}
                      className="cursor-default px-2 py-1 text-[10px] disabled:opacity-40 sm:px-3"
                      style={{
                        background: "#c0c0c0",
                        border: "none",
                        fontFamily: "Tahoma, Arial, sans-serif",
                        boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
                      }}
                    >
                      Next ►
                    </button>
                  </div>
                </div>

                {/* Status bar */}
                <div className="flex" style={{ margin: "2px 3px 3px" }}>
                  <span
                    className="flex-1 px-1 text-[9px] sm:text-[10px]"
                    style={{ boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #808080", lineHeight: "14px" }}
                  >
                    Ready
                  </span>
                  <span
                    className="px-1 text-[9px] sm:text-[10px]"
                    style={{ boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #808080", lineHeight: "14px", width: 50 }}
                  >
                    Pg {currentRecord + 1}
                  </span>
                </div>
              </motion.div>

              {/* Taskbar */}
              <div
                className="absolute bottom-0 left-0 right-0 z-50 flex items-center gap-1 px-1"
                style={{
                  height: 22,
                  background: "#c0c0c0",
                  boxShadow: "inset 0 1px 0 #fff",
                }}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-1.5 text-[9px] font-bold sm:text-[10px]"
                  style={{
                    height: 16,
                    background: "#c0c0c0",
                    border: "none",
                    fontFamily: "inherit",
                    boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf",
                  }}
                >
                  🪟 Start
                </button>
                <div style={{ width: 2, height: 14, boxShadow: "inset 1px 0 #808080, inset -1px 0 #fff" }} />
                <button
                  type="button"
                  className="overflow-hidden text-ellipsis whitespace-nowrap px-1.5 text-[9px] sm:text-[10px]"
                  style={{
                    height: 16,
                    maxWidth: 120,
                    background: "#c0c0c0",
                    border: "none",
                    fontFamily: "inherit",
                    boxShadow: "inset -1px -1px #fff, inset 1px 1px #0a0a0a",
                  }}
                >
                  📝 resume.doc
                </button>
                <span
                  className="ml-auto px-1.5 text-[9px] sm:text-[10px]"
                  style={{ height: 16, lineHeight: "16px", boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #808080" }}
                >
                  🔊 3:42 PM
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Monitor chin */}
        <div className="flex items-center justify-between px-2 pt-2">
          <span className="font-mono text-[8px] font-bold uppercase tracking-widest sm:text-[9px]" style={{ color: "#8a7a5a", textShadow: "0 1px 0 rgba(255,255,255,0.3)" }}>
            MENDIVIL SYS
          </span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#33cc33]" style={{ boxShadow: "0 0 4px #33cc33, 0 0 8px #33cc33" }} />
            <div className="h-2 w-4 rounded-sm" style={{ background: "linear-gradient(180deg, #888, #666, #555)", border: "1px solid rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      </div>

      {/* Stand */}
      <div className="mx-auto h-2.5 w-[50%] rounded-b" style={{ background: "linear-gradient(180deg, #a89868, #c8b88a)", boxShadow: "0 4px 8px rgba(0,0,0,0.2)" }} />
      <div className="mx-auto h-1.5 w-[65%] rounded-b-lg" style={{ background: "linear-gradient(180deg, #c8b88a, #a89868)", boxShadow: "0 3px 8px rgba(0,0,0,0.15)" }} />
    </div>
  );
}
