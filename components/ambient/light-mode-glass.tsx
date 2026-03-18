"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useMotionPreference } from "@/lib/motion";

// Dynamic import — no SSR since it uses backdrop-filter + SVG
const LiquidGlass = dynamic(
  () => import("@liquidglass/react").then((mod) => mod.LiquidGlass),
  { ssr: false }
);

/**
 * Light mode hero — diagonal glass bars using @liquidglass/react.
 * Uses backdrop-filter + SVG feDisplacementMap — no html2canvas,
 * no CORS issues, no black flash.
 */

const BARS = Array.from({ length: 7 }, (_, i) => ({
  id: i,
  offset: -5 + i * 18,
}));

export function LightModeGlass({ children }: { children?: React.ReactNode }) {
  const { reduceMotion } = useMotionPreference();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Colored gradient background — visible through the glass */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          background: `
            linear-gradient(125deg,
              rgba(60, 120, 255, 0.45) 0%,
              rgba(160, 100, 240, 0.35) 25%,
              rgba(80, 200, 210, 0.30) 50%,
              rgba(180, 120, 230, 0.25) 75%,
              rgba(60, 150, 250, 0.35) 100%
            )
          `,
        }}
      />

      {/* Glass bars */}
      {mounted && !reduceMotion && BARS.map((bar) => (
        <div
          key={bar.id}
          className="pointer-events-none absolute z-[1]"
          aria-hidden="true"
          style={{
            left: `${bar.offset}%`,
            top: "50%",
            width: "110px",
            height: "140%",
            transform: "translateY(-50%) rotate(-35deg)",
            transformOrigin: "center center",
          }}
        >
          <LiquidGlass
            displacementScale={40}
            blur={6}
            contrast={1.1}
            brightness={1.05}
            saturation={1.3}
            shadowIntensity={0.15}
            elasticity={0.12}
            borderRadius={8}
          >
            <div style={{ width: "110px", height: "1200px" }} />
          </LiquidGlass>
        </div>
      ))}

      {/* Fade out at bottom */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-72"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--background) 30%, transparent) 40%, var(--background) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
