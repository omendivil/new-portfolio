"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { CircleDot, Play } from "lucide-react";
import { useEffect, useRef } from "react";

import type { Project } from "@/data/types";
import { trackVideoPlay } from "@/lib/analytics";
import { motionEase, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { ProjectShowcaseFrame } from "./project-showcase-frame";

type ProjectLivePreviewProps = {
  className?: string;
  project: Project;
};

export function ProjectLivePreview({ className, project }: ProjectLivePreviewProps) {
  const { reduceMotion } = useMotionPreference();
  const previewRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackedPlaybackRef = useRef(false);
  const hasVideo = project.videos.length > 0;
  const previewVideo = hasVideo ? project.videos[0] : null;
  const presentation = project.presentation;
  const isInView = useInView(previewRef, {
    amount: 0.45,
    once: false,
    margin: "0px 0px -8% 0px",
  });

  useEffect(() => {
    trackedPlaybackRef.current = false;
  }, [previewVideo?.id]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement || !previewVideo || reduceMotion) {
      videoElement?.pause();
      return;
    }

    const mediaElement = videoElement;

    if (!isInView) {
      mediaElement.pause();
      return;
    }

    let cancelled = false;

    async function playPreview() {
      if (cancelled) {
        return;
      }

      try {
        await mediaElement.play();
      } catch {
        mediaElement.pause();
      }
    }

    void playPreview();

    return () => {
      cancelled = true;
    };
  }, [isInView, previewVideo, reduceMotion]);

  return (
    <motion.div
      ref={previewRef}
      initial={reduceMotion ? false : { opacity: 0, y: 16, filter: "brightness(0.92)" }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "brightness(1)" }}
      transition={{ duration: 0.42, ease: motionEase }}
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-border/70 bg-[#181512] p-3 shadow-[0_32px_120px_-54px_rgba(17,16,13,0.54)] sm:p-4",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_24%),radial-gradient(circle_at_top_right,rgba(143,179,171,0.2),transparent_34%),radial-gradient(circle_at_bottom_center,rgba(255,129,41,0.24),transparent_28%)]" />

      <div className="relative flex min-h-[22rem] items-center justify-center overflow-hidden rounded-[1.7rem] border border-white/8 bg-[linear-gradient(135deg,rgba(210,217,214,0.9),rgba(203,188,163,0.82))] px-4 py-5 sm:min-h-[30rem] sm:px-6 sm:py-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-[20%] w-[28%] bg-white/14 blur-3xl" />

        <div className="pointer-events-none absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2 sm:left-5 sm:top-5">
          <span className="rounded-full border border-white/12 bg-black/32 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/74 backdrop-blur">
            {project.demo.eyebrow}
          </span>
          <span className="rounded-full border border-white/12 bg-black/32 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/74 backdrop-blur">
            {hasVideo && !reduceMotion ? "Motion on view" : "Still fallback"}
          </span>
        </div>

        <div
          className={cn(
            "relative z-10 w-full",
            presentation === "device" ? "max-w-[22rem]" : "max-w-[42rem]",
          )}
        >
          <ProjectShowcaseFrame
            className={cn("mx-auto", presentation === "canvas" && "w-full")}
            label={hasVideo && !reduceMotion ? "Live preview" : "Poster preview"}
            variant={presentation}
          >
            {previewVideo && !reduceMotion ? (
              <video
                ref={videoRef}
                autoPlay
                disablePictureInPicture
                disableRemotePlayback
                loop
                muted
                playsInline
                poster={previewVideo.poster}
                preload="metadata"
                className="h-full w-full bg-black object-cover"
                onPlay={() => {
                  if (trackedPlaybackRef.current) {
                    return;
                  }

                  trackedPlaybackRef.current = true;
                  trackVideoPlay(project.id, previewVideo.id, { surface: "featured_stage" });
                }}
              >
                <source src={previewVideo.url} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={project.poster.url}
                alt={project.poster.alt}
                fill
                sizes="(min-width: 1280px) 44vw, (min-width: 768px) 56vw, 100vw"
                className="object-cover"
              />
            )}

            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/28 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/46 via-black/10 to-transparent" />
          </ProjectShowcaseFrame>
        </div>

        <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 rounded-[1.15rem] border border-white/10 bg-black/34 px-4 py-3 text-white/82 backdrop-blur sm:bottom-5 sm:left-5 sm:right-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{project.title}</p>
              <p className="mt-1 truncate text-xs uppercase tracking-[0.2em] text-white/58">
                {project.demo.title}
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-white/72">
              {hasVideo && !reduceMotion ? (
                <>
                  <CircleDot className="h-3.5 w-3.5" />
                  Live
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Poster
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
