import type {
  Project,
  ProjectCategory,
  ProjectFilterOptions,
  ProjectGroup,
} from "@/data/types";

export function getFeaturedProjects(projectList: Project[]): Project[] {
  return projectList.filter((project) => project.featured);
}

export function getProjectCategories(projectList: Project[]): ProjectCategory[] {
  return Array.from(new Set(projectList.map((project) => project.category)));
}

export function filterProjects(
  projectList: Project[],
  searchOrOptions: string | ProjectFilterOptions = "",
  categoryArg: ProjectCategory | "All" = "All",
): Project[] {
  const options: ProjectFilterOptions =
    typeof searchOrOptions === "string"
      ? { category: categoryArg, query: searchOrOptions }
      : searchOrOptions;

  const query = options.query?.trim().toLowerCase() ?? "";
  const category = options.category ?? "All";

  return projectList.filter((project) => {
    const matchesCategory = category === "All" || project.category === category;

    if (!matchesCategory) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      project.title,
      project.oneLiner,
      project.summary,
      project.category,
      project.role,
      project.demo.title,
      project.demo.summary,
      ...project.technicalThemes,
      ...project.story.map((storyBeat) => `${storyBeat.title} ${storyBeat.description}`),
      ...project.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function groupProjectsByCategory(projectList: Project[]): ProjectGroup[] {
  const groups = new Map<ProjectCategory, Project[]>();

  for (const project of projectList) {
    const existing = groups.get(project.category);

    if (existing) {
      existing.push(project);
      continue;
    }

    groups.set(project.category, [project]);
  }

  return Array.from(groups.entries()).map(([category, groupedProjects]) => ({
    category,
    projects: groupedProjects,
  }));
}
