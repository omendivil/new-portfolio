"use client";

import { forwardRef } from "react";

import type { ProjectVideo } from "@/data/types";
import { trackVideoPlay } from "@/lib/analytics";

type ProjectVideoPlayerProps = {
  projectId: string;
  video: ProjectVideo;
};

export const ProjectVideoPlayer = forwardRef<HTMLVideoElement, ProjectVideoPlayerProps>(
  function ProjectVideoPlayer({ projectId, video }, ref) {
    return (
      <div className="surface-card rounded-[1.4rem] p-3">
        <div className="mb-3 flex items-center justify-between gap-3 px-1">
          <p className="text-sm font-medium text-text">{video.label}</p>
          <p className="text-xs uppercase tracking-[0.28em] text-muted">Lazy loaded</p>
        </div>
        <video
          ref={ref}
          controls
          playsInline
          preload="none"
          poster={video.posterUrl}
          className="aspect-video w-full rounded-[1rem] bg-black object-cover"
          onPlay={() => trackVideoPlay(projectId, video.id)}
        >
          <source src={video.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  },
);
