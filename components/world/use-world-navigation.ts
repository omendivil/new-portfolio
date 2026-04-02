"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { NavSectionId } from "@/data/types";

type WorldNavigationState = {
  activeSection: NavSectionId;
  previousSection: NavSectionId | null;
  isTransitioning: boolean;
  transitionTarget: NavSectionId | null;
};

type UseWorldNavigationReturn = WorldNavigationState & {
  scrollToSection: (id: NavSectionId) => void;
  sectionOrder: NavSectionId[];
};

export function useWorldNavigation(
  sectionIds: NavSectionId[],
): UseWorldNavigationReturn {
  const [state, setState] = useState<WorldNavigationState>({
    activeSection: sectionIds[0],
    previousSection: null,
    isTransitioning: false,
    transitionTarget: null,
  });
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          const newSection = visible.target.id as NavSectionId;
          setState((prev) => {
            if (prev.activeSection === newSection) return prev;
            return {
              activeSection: newSection,
              previousSection: prev.activeSection,
              isTransitioning: true,
              transitionTarget: newSection,
            };
          });
        }
      },
      { threshold: [0.4, 0.6, 0.8] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [sectionIds]);

  useEffect(() => {
    if (!state.isTransitioning) return;

    transitionTimerRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isTransitioning: false,
        transitionTarget: null,
      }));
    }, 1500);

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [state.isTransitioning, state.transitionTarget]);

  const scrollToSection = useCallback(
    (id: NavSectionId) => {
      const target = document.getElementById(id);
      if (!target) return;

      setState((prev) => ({
        ...prev,
        isTransitioning: true,
        transitionTarget: id,
        previousSection: prev.activeSection,
      }));

      target.scrollIntoView({ behavior: "smooth" });
    },
    [],
  );

  return {
    ...state,
    scrollToSection,
    sectionOrder: sectionIds,
  };
}
