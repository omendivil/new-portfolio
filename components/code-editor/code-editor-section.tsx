"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

import { CodeEditorAnimation } from "./code-editor-animation";

export function CodeEditorSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="code"
      ref={ref}
      className="section-anchor px-4 py-16 sm:px-6 sm:py-24"
    >
      {isInView && <CodeEditorAnimation />}
    </section>
  );
}
