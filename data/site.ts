import {
  type ContactConfig,
  type Experience,
  type HeroContent,
  type MediaAsset,
  type NavSection,
  type Project,
  type ProjectChapter,
  type ProjectDemoGuide,
  type ProjectLink,
  type ProjectStoryBeat,
  type ProjectVideo,
  type SiteContent,
  type SiteMediaCatalog,
  type Skill,
  type WritingEntry,
} from "@/data/types";

const baseHost = "https://pub-8845c4797eee47adbbeb7077d3509851.r2.dev";

function createMediaAsset(path: string, alt: string): MediaAsset {
  const url = `${baseHost}/${path}`;

  return { alt, url };
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
    poster: poster.url,
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
    videoId,
  };
}

function createDemoGuide(
  eyebrow: string,
  title: string,
  summary: string,
): ProjectDemoGuide {
  return {
    eyebrow,
    summary,
    title,
  };
}

function createStoryBeat(
  id: string,
  eyebrow: string,
  title: string,
  description: string,
): ProjectStoryBeat {
  return {
    description,
    eyebrow,
    id,
    title,
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

const logoC = createMediaAsset("c.svg", "C logo");
const logoPython = createMediaAsset("python.png", "Python logo");
const logoSwift = createMediaAsset("swift.svg", "Swift logo");
const logoSwiftUi = createMediaAsset("swiftui.svg", "SwiftUI logo");
const logoXcode = createMediaAsset("xcode.png", "Xcode logo");
const logoFigma = createMediaAsset("figma.png", "Figma logo");
const logoGithub = createMediaAsset("github.png", "GitHub logo");

const iconEmail = createMediaAsset("email.png", "Email icon");
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
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const siteMedia: SiteMediaCatalog = {
  baseHost,
  contactIcons: {
    email: iconEmail,
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
        "Catalog browse",
        "Start on the framework index and scan grouped cards that keep a dense catalog readable.",
        videoFrameworksPrimary.id,
        0,
      ),
      createChapter(
        "frameworks-detail",
        "Detail handoff",
        "Move into a focused detail view that keeps orientation instead of feeling like a context switch.",
        videoFrameworksPrimary.id,
        12,
      ),
      createChapter(
        "frameworks-motion",
        "Motion cue",
        "Review the scroll-scrubbed transition language used to make the learning flow feel guided.",
        videoFrameworksPrimary.id,
        19,
      ),
    ],
    demo: createDemoGuide(
      "Guided walkthrough",
      "Browse to detail without losing context",
      "This preview follows the product's core promise: scan quickly, commit to one framework, and land in detail with motion that keeps the user oriented.",
    ),
    featured: true,
    gallery: [],
    highlights: [
      "Turns a dense Apple-framework catalog into a calm browse-first learning surface.",
      "Built with reusable SwiftUI composition and layered browse states for fast scanning.",
      "Packages technical reference content in a way that still feels approachable and polished.",
    ],
    id: "frameworks-app",
    links: [
      createProjectLink("Poster asset", posterFrameworks.url, "poster"),
      createProjectLink("Demo asset", videoFrameworksPrimary.url, "video"),
    ],
    oneLiner:
      "A SwiftUI reference browser that makes Apple's framework catalog feel approachable, guided, and easy to learn from.",
    poster: posterFrameworks,
    presentation: "device",
    role: "Product design and SwiftUI development",
    story: [
      createStoryBeat(
        "frameworks-what",
        "What it is",
        "An educational browser, not just a list of logos.",
        "Frameworks App turns Apple technologies into a clean learning surface with enough hierarchy to browse fast and enough polish to feel intentionally productized.",
      ),
      createStoryBeat(
        "frameworks-tech",
        "Technical lens",
        "The challenge is navigation clarity under density.",
        "The project focuses on reusable SwiftUI composition, layered browse states, and transitions that keep users oriented as they move from catalog scan to detail.",
      ),
      createStoryBeat(
        "frameworks-why",
        "Why it matters",
        "It shows product thinking on top of implementation detail.",
        "This is strong portfolio work because the win is restraint: making technical information feel obvious, native, and calm rather than visually overloaded.",
      ),
    ],
    status: "Prototype",
    summary:
      "Frameworks App explores how a technical catalog can still feel light. The product uses clean grouping, clear navigation, and measured motion so detail views feel like a continuation of browsing rather than a hard mode switch.",
    tags: ["SwiftUI", "iOS", "Motion Systems"],
    technicalThemes: ["SwiftUI navigation", "information architecture", "motion-led transitions"],
    title: "Frameworks App",
    videos: [videoFrameworksPrimary],
    year: "2024",
  },
  {
    category: "AI Product",
    chapters: [
      createChapter(
        "anime-ai-discovery",
        "Prompt to discovery",
        "Start with a conversational request and move into a product view that turns free-form intent into structured anime recommendations.",
        videoAnimeAiPrimary.id,
        0,
      ),
      createChapter(
        "anime-ai-structure",
        "Structured response",
        "Watch the UI turn summaries, comparisons, and recommendations into browseable cards instead of chat-only output.",
        videoAnimeAiPrimary.id,
        9,
      ),
    ],
    demo: createDemoGuide(
      "AI product preview",
      "Translate prompts into product-like results",
      "The demo focuses on the moment where natural-language requests become structured UI: recommendations, summaries, and comparisons that feel like product features rather than generated text.",
    ),
    featured: true,
    gallery: [extraAnimeAiOne, extraAnimeAiTwo],
    highlights: [
      "Combines anime discovery with AI features without collapsing into a plain chatbot UI.",
      "Turns natural-language prompts into structured recommendation and comparison flows.",
      "Balances playful exploration with clear browsing surfaces and readable detail states.",
    ],
    id: "anime-ai-app",
    links: [
      createProjectLink("Poster asset", posterAnimeAi.url, "poster"),
      createProjectLink("Demo asset", videoAnimeAiPrimary.url, "video"),
    ],
    oneLiner:
      "A SwiftUI anime app that blends discovery, conversation, and AI-assisted recommendations into one guided product flow.",
    poster: posterAnimeAi,
    presentation: "device",
    role: "Product direction, SwiftUI, and AI interaction design",
    story: [
      createStoryBeat(
        "anime-ai-what",
        "What it is",
        "An anime discovery app with AI woven into the product flow.",
        "The goal was to combine search, detail views, and natural-language assistance without making the experience feel like a bolted-on assistant.",
      ),
      createStoryBeat(
        "anime-ai-tech",
        "Technical lens",
        "The interesting work is prompt interpretation plus API-driven UI.",
        "The app uses anime metadata from Jikan, then layers in OpenAI-powered features for summaries, comparisons, and recommendations that resolve into structured interface states.",
      ),
      createStoryBeat(
        "anime-ai-why",
        "Why it matters",
        "It demonstrates AI as interface behavior, not decoration.",
        "This project is useful in interviews because it shows how to translate open-ended prompts into reliable UI responses while still preserving browse speed and product clarity.",
      ),
    ],
    status: "Prototype",
    summary:
      "Anime AI App explores how conversational input can power a real product surface. Instead of stopping at chat output, it converts prompts into recommendation cards, summaries, and comparisons that still behave like a browseable interface.",
    tags: ["AI", "Product Design", "Frontend"],
    technicalThemes: ["prompt classification", "Jikan API integration", "SwiftUI state handling"],
    title: "Anime AI App",
    videos: [videoAnimeAiPrimary],
    year: "2025",
  },
  {
    category: "iOS",
    chapters: [
      createChapter(
        "appetizer-menu",
        "Menu browse",
        "Start on the API-driven menu and review the category hierarchy, image loading, and add-to-order flow.",
        videoAppetizerBrowse.id,
        0,
      ),
      createChapter(
        "appetizer-checkout",
        "Checkout path",
        "Jump to the second clip to see validation, confirmation, and how the flow stays calm through the final step.",
        videoAppetizerCheckout.id,
        0,
      ),
    ],
    demo: createDemoGuide(
      "Commerce flow",
      "Browse first, then tighten the path to checkout",
      "The demo is split into guided scenes so menu browsing, adding items, and checkout validation each get room to explain the product instead of being buried in one overloaded clip.",
    ),
    featured: true,
    gallery: [],
    highlights: [
      "Uses API-backed menu data and image caching to keep browsing responsive.",
      "Splits the demo into scenes so browsing and checkout can each be explained clearly.",
      "Focuses on validation, order state, and a clean mobile commerce path.",
    ],
    id: "appetizer-app",
    links: [
      createProjectLink("Poster asset", posterAppetizer.url, "poster"),
      createProjectLink("Browse demo", videoAppetizerBrowse.url, "video"),
      createProjectLink("Checkout demo", videoAppetizerCheckout.url, "video"),
    ],
    oneLiner:
      "A SwiftUI ordering app focused on readable menus, responsive image loading, and a checkout flow that stays clear under validation.",
    poster: posterAppetizer,
    presentation: "device",
    role: "SwiftUI mobile product implementation",
    story: [
      createStoryBeat(
        "appetizer-what",
        "What it is",
        "A mobile ordering flow shaped around clarity over excess.",
        "The app practices familiar product moments: fetch remote items, maintain order state, and guide the user from menu browsing into checkout without visual noise.",
      ),
      createStoryBeat(
        "appetizer-tech",
        "Technical lens",
        "The interesting parts are state, validation, and performance polish.",
        "The build leans on remote data fetching, image caching, local order updates, and form validation so the experience feels responsive even as the user moves through multiple steps.",
      ),
      createStoryBeat(
        "appetizer-why",
        "Why it matters",
        "It shows product execution in a common but demanding pattern.",
        "Commerce-style flows expose weak hierarchy quickly. This project is useful because it demonstrates the small interaction decisions that make a basic ordering flow feel trustworthy.",
      ),
    ],
    status: "Prototype",
    summary:
      "Appetizer App studies the small choices that make ordering feel easy: fast image loading, predictable cart updates, and checkout validation that supports the user instead of interrupting them.",
    tags: ["SwiftUI", "Commerce", "Mobile UX"],
    technicalThemes: ["API-driven UI", "image caching", "form validation"],
    title: "Appetizer App",
    videos: [videoAppetizerBrowse, videoAppetizerCheckout],
    year: "2024",
  },
  {
    category: "Frontend",
    chapters: [
      createChapter(
        "2048-opening",
        "Board opening",
        "Open on the first board state to inspect layout, score framing, and the visual cues that guide the initial move.",
        video2048Gameplay.id,
        0,
      ),
      createChapter(
        "2048-flow",
        "Score rhythm",
        "Jump into a later sequence to review merge feedback, score pacing, and how the UI keeps momentum readable.",
        video2048Gameplay.id,
        8,
      ),
    ],
    demo: createDemoGuide(
      "Interaction preview",
      "Show game feel through pacing and feedback",
      "The walkthrough focuses on how board motion, merge feedback, and score rhythm combine to make a familiar mechanic feel crisp instead of generic.",
    ),
    featured: true,
    gallery: [],
    highlights: [
      "Recreates a familiar game with a stronger emphasis on responsive visual rhythm.",
      "Separates game logic from presentation so the interaction remains easier to validate.",
      "Uses a compact surface to focus on feedback timing and state clarity.",
    ],
    id: "2048-game",
    links: [
      createProjectLink("Poster asset", poster2048.url, "poster"),
      createProjectLink("Demo asset", video2048Gameplay.url, "video"),
    ],
    oneLiner:
      "A 2048 implementation built to practice game-state logic and sharpen the feel of a fast, single-purpose interface.",
    poster: poster2048,
    presentation: "canvas",
    role: "Frontend design and implementation",
    story: [
      createStoryBeat(
        "2048-what",
        "What it is",
        "A focused recreation of a familiar puzzle loop.",
        "The project rebuilds 2048 as a compact browser experience where the interesting work lives in game feel, merge timing, and the clarity of each board state.",
      ),
      createStoryBeat(
        "2048-tech",
        "Technical lens",
        "The code is organized around state handling, not visual tricks.",
        "The implementation separates board logic, tile behavior, and presentation so the gameplay rules stay testable while the interface stays responsive.",
      ),
      createStoryBeat(
        "2048-why",
        "Why it matters",
        "It shows discipline on a small surface.",
        "Small games reveal whether someone can make a familiar interaction feel intentional. This piece highlights object-oriented thinking and attention to feedback detail.",
      ),
    ],
    status: "Shipped demo",
    summary:
      "2048 Game is less about novelty and more about execution. The project uses a familiar mechanic to focus on state management, crisp feedback, and the pacing decisions that make a simple interaction feel satisfying.",
    tags: ["TypeScript", "Game UI", "Frontend"],
    technicalThemes: ["object-oriented design", "game state management", "DOM-driven rendering"],
    title: "2048 Game",
    videos: [video2048Gameplay],
    year: "2025",
  },
  {
    category: "Frontend",
    chapters: [],
    demo: createDemoGuide(
      "Browse system",
      "A search-first catalog focused on async UI polish",
      "Anime Browser has no embedded demo yet, but the project is still presented as a browse system study: fast scanning, infinite scrolling, and predictable async feedback.",
    ),
    featured: false,
    gallery: [],
    highlights: [
      "Uses infinite scrolling and loading guards to keep pagination predictable.",
      "Keeps async states readable with skeletons, throttling, and responsive cards.",
      "Treats the browse layer itself as the product experience.",
    ],
    id: "anime-browser",
    links: [createProjectLink("Poster asset", posterAnimeBrowser.url, "poster")],
    oneLiner:
      "A lightweight anime browser built to practice infinite scroll, async loading states, and clean responsive discovery UI.",
    poster: posterAnimeBrowser,
    presentation: "canvas",
    role: "Product design and frontend systems",
    story: [
      createStoryBeat(
        "anime-browser-what",
        "What it is",
        "A browse-first anime library built around real frontend fundamentals.",
        "The app focuses on the quality of searching, scrolling, and loading rather than on decorative complexity, which makes it a good study in practical interface behavior.",
      ),
      createStoryBeat(
        "anime-browser-tech",
        "Technical lens",
        "Async state handling drives the experience.",
        "It uses Jikan API data, IntersectionObserver-based pagination, and loading guards so requests stay predictable even when users scroll quickly or repeatedly.",
      ),
      createStoryBeat(
        "anime-browser-why",
        "Why it matters",
        "It demonstrates discipline in common web product patterns.",
        "A lot of real product work lives in list density, empty states, and async polish. This project is useful because it makes those details explicit instead of treating them as table stakes.",
      ),
    ],
    status: "Concept",
    summary:
      "Anime Browser treats the browse layer as the product itself. The work centers on async loading, infinite-scroll control, and responsive layout choices that keep a large catalog readable.",
    tags: ["Search", "Catalog UX", "Frontend"],
    technicalThemes: ["async UI handling", "infinite scroll behavior", "responsive components"],
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
    level: "Core",
    name: "Swift",
    summary: "Native application development with an emphasis on product feel and UI detail.",
  },
  {
    category: "Mobile",
    icon: siteMedia.logos.swiftUi,
    id: "swiftui",
    level: "Core",
    name: "SwiftUI",
    summary: "Declarative layout systems, motion, and reusable composition for iOS work.",
  },
  {
    category: "Tooling",
    icon: siteMedia.logos.xcode,
    id: "xcode",
    level: "Daily",
    name: "Xcode",
    summary: "Build, debug, and ship workflows centered around native product iteration.",
  },
  {
    category: "Languages",
    icon: siteMedia.logos.python,
    id: "python",
    level: "Supporting",
    name: "Python",
    summary: "Automation, scripting, and quick experiments for product and data workflows.",
  },
  {
    category: "Foundations",
    icon: siteMedia.logos.c,
    id: "c",
    level: "Foundational",
    name: "C",
    summary: "Lower-level thinking that sharpens performance and systems reasoning.",
  },
  {
    category: "Design",
    icon: siteMedia.logos.figma,
    id: "figma",
    level: "Core",
    name: "Figma",
    summary: "Interface studies, layout iteration, and motion planning before implementation.",
  },
  {
    category: "Workflow",
    icon: siteMedia.logos.github,
    id: "github",
    level: "Daily",
    name: "GitHub",
    summary: "Versioned collaboration, review flow, and project hygiene across product work.",
  },
];

export const experience: Experience[] = [
  {
    bullets: [
      "Led weekly triage meetings with the Product Integrity team, analyzing radar data and communicating issues to engineers.",
      "Helped the QE team better understand system behavior, reducing unnecessary radars and making testing more targeted.",
      "Identified a recurring issue pattern across multiple radars that helped engineers isolate and fix a perception bug.",
    ],
    id: "apple-triage",
    location: "Cupertino, CA",
    organization: "Apple",
    period: "Jun 2025 - Nov 2025",
    role: "Perception Triage Engineer",
    summary:
      "Career Experience Program — selected into a program only the top 10% of the company is accepted into. Triaged perception system issues across the product integrity pipeline.",
  },
  {
    bullets: [
      "Built and customized websites for clients with a focus on usability, visual polish, and practical business needs.",
      "Implemented custom functionality using JavaScript and HTML embeds when built-in site builder features weren't enough.",
    ],
    id: "aer-digital",
    location: "Remote",
    organization: "Aer Digital",
    period: "May 2022 - Jun 2025",
    role: "Web Developer",
    summary:
      "Designed and shipped client websites with custom JavaScript functionality, focused on converting business requirements into polished web experiences.",
  },
  {
    bullets: [
      "Building product concepts across Swift, SwiftUI, React, and TypeScript — from interface study through functional demo.",
      "Shipping apps, developer tools, and this portfolio with an emphasis on motion, architecture, and craft.",
      "Creating dev content and walkthroughs to document the build process.",
    ],
    id: "independent-dev",
    location: "Arizona",
    organization: "Self-directed",
    period: "2024 - Present",
    role: "Independent Developer",
    summary:
      "6+ shipped projects across iOS and web. Building focused product concepts with clean architecture and no compromises on design.",
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
  heading: "Start with a concrete problem.",
  icons: {
    email: siteMedia.contactIcons.email,
    phone: siteMedia.contactIcons.phone,
  },
  location: "Based in Arizona",
  primaryActionLabel: "Copy email",
  secondaryActionLabel: "Open mail app",
  showPhone: false,
};

export const siteContent: SiteContent = {
  contact,
  experience,
  hero,
  media: siteMedia,
  projects,
  skills,
  writing,
};
