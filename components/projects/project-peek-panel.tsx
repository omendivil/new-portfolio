"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ProjectChapters } from "@/components/projects/project-chapters";
import { ProjectLinkList } from "@/components/projects/project-link-list";
import { getProjectPresentation, ProjectPoster } from "@/components/projects/project-poster";
import { ProjectVideoPlayer } from "@/components/projects/project-video-player";
import type { Project, ProjectChapter } from "@/data/types";
import { trackChapterClick } from "@/lib/analytics";
import { motionEase, overlayMotion, panelMotion, useMotionPreference } from "@/lib/motion";
import { useModalBehavior } from "@/lib/use-modal-behavior";
import { cn } from "@/lib/utils";

function findFirstChapter(project: Project | null, videoId?: string | null) {
  if (!project) {
    return undefined;
  }

  if (videoId) {
    const chapterForVideo = project.chapters.find((chapter) => chapter.videoId === videoId);

    if (chapterForVideo) {
      return chapterForVideo;
    }
  }

  return project.chapters[0];
}

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
  const panelRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const initialVideo = project?.videos[0] ?? null;
  const initialChapter = findFirstChapter(project, initialVideo?.id);
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

  useModalBehavior({
    containerRef: panelRef,
    isOpen,
  });

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
      findFirstChapter(project, activeVideo?.id)
    );
  }, [activeVideo?.id, project, selectedChapterId]);

  const activeChapterIndex = useMemo(() => {
    if (!project || !activeChapter) {
      return -1;
    }

    return project.chapters.findIndex((chapter) => chapter.id === activeChapter.id);
  }, [activeChapter, project]);

  const presentation = project ? getProjectPresentation(project) : "canvas";

  function handleSelectVideo(videoId: string) {
    if (!project) {
      return;
    }

    const matchingChapter = findFirstChapter(project, videoId);

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
          <motion.div
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/65 backdrop-blur-[6px]"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayMotion(reduceMotion)}
          />

          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${project.id}-title`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelMotion(reduceMotion)}
            tabIndex={-1}
            className="fixed inset-0 z-50 flex justify-end p-2 sm:p-4"
          >
            <div className="pointer-events-auto ml-auto flex h-full w-full max-w-[46rem] flex-col">
              <div className="surface-card flex h-full flex-col overflow-hidden rounded-[1.9rem] sm:rounded-[2.1rem]">
                <div className="relative overflow-hidden border-b border-border/70 bg-surface/92 px-4 py-4 backdrop-blur sm:px-6 sm:py-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,111,102,0.12),transparent_36%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(138,201,189,0.14),transparent_36%)]" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                          {project.category}
                        </span>
                        <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 font-mono text-[0.64rem] uppercase tracking-[0.2em] text-muted">
                          {project.year}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/72 px-3 py-1 text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                          <Sparkles className="h-3.5 w-3.5" />
                          Case study
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                          {project.demo.eyebrow}
                        </p>
                        <h3
                          id={`${project.id}-title`}
                          className="max-w-3xl text-balance text-2xl font-semibold tracking-[-0.04em] text-text sm:text-3xl"
                        >
                          {project.title}
                        </h3>
                        <p className="max-w-3xl text-sm leading-7 text-muted">{project.oneLiner}</p>
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
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
                    <div className="space-y-5">
                      <div className="rounded-[1.6rem] border border-border/70 bg-surface-2/52 p-4 sm:p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                              Demo focus
                            </p>
                            <p className="mt-2 text-lg font-semibold tracking-[-0.03em] text-text">
                              {project.demo.title}
                            </p>
                          </div>
                          <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs text-muted">
                            {project.videos.length > 0 ? "Video on demand" : "Poster-only preview"}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-muted">{project.demo.summary}</p>
                      </div>

                      {project.videos.length > 1 ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {project.videos.map((video, index) => {
                            const isActive = video.id === activeVideo?.id;
                            const sceneChapter = findFirstChapter(project, video.id);

                            return (
                              <motion.button
                                key={video.id}
                                type="button"
                                onClick={() => handleSelectVideo(video.id)}
                                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                                transition={{
                                  duration: 0.28,
                                  ease: motionEase,
                                  delay: reduceMotion ? 0 : index * 0.04,
                                }}
                                className={cn(
                                  "rounded-[1.35rem] border px-4 py-4 text-left transition-colors",
                                  isActive
                                    ? "border-accent/35 bg-accent-soft/75"
                                    : "border-border/70 bg-surface/74 hover:border-accent/24 hover:bg-accent-soft/42",
                                )}
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <span className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                                    Scene {String(index + 1).padStart(2, "0")}
                                  </span>
                                  <ArrowUpRight className="h-4 w-4 text-muted" />
                                </div>
                                <p className="mt-3 text-sm font-medium text-text">{video.label}</p>
                                <p className="mt-2 text-sm leading-6 text-muted">
                                  {sceneChapter?.description ?? video.description}
                                </p>
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : null}

                      {activeVideo ? (
                        <ProjectVideoPlayer
                          key={`${activeVideo.id}-${playbackStartAt}`}
                          chapterCount={project.chapters.length}
                          chapterLabel={activeChapter?.label}
                          chapterNumber={activeChapterIndex >= 0 ? activeChapterIndex + 1 : undefined}
                          contextLabel={project.demo.eyebrow}
                          presentation={presentation}
                          projectId={project.id}
                          startAtSeconds={playbackStartAt}
                          video={activeVideo}
                        />
                      ) : (
                        <ProjectPoster
                          className={cn(presentation === "device" && "mx-auto w-full max-w-[21rem]")}
                          label={project.demo.eyebrow}
                          presentation={presentation}
                          project={project}
                          sizes="(min-width: 1024px) 36vw, 100vw"
                        />
                      )}

                      <div className="grid gap-3 sm:grid-cols-3">
                        {project.story.map((storyBeat) => (
                          <div
                            key={storyBeat.id}
                            className="rounded-[1.3rem] border border-border/70 bg-surface/72 p-4"
                          >
                            <p className="text-[0.68rem] uppercase tracking-[0.24em] text-muted">
                              {storyBeat.eyebrow}
                            </p>
                            <p className="mt-2 text-sm font-medium leading-6 text-text">
                              {storyBeat.title}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-muted">
                              {storyBeat.description}
                            </p>
                          </div>
                        ))}
                      </div>

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
                    </div>

                    <div className="space-y-5">
                      <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/75 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted">Highlights</p>
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-text">
                          {project.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="rounded-[1rem] border border-border/70 bg-background/70 px-4 py-3"
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
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

                      <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/75 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted">Guided walkthrough</p>
                        <p className="mt-3 text-sm leading-7 text-muted">
                          Each scene is meant to explain the product, not just display media. The active chapter keeps the demo aligned with the part of the interface worth discussing.
                        </p>
                        {project.chapters.length > 0 ? (
                          <div className="mt-4">
                            <ProjectChapters
                              activeChapterId={activeChapter?.id}
                              chapters={project.chapters}
                              onSelect={handleSelectChapter}
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/75 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted">Technical themes</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.technicalThemes.map((theme) => (
                            <span
                              key={theme}
                              className="rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs text-muted"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      </div>

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
                        <p className="mt-4 text-sm leading-7 text-muted">{project.summary}</p>
                      </div>

                      <div className="rounded-[1.45rem] border border-border/70 bg-surface-2/75 p-4">
                        <p className="text-xs uppercase tracking-[0.28em] text-muted">Links</p>
                        <div className="mt-4">
                          <ProjectLinkList links={project.links} />
                        </div>
                      </div>
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
