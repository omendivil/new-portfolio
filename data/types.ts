export type NavSectionId =
  | "hero"
  | "projects"
  | "skills"
  | "experience"
  | "writing"
  | "contact";

export type ProjectCategory = "AI Product" | "Frontend" | "iOS";

export type SkillCategory =
  | "Design"
  | "Foundations"
  | "Languages"
  | "Mobile"
  | "Tooling"
  | "Workflow";

export type MediaAsset = {
  alt: string;
  url: string;
};

export type ProjectLink = {
  href: string;
  kind: "demo" | "poster" | "repo" | "video";
  label: string;
};

export type ProjectVideo = {
  description: string;
  id: string;
  label: string;
  poster: string;
  url: string;
};

export type ProjectChapter = {
  atSeconds: number;
  description: string;
  id: string;
  label: string;
  videoId: string;
};

export type ProjectPresentation = "canvas" | "device";

export type ProjectStoryBeat = {
  description: string;
  eyebrow: string;
  id: string;
  title: string;
};

export type ProjectDemoGuide = {
  eyebrow: string;
  summary: string;
  title: string;
};

export type Project = {
  category: ProjectCategory;
  chapters: ProjectChapter[];
  demo: ProjectDemoGuide;
  featured: boolean;
  gallery: MediaAsset[];
  highlights: string[];
  id: string;
  links: ProjectLink[];
  oneLiner: string;
  poster: MediaAsset;
  presentation: ProjectPresentation;
  role: string;
  story: ProjectStoryBeat[];
  status: string;
  summary: string;
  tags: string[];
  technicalThemes: string[];
  title: string;
  videos: ProjectVideo[];
  year: string;
};

export type Skill = {
  category: SkillCategory;
  icon?: MediaAsset;
  id: string;
  level: string;
  name: string;
  summary: string;
};

export type Experience = {
  bullets: string[];
  id: string;
  location: string;
  organization: string;
  period: string;
  role: string;
  summary: string;
};

export type WritingEntry = {
  duration?: string;
  format: "Essay" | "Video";
  href?: string;
  id: string;
  outlet: string;
  published: string;
  status: "Draft" | "Live";
  summary: string;
  title: string;
};

export type ContactConfig = {
  availability: string;
  blurb: string;
  heading: string;
  icons: {
    email: MediaAsset;
    phone: MediaAsset;
  };
  location: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  showPhone: boolean;
};

export type HeroContent = {
  availability: string;
  description: string;
  eyebrow: string;
  intro: string;
  locationLabel: string;
  portrait: MediaAsset;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  summary: string;
  title: string;
};

export type NavSection = {
  id: NavSectionId;
  label: string;
};

export type SiteMediaCatalog = {
  baseHost: string;
  contactIcons: {
    email: MediaAsset;
    phone: MediaAsset;
  };
  logos: {
    c: MediaAsset;
    figma: MediaAsset;
    github: MediaAsset;
    python: MediaAsset;
    swift: MediaAsset;
    swiftUi: MediaAsset;
    xcode: MediaAsset;
  };
  people: {
    primaryHeadshot: MediaAsset;
  };
  projectAssets: {
    game2048: {
      poster: MediaAsset;
      videos: ProjectVideo[];
    };
    animeAiApp: {
      extras: MediaAsset[];
      poster: MediaAsset;
      videos: ProjectVideo[];
    };
    animeBrowser: {
      poster: MediaAsset;
    };
    appetizerApp: {
      poster: MediaAsset;
      videos: ProjectVideo[];
    };
    frameworksApp: {
      poster: MediaAsset;
      videos: ProjectVideo[];
    };
  };
};

export type SiteContent = {
  contact: ContactConfig;
  experience: Experience[];
  hero: HeroContent;
  media: SiteMediaCatalog;
  projects: Project[];
  skills: Skill[];
  writing: WritingEntry[];
};

export type ProjectFilterOptions = {
  category?: ProjectCategory | "All";
  query?: string;
};

export type ProjectGroup = {
  category: ProjectCategory;
  projects: Project[];
};
