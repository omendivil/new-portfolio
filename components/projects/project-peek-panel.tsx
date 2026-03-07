"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProjectChapters } from "@/components/projects/project-chapters";
import { ProjectLinkList } from "@/components/projects/project-link-list";
import { ProjectPoster } from "@/components/projects/project-poster";
import { ProjectVideoPlayer } from "@/components/projects/project-video-player";
import type { Project, ProjectChapter } from "@/data/types";
import { trackChapterClick } from "@/lib/analytics";
import { panelMotion, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function ProjectPeekPanel({
  isOpen,
  onClose,
  project,
}: {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}) {
  const { reduceMotion } = useMotionPreference();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(() => project?.videos?.[0]?.id ?? null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>(() => project?.chapters?.[0]?.id);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  const activeVideo = useMemo(() => {
    if (!project?.videos || project.videos.length === 0) {
      return null;
    }

    return project.videos.find((video) => video.id === selectedVideoId) ?? project.videos[0];
  }, [project, selectedVideoId]);

  const activeChapterId = useMemo(() => {
    if (!project?.chapters?.length) {
      return undefined;
    }

    return project.chapters.some((chapter) => chapter.id === selectedChapterId)
      ? selectedChapterId
      : project.chapters[0]?.id;
  }, [project, selectedChapterId]);

  function handleSelectChapter(chapter: ProjectChapter) {
    if (!project) {
      return;
    }

    setSelectedChapterId(chapter.id);
    trackChapterClick(project.id, chapter.id);

    if (chapter.videoId !== activeVideo?.id) {
      setSelectedVideoId(chapter.videoId);
      window.setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = chapter.atSeconds;
        }
      }, 160);
      return;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = chapter.atSeconds;
    }
  }

  return (
    <AnimatePresence>
      {isOpen && project ? (
        <>
          <motion.button
            type="button"
            aria-label="Close project panel"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${project.id}-title`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelMotion(reduceMotion)}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-2xl flex-col p-3 sm:p-5"
          >
            <div className="surface-card flex h-full flex-col overflow-hidden rounded-[1.9rem] p-4 sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-muted">{project.category}</p>
                  <h3 id={`${project.id}-title`} className="mt-2 text-2xl font-semibold tracking-tight text-text sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{project.oneLiner}</p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="surface-pill inline-flex h-11 w-11 items-center justify-center rounded-full text-text transition-colors hover:text-accent"
                >
                  <span className="sr-only">Close project panel</span>
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto pr-1">
                <ProjectPoster project={project} sizes="(min-width: 1024px) 36vw, 100vw" />

                {project.videos && project.videos.length > 1 ? (
                  <div className="flex flex-wrap gap-2">
                    {project.videos.map((video) => {
                      const isActive = video.id === activeVideo?.id;

                      return (
                        <button
                          key={video.id}
                          type="button"
                          onClick={() => setSelectedVideoId(video.id)}
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm transition-colors",
                            isActive
                              ? "border-accent/35 bg-accent-soft text-text"
                              : "border-border/70 bg-surface-2/80 text-muted hover:text-text",
                          )}
                        >
                          {video.label}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {activeVideo ? (
                  <ProjectVideoPlayer key={activeVideo.id} ref={videoRef} projectId={project.id} video={activeVideo} />
                ) : null}

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,0.8fr)]">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-muted">Overview</p>
                      <p className="mt-3 text-sm leading-7 text-muted">{project.summary}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-muted">Highlights</p>
                      <ul className="mt-3 grid gap-3 text-sm leading-7 text-muted">
                        {project.highlights.map((highlight) => (
                          <li key={highlight} className="rounded-[1.1rem] border border-border/70 bg-surface-2/80 px-4 py-3">
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.4rem] border border-border/70 bg-surface-2/80 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-muted">Project notes</p>
                      <dl className="mt-4 space-y-3 text-sm">
                        <div>
                          <dt className="text-muted">Year</dt>
                          <dd className="mt-1 text-text">{project.year}</dd>
                        </div>
                        <div>
                          <dt className="text-muted">Role</dt>
                          <dd className="mt-1 text-text">{project.role}</dd>
                        </div>
                        <div>
                          <dt className="text-muted">Status</dt>
                          <dd className="mt-1 text-text">{project.status}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-muted">Tags</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-border/70 bg-surface-2/80 px-3 py-1 text-xs text-muted">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {project.chapters ? (
                      <ProjectChapters
                        activeChapterId={activeChapterId}
                        chapters={project.chapters}
                        onSelect={handleSelectChapter}
                      />
                    ) : null}
                  </div>
                </div>

                <ProjectLinkList links={project.links} />
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
