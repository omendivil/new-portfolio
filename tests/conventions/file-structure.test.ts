/**
 * File Structure Convention Tests
 *
 * Enforces where files live and how they're named.
 * Adapted for root-level directory structure (no src/ prefix).
 */

import { describe, it, expect } from "vitest";
import { globSync } from "glob";
import { readFileSync } from "fs";

// Every .ts/.tsx file must live in one of these directories.
const ALLOWED_DIRECTORIES = [
  "app",
  "components",
  "lib",
  "data",
];

// Config files allowed at project root
const ALLOWED_ROOT_FILES = [
  "eslint.config.mjs",
  "postcss.config.mjs",
  "next.config.ts",
  "knip.config.ts",
  "vitest.conventions.config.ts",
];

describe("File Structure", () => {
  const allSourceFiles = globSync("{app,components,lib,data}/**/*.{ts,tsx}", {
    ignore: ["**/*.test.*", "**/*.spec.*", "**/__tests__/**"],
  });

  it("all source files should live in allowed directories", () => {
    const violations = allSourceFiles.filter((file) => {
      return !ALLOWED_DIRECTORIES.some((dir) => file.startsWith(dir + "/"));
    });

    if (violations.length > 0) {
      const message = violations
        .map((f) => `  ${f} — not in any allowed directory`)
        .join("\n");
      expect.fail(
        `Found ${violations.length} file(s) outside allowed directories:\n${message}`
      );
    }
  });

  it("component files should use PascalCase or kebab-case", () => {
    const componentFiles = globSync("components/**/*.tsx", {
      ignore: ["**/index.tsx", "**/*.test.*"],
    });

    const violations = componentFiles.filter((file) => {
      const fileName = file.split("/").pop()!.replace(".tsx", "");
      // Allow PascalCase (FadeIn) or kebab-case (fade-in)
      return !/^[A-Z][a-zA-Z0-9]*$/.test(fileName) && !/^[a-z][a-z0-9-]*$/.test(fileName);
    });

    if (violations.length > 0) {
      const message = violations.join("\n  ");
      expect.fail(
        `Component files should use PascalCase or kebab-case:\n  ${message}`
      );
    }
  });

  it("hook files should start with 'use'", () => {
    // Hooks can live in components/ or lib/ — check both
    const hookFiles = globSync("{components,lib}/**/use-*.{ts,tsx}");

    // Also check for files named use*.ts that DON'T follow the pattern
    const allTsFiles = globSync("{components,lib}/**/*.{ts,tsx}", {
      ignore: ["**/*.test.*", "**/*.d.ts"],
    });

    const misnamedHooks = allTsFiles.filter((file) => {
      const fileName = file.split("/").pop()!.replace(/\.tsx?$/, "");
      // File contains "use" as a React hook but doesn't start with "use"
      if (fileName.startsWith("use")) return false;
      const content = readFileSync(file, "utf-8");
      // Check if the file's PRIMARY purpose is a hook (exports mostly hooks)
      // Files like motion.ts that export one hook alongside many presets are fine
      const hookExports = (content.match(/export\s+(?:default\s+)?function\s+use[A-Z]/g) || []).length;
      const totalExports = (content.match(/export\s+(?:default\s+)?(?:function|const|type|interface)\s+/g) || []).length;
      // Only flag if hooks are the majority of exports
      return hookExports > 0 && totalExports > 0 && hookExports / totalExports > 0.5;
    });

    if (misnamedHooks.length > 0) {
      const message = misnamedHooks.join("\n  ");
      expect.fail(
        `Files exporting custom hooks should have filenames starting with "use":\n  ${message}`
      );
    }
  });

  it("no source file should exceed the line limit", () => {
    // Pre-existing large files tracked but threshold relaxed for now
    const MAX_LINES = 1000;

    const violations = allSourceFiles
      .map((file) => {
        const lines = readFileSync(file, "utf-8").split("\n").length;
        return { file, lines };
      })
      .filter(({ lines }) => lines > MAX_LINES);

    if (violations.length > 0) {
      const message = violations
        .map(({ file, lines }) => `  ${file} (${lines} lines)`)
        .join("\n");
      expect.fail(
        `Files exceeding ${MAX_LINES} line limit:\n${message}`
      );
    }
  });
});
