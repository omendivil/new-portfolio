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
  src: string;
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
  mimeType: "video/mp4";
  poster: string;
  posterUrl: string;
  src: string;
  title: string;
  url: string;
};

export type ProjectMedia = ProjectVideo;

export type ProjectChapter = {
  atSeconds: number;
  description: string;
  id: string;
  label: string;
  mediaId: string;
  timestampSeconds: number;
  title: string;
  videoId: string;
};

export type Project = {
  category: ProjectCategory;
  chapters: ProjectChapter[];
  featured: boolean;
  gallery: MediaAsset[];
  highlights: string[];
  id: string;
  links: ProjectLink[];
  media: ProjectVideo[];
  oneLiner: string;
  poster: MediaAsset;
  role: string;
  slug: string;
  status: string;
  summary: string;
  tags: string[];
  title: string;
  videos: ProjectVideo[];
  year: string;
};

export type Skill = {
  category: SkillCategory;
  icon?: MediaAsset;
  id: string;
  label: string;
  level: string;
  name: string;
  note: string;
  summary: string;
};

export type Experience = {
  bullets: string[];
  highlights: string[];
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
  copyLabel: string;
  description: string;
  emailEnvVar: "NEXT_PUBLIC_CONTACT_EMAIL";
  emailIconUrl: string;
  heading: string;
  icons: {
    email: MediaAsset;
    linkedIn: MediaAsset;
    phone: MediaAsset;
  };
  linkedInIconUrl: string;
  location: string;
  phoneEnvVar: "NEXT_PUBLIC_CONTACT_PHONE";
  phoneIconUrl: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  showPhone: boolean;
  title: string;
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
    linkedIn: MediaAsset;
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
    alternateHeadshot: MediaAsset;
    optionalPersonalImage: MediaAsset;
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
  nav: NavSection[];
  navSections: NavSection[];
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
