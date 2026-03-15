"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

import { useMotionPreference } from "@/lib/motion";

const SECTIONS = ["hero", "projects", "code", "experience", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

const WASH_COLORS: Record<SectionId, string> = {
  hero: "var(--wash-hero)",
  projects: "var(--wash-projects)",
  code: "var(--wash-code)",
  experience: "var(--wash-experience)",
  contact: "var(--wash-contact)",
};

export function ScrollWash() {
  const { reduceMotion } = useMotionPreference();
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", () => {
    for (let i = SECTIONS.length - 1; i >= 0; i--) {
      const el = document.getElementById(SECTIONS[i]);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.4) {
        if (activeSection !== SECTIONS[i]) {
          setActiveSection(SECTIONS[i]);
        }
        break;
      }
    }
  });

  if (reduceMotion) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-[background] duration-1000 ease-out"
      style={{
        background: `radial-gradient(
          ellipse 80% 60% at 50% 30%,
          ${WASH_COLORS[activeSection]},
          transparent 70%
        )`,
      }}
      aria-hidden="true"
    />
  );
}
