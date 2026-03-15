"use client";

import { AnimatePresence, motion, useDragControls, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Experience } from "@/data/types";

type RetroComputerProps = {
  experiences: Experience[];
};

const BADGES: Record<string, string> = {
  "apple-triage": "TOP 10% — Career Experience Program",
  "aer-digital": "3+ YEARS — Client Delivery",
  "independent-dev": "6+ SHIPPED PROJECTS",
};

function ExperienceRecord({ experience }: { experience: Experience }) {
  const badge = BADGES[experience.id];
  return (
    <div>
      <h2 className="font-[Arial,sans-serif] text-[12px] font-bold sm:text-[14px]">{experience.role}</h2>
      <div className="text-[9px] italic text-[#555] sm:text-[10px]">
        {experience.organization} · {experience.location} · {experience.period}
      </div>
      {badge && (
        <div className="mt-1 inline-block bg-[#000080] px-1.5 py-px font-[Arial,sans-serif] text-[8px] font-bold text-white sm:text-[9px]">
          {badge}
        </div>
      )}
      <div className="mt-1 text-[10px] leading-[1.4] sm:text-[11px]">{experience.summary}</div>
      <ul className="mt-1 list-disc pl-4 text-[10px] leading-[1.4] sm:text-[11px]">
        {experience.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return <>{time}</>;
}

export function RetroComputer({ experiences }: RetroComputerProps) {
  const [currentRecord, setCurrentRecord] = useState(0);
  const [booted, setBooted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const reduceMotion = Boolean(useReducedMotion());

  const total = experiences.length;
  const exp = experiences[currentRecord];

  useEffect(() => {
    if (isInView && !booted) {
      const t = setTimeout(() => setBooted(true), reduceMotion ? 0 : 800);
      return () => clearTimeout(t);
    }
  }, [isInView, booted, reduceMotion]);

  const next = useCallback(() => setCurrentRecord((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrentRecord((i) => Math.max(i - 1, 0)), []);

  return (
    <div ref={ref} className="mx-auto w-full max-w-3xl lg:max-w-4xl">
      {/* Monitor body */}
      <div
        className="relative rounded-2xl p-4 sm:p-5"
        style={{
          background: "linear-gradient(180deg, #4a4a4a 0%, #3d3d3d 3%, #353535 50%, #2a2a2a 100%)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}
      >
        {/* Screen bezel */}
        <div
          className="rounded-lg p-1 sm:p-1.5"
          style={{
            background: "linear-gradient(145deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2), rgba(255,255,255,0.02))",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(0,0,0,0.3)",
          }}
        >
          {/* CRT screen */}
          <div ref={constraintsRef} className="relative overflow-hidden rounded-md" style={{ boxShadow: "0 0 15px rgba(0,100,0,0.05)" }}>
            {/* Scanlines */}
            <div className="pointer-events-none absolute inset-0 z-[100]" style={{ background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)" }} />
            {/* Glass reflection */}
            <div className="pointer-events-none absolute inset-0 z-[101] rounded-md" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 35%)" }} />

            {/* CRT Boot animation */}
            {isInView && !booted && !reduceMotion && (
              <div className="absolute inset-0 z-[102] flex items-center justify-center bg-black">
                <motion.div
                  className="w-full bg-white"
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: [0, 0.004, 0.004, 1, 1], opacity: [0, 1, 1, 0.8, 0] }}
                  transition={{ duration: 0.8, times: [0, 0.1, 0.25, 0.7, 1], ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: "100%", transformOrigin: "center" }}
                />
              </div>
            )}

            {/* Windows Desktop with green hills background */}
            <motion.div
              className="relative flex"
              style={{
                minHeight: 280,
                aspectRatio: "4/3",
                background: "linear-gradient(180deg, #3a7bd5 0%, #6db3f2 30%, #87ceeb 45%, #4a8c3f 46%, #3d7a35 55%, #5a9e4f 70%, #4a8c3f 100%)",
              }}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={booted ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Desktop icons */}
              <div className="hidden flex-col gap-2 p-2 sm:flex" style={{ width: 52 }}>
                {[
                  { icon: "💻", label: "My Computer" },
                  { icon: "📁", label: "Projects" },
                  { icon: "🌐", label: "Portfolio" },
                  { icon: "🗑️", label: "Recycle Bin" },
                ].map((item) => (
                  <div key={item.label} className="flex cursor-default select-none flex-col items-center gap-px">
                    <span className="text-base">{item.icon}</span>
                    <span className="text-center text-[7px] leading-tight text-white" style={{ textShadow: "1px 1px 1px #000" }}>{item.label}</span>
                  </div>
                ))}
              </div>

              {/* WordPad Window */}
              <motion.div
                className="m-1 flex flex-1 flex-col sm:m-2"
                style={{
                  background: "#c0c0c0",
                  boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf, 2px 2px 6px rgba(0,0,0,0.15)",
                  padding: 3,
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
                  style={{ background: "linear-gradient(to right, #000080, #1084d0)", height: 18, cursor: "grab", touchAction: "none" }}
                  onPointerDown={(e) => { if (typeof window !== "undefined" && window.innerWidth >= 640) dragControls.start(e); }}
                >
                  <span className="flex items-center gap-1 overflow-hidden text-[10px] font-bold text-white sm:text-[11px]">📝 resume.doc — WordPad</span>
                  <div className="flex gap-px">
                    {["_", "□", "×"].map((btn) => (
                      <button key={btn} type="button" className="flex h-3 w-3.5 items-center justify-center text-[7px] font-bold text-black sm:h-[14px] sm:w-4" style={{ background: "#c0c0c0", boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf" }}>{btn}</button>
                    ))}
                  </div>
                </div>

                {/* Menu */}
                <div className="flex" style={{ background: "#c0c0c0", borderBottom: "1px solid #808080" }}>
                  {["File", "Edit", "View", "Help"].map((m) => (
                    <button key={m} type="button" className="cursor-default px-1.5 py-px text-[9px] sm:text-[10px]" style={{ background: "none", border: "none", fontFamily: "inherit" }}><u>{m[0]}</u>{m.slice(1)}</button>
                  ))}
                </div>

                {/* Content */}
                <div
                  className="flex-1 overflow-y-auto p-2 sm:p-3"
                  style={{ margin: "2px 3px", background: "#fff", boxShadow: "inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080", fontFamily: '"Times New Roman", Georgia, serif', color: "#000" }}
                >
                  <h1 className="mb-1.5 border-b-2 border-black pb-1 font-[Arial,sans-serif] text-[13px] font-bold sm:mb-2 sm:text-[15px]">
                    Omar Mendivil — Experience
                  </h1>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentRecord}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ExperienceRecord experience={exp} />
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-2 flex items-center justify-between border-t border-[#c0c0c0] pt-1.5">
                    <button type="button" onClick={prev} disabled={currentRecord === 0} className="cursor-default px-2 py-0.5 text-[9px] disabled:opacity-30 sm:px-3 sm:text-[10px]" style={{ background: "#c0c0c0", border: "none", fontFamily: "Tahoma, Arial", boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf" }}>◄ Prev</button>
                    <span className="text-[9px] text-[#666] sm:text-[10px]" style={{ fontFamily: "Tahoma, Arial" }}>Record {currentRecord + 1} of {total}</span>
                    <button type="button" onClick={next} disabled={currentRecord === total - 1} className="cursor-default px-2 py-0.5 text-[9px] disabled:opacity-30 sm:px-3 sm:text-[10px]" style={{ background: "#c0c0c0", border: "none", fontFamily: "Tahoma, Arial", boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf" }}>Next ►</button>
                  </div>
                </div>

                {/* Status bar */}
                <div className="flex" style={{ margin: "2px 3px 3px" }}>
                  <span className="flex-1 px-1 text-[9px]" style={{ boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #808080", lineHeight: "14px" }}>Ready</span>
                  <span className="px-1 text-[9px]" style={{ boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #808080", lineHeight: "14px", width: 45 }}>Pg {currentRecord + 1}</span>
                </div>
              </motion.div>

              {/* Taskbar */}
              <div className="absolute bottom-0 left-0 right-0 z-50 flex items-center gap-1 px-1" style={{ height: 22, background: "#c0c0c0", boxShadow: "inset 0 1px 0 #fff" }}>
                <button type="button" className="flex items-center gap-1 px-1.5 text-[9px] font-bold sm:text-[10px]" style={{ height: 16, background: "#c0c0c0", border: "none", fontFamily: "inherit", boxShadow: "inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf" }}>🪟 Start</button>
                <div style={{ width: 2, height: 14, boxShadow: "inset 1px 0 #808080, inset -1px 0 #fff" }} />
                <button type="button" className="overflow-hidden text-ellipsis whitespace-nowrap px-1.5 text-[9px] sm:text-[10px]" style={{ height: 16, maxWidth: 120, background: "#c0c0c0", border: "none", fontFamily: "inherit", boxShadow: "inset -1px -1px #fff, inset 1px 1px #0a0a0a" }}>📝 resume.doc</button>
                <span className="ml-auto px-1.5 text-[9px] sm:text-[10px]" style={{ height: 16, lineHeight: "16px", boxShadow: "inset -1px -1px #dfdfdf, inset 1px 1px #808080" }}>
                  🔊 <LiveClock />
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Monitor chin */}
        <div className="flex items-center justify-between px-2 pt-2">
          <span className="font-mono text-[8px] font-bold uppercase tracking-widest text-[#666] sm:text-[9px]">MENDIVIL SYS</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#33cc33] animate-[blink_3s_ease-in-out_infinite]" style={{ boxShadow: "0 0 4px #33cc33, 0 0 8px #33cc33" }} />
            <div className="h-2 w-4 rounded-sm" style={{ background: "linear-gradient(180deg, #555, #444, #333)", border: "1px solid rgba(0,0,0,0.3)" }} />
          </div>
        </div>
      </div>

      {/* Stand */}
      <div className="mx-auto h-2.5 w-[50%] rounded-b" style={{ background: "linear-gradient(180deg, #333, #2a2a2a)", boxShadow: "0 4px 8px rgba(0,0,0,0.3)" }} />
      <div className="mx-auto h-1.5 w-[65%] rounded-b-lg" style={{ background: "linear-gradient(180deg, #2a2a2a, #222)", boxShadow: "0 3px 8px rgba(0,0,0,0.2)" }} />
    </div>
  );
}
