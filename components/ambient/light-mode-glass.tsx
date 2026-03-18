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

const BARS = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  offset: -5 + i * 25,
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
              #3060ff 0%,
              #8040e0 20%,
              #20c0c0 40%,
              #a060e0 60%,
              #4080ff 80%,
              #6030d0 100%
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
            width: "160px",
            height: "160%",
            transform: "translateY(-50%) rotate(-35deg)",
            transformOrigin: "center center",
          }}
        >
          <LiquidGlass
            displacementScale={200}
            blur={3}
            contrast={1.1}
            brightness={1.05}
            saturation={1.5}
            shadowIntensity={0.3}
            elasticity={0.2}
            borderRadius={12}
          >
            {/* Glassmorphism surface — the 4 core properties */}
            <div
              style={{
                width: "160px",
                height: "1400px",
                background: "rgba(255, 255, 255, 0.1)",
                borderLeft: "1.5px solid rgba(255, 255, 255, 0.6)",
                borderTop: "1px solid rgba(255, 255, 255, 0.4)",
                borderRight: "1px solid rgba(255, 255, 255, 0.15)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "12px",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.15)",
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
