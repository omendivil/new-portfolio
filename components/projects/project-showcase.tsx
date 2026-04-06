"use client";

import { type RefObject, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Package } from "lucide-react";

import type { Project } from "@/data/types";
import { pillTransition, useMotionPreference } from "@/lib/motion";
import { useProjectStore } from "@/lib/use-project-store";
import { cn } from "@/lib/utils";
import { WorldEntrance } from "@/components/world/world-entrance";

import { DashboardPresentation } from "./dashboard-presentation";
import { TerminalPresentation } from "./terminal-presentation";
import { ProjectShowcaseDevice } from "./project-showcase-device";
import { ProjectWorldBackground } from "./project-world-background";

type ProjectShowcaseProps = {
  drawerTriggerRef: RefObject<HTMLButtonElement | null>;
  onOpenDrawer: () => void;
  projectCount: number;
  projects: Project[];
};

function ProjectPresentation({ project }: { project: Project }) {
  switch (project.presentation) {
    case "dashboard":
      return <DashboardPresentation />;
    case "terminal":
      return <TerminalPresentation projectId={project.id} />;
    case "device":
      return <ProjectShowcaseDevice project={project} />;
    default:
      return <ProjectShowcaseDevice project={project} />;
  }
}

export function ProjectShowcase({
  drawerTriggerRef,
  onOpenDrawer,
  projectCount,
  projects,
}: ProjectShowcaseProps) {
  const { reduceMotion } = useMotionPreference();
  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const setActiveProjectId = useProjectStore((s) => s.setActiveProjectId);

  useEffect(() => {
    if (!activeProjectId && projects.length > 0) {
      setActiveProjectId(projects[0].id);
    }
  }, [activeProjectId, projects, setActiveProjectId]);

  const activeProject =
    projects.find((p) => p.id === activeProjectId) ?? projects[0];

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col">
      {/* ── World background (full viewport, behind everything) ── */}
      {activeProject && (
        <ProjectWorldBackground projectId={activeProject.id} />
      )}

      {/* ── Content layer ── */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* Top bar: section label + project pills */}
        <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-10">
          <WorldEntrance delay={0.1} from="bottom" distance={24}>
            <p className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-white/40 sm:text-xs">
              Projects
            </p>
          </WorldEntrance>

          <WorldEntrance delay={0.2} from="bottom" distance={16}>
            <div className="flex items-center gap-1.5 overflow-x-auto sm:flex-wrap sm:overflow-x-visible">
              {projects.map((project) => {
                const isActive = project.id === activeProject?.id;

                return (
                  <button
                    key={project.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveProjectId(project.id)}
                    className={cn(
                      "relative shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                      isActive
                        ? "text-white"
                        : "text-white/40 hover:text-white/70",
                    )}
                  >
                    {isActive && !reduceMotion ? (
                      <motion.span
                        layoutId="project-pill-active"
                        transition={pillTransition}
                        className="absolute inset-0 rounded-full border border-white/15 bg-white/[0.08] backdrop-blur-sm"
                      />
                    ) : isActive ? (
                      <span className="absolute inset-0 rounded-full border border-white/15 bg-white/[0.08]" />
                    ) : null}
                    <span className="relative z-10">{project.title}</span>
                  </button>
                );
              })}
            </div>
          </WorldEntrance>
        </div>

        {/* Center: project presentation (fills available space) */}
        <div className="flex flex-1 items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
          <WorldEntrance delay={0.35} from="bottom" distance={30}>
            {activeProject && (
              <motion.div
                key={activeProject.id}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-5xl"
              >
                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30 shadow-2xl backdrop-blur-md">
                  <ProjectPresentation project={activeProject} />
                </div>
              </motion.div>
            )}
          </WorldEntrance>
        </div>

        {/* Bottom: project info overlay */}
        {activeProject && (
          <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6 sm:pb-12">
            <motion.div
              key={`info-${activeProject.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
            >
              <div className="max-w-xl space-y-1.5">
                <h3 className="text-xl font-semibold text-white">
                  {activeProject.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/50">
                  {activeProject.oneLiner}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeProject.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.06] bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                {activeProject.links.map((link) => {
                  const Icon =
                    link.kind === "repo"
                      ? Github
                      : link.kind === "demo"
                        ? link.href.includes("npmjs")
                          ? Package
                          : ExternalLink
                        : ExternalLink;

                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.1] bg-white/[0.05] px-3.5 py-1.5 text-[13px] text-white/60 backdrop-blur-sm transition-colors hover:border-white/[0.2] hover:text-white/90"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
