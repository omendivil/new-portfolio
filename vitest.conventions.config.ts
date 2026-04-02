import { defineConfig } from "vitest/config";

// Convention tests run in Node (not jsdom) because they read the filesystem
// to check file structure, import patterns, and route traceability.
//
// Run: npx vitest run --config vitest.conventions.config.ts

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/conventions/**/*.test.ts"],
  },
});
