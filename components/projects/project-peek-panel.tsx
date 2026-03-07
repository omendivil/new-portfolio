"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProjectChapters } from "@/components/projects/project-chapters";
import { ProjectLinkList } from "@/components/projects/project-link-list";
import { getProjectPresentation, ProjectPoster } from "@/components/projects/project-poster";
import { ProjectVideoPlayer } from "@/components/projects/project-video-player";
import type { Project, ProjectChapter } from "@/data/types";
import { trackChapterClick } from "@/lib/analytics";
import { overlayMotion, panelMotion, useMotionPreference } from "@/lib/motion";
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
  const initialVideo = project?.videos[0] ?? null;
  const initialChapter =
    (initialVideo && project?.chapters.find((chapter) => chapter.videoId === initialVideo.id)) ??
    project?.chapters[0];
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(() => initialVideo?.id ?? null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | undefined>(
    () => initialChapter?.id,
  );
  const [playbackStartAt, setPlaybackStartAt] = useState(() => initialChapter?.atSeconds ?? 0);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  const activeVideo = useMemo(() => {
    if (!project?.videos.length) {
      return null;
    }

    return project.videos.find((video) => video.id === selectedVideoId) ?? project.videos[0];
  }, [project, selectedVideoId]);

  const activeChapter = useMemo(() => {
    if (!project?.chapters.length) {
      return undefined;
    }

    return (
      project.chapters.find((chapter) => chapter.id === selectedChapterId) ??
      project.chapters.find((chapter) => chapter.videoId === activeVideo?.id) ??
      project.chapters[0]
    );
  }, [activeVideo?.id, project, selectedChapterId]);

  const activeChapterId = activeChapter?.id;
  const presentation = project ? getProjectPresentation(project) : "canvas";

  function handleSelectVideo(videoId: string) {
    if (!project) {
      return;
    }

    const matchingChapter = project.chapters.find((chapter) => chapter.videoId === videoId);

    setSelectedVideoId(videoId);
    setSelectedChapterId(matchingChapter?.id);
    setPlaybackStartAt(matchingChapter?.atSeconds ?? 0);
  }

  function handleSelectChapter(chapter: ProjectChapter) {
    if (!project) {
      return;
    }

    setSelectedChapterId(chapter.id);
    setSelectedVideoId(chapter.videoId);
    setPlaybackStartAt(chapter.atSeconds);
    trackChapterClick(project.id, chapter.id);
  }

  return (
    <AnimatePresence>
      {isOpen && project ? (
        <>
          <motion.button
            type="button"
            aria-label="Close project panel"
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/65 backdrop-blur-[6px]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayMotion(reduceMotion)}
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${project.id}-title`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelMotion(reduceMotion)}
            className="fixed inset-0 z-50 flex justify-end p-2 sm:p-4"
          >
            <div className="pointer-events-auto ml-auto flex h-full w-full max-w-[44rem] flex-col">
              <div className="surface-card flex h-full flex-col overflow-hidden rounded-[1.9rem] sm:rounded-[2.1rem]">
                <div className="border-b border-border/70 bg-surface/92 px-4 py-4 backdrop-blur sm:px-6 sm:py-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                          {project.category}
                        </span>
                        <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                          {project.year}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/72 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                          <Sparkles className="h-3.5 w-3.5" />
                          Peek panel
                        </span>
                      </div>

                      <div>
                        <h3
                          id={`${project.id}-title`}
                          className="text-balance text-2xl font-semibold tracking-[-0.04em] text-text sm:text-3xl"
                        >
                          {project.title}
                        </h3>
                        <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
                          {project.oneLiner}
                        </p>
                      </div>
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
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(260px,0.9fr)]">
                    <div className="space-y-5">
                      {project.videos.length > 1 ? (
                        <div className="flex flex-wrap gap-2">
                          {project.videos.map((video) => {
                            const isActive = video.id === activeVideo?.id;

                            return (
                              <button
                                key={video.id}
                                type="button"
                                onClick={() => handleSelectVideo(video.id)}
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
                        <ProjectVideoPlayer
                          key={`${activeVideo.id}-${playbackStartAt}`}
                          chapterLabel={activeChapter?.label}
                          presentation={presentation}
                          projectId={project.id}
                          startAtSeconds={playbackStartAt}
                          video={activeVideo}
                        />
                      ) : (
                        <ProjectPoster
                          className={cn(presentation === "device" && "w-full")}
                          label="Poster preview"
                          presentation={presentation}
                          project={project}
                          sizes="(min-width: 1024px) 36vw, 100vw"
                        />
                      )}

                      {project.gallery.length > 0 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {project.gallery.map((asset) => (
                            <div
                              key={asset.url}
                              className="overflow-hidden rounded-[1.35rem] border border-border/70 bg-surface-2/65"
                            >
                              <div className="relative aspect-[4/3]">
                                <Image
                                  src={asset.url}
                                  alt={asset.alt}
                                  fill
                                  sizes="(min-width: 640px) 18vw, 100vw"
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.28em] text-muted">Overview</p>
                          <p className="mt-3 text-sm leading-7 text-muted">{project.summary}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {project.highlights.map((highlight) => (
                            <div
                              key={highlight}
                              className="rounded-[1.2rem] border border-border/70 bg-surface-2/80 px-4 py-3 text-sm leading-6 text-muted"
                            >
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/75 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted">Project notes</p>
                        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3 xl:grid-cols-1">
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

                      <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/75 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted">Tags</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {project.chapters.length > 0 ? (
                        <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/75 p-4">
                          <ProjectChapters
                            activeChapterId={activeChapterId}
                            chapters={project.chapters}
                            onSelect={handleSelectChapter}
                          />
                        </div>
                      ) : null}

                      <ProjectLinkList links={project.links} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
