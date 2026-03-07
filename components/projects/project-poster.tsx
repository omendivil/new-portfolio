import Image from "next/image";

import type { Project } from "@/data/types";
import { cn } from "@/lib/utils";

type ProjectPosterProps = {
  className?: string;
  priority?: boolean;
  project: Project;
  sizes?: string;
};

export function ProjectPoster({
  className,
  priority = false,
  project,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
}: ProjectPosterProps) {
  return (
    <div className={cn("relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-surface-2", className)}>
      <Image
        src={project.poster.url}
        alt={project.poster.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
