import { ProjectsSectionClient } from "@/components/projects/projects-section-client";
import { SectionHeading } from "@/components/sections/section-heading";
import { projects } from "@/data/site";

export function ProjectsSection() {
  return (
    <section id="projects" className="section-anchor section-surface section-grid gap-y-8 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <SectionHeading
        eyebrow="Projects"
        title="An active project stage up front, deeper inspection on demand"
        description="The featured layer now behaves more like a live showcase. Select a project, let the preview start immediately, then open the right-side panel for the full story and guided walkthrough."
      />
      <ProjectsSectionClient projects={projects} />
    </section>
  );
}
