import {
  type ContactConfig,
  type Experience,
  type HeroContent,
  type MediaAsset,
  type NavSection,
  type Project,
  type ProjectCategory,
  type ProjectChapter,
  type ProjectFilterOptions,
  type ProjectGroup,
  type ProjectLink,
  type ProjectVideo,
  type SiteContent,
  type SiteMediaCatalog,
  type Skill,
  type WritingEntry,
} from "@/data/types";

const baseHost = "https://pub-8845c4797eee47adbbeb7077d3509851.r2.dev";

function createMediaAsset(path: string, alt: string): MediaAsset {
  const url = `${baseHost}/${path}`;

  return {
    alt,
    src: url,
    url,
  };
}

function createVideo(
  id: string,
  label: string,
  path: string,
  poster: MediaAsset,
  description: string,
): ProjectVideo {
  const url = `${baseHost}/${path}`;

  return {
    description,
    id,
    label,
    mimeType: "video/mp4",
    poster: poster.url,
    posterUrl: poster.url,
    src: url,
    title: label,
    url,
  };
}

function createChapter(
  id: string,
  label: string,
  description: string,
  videoId: string,
  atSeconds: number,
): ProjectChapter {
  return {
    atSeconds,
    description,
    id,
    label,
    mediaId: videoId,
    timestampSeconds: atSeconds,
    title: label,
    videoId,
  };
}

function createProjectLink(label: string, href: string, kind: ProjectLink["kind"]): ProjectLink {
  return {
    href,
    kind,
    label,
  };
}

const primaryHeadshot = createMediaAsset("omar.jpg", "Portrait of Omar Mendivil");
const alternateHeadshot = createMediaAsset("omar2.jpeg", "Alternate portrait of Omar Mendivil");
const optionalPersonalImage = createMediaAsset("puppy.jpg", "Optional personal image");

const logoC = createMediaAsset("c.svg", "C logo");
const logoPython = createMediaAsset("python.png", "Python logo");
const logoSwift = createMediaAsset("swift.svg", "Swift logo");
const logoSwiftUi = createMediaAsset("swiftui.svg", "SwiftUI logo");
const logoXcode = createMediaAsset("xcode.png", "Xcode logo");
const logoFigma = createMediaAsset("figma.png", "Figma logo");
const logoGithub = createMediaAsset("github.png", "GitHub logo");

const iconEmail = createMediaAsset("email.png", "Email icon");
const iconLinkedIn = createMediaAsset("linked.png", "LinkedIn icon");
const iconPhone = createMediaAsset("phone.png", "Phone icon");

const poster2048 = createMediaAsset("2048-homepage.png", "2048 Game poster preview");
const posterAnimeBrowser = createMediaAsset("anime-browser.png", "Anime Browser poster preview");
const posterAnimeAi = createMediaAsset("animeai.png", "Anime AI App poster preview");
const extraAnimeAiOne = createMediaAsset("aiapp.png", "Anime AI App additional screen one");
const extraAnimeAiTwo = createMediaAsset("animeapp.png", "Anime AI App additional screen two");
const posterAppetizer = createMediaAsset("croppedappetizer.png", "Appetizer App poster preview");
const posterFrameworks = createMediaAsset("croppedFrameworks.png", "Frameworks App poster preview");

const video2048Gameplay = createVideo(
  "2048-demo",
  "Gameplay demo",
  "20480Demo.mp4",
  poster2048,
  "A short gameplay loop showing board rhythm, score pacing, and keyboard-first interaction.",
);
const videoAnimeAiPrimary = createVideo(
  "anime-ai-demo",
  "Primary demo",
  "animeapp.mp4",
  posterAnimeAi,
  "A concise product tour through prompt input, recommendation output, and media browsing.",
);
const videoAppetizerBrowse = createVideo(
  "appetizer-browse",
  "Browse flow",
  "appetizer1.mp4",
  posterAppetizer,
  "Browse categories, inspect an item, and move toward selection.",
);
const videoAppetizerCheckout = createVideo(
  "appetizer-checkout",
  "Checkout flow",
  "appetizer2.mp4",
  posterAppetizer,
  "Follow the cart and confirmation flow through the final action.",
);
const videoFrameworksPrimary = createVideo(
  "frameworks-demo",
  "Primary demo",
  "frameworks.mp4",
  posterFrameworks,
  "A walkthrough of the browse system, transitions, and scroll-scrubbed presentation.",
);

export const navSections: NavSection[] = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "writing", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export const siteMedia: SiteMediaCatalog = {
  baseHost,
  contactIcons: {
    email: iconEmail,
    linkedIn: iconLinkedIn,
    phone: iconPhone,
  },
  logos: {
    c: logoC,
    figma: logoFigma,
    github: logoGithub,
    python: logoPython,
    swift: logoSwift,
    swiftUi: logoSwiftUi,
    xcode: logoXcode,
  },
  people: {
    alternateHeadshot,
    optionalPersonalImage,
    primaryHeadshot,
  },
  projectAssets: {
    game2048: {
      poster: poster2048,
      videos: [video2048Gameplay],
    },
    animeAiApp: {
      extras: [extraAnimeAiOne, extraAnimeAiTwo],
      poster: posterAnimeAi,
      videos: [videoAnimeAiPrimary],
    },
    animeBrowser: {
      poster: posterAnimeBrowser,
    },
    appetizerApp: {
      poster: posterAppetizer,
      videos: [videoAppetizerBrowse, videoAppetizerCheckout],
    },
    frameworksApp: {
      poster: posterFrameworks,
      videos: [videoFrameworksPrimary],
    },
  },
};

export const hero: HeroContent = {
  availability: "Open to product-focused frontend and iOS opportunities.",
  description:
    "The portfolio stays structured like a working system: featured work up front, a scalable browse view behind it, and project detail only when someone asks for more.",
  eyebrow: "Portfolio",
  intro: "Product-focused frontend and iOS work with a Notion-like sense of structure and restrained motion.",
  locationLabel: "Based in the United States.",
  portrait: siteMedia.people.primaryHeadshot,
  primaryCtaLabel: "View projects",
  secondaryCtaLabel: "Get in touch",
  summary:
    "Clear interfaces, measured motion, and project surfaces designed for scanning before depth.",
  title: "Omar Mendivil builds interfaces that stay calm when the interaction gets complex.",
};

export const projects: Project[] = [
  {
    category: "iOS",
    chapters: [
      createChapter(
        "frameworks-browse",
        "Browse view",
        "Open on the lightweight framework index and scan the main categories.",
        videoFrameworksPrimary.id,
        0,
      ),
      createChapter(
        "frameworks-detail",
        "Detail transition",
        "Shift into a focused framework detail view without losing context.",
        videoFrameworksPrimary.id,
        12,
      ),
      createChapter(
        "frameworks-scrub",
        "Scroll scrub",
        "Review the scroll-scrubbing style interaction called out in the media brief.",
        videoFrameworksPrimary.id,
        19,
      ),
    ],
    featured: true,
    gallery: [],
    highlights: [
      "Browse-heavy information architecture tuned for quick scanning.",
      "Detail flow designed around motion rather than page churn.",
      "Scroll-scrubbing style demo captured as the product narrative.",
    ],
    id: "frameworks-app",
    links: [
      createProjectLink("Poster asset", posterFrameworks.url, "poster"),
      createProjectLink("Demo asset", videoFrameworksPrimary.url, "video"),
    ],
    media: [videoFrameworksPrimary],
    oneLiner:
      "A SwiftUI reference browser for learning Apple frameworks through motion and scroll-scrubbed storytelling.",
    poster: posterFrameworks,
    role: "Product design and SwiftUI development",
    slug: "frameworks-app",
    status: "Prototype",
    summary:
      "Frameworks App turns a dense list of Apple technologies into a calm browse-first experience with strong hierarchy, smooth transitions, and detail views that feel native.",
    tags: ["SwiftUI", "iOS", "Motion Systems"],
    title: "Frameworks App",
    videos: [videoFrameworksPrimary],
    year: "2024",
  },
  {
    category: "AI Product",
    chapters: [
      createChapter(
        "anime-ai-chat",
        "Conversation start",
        "Move from prompt entry into tailored suggestions.",
        videoAnimeAiPrimary.id,
        0,
      ),
      createChapter(
        "anime-ai-results",
        "Recommendation layout",
        "See how AI output becomes structured content cards instead of raw text.",
        videoAnimeAiPrimary.id,
        9,
      ),
    ],
    featured: true,
    gallery: [extraAnimeAiOne, extraAnimeAiTwo],
    highlights: [
      "Blends chat-style discovery with clear recommendation surfaces.",
      "Balances personality and utility without losing browse speed.",
      "Designed for progressive disclosure from overview to detail.",
    ],
    id: "anime-ai-app",
    links: [
      createProjectLink("Poster asset", posterAnimeAi.url, "poster"),
      createProjectLink("Demo asset", videoAnimeAiPrimary.url, "video"),
    ],
    media: [videoAnimeAiPrimary],
    oneLiner:
      "An anime discovery experience with AI-assisted recommendations and conversational exploration.",
    poster: posterAnimeAi,
    role: "Product direction and frontend implementation",
    slug: "anime-ai-app",
    status: "Prototype",
    summary:
      "Anime AI App combines assistant-style prompting with structured media browsing so the interface can move between playful exploration and direct recommendations.",
    tags: ["AI", "Product Design", "Frontend"],
    title: "Anime AI App",
    videos: [videoAnimeAiPrimary],
    year: "2025",
  },
  {
    category: "iOS",
    chapters: [
      createChapter(
        "appetizer-menu",
        "Menu system",
        "Use the browse clip to inspect category navigation and item hierarchy.",
        videoAppetizerBrowse.id,
        0,
      ),
      createChapter(
        "appetizer-checkout",
        "Checkout",
        "Jump to the checkout clip and review the shortened completion path.",
        videoAppetizerCheckout.id,
        0,
      ),
    ],
    featured: true,
    gallery: [],
    highlights: [
      "Menu browsing built around legibility first.",
      "Shorter path from item discovery to action.",
      "Multiple demo clips split by flow instead of one overloaded video.",
    ],
    id: "appetizer-app",
    links: [
      createProjectLink("Poster asset", posterAppetizer.url, "poster"),
      createProjectLink("Browse demo", videoAppetizerBrowse.url, "video"),
      createProjectLink("Checkout demo", videoAppetizerCheckout.url, "video"),
    ],
    media: [videoAppetizerBrowse, videoAppetizerCheckout],
    oneLiner:
      "A mobile ordering concept focused on faster selection, readable menus, and a calm checkout path.",
    poster: posterAppetizer,
    role: "Mobile product design and SwiftUI implementation",
    slug: "appetizer-app",
    status: "Prototype",
    summary:
      "Appetizer App studies the small decisions that make ordering feel effortless: clear hierarchy, predictable actions, and enough motion to guide without distracting.",
    tags: ["SwiftUI", "Commerce", "Mobile UX"],
    title: "Appetizer App",
    videos: [videoAppetizerBrowse, videoAppetizerCheckout],
    year: "2024",
  },
  {
    category: "Frontend",
    chapters: [
      createChapter(
        "2048-opening",
        "Board setup",
        "See the initial board, score framing, and first interaction cues.",
        video2048Gameplay.id,
        0,
      ),
      createChapter(
        "2048-flow",
        "Momentum",
        "Jump into the middle of a scoring sequence to see feedback speed.",
        video2048Gameplay.id,
        8,
      ),
    ],
    featured: true,
    gallery: [],
    highlights: [
      "Responsive board layout with fast visual feedback.",
      "Single-screen product framing with minimal friction.",
      "A compact surface used to push interaction polish.",
    ],
    id: "2048-game",
    links: [
      createProjectLink("Poster asset", poster2048.url, "poster"),
      createProjectLink("Demo asset", video2048Gameplay.url, "video"),
    ],
    media: [video2048Gameplay],
    oneLiner:
      "A polished browser version of 2048 with tactile feedback, score flow, and crisp visual rhythm.",
    poster: poster2048,
    role: "Frontend design and implementation",
    slug: "2048-game",
    status: "Shipped demo",
    summary:
      "2048 Game focuses on game feel more than complexity, turning a familiar mechanic into a responsive single-purpose interface with clear states and pacing.",
    tags: ["TypeScript", "Game UI", "Frontend"],
    title: "2048 Game",
    videos: [video2048Gameplay],
    year: "2025",
  },
  {
    category: "Frontend",
    chapters: [],
    featured: false,
    gallery: [],
    highlights: [
      "List density calibrated for large catalogs.",
      "Search-first interaction without losing visual hierarchy.",
      "A useful contrast to the more guided AI experience.",
    ],
    id: "anime-browser",
    links: [createProjectLink("Poster asset", posterAnimeBrowser.url, "poster")],
    media: [],
    oneLiner:
      "A searchable anime library with list density tuned for discovery instead of clutter.",
    poster: posterAnimeBrowser,
    role: "Product design and frontend systems",
    slug: "anime-browser",
    status: "Concept",
    summary:
      "Anime Browser treats the browse layer as the product itself, focusing on fast scanning, category cues, and a layout that feels organized at a glance.",
    tags: ["Search", "Catalog UX", "Frontend"],
    title: "Anime Browser",
    videos: [],
    year: "2025",
  },
];

export const skills: Skill[] = [
  {
    category: "Languages",
    icon: siteMedia.logos.swift,
    id: "swift",
    label: "Swift",
    level: "Core",
    name: "Swift",
    note: "Native application development with an emphasis on product feel and UI detail.",
    summary: "Native application development with an emphasis on product feel and UI detail.",
  },
  {
    category: "Mobile",
    icon: siteMedia.logos.swiftUi,
    id: "swiftui",
    label: "SwiftUI",
    level: "Core",
    name: "SwiftUI",
    note: "Declarative layout systems, motion, and reusable composition for iOS work.",
    summary: "Declarative layout systems, motion, and reusable composition for iOS work.",
  },
  {
    category: "Tooling",
    icon: siteMedia.logos.xcode,
    id: "xcode",
    label: "Xcode",
    level: "Daily",
    name: "Xcode",
    note: "Build, debug, and ship workflows centered around native product iteration.",
    summary: "Build, debug, and ship workflows centered around native product iteration.",
  },
  {
    category: "Languages",
    icon: siteMedia.logos.python,
    id: "python",
    label: "Python",
    level: "Supporting",
    name: "Python",
    note: "Automation, scripting, and quick experiments for product and data workflows.",
    summary: "Automation, scripting, and quick experiments for product and data workflows.",
  },
  {
    category: "Foundations",
    icon: siteMedia.logos.c,
    id: "c",
    label: "C",
    level: "Foundational",
    name: "C",
    note: "Lower-level thinking that sharpens performance and systems reasoning.",
    summary: "Lower-level thinking that sharpens performance and systems reasoning.",
  },
  {
    category: "Design",
    icon: siteMedia.logos.figma,
    id: "figma",
    label: "Figma",
    level: "Core",
    name: "Figma",
    note: "Interface studies, layout iteration, and motion planning before implementation.",
    summary: "Interface studies, layout iteration, and motion planning before implementation.",
  },
  {
    category: "Workflow",
    icon: siteMedia.logos.github,
    id: "github",
    label: "GitHub",
    level: "Daily",
    name: "GitHub",
    note: "Versioned collaboration, review flow, and project hygiene across product work.",
    summary: "Versioned collaboration, review flow, and project hygiene across product work.",
  },
];

export const experience: Experience[] = [
  {
    bullets: [
      "Design and implement single-purpose product experiences with tight feedback loops.",
      "Translate rough concepts into demo-ready interfaces that communicate intent quickly.",
      "Use motion sparingly to improve orientation instead of decoration.",
    ],
    highlights: [
      "Design and implement single-purpose product experiences with tight feedback loops.",
      "Translate rough concepts into demo-ready interfaces that communicate intent quickly.",
      "Use motion sparingly to improve orientation instead of decoration.",
    ],
    id: "independent-product",
    location: "Arizona",
    organization: "Self-directed work",
    period: "2024 - Present",
    role: "Independent Product Developer",
    summary:
      "Building focused product concepts from interface study through functional demo, with most of the effort spent on clarity, pacing, and interaction quality.",
  },
  {
    bullets: [
      "Ship SwiftUI prototypes that feel close to finished products.",
      "Prototype detail flows, browse states, and lightweight information systems.",
      "Use captured demos to refine pacing and handoff between screens.",
    ],
    highlights: [
      "Ship SwiftUI prototypes that feel close to finished products.",
      "Prototype detail flows, browse states, and lightweight information systems.",
      "Use captured demos to refine pacing and handoff between screens.",
    ],
    id: "ios-builds",
    location: "Remote",
    organization: "Selected app experiments",
    period: "2023 - Present",
    role: "iOS Application Builder",
    summary:
      "A run of iOS app concepts centered on browse-heavy flows, polished transitions, and legible information density.",
  },
  {
    bullets: [
      "Build interfaces where list browsing and detail inspection stay fast on any screen size.",
      "Prioritize keyboard support and performance constraints from the start.",
      "Keep client bundles small by isolating interactivity to the surfaces that need it.",
    ],
    highlights: [
      "Build interfaces where list browsing and detail inspection stay fast on any screen size.",
      "Prioritize keyboard support and performance constraints from the start.",
      "Keep client bundles small by isolating interactivity to the surfaces that need it.",
    ],
    id: "frontend-systems",
    location: "Remote",
    organization: "Web projects",
    period: "2022 - Present",
    role: "Frontend Interaction Builder",
    summary:
      "Exploring how compact web experiences can still feel premium through responsive layout, micro state handling, and disciplined motion.",
  },
];

export const writing: WritingEntry[] = [
  {
    format: "Essay",
    id: "browse-systems",
    outlet: "Notes",
    published: "Current",
    status: "Draft",
    summary:
      "A running note on how to keep large project catalogs readable without flattening their personality.",
    title: "Designing browse systems that stay calm under scale",
  },
  {
    duration: "4 min",
    format: "Video",
    href: videoFrameworksPrimary.url,
    id: "motion-restraint",
    outlet: "Walkthrough",
    published: "Current",
    status: "Live",
    summary:
      "A short capture focused on how restrained transitions can explain structure better than labels alone.",
    title: "Motion as orientation, not decoration",
  },
  {
    format: "Essay",
    id: "prototype-fidelity",
    outlet: "Notes",
    published: "Current",
    status: "Draft",
    summary:
      "A framework for deciding when a prototype should stay rough and when polish becomes part of the product idea.",
    title: "Raising fidelity only where the interaction earns it",
  },
];

export const contact: ContactConfig = {
  availability: "Open to product-focused frontend and iOS opportunities.",
  blurb:
    "Best-fit work usually begins with a product question, a rough flow, or an interaction that needs to feel obvious.",
  copyLabel: "Copy email",
  description:
    "Email stays env-driven so private contact details never need to live in tracked files. Phone remains optional and off by default.",
  emailEnvVar: "NEXT_PUBLIC_CONTACT_EMAIL",
  emailIconUrl: siteMedia.contactIcons.email.url,
  heading: "Start with a concrete problem.",
  icons: {
    email: siteMedia.contactIcons.email,
    linkedIn: siteMedia.contactIcons.linkedIn,
    phone: siteMedia.contactIcons.phone,
  },
  linkedInIconUrl: siteMedia.contactIcons.linkedIn.url,
  location: "Based in Arizona",
  phoneEnvVar: "NEXT_PUBLIC_CONTACT_PHONE",
  phoneIconUrl: siteMedia.contactIcons.phone.url,
  primaryActionLabel: "Copy email",
  secondaryActionLabel: "Open mail app",
  showPhone: false,
  title: "Reach out through the env-driven contact lane",
};

export const siteContent: SiteContent = {
  contact,
  experience,
  hero,
  media: siteMedia,
  nav: navSections,
  navSections,
  projects,
  skills,
  writing,
};

export function getFeaturedProjects(projectList: Project[] = siteContent.projects): Project[] {
  return projectList.filter((project) => project.featured);
}

export function getProjectCategories(
  projectList: Project[] = siteContent.projects,
): ProjectCategory[] {
  return Array.from(new Set(projectList.map((project) => project.category)));
}

export function filterProjects(
  projectList: Project[] = siteContent.projects,
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
      ...project.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function groupProjectsByCategory(
  projectList: Project[] = siteContent.projects,
): ProjectGroup[] {
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
