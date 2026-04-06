"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, useMotionTemplate } from "framer-motion";

import type { Project } from "@/data/types";

import { CanvasProjectFrame, getFrameDimensions } from "./canvas-project-frame";
import { DotGridBackground } from "./dot-grid-background";
import { useCanvasControls } from "./use-canvas-controls";

type CanvasPosition = {
  x: number;
  y: number;
};

const CANVAS_POSITIONS: Record<string, CanvasPosition> = {
  "frameworks-app": { x: 0, y: 0 },
  "anime-ai-app": { x: 800, y: -100 },
  "appetizer-app": { x: -700, y: 200 },
  "2048-game": { x: 400, y: 500 },
};

type CanvasViewportProps = {
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  projects: Project[];
};

export function CanvasViewport({
  activeProjectId,
  onSelectProject,
  projects,
}: CanvasViewportProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  const {
    offsetX,
    offsetY,
    scale,
    dotSize,
    dotSpacing,
    dotBgPosX,
    dotBgPosY,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handleWheel,
    panToProject,
    resetView,
  } = useCanvasControls(viewportRef);

  const transform = useMotionTemplate`translate(${offsetX}px, ${offsetY}px) scale(${scale})`;

  const getAllFramePositions = useCallback(() => {
    return projects
      .map((p) => {
        const pos = CANVAS_POSITIONS[p.id];
        if (!pos) return null;
        const dims = getFrameDimensions(p.presentation as "canvas" | "device");
        return { x: pos.x, y: pos.y, width: dims.width, height: dims.height + 80 };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);
  }, [projects]);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const positions = getAllFramePositions();
    resetView(positions);
  }, [getAllFramePositions, resetView]);

  useEffect(() => {
    if (!activeProjectId) return;
    const pos = CANVAS_POSITIONS[activeProjectId];
    if (!pos) return;
    const project = projects.find((p) => p.id === activeProjectId);
    if (!project) return;
    const dims = getFrameDimensions(project.presentation as "canvas" | "device");
    panToProject(pos.x, pos.y, dims.width, dims.height + 80);
  }, [activeProjectId, projects, panToProject]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handleResetView = useCallback(() => {
    const positions = getAllFramePositions();
    resetView(positions);
  }, [getAllFramePositions, resetView]);

  return (
    <div className="relative hidden sm:block">
      <div
        ref={viewportRef}
        className="relative h-[36rem] w-full cursor-grab overflow-hidden rounded-2xl border border-border/40 bg-surface/30 active:cursor-grabbing lg:h-[42rem]"
        style={{ touchAction: "none", overscrollBehavior: "contain" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <DotGridBackground
          dotBgPosX={dotBgPosX}
          dotBgPosY={dotBgPosY}
          dotSize={dotSize}
          dotSpacing={dotSpacing}
        />

        <motion.div
          className="absolute left-0 top-0 origin-[0_0]"
          style={{ transform }}
        >
          {projects.map((project) => {
            const pos = CANVAS_POSITIONS[project.id];
            if (!pos) return null;

            return (
              <div
                key={project.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectProject(project.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectProject(project.id);
                  }
                }}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/20 focus-visible:ring-offset-2"
              >
                <CanvasProjectFrame
                  isActive={project.id === activeProjectId}
                  project={project}
                  x={pos.x}
                  y={pos.y}
                />
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleResetView}
          className="rounded-lg border border-border/50 bg-surface/80 px-2.5 py-1.5 text-[0.65rem] font-medium text-muted backdrop-blur transition-colors hover:text-text"
          aria-label="Reset canvas view"
        >
          Fit all
        </button>
      </div>
    </div>
  );
}

export { CANVAS_POSITIONS };
