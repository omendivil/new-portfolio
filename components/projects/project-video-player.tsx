"use client";

import { useEffect, useRef } from "react";
import { CircleDot } from "lucide-react";
import { useReducedMotion } from "framer-motion";

import type { ProjectPresentation, ProjectVideo } from "@/data/types";
import { trackVideoPlay } from "@/lib/analytics";

import { ProjectShowcaseFrame } from "./project-showcase-frame";

type ProjectVideoPlayerProps = {
  chapterCount?: number;
  chapterLabel?: string;
  chapterNumber?: number;
  contextLabel?: string;
  presentation?: ProjectPresentation;
  projectId: string;
  startAtSeconds?: number;
  video: ProjectVideo;
};

export function ProjectVideoPlayer({
  chapterCount,
  chapterLabel,
  chapterNumber,
  contextLabel,
  presentation = "device",
  projectId,
  startAtSeconds = 0,
  video,
}: ProjectVideoPlayerProps) {
    const reduceMotion = Boolean(useReducedMotion());
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const trackedPlaybackRef = useRef(false);

    useEffect(() => {
      trackedPlaybackRef.current = false;
    }, [video.id]);

    useEffect(() => {
      const element = localVideoRef.current;

      if (!element) {
        return;
      }

      const mediaElement = element;

      let cancelled = false;

      async function applyCue() {
        if (cancelled) {
          return;
        }

        const nextTime = Number.isFinite(startAtSeconds) ? Math.max(0, startAtSeconds) : 0;

        try {
          mediaElement.currentTime = nextTime;
        } catch {
          mediaElement.currentTime = 0;
        }

        if (reduceMotion) {
          mediaElement.pause();
          return;
        }

        try {
          await mediaElement.play();
        } catch {
          mediaElement.pause();
        }
      }

      if (mediaElement.readyState >= 1) {
        void applyCue();

        return () => {
          cancelled = true;
        };
      }

      const handleLoadedMetadata = () => {
        void applyCue();
      };

      mediaElement.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        cancelled = true;
        mediaElement.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }, [reduceMotion, startAtSeconds, video.id]);

    const sceneLabel =
      chapterNumber && chapterCount
        ? `Scene ${String(chapterNumber).padStart(2, "0")} of ${String(chapterCount).padStart(2, "0")}`
        : chapterLabel
          ? "Guided scene"
          : "Embedded preview";

    return (
      <div className="relative overflow-hidden rounded-[1.7rem] border border-border/70 bg-surface/78 p-4 sm:p-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,111,102,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.46),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(138,201,189,0.14),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_26%)]" />

        <div className="relative">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-muted">
                  {contextLabel ?? "Guided preview"}
                </span>
                <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 text-xs text-muted">
                  {sceneLabel}
                </span>
                {chapterLabel ? (
                  <span className="rounded-full border border-border/70 bg-surface-2/74 px-3 py-1 text-xs text-muted">
                    {chapterLabel}
                  </span>
                ) : null}
              </div>

              <div>
                <p className="text-lg font-semibold tracking-[-0.03em] text-text">{video.label}</p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{video.description}</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/72 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-muted">
              <CircleDot className="h-3.5 w-3.5" />
              On demand
            </span>
          </div>

          <div className="relative mt-5">
            <div className="pointer-events-none absolute inset-x-10 bottom-6 h-24 rounded-full bg-accent/18 blur-3xl dark:bg-accent/16" />

            <ProjectShowcaseFrame
              className={presentation === "device" ? "w-full" : undefined}
              label={reduceMotion ? "Motion paused" : "Live showcase"}
              variant={presentation}
            >
              <video
                ref={localVideoRef}
                aria-label={`${video.label} project preview`}
                autoPlay={!reduceMotion}
                disablePictureInPicture
                disableRemotePlayback
                loop={!reduceMotion}
                muted
                playsInline
                poster={video.poster}
                preload="metadata"
                className="h-full w-full bg-black object-cover"
                onPlay={() => {
                  if (trackedPlaybackRef.current) {
                    return;
                  }

                  trackedPlaybackRef.current = true;
                  trackVideoPlay(projectId, video.id);
                }}
              >
                <source src={video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/42 via-black/12 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/48 via-black/14 to-transparent" />

              <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-3 rounded-full border border-white/10 bg-black/42 px-3 py-2 text-[0.62rem] uppercase tracking-[0.22em] text-white/72 backdrop-blur">
                <span className="truncate">{chapterLabel ?? video.label}</span>
                <span>{reduceMotion ? "Paused" : "Preview"}</span>
              </div>
            </ProjectShowcaseFrame>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
            <p>Media is requested only after the project panel opens.</p>
            <p>
              {reduceMotion
                ? "Autoplay is disabled when reduced motion is enabled."
                : "Muted autoplay keeps the scene closer to a live product preview than a raw player."}
            </p>
          </div>
        </div>
      </div>
    );
}
