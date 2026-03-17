"use client";

import { useCallback, useEffect, useRef } from "react";

import { useMotionPreference } from "@/lib/motion";

/**
 * Dual-layer cursor glow — outer soft wash + inner bright core.
 * The outer layer creates atmosphere, the inner gives precision.
 * Only active on devices with a fine pointer (mouse/trackpad).
 */
export function CursorGlow() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useMotionPreference();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = `${e.clientX}px`;
    const y = `${e.clientY}px`;

    if (outerRef.current) {
      outerRef.current.style.setProperty("--glow-x", x);
      outerRef.current.style.setProperty("--glow-y", y);
      outerRef.current.style.opacity = "1";
    }
    if (innerRef.current) {
      innerRef.current.style.setProperty("--glow-x", x);
      innerRef.current.style.setProperty("--glow-y", y);
      innerRef.current.style.opacity = "1";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (outerRef.current) outerRef.current.style.opacity = "0";
    if (innerRef.current) innerRef.current.style.opacity = "0";
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const mql = window.matchMedia("(pointer: fine)");
    if (!mql.matches) return;

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [reduceMotion, handleMouseMove, handleMouseLeave]);

  if (reduceMotion) return null;

  return (
    <>
      {/* Outer: large soft atmospheric wash */}
      <div
        ref={outerRef}
        className="pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(
            var(--cursor-glow-size) circle at var(--glow-x, 50%) var(--glow-y, 50%),
            var(--cursor-glow-color),
            transparent 70%
          )`,
        }}
        aria-hidden="true"
      />
      {/* Inner: small bright core for precision */}
      <div
        ref={innerRef}
        className="pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity duration-200"
        style={{
          background: `radial-gradient(
            var(--cursor-core-size) circle at var(--glow-x, 50%) var(--glow-y, 50%),
            var(--cursor-core-color),
            transparent 70%
          )`,
        }}
        aria-hidden="true"
      />
    </>
  );
}
