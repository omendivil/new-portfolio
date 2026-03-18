"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { useMotionPreference } from "@/lib/motion";

// Dynamic import — no SSR since it uses backdrop-filter + SVG
const LiquidGlass = dynamic(
  () => import("@liquidglass/react").then((mod) => mod.LiquidGlass),
  { ssr: false, loading: () => null }
);

/**
 * Light mode hero — diagonal glass bars using @liquidglass/react.
 * Uses backdrop-filter + SVG feDisplacementMap — no html2canvas,
 * no CORS issues, no black flash.
 */

// Each bar gets its own tint color — like stained glass panels
const BAR_COLORS = [
  "rgba(60, 140, 220, 0.35)",
  "rgba(140, 80, 200, 0.30)",
  "rgba(60, 190, 180, 0.32)",
  "rgba(120, 100, 220, 0.30)",
  "rgba(80, 160, 240, 0.35)",
];

const BARS = BAR_COLORS.map((color, i) => ({
  id: i,
  offset: -5 + i * 25,
  color,
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
          background: "transparent",
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
            width: "160px",
            height: "160%",
            transform: "translateY(-50%) rotate(-35deg)",
            transformOrigin: "center center",
          }}
        >
          <LiquidGlass
            displacementScale={200}
            blur={20}
            contrast={1.1}
            brightness={1.05}
            saturation={1.5}
            shadowIntensity={0.3}
            elasticity={0.2}
            borderRadius={12}
          >
            {/* Colored glass panel — tint + glassmorphism surface */}
            <div
              style={{
                width: "160px",
                height: "1400px",
                background: `linear-gradient(180deg, ${bar.color}, rgba(255, 255, 255, 0.15), ${bar.color})`,
                borderLeft: "2px solid rgba(255, 255, 255, 0.7)",
                borderTop: "1.5px solid rgba(255, 255, 255, 0.5)",
                borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                boxShadow: "inset 0 2px 4px rgba(255, 255, 255, 0.3), inset 0 -1px 2px rgba(0, 0, 0, 0.05), 0 8px 32px rgba(0, 0, 0, 0.12)",
              }}
            />
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
