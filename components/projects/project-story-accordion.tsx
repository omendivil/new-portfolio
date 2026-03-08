"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

import type { Project } from "@/data/types";
import { motionEase, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StoryAccordionItem = {
  description: string;
  eyebrow: string;
  id: string;
  title: string;
};

export function ProjectStoryAccordion({ project }: { project: Project }) {
  const { reduceMotion } = useMotionPreference();
  const items = useMemo<StoryAccordionItem[]>(
    () => [
      ...project.story,
      {
        description: project.highlights.join(" "),
        eyebrow: "Technical framing",
        id: `${project.id}-technical-framing`,
        title: "What the project explores technically",
      },
    ],
    [project],
  );
  const [openItemId, setOpenItemId] = useState<string | null>(items[0]?.id ?? null);
  const activeItemId = items.some((item) => item.id === openItemId) ? openItemId : items[0]?.id ?? null;

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = item.id === activeItemId;

        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-[1.35rem] border border-border/70 bg-surface/76 transition-colors",
              isOpen && "bg-surface-2/56",
            )}
          >
            <button
              type="button"
              onClick={() => setOpenItemId(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
              aria-expanded={isOpen}
            >
              <div className="min-w-0">
                <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">{item.eyebrow}</p>
                <p className="mt-1 text-sm font-medium leading-6 text-text sm:text-base">{item.title}</p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={reduceMotion ? undefined : { height: "auto", opacity: 1 }}
                  exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.26, ease: motionEase }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-border/70 px-4 py-4 sm:px-5">
                    <p className="text-sm leading-7 text-muted">{item.description}</p>

                    {item.id === `${project.id}-technical-framing` ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.technicalThemes.map((theme) => (
                          <span
                            key={theme}
                            className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs text-muted"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
