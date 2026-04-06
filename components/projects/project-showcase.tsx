"use client";

import { type RefObject, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Package } from "lucide-react";

import type { Project } from "@/data/types";
import { pillTransition, useMotionPreference } from "@/lib/motion";
import { useProjectStore } from "@/lib/use-project-store";
import { cn } from "@/lib/utils";
import { WorldEntrance } from "@/components/world/world-entrance";

import { DashboardPresentation } from "./dashboard-presentation";
import { TerminalPresentation } from "./terminal-presentation";
import { ProjectShowcaseDevice } from "./project-showcase-device";

type ProjectShowcaseProps = {
  drawerTriggerRef: RefObject<HTMLButtonElement | null>;
  onOpenDrawer: () => void;
  projectCount: number;
  projects: Project[];
};

const linkIcons: Record<string, typeof ExternalLink> = {
  demo: ExternalLink,
  repo: Github,
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
    <div className="space-y-6">
      {/* Section header */}
      <WorldEntrance delay={0.1} from="bottom" distance={24}>
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-muted sm:text-xs">
          Projects
        </p>
      </WorldEntrance>

      {/* Project pills */}
      <WorldEntrance delay={0.2} from="bottom" distance={16}>
        <div className="-mx-4 flex items-center gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-x-visible sm:px-0">
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
                  isActive ? "text-text" : "text-muted hover:text-text",
                )}
              >
                {isActive && !reduceMotion ? (
                  <motion.span
                    layoutId="project-pill-active"
                    transition={pillTransition}
                    className="absolute inset-0 rounded-full border border-border bg-surface"
                  />
                ) : isActive ? (
                  <span className="absolute inset-0 rounded-full border border-border bg-surface" />
                ) : null}
                <span className="relative z-10">{project.title}</span>
              </button>
            );
          })}
        </div>
      </WorldEntrance>

      {/* Active project showcase */}
      <WorldEntrance delay={0.35} from="bottom" distance={30}>
        {activeProject && (
          <motion.div
            key={activeProject.id}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-5"
          >
              {/* Visual presentation */}
              <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                <ProjectPresentation project={activeProject} />
              </div>

              {/* Project info */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-xl space-y-2">
                  <h3 className="text-lg font-semibold text-text">
                    {activeProject.title}
                  </h3>
                  <p className="text-[0.9rem] leading-relaxed text-muted">
                    {activeProject.oneLiner}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/[0.04] px-2.5 py-0.5 text-[11px] text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
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
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] px-3.5 py-1.5 text-[13px] text-muted transition-colors hover:border-white/[0.15] hover:text-text"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
      </WorldEntrance>
    </div>
  );
}
