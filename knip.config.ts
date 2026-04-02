import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Root-level Next.js App Router (no src/ prefix)
  entry: [
    "app/**/page.tsx",
    "app/**/layout.tsx",
    "app/**/error.tsx",
    "app/**/global-error.tsx",
    "app/**/route.ts",
  ],

  project: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "data/**/*.{ts,tsx}",
  ],

  ignore: [
    "node_modules/**",
    ".next/**",
    "public/**",
    "docs/**",
  ],

  ignoreDependencies: [
    // @tailwindcss/postcss is loaded via postcss.config.mjs, not direct import
    "@tailwindcss/postcss",
    // tailwindcss is a peer dep of @tailwindcss/postcss
    "tailwindcss",
    // glob is used in convention tests, not app code
    "glob",
  ],

  ignoreExportsUsedInFile: true,

  rules: {
    // Section data exports (hero, skills, writing, contact) are kept for upcoming release
    exports: "warn",
  },
};

export default config;
