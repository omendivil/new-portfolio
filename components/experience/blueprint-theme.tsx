"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import type { Experience } from "@/data/types";

/* ─── Typewriter Text ─── */
// Reveals text character by character at a given speed.
// Each instance gets a stagger delay based on its index prop.
function TypewriterText({
  text,
  delay = 0,
  speed = 12,
  className,
  style,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [visible, setVisible] = useState(0);
  const reduceMotion = Boolean(useReducedMotion());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduceMotion) { setVisible(text.length); return; }
    setVisible(0);
    const startTimeout = setTimeout(() => {
      let i = 0;
      const tick = () => {
        i++;
        setVisible(i);
        if (i < text.length) timerRef.current = setTimeout(tick, speed);
      };
      timerRef.current = setTimeout(tick, speed);
    }, delay);
    return () => {
      clearTimeout(startTimeout);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, delay, speed, reduceMotion]);

  return (
    <span className={className} style={style}>
      {text.slice(0, visible)}
      {visible < text.length && (
        <span
          className="inline-block h-[1em] w-[0.5em] align-text-bottom"
          style={{
            background: "#5ba3d9",
            animation: "blink-cursor 0.8s step-end infinite",
            marginLeft: 1,
          }}
        />
      )}
    </span>
  );
}

type BlueprintThemeProps = {
  experiences: Experience[];
};

/* ─── Expandable Section ─── */
function ExpandableSection({
  label,
  children,
  defaultOpen = true,
}: {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 text-left"
        style={{
          fontFamily: "var(--font-plex-mono), monospace",
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          color: "#5ba3d9",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <motion.span
          animate={{ rotate: open ? 90 : 0 }}
          transition={{ duration: 0.15 }}
          className="inline-block"
        >
          ▸
        </motion.span>
        {label}
        <span style={{ flex: 1, height: 1, background: "rgba(90,163,217,0.15)", marginLeft: 8 }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: "hidden" }}
          >
            <div className="pt-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Blueprint Record ─── */
// key prop forces remount on record change, restarting all typewriter animations
function BlueprintRecord({ experience }: { experience: Experience }) {
  const titleText = experience.role.toUpperCase();
  const fields = [
    { label: "CLIENT", value: experience.organization.toUpperCase() },
    { label: "LOCATION", value: experience.location.toUpperCase() },
    { label: "PERIOD", value: experience.period.toUpperCase() },
  ];

  // Calculate stagger delays: title types first, then each field, then scope, then reqs
  const titleDuration = titleText.length * 12;
  let fieldStart = titleDuration + 100;

  return (
    <div
      className="space-y-3"
      style={{ fontFamily: "var(--font-plex-mono), monospace", color: "#e8f0ff" }}
    >
      {/* Title — types first */}
      <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "0.05em", minHeight: "1.5em" }}>
        <TypewriterText text={titleText} delay={0} speed={18} />
      </div>

      {/* Metadata fields — stagger after title */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {fields.map((field, i) => {
          const delay = fieldStart + i * 200;
          return (
            <div key={field.label}>
              <div
                style={{
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "#5ba3d9",
                  marginBottom: 2,
                }}
              >
                {field.label}
              </div>
              <div style={{ fontSize: 13, minHeight: "1.3em" }}>
                <TypewriterText text={field.value} delay={delay} speed={14} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: "1px dashed rgba(90,163,217,0.25)", margin: "10px 0" }} />

      {/* Scope — types after fields */}
      <ExpandableSection label="SCOPE" defaultOpen={true}>
        <div style={{ fontSize: 11, lineHeight: 1.5, minHeight: "3em" }}>
          <TypewriterText
            text={experience.summary}
            delay={fieldStart + fields.length * 200 + 200}
            speed={8}
          />
        </div>
      </ExpandableSection>

      <div style={{ borderTop: "1px dashed rgba(90,163,217,0.25)", margin: "10px 0" }} />

      {/* Requirements — type last, staggered per line */}
      <ExpandableSection label="REQUIREMENTS" defaultOpen={true}>
        <div className="space-y-1">
          {experience.bullets.map((bullet, i) => {
            const reqDelay = fieldStart + fields.length * 200 + 600 + i * 400;
            return (
              <div key={bullet} style={{ fontSize: 11, paddingLeft: "1em", minHeight: "1.4em" }}>
                <span style={{ color: "#5ba3d9", fontSize: 10 }}>REQ-{String(i + 1).padStart(2, "0")}</span>{" "}
                <TypewriterText text={bullet} delay={reqDelay} speed={6} />
              </div>
            );
          })}
        </div>
      </ExpandableSection>
    </div>
  );
}

/* ─── Entrance animation stages ─── */
// Stage 0: border draws in (dashed outline appears)
// Stage 1: grid fades in
// Stage 2: content appears (typewriter-like stagger)

/* ─── Main Component ─── */
export function BlueprintTheme({ experiences }: BlueprintThemeProps) {
  const [currentRecord, setCurrentRecord] = useState(0);
  const [stage, setStage] = useState(0);
  const reduceMotion = Boolean(useReducedMotion());
  const total = experiences.length;
  const exp = experiences[currentRecord];

  const next = useCallback(() => setCurrentRecord((i) => Math.min(i + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrentRecord((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    if (reduceMotion) { setStage(2); return; }
    const t1 = setTimeout(() => setStage(1), 300);  // grid appears
    const t2 = setTimeout(() => setStage(2), 700);  // content types on
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [reduceMotion]);

  return (
    <div className="mx-auto w-full max-w-3xl lg:max-w-4xl">

      {/* Outer container — border draws in */}
      <motion.div
        className="relative min-h-[420px] overflow-hidden"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "#0a1628",
          padding: 24,
          fontFamily: "var(--font-plex-mono), monospace",
          color: "#e8f0ff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        }}
      >
        {/* Dashed border — animates in via clip-path */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ border: "1px dashed rgba(90,163,217,0.3)" }}
          initial={reduceMotion ? false : { clipPath: "inset(0 100% 100% 0)" }}
          animate={{ clipPath: "inset(0 0% 0% 0)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Grid pattern — fades in at stage 1 */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(90,163,217,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(90,163,217,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: stage >= 1 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Corner registration marks — fade in with grid */}
        {[
          { pos: "left-1.5 top-1.5", border: "1px 0 0 1px" },
          { pos: "right-1.5 top-1.5", border: "1px 1px 0 0" },
          { pos: "bottom-1.5 left-1.5", border: "0 0 1px 1px" },
          { pos: "bottom-1.5 right-1.5", border: "0 1px 1px 0" },
        ].map((corner, i) => (
          <motion.div
            key={i}
            className={`absolute h-4 w-4 ${corner.pos}`}
            style={{ borderColor: "rgba(90,163,217,0.4)", borderStyle: "solid", borderWidth: corner.border }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
          />
        ))}

        {/* Content — types on at stage 2 */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: stage >= 2 ? 1 : 0, y: stage >= 2 ? 0 : 6 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Header */}
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#5ba3d9",
              marginBottom: 2,
            }}
          >
            SPECIFICATION SHEET — REV {String(currentRecord + 1).padStart(2, "0")}
          </div>
          <div style={{ borderTop: "1px dashed rgba(90,163,217,0.25)", margin: "8px 0" }} />

          {/* Record content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRecord}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <BlueprintRecord experience={exp} />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={prev}
              disabled={currentRecord === 0}
              className="disabled:opacity-30"
              style={{
                background: "none",
                border: "1px solid rgba(90,163,217,0.3)",
                color: "#5ba3d9",
                padding: "3px 12px",
                fontFamily: "inherit",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: currentRecord === 0 ? "default" : "pointer",
              }}
            >
              ◄ PREV SHEET
            </button>
            <span style={{ fontSize: 10, color: "#5ba3d9" }}>SHEET {currentRecord + 1} OF {total}</span>
            <button
              type="button"
              onClick={next}
              disabled={currentRecord === total - 1}
              className="disabled:opacity-30"
              style={{
                background: "none",
                border: "1px solid rgba(90,163,217,0.3)",
                color: "#5ba3d9",
                padding: "3px 12px",
                fontFamily: "inherit",
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                cursor: currentRecord === total - 1 ? "default" : "pointer",
              }}
            >
              NEXT SHEET ►
            </button>
          </div>

          {/* Title block */}
          <div
            className="absolute bottom-2 right-2"
            style={{
              border: "1px solid rgba(90,163,217,0.25)",
              padding: "4px 10px",
              fontSize: 9,
              color: "#5ba3d9",
              textAlign: "right",
              lineHeight: 1.5,
              fontFamily: "var(--font-plex-mono), monospace",
            }}
          >
            DRAWN BY: O. MENDIVIL
            <br />
            DATE: 2025
            <br />
            REV: {String(currentRecord + 1).padStart(2, "0")}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
