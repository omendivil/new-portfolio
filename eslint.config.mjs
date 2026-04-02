import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Three.js/R3F and complex animation components use patterns (useFrame mutations,
  // procedural Math.random in useMemo, setState in load effects) that are correct
  // for 3D rendering but incompatible with React compiler strict rules.
  {
    files: [
      "components/experience/workspace-theme.tsx",
      "components/experience/nes-theme.tsx",
      "components/experience/blueprint-theme.tsx",
    ],
    rules: {
      "react-hooks/purity": "off",
      "react-hooks/rules-of-hooks": "warn",
      "react-hooks/refs": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);

export default eslintConfig;
