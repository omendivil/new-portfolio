"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { useState } from "react";

import type { Experience } from "@/data/types";
import { RetroComputer } from "./retro-computer";
import { BlueprintTheme } from "./blueprint-theme";
import { NESTheme } from "./nes-theme";

const WorkspaceTheme = dynamic(
  () => import("./workspace-theme").then((m) => ({ default: m.WorkspaceTheme })),
  { ssr: false },
);

const THEMES = [
  { id: "win95", label: "Retro", icon: "💻" },
  { id: "workspace", label: "Workspace", icon: "🖥️" },
  { id: "blueprint", label: "Blueprint", icon: "📐" },
  { id: "nes", label: "8-bit", icon: "👾" },
] as const;

type ThemeId = (typeof THEMES)[number]["id"];

type ExperienceThemeSwitcherProps = {
  experiences: Experience[];
};

export function ExperienceThemeSwitcher({ experiences }: ExperienceThemeSwitcherProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeId>("win95");

  return (
    <div>
      <LayoutGroup>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {THEMES.map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActiveTheme(theme.id)}
                className="relative rounded-lg border border-border/40 px-3 py-1.5 font-mono text-[11px] text-muted transition-colors hover:text-text sm:px-4 sm:text-xs"
              >
                {isActive && (
                  <motion.div
                    layoutId="experience-theme-pill"
                    className="absolute inset-0 rounded-lg border border-accent/30 bg-accent/8"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${isActive ? "text-accent" : ""}`}>
                  {theme.icon} {theme.label}
                </span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <AnimatePresence mode="wait">
        {activeTheme === "win95" && (
          <motion.div key="win95" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <RetroComputer experiences={experiences} />
          </motion.div>
        )}
        {activeTheme === "workspace" && (
          <motion.div key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <WorkspaceTheme experiences={experiences} />
          </motion.div>
        )}
        {activeTheme === "blueprint" && (
          <motion.div key="blueprint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <BlueprintTheme experiences={experiences} />
          </motion.div>
        )}
        {activeTheme === "nes" && (
          <motion.div key="nes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <NESTheme experiences={experiences} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
