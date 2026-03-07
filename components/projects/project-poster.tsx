import Image from "next/image";

import type { Project } from "@/data/types";

import {
  ProjectShowcaseFrame,
  type ProjectShowcaseVariant,
} from "./project-showcase-frame";

type ProjectPosterProps = {
  className?: string;
  label?: string;
  mediaClassName?: string;
  presentation?: ProjectShowcaseVariant;
  priority?: boolean;
  project: Project;
  sizes?: string;
};

export function getProjectPresentation(project: Pick<Project, "category" | "title">): ProjectShowcaseVariant {
  if (project.category === "iOS" || project.category === "AI Product" || project.title.includes("App")) {
    return "device";
  }

  return "canvas";
}

export function ProjectPoster({
  className,
  label,
  mediaClassName,
  presentation,
  priority = false,
  project,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
}: ProjectPosterProps) {
  const showcaseVariant = presentation ?? getProjectPresentation(project);

  return (
    <ProjectShowcaseFrame
      className={className}
      label={label ?? project.category}
      screenClassName={mediaClassName}
      variant={showcaseVariant}
    >
      <div className="absolute inset-0">
        <Image
          src={project.poster.url}
          alt={project.poster.alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/10" />
      </div>
    </ProjectShowcaseFrame>
  );
}
