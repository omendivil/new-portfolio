import { ProjectsSectionClient } from "@/components/projects/projects-section-client";
import { projects } from "@/data/site";

export function ProjectsSection() {
  return <ProjectsSectionClient projects={projects} />;
}
