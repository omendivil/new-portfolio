"use client";

import type { Project } from "@/data/types";
import { useMotionPreference } from "@/lib/motion";

import { ProjectShowcaseFrame } from "./project-showcase-frame";

type ProjectShowcaseDeviceProps = {
  project: Project;
};

export function ProjectShowcaseDevice({ project }: ProjectShowcaseDeviceProps) {
  const { reduceMotion } = useMotionPreference();
  const video = project.videos[0];
  const poster = project.poster;

  return (
    <div className="flex items-center justify-center bg-[#08090a] py-10 sm:py-14">
      <ProjectShowcaseFrame variant="device">
        {video ? (
          <video
            autoPlay={!reduceMotion}
            className="h-full w-full object-cover"
            loop
            muted
            playsInline
            poster={video.poster}
            src={video.url}
          />
        ) : (
          <img
            alt={poster.alt}
            className="h-full w-full object-cover"
            src={poster.url}
          />
        )}
      </ProjectShowcaseFrame>
    </div>
  );
}
