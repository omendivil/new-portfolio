"use client";

import { useMotionPreference } from "@/lib/motion";

import { FloatingParticles } from "./floating-particles";
import { NoiseOverlay } from "./noise-overlay";

/**
 * Global ambient layer — effects that span the ENTIRE page.
 * Section-specific effects (Webflow gradient, Vercel grid)
 * live inside their respective sections, not here.
 *
 * Z-index stack:
 *   0  — FloatingParticles (drifting luminous dots, behind content)
 *  50  — NoiseOverlay (grain texture, topmost)
 */
export function AmbientBackground() {
  const { reduceMotion } = useMotionPreference();

  return (
    <>
      {!reduceMotion && <FloatingParticles />}
      <NoiseOverlay />
    </>
  );
}
