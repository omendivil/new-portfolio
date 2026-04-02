/**
 * Import Boundary Convention Tests
 *
 * Backup enforcement for arch-drift. Verifies import rules
 * by reading source files and checking import statements.
 *
 * Adapted for root-level directory structure (no src/ prefix).
 * Path alias: @/* → ./*
 */

import { describe, it, expect } from "vitest";
import { globSync } from "glob";
import { readFileSync } from "fs";

// Mirror architecture.yml layer rules.
// Key = layer directory, Value = directories this layer CAN import from.
const LAYER_RULES: Record<string, string[]> = {
  data: [],
  lib: ["data"],
  components: ["lib", "data"],
  // app layer excluded — top of tree, can import anything
};

// Path alias: @/ → ./  (root-level)
const PATH_ALIASES: Record<string, string> = {
  "@/": "",
};

function extractImports(content: string): { path: string; line: number }[] {
  const imports: { path: string; line: number }[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(
      /import\s+(?:type\s+)?(?:.*?\s+from\s+)?['"]([^'"]+)['"]/
    );
    if (match) {
      imports.push({ path: match[1], line: i + 1 });
    }
  }

  return imports;
}

function resolveImportToLayer(importPath: string, sourceFile: string): string | null {
  let resolved = importPath;

  // Resolve path aliases (@/ → root)
  for (const [alias, target] of Object.entries(PATH_ALIASES)) {
    if (resolved.startsWith(alias)) {
      resolved = resolved.replace(alias, target);
      break;
    }
  }

  // Resolve relative imports
  if (resolved.startsWith(".")) {
    const sourceDir = sourceFile.split("/").slice(0, -1).join("/");
    const parts = [...sourceDir.split("/"), ...resolved.split("/")];
    const normalized: string[] = [];
    for (const part of parts) {
      if (part === "..") normalized.pop();
      else if (part !== ".") normalized.push(part);
    }
    resolved = normalized.join("/");
  }

  // Skip external packages
  if (
    !resolved.startsWith("data/") &&
    !resolved.startsWith("lib/") &&
    !resolved.startsWith("components/") &&
    !resolved.startsWith("app/")
  ) {
    return null;
  }

  // Extract layer name (first directory segment)
  const layer = resolved.split("/")[0];
  return LAYER_RULES[layer] !== undefined ? layer : null;
}

function getLayerForFile(filePath: string): string | null {
  const layer = filePath.split("/")[0];
  return LAYER_RULES[layer] !== undefined ? layer : null;
}

describe("Import Boundaries", () => {
  const enforcedLayers = Object.keys(LAYER_RULES);
  const sourceFiles = enforcedLayers.flatMap((layer) =>
    globSync(`${layer}/**/*.{ts,tsx}`, {
      ignore: ["**/*.test.*", "**/*.spec.*", "**/__tests__/**"],
    })
  );

  it("all imports should respect layer boundaries", () => {
    const violations: string[] = [];

    for (const file of sourceFiles) {
      const sourceLayer = getLayerForFile(file);
      if (!sourceLayer) continue;

      const content = readFileSync(file, "utf-8");
      const imports = extractImports(content);
      const allowedLayers = LAYER_RULES[sourceLayer];

      for (const imp of imports) {
        const targetLayer = resolveImportToLayer(imp.path, file);

        // Skip: external packages, same layer, unresolvable
        if (!targetLayer) continue;
        if (targetLayer === sourceLayer) continue;

        if (!allowedLayers.includes(targetLayer)) {
          violations.push(
            `  ${file}:${imp.line} — ${sourceLayer} imports from ${targetLayer} (${imp.path})`
          );
        }
      }
    }

    if (violations.length > 0) {
      expect.fail(
        `Found ${violations.length} import boundary violation(s):\n${violations.join("\n")}`
      );
    }
  });

  it("data layer should not import from any other layer", () => {
    const dataFiles = globSync("data/**/*.{ts,tsx}", {
      ignore: ["**/*.test.*"],
    });

    const violations: string[] = [];

    for (const file of dataFiles) {
      const content = readFileSync(file, "utf-8");
      const imports = extractImports(content);

      for (const imp of imports) {
        const targetLayer = resolveImportToLayer(imp.path, file);
        if (targetLayer && targetLayer !== "data") {
          violations.push(
            `  ${file}:${imp.line} — data imports from ${targetLayer} (${imp.path})`
          );
        }
      }
    }

    if (violations.length > 0) {
      expect.fail(
        `Data layer must not import from other layers:\n${violations.join("\n")}`
      );
    }
  });
});
