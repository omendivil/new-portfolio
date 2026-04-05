"use client";

import { useCallback, useRef } from "react";

import { WorldEntrance } from "@/components/world/world-entrance";
import { useWorldActive } from "@/components/world/world-slide";

import { AsciiVideoBackground, type AsciiVideoBackgroundRef } from "./ascii-video-background";
import { CodeEditorAnimation } from "./code-editor-animation";

export function CodeEditorSection() {
  const isActive = useWorldActive();
  const bgRef = useRef<AsciiVideoBackgroundRef>(null);

  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    bgRef.current?.triggerRipple(e);
  }, []);

  return (
    <div
      className="relative h-full w-full overflow-hidden cursor-pointer"
      onClick={handleBackgroundClick}
    >
      {/* Video ASCII background — fills the world */}
      <AsciiVideoBackground ref={bgRef} active={isActive} />

      {/* Editor content — floats on top */}
      <div className="pointer-events-none relative z-10 flex h-full items-center justify-center">
        <div
          className="pointer-events-auto w-full rounded-2xl border border-white/[0.05] bg-[rgba(8,8,14,0.6)] px-6 py-6 backdrop-blur-[30px] sm:px-7"
          style={{ maxWidth: "min(960px, 92vw)", boxShadow: "0 40px 120px -20px rgba(0,0,0,0.7)" }}
        >
          <WorldEntrance delay={0.1}>
            {isActive && <CodeEditorAnimation />}
          </WorldEntrance>
        </div>
      </div>
    </div>
  );
}
