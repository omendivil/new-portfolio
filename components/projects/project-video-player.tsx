"use client";

import { forwardRef, useEffect, useRef } from "react";
import { CircleDot } from "lucide-react";
import { useReducedMotion } from "framer-motion";

import type { ProjectVideo } from "@/data/types";
import { trackVideoPlay } from "@/lib/analytics";

import { ProjectShowcaseFrame, type ProjectShowcaseVariant } from "./project-showcase-frame";

type ProjectVideoPlayerProps = {
  chapterLabel?: string;
  presentation?: ProjectShowcaseVariant;
  projectId: string;
  startAtSeconds?: number;
  video: ProjectVideo;
};

export const ProjectVideoPlayer = forwardRef<HTMLVideoElement, ProjectVideoPlayerProps>(
  function ProjectVideoPlayer(
    {
      chapterLabel,
      presentation = "device",
      projectId,
      startAtSeconds = 0,
      video,
    },
    ref,
  ) {
    const reduceMotion = Boolean(useReducedMotion());
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const trackedPlaybackRef = useRef(false);

    function setRefs(node: HTMLVideoElement | null) {
      localVideoRef.current = node;

      if (typeof ref === "function") {
        ref(node);
        return;
      }

      if (ref) {
        ref.current = node;
      }
    }

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

    return (
      <div className="surface-card overflow-hidden rounded-[1.6rem] p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border/70 bg-background/72 px-3 py-1 font-mono text-[0.64rem] uppercase tracking-[0.24em] text-muted">
                {reduceMotion ? "Preview paused" : "Live preview"}
              </span>
              {chapterLabel ? (
                <span className="rounded-full border border-border/70 bg-surface-2/72 px-3 py-1 text-xs text-muted">
                  {chapterLabel}
                </span>
              ) : null}
            </div>
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em] text-text">{video.label}</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted">{video.description}</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/72 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-muted">
            <CircleDot className="h-3.5 w-3.5" />
            Lazy loaded
          </span>
        </div>

        <ProjectShowcaseFrame
          className={presentation === "device" ? "w-full" : undefined}
          label={reduceMotion ? "Motion paused" : "Embedded demo"}
          variant={presentation}
        >
          <video
            ref={setRefs}
            aria-label={`${video.title} project preview`}
            autoPlay={!reduceMotion}
            disablePictureInPicture
            loop={!reduceMotion}
            muted
            playsInline
            poster={video.posterUrl}
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
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 via-black/12 to-transparent" />
        </ProjectShowcaseFrame>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
          <p>Video loads only after the project panel opens.</p>
          <p>{reduceMotion ? "Autoplay disabled for reduced motion." : "Muted loop to mimic a live app preview."}</p>
        </div>
      </div>
    );
  },
);

ProjectVideoPlayer.displayName = "ProjectVideoPlayer";
