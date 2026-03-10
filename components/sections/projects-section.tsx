import { ProjectsSectionClient } from "@/components/projects/projects-section-client";
import { projects } from "@/data/site";

export function ProjectsSection() {
  return (
    <section id="projects" className="section-anchor section-surface section-grid gap-y-6 px-4 py-4 sm:gap-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <ProjectsSectionClient projects={projects} />
    </section>
  );
}
