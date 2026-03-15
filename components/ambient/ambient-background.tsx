"use client";

import { useMotionPreference } from "@/lib/motion";

import { AuroraBlobs } from "./aurora-blobs";
import { CursorGlow } from "./cursor-glow";
import { NoiseOverlay } from "./noise-overlay";
import { ScrollWash } from "./scroll-wash";

export function AmbientBackground() {
  const { reduceMotion } = useMotionPreference();

  return (
    <>
      <NoiseOverlay />
      <AuroraBlobs />
      {!reduceMotion && <CursorGlow />}
      {!reduceMotion && <ScrollWash />}
    </>
  );
}
