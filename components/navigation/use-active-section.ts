"use client";

import { useEffect, useState } from "react";

import type { NavSectionId } from "@/data/types";

export function useActiveSection(sectionIds: NavSectionId[]) {
  const [activeSection, setActiveSection] = useState<NavSectionId>(() => {
    if (typeof window === "undefined") {
      return sectionIds[0];
    }

    const hash = window.location.hash.slice(1) as NavSectionId;
    return hash && sectionIds.includes(hash) ? hash : sectionIds[0];
  });
  const sectionIdsKey = sectionIds.join(",");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              right.intersectionRatio - left.intersectionRatio,
          )[0];

        if (visibleEntry?.target.id) {
          setActiveSection(visibleEntry.target.id as NavSectionId);
        }
      },
      {
        rootMargin: "-35% 0px -45% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIds, sectionIdsKey]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as NavSectionId;

      if (hash && sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [sectionIds, sectionIdsKey]);

  return { activeSection, setActiveSection };
}
