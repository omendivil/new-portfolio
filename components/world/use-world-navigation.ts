"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { NavSectionId } from "@/data/types";

type WorldNavigationState = {
  activeIndex: number;
  previousIndex: number | null;
  isTransitioning: boolean;
  direction: "left" | "right" | null;
};

type UseWorldNavigationReturn = WorldNavigationState & {
  activeSection: NavSectionId;
  transitionTarget: NavSectionId | null;
  sectionOrder: NavSectionId[];
  goToSection: (id: NavSectionId) => void;
  goNext: () => void;
  goPrev: () => void;
};

export function useWorldNavigation(
  sectionIds: NavSectionId[],
): UseWorldNavigationReturn {
  const [state, setState] = useState<WorldNavigationState>({
    activeIndex: 0,
    previousIndex: null,
    isTransitioning: false,
    direction: null,
  });
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Clear transition state after animation completes
  useEffect(() => {
    if (!state.isTransitioning) return;

    transitionTimerRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isTransitioning: false,
        direction: null,
      }));
    }, 1600); // matches terminal transition + slide animation

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [state.isTransitioning, state.activeIndex]);

  const goToSection = useCallback(
    (id: NavSectionId) => {
      const targetIndex = sectionIds.indexOf(id);
      if (targetIndex === -1) return;

      setState((prev) => {
        if (prev.activeIndex === targetIndex) return prev;
        if (prev.isTransitioning) return prev; // prevent double-nav during transition
        return {
          activeIndex: targetIndex,
          previousIndex: prev.activeIndex,
          isTransitioning: true,
          direction: targetIndex > prev.activeIndex ? "left" : "right",
        };
      });
    },
    [sectionIds],
  );

  const goNext = useCallback(() => {
    setState((prev) => {
      if (prev.isTransitioning) return prev;
      if (prev.activeIndex >= sectionIds.length - 1) return prev;
      return {
        activeIndex: prev.activeIndex + 1,
        previousIndex: prev.activeIndex,
        isTransitioning: true,
        direction: "left",
      };
    });
  }, [sectionIds.length]);

  const goPrev = useCallback(() => {
    setState((prev) => {
      if (prev.isTransitioning) return prev;
      if (prev.activeIndex <= 0) return prev;
      return {
        activeIndex: prev.activeIndex - 1,
        previousIndex: prev.activeIndex,
        isTransitioning: true,
        direction: "right",
      };
    });
  }, []);

  return {
    ...state,
    activeSection: sectionIds[state.activeIndex],
    transitionTarget: state.isTransitioning ? sectionIds[state.activeIndex] : null,
    sectionOrder: sectionIds,
    goToSection,
    goNext,
    goPrev,
  };
}
