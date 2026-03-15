"use client";

import { useCallback, useEffect, useRef } from "react";

import { useMotionPreference } from "@/lib/motion";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduceMotion } = useMotionPreference();

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    ref.current.style.setProperty("--glow-x", `${e.clientX}px`);
    ref.current.style.setProperty("--glow-y", `${e.clientY}px`);
    ref.current.style.opacity = "1";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.opacity = "0";
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
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-40 opacity-0 transition-opacity duration-300"
      style={{
        background: `radial-gradient(
          var(--cursor-glow-size) circle at var(--glow-x, 50%) var(--glow-y, 50%),
          var(--cursor-glow-color),
          transparent 70%
        )`,
      }}
      aria-hidden="true"
    />
  );
}
