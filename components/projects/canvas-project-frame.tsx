"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import type { Project } from "@/data/types";
import { trackVideoPlay } from "@/lib/analytics";
import { useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { ProjectShowcaseFrame } from "./project-showcase-frame";

type CanvasProjectFrameProps = {
  isActive: boolean;
  project: Project;
  x: number;
  y: number;
};

const DEVICE_FRAME_WIDTH = 240;
const CANVAS_FRAME_WIDTH = 480;

export function getFrameDimensions(presentation: "canvas" | "device") {
  if (presentation === "device") {
    return { width: DEVICE_FRAME_WIDTH, height: Math.round(DEVICE_FRAME_WIDTH * (19.5 / 9)) };
  }
  return { width: CANVAS_FRAME_WIDTH, height: Math.round(CANVAS_FRAME_WIDTH * (10 / 16)) };
}

export function CanvasProjectFrame({
  isActive,
  project,
  x,
  y,
}: CanvasProjectFrameProps) {
  const { reduceMotion } = useMotionPreference();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const trackedPlaybackRef = useRef(false);
  const hasVideo = project.videos.length > 0;
  const previewVideo = hasVideo ? project.videos[0] : null;
  const presentation = project.presentation;
  const { width: frameWidth } = getFrameDimensions(presentation);

  useEffect(() => {
    trackedPlaybackRef.current = false;
  }, [previewVideo?.id]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !previewVideo || reduceMotion) {
      videoElement?.pause();
      return;
    }

    if (!isActive) {
      videoElement.pause();
      return;
    }

    let cancelled = false;
    async function playPreview() {
      if (cancelled) return;
      try {
        await videoElement!.play();
      } catch {
        videoElement!.pause();
      }
    }
    void playPreview();

    return () => {
      cancelled = true;
    };
  }, [isActive, previewVideo, reduceMotion]);

  return (
    <div
      className={cn(
        "absolute transition-[opacity,filter] duration-300",
        isActive ? "opacity-100" : "opacity-70 hover:opacity-90",
      )}
      style={{
        left: x,
        top: y,
        width: frameWidth,
      }}
    >
      {isActive && (
        <div className="pointer-events-none absolute -inset-3 rounded-3xl border border-text/10 bg-text/[0.02]" />
      )}

      <div
        style={{ width: presentation === "device" ? "14rem" : "100%" }}
        className="relative mx-auto"
      >
        <ProjectShowcaseFrame variant={presentation}>
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
                if (trackedPlaybackRef.current) return;
                trackedPlaybackRef.current = true;
                trackVideoPlay(project.id, previewVideo.id, { surface: "canvas" });
              }}
            >
              <source src={previewVideo.url} type="video/mp4" />
            </video>
          ) : (
            <Image
              src={project.poster.url}
              alt={project.poster.alt}
              fill
              sizes="300px"
              className="object-cover"
            />
          )}
        </ProjectShowcaseFrame>
      </div>

      <div className="relative mt-3 space-y-1.5 px-1">
        <h3 className="text-sm font-semibold text-text">{project.title}</h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted">{project.oneLiner}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/60 bg-surface/50 px-2 py-0.5 text-[0.6rem] font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
