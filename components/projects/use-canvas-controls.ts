"use client";

import { useCallback, useRef } from "react";
import { animate, useMotionValue, useMotionValueEvent } from "framer-motion";

const MIN_SCALE = 0.15;
const MAX_SCALE = 3.0;
const DEFAULT_SCALE = 0.5;
const ZOOM_SENSITIVITY = 0.001;

type CanvasPosition = { x: number; y: number };

export function useCanvasControls(viewportRef: React.RefObject<HTMLDivElement | null>) {
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const scale = useMotionValue(DEFAULT_SCALE);

  const isDragging = useRef(false);
  const lastPointer = useRef<CanvasPosition>({ x: 0, y: 0 });

  const dotSize = useMotionValue(1);
  const dotSpacing = useMotionValue(24);
  const dotBgPosX = useMotionValue(0);
  const dotBgPosY = useMotionValue(0);

  const updateDotGrid = useCallback(() => {
    const s = scale.get();
    const ox = offsetX.get();
    const oy = offsetY.get();
    const baseSpacing = 24;
    const spacing = baseSpacing * s;
    dotSpacing.set(spacing);
    dotSize.set(Math.max(0.5, 1 * s));
    dotBgPosX.set(ox % spacing);
    dotBgPosY.set(oy % spacing);
  }, [scale, offsetX, offsetY, dotSpacing, dotSize, dotBgPosX, dotBgPosY]);

  useMotionValueEvent(scale, "change", updateDotGrid);
  useMotionValueEvent(offsetX, "change", updateDotGrid);
  useMotionValueEvent(offsetY, "change", updateDotGrid);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      offsetX.set(offsetX.get() + dx);
      offsetY.set(offsetY.get() + dy);
    },
    [offsetX, offsetY],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = false;
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    },
    [],
  );

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const currentScale = scale.get();
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, currentScale * Math.exp(-e.deltaY * ZOOM_SENSITIVITY)),
      );

      const ox = offsetX.get();
      const oy = offsetY.get();
      const newOffsetX = cursorX - ((cursorX - ox) / currentScale) * newScale;
      const newOffsetY = cursorY - ((cursorY - oy) / currentScale) * newScale;

      scale.set(newScale);
      offsetX.set(newOffsetX);
      offsetY.set(newOffsetY);
    },
    [scale, offsetX, offsetY, viewportRef],
  );

  const panToProject = useCallback(
    (canvasX: number, canvasY: number, frameWidth: number, frameHeight: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const targetScale = 0.65;

      const centerX = rect.width / 2 - (canvasX + frameWidth / 2) * targetScale;
      const centerY = rect.height / 2 - (canvasY + frameHeight / 2) * targetScale;

      const springConfig = { type: "spring" as const, stiffness: 200, damping: 28, mass: 0.9 };

      void animate(offsetX, centerX, springConfig);
      void animate(offsetY, centerY, springConfig);
      void animate(scale, targetScale, springConfig);
    },
    [offsetX, offsetY, scale, viewportRef],
  );

  const resetView = useCallback(
    (projectPositions: Array<{ x: number; y: number; width: number; height: number }>) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();

      if (projectPositions.length === 0) {
        void animate(offsetX, rect.width / 2, { type: "spring", stiffness: 200, damping: 28 });
        void animate(offsetY, rect.height / 2, { type: "spring", stiffness: 200, damping: 28 });
        void animate(scale, DEFAULT_SCALE, { type: "spring", stiffness: 200, damping: 28 });
        return;
      }

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (const pos of projectPositions) {
        minX = Math.min(minX, pos.x);
        minY = Math.min(minY, pos.y);
        maxX = Math.max(maxX, pos.x + pos.width);
        maxY = Math.max(maxY, pos.y + pos.height);
      }

      const contentWidth = maxX - minX;
      const contentHeight = maxY - minY;
      const padding = 200;

      const scaleX = rect.width / (contentWidth + padding);
      const scaleY = rect.height / (contentHeight + padding);
      const fitScale = Math.min(Math.max(MIN_SCALE, Math.min(scaleX, scaleY)), 1.0);

      const centerX = rect.width / 2 - (minX + contentWidth / 2) * fitScale;
      const centerY = rect.height / 2 - (minY + contentHeight / 2) * fitScale;

      const springConfig = { type: "spring" as const, stiffness: 200, damping: 28 };
      void animate(offsetX, centerX, springConfig);
      void animate(offsetY, centerY, springConfig);
      void animate(scale, fitScale, springConfig);
    },
    [offsetX, offsetY, scale, viewportRef],
  );

  return {
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
  };
}
