"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

import type { Project } from "@/data/types";
import { trackVideoPlay } from "@/lib/analytics";
import { motionEase, useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { ProjectPreviewStage } from "./project-preview-stage";
import { ProjectShowcaseFrame } from "./project-showcase-frame";

type ProjectLivePreviewProps = {
  className?: string;
  project: Project;
};

function hudTransition(delay: number) {
  return { delay, duration: 0.5, ease: motionEase };
}

const hudSlideIn = { opacity: 0, x: -10 };
const hudSlideAnimate = { opacity: 1, x: 0 };
const hudInitial = { opacity: 0, y: 6 };
const hudAnimate = { opacity: 1, y: 0 };
const hudExit = { opacity: 0, transition: { duration: 0.12, ease: motionEase } };

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

  const highlights = project.highlights.slice(0, 2);
  const themes = project.technicalThemes.slice(0, 3);

  return (
    <motion.div
      ref={previewRef}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: motionEase }}
      className={cn(
        "preview-outer-shell relative overflow-hidden rounded-[2rem] p-3 sm:p-4",
        className,
      )}
    >
      {/* Static radial gradients on the Outer Shell */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_24%),radial-gradient(circle_at_top_right,rgba(143,179,171,0.14),transparent_34%)]" />

      {/* Spinning gradient on the Outer Shell — Inner Stage covers the center */}
      <div className="preview-border-glow pointer-events-none absolute left-1/2 top-1/2" />

      {/* Inner Stage */}
      <ProjectPreviewStage className="relative">

        {/* HUD overlays */}
        <AnimatePresence mode="wait">
          <div key={project.id} className="contents">
            {/* Top left — status line */}
            <motion.div
              initial={reduceMotion ? false : hudInitial}
              animate={hudAnimate}
              exit={reduceMotion ? undefined : hudExit}
              transition={reduceMotion ? { duration: 0 } : hudTransition(0.3)}
              className="absolute left-4 top-4 z-20 sm:left-5 sm:top-5"
            >
              <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.22em] text-white/70 sm:text-[0.68rem]">
                {project.status} · {project.year} · {project.category}
              </p>
            </motion.div>

            {/* Top right — tech themes stacked vertically */}
            <div className="absolute right-4 top-4 z-20 hidden sm:right-5 sm:top-5 sm:block">
              {themes.map((theme, i) => (
                <motion.p
                  key={theme}
                  initial={reduceMotion ? false : hudInitial}
                  animate={hudAnimate}
                  exit={reduceMotion ? undefined : hudExit}
                  transition={reduceMotion ? { duration: 0 } : hudTransition(0.6 + i * 0.3)}
                  className="mt-1.5 text-right font-mono text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/60 first:mt-0 sm:text-[0.68rem]"
                >
                  {theme}
                </motion.p>
              ))}
            </div>

            {/* Left side — two highlights, centered to phone (desktop only) */}
            <div className="absolute bottom-0 left-5 top-0 z-20 hidden w-[14.5rem] items-center lg:flex">
              <div className="space-y-4">
                {highlights.map((hl, i) => (
                  <motion.p
                    key={hl}
                    initial={reduceMotion ? false : hudSlideIn}
                    animate={hudSlideAnimate}
                    exit={reduceMotion ? undefined : hudExit}
                    transition={reduceMotion ? { duration: 0 } : hudTransition(1.2 + i * 1.0)}
                    className="text-[0.88rem] font-semibold leading-[1.6] text-white/80 sm:text-[0.95rem]"
                  >
                    {hl}
                  </motion.p>
                ))}
              </div>
            </div>

            {/* Mobile — single highlight */}
            <motion.div
              initial={reduceMotion ? false : hudSlideIn}
              animate={hudSlideAnimate}
              exit={reduceMotion ? undefined : hudExit}
              transition={reduceMotion ? { duration: 0 } : hudTransition(1.0)}
              className="absolute bottom-4 left-4 right-4 z-20 sm:bottom-5 sm:left-5 sm:right-5 lg:hidden"
            >
              <p className="text-[0.82rem] font-semibold leading-[1.5] text-white/80 sm:text-[0.95rem]">
                {highlights[0]}
              </p>
            </motion.div>
          </div>
        </AnimatePresence>

        {/* Stable-height stage — content sizes itself, container stays fixed */}
        <div className="relative z-10 h-[26rem] sm:h-[34rem]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "w-full",
                presentation === "device" ? "max-w-[11rem] sm:max-w-[16rem]" : "max-w-[30rem] sm:max-w-[52rem]",
              )}
            >
              <ProjectShowcaseFrame
                className="mx-auto"
                variant={presentation}
            >
              {previewVideo && !reduceMotion ? (
                <video
                  key={previewVideo.id}
                  ref={videoRef}
                  autoPlay
                  disablePictureInPicture
                  disableRemotePlayback
                  loop
                  muted
                  playsInline
                  poster={previewVideo.poster}
                  preload="none"
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
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 56vw, 100vw"
                  className="object-cover"
                />
              )}

              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/28 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/46 via-black/10 to-transparent" />
            </ProjectShowcaseFrame>
          </div>
          </div>
        </div>
        </ProjectPreviewStage>
    </motion.div>
  );
}
