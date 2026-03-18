"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { DarkModeShader } from "./dark-mode-shader";
import { LightModeGlass } from "./light-mode-glass";

/**
 * Theme-aware hero background.
 * Dark mode: exact shader from main (opaque, single-pass, untouchable)
 * Light mode: separate glass refraction system (freely modifiable)
 * Zero shared state between them.
 */
export function WebflowGradient({ children }: { children?: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="relative overflow-hidden">{children}</div>;
  }

  if (resolvedTheme === "dark") {
    return <DarkModeShader>{children}</DarkModeShader>;
  }

  return <LightModeGlass>{children}</LightModeGlass>;
}
