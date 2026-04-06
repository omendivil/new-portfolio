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

const posterResearchCommander = createMediaAsset("research-commander.png", "Research Commander dashboard preview");
const posterArchDrift = createMediaAsset("arch-drift.png", "arch-drift CLI output preview");
const posterClaudeNotifier = createMediaAsset("claude-notifier.png", "Claude Notifier tab states preview");
const posterAnimeAi = createMediaAsset("animeai.png", "Anime AI App poster preview");
const extraAnimeAiOne = createMediaAsset("aiapp.png", "Anime AI App additional screen one");
const extraAnimeAiTwo = createMediaAsset("animeapp.png", "Anime AI App additional screen two");
const posterAtlasChat = createMediaAsset("atlas-chat.png", "Atlas Chat App poster preview");

const videoAnimeAiPrimary = createVideo(
  "anime-ai-demo",
  "Primary demo",
  "animeapp.mp4",
  posterAnimeAi,
  "A concise product tour through prompt input, recommendation output, and media browsing.",
);

export const navSections: NavSection[] = [
  { id: "hero", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "code", label: "Languages" },
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
    researchCommander: {
      poster: posterResearchCommander,
    },
    archDrift: {
      poster: posterArchDrift,
    },
    claudeNotifier: {
      poster: posterClaudeNotifier,
    },
    animeAiApp: {
      extras: [extraAnimeAiOne, extraAnimeAiTwo],
      poster: posterAnimeAi,
      videos: [videoAnimeAiPrimary],
    },
    atlasChatApp: {
      poster: posterAtlasChat,
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
    category: "AI Systems",
    chapters: [],
    demo: createDemoGuide(
      "System overview",
      "11 agents, one command center",
      "Research Commander runs overnight AI agents that scour the internet, analyze findings with Claude, and deliver structured briefings by morning.",
    ),
    featured: true,
    gallery: [],
    highlights: [
      "11 specialized agents — 6 research (Perplexity) + 5 analysis (Claude) — coordinated through Temporal workflows.",
      "LangGraph pipelines with multi-pass research, quality gates, and injection detection.",
      "Neon PostgreSQL with pgvector for semantic search across 900+ research items.",
      "Glass-card workspace UI with per-agent color coding, live status, and Atlas AI briefings.",
      "Deployed across Vercel (frontend), Hetzner VPS (Docker workers), and Electron (desktop).",
    ],
    id: "research-commander",
    links: [
      createProjectLink("Live app", "https://atlas-dashboard-five-kappa.vercel.app", "demo"),
      createProjectLink("Source", "https://github.com/omendivil/research-dashboard", "repo"),
    ],
    oneLiner:
      "A multi-agent AI research system that runs overnight, synthesizes findings across domains, and delivers structured daily briefings.",
    poster: posterResearchCommander,
    presentation: "dashboard",
    role: "Full-stack architecture, AI pipeline design, and product development",
    story: [
      createStoryBeat(
        "rc-what",
        "What it is",
        "A personal command center powered by AI agents.",
        "Research Commander automates the research process: job hunting, content strategy, security monitoring, business intelligence. Agents run on a schedule, findings flow into a searchable knowledge base, and Atlas synthesizes daily briefings.",
      ),
      createStoryBeat(
        "rc-tech",
        "Technical lens",
        "The system coordinates across three deployment targets.",
        "The frontend runs on Vercel (Next.js + React Query + Zustand). Agent pipelines run on a Hetzner VPS via Docker (Python + LangGraph + aiohttp). Temporal Cloud orchestrates multi-phase workflows with conditional agent chaining and staggered starts.",
      ),
      createStoryBeat(
        "rc-why",
        "Why it matters",
        "It demonstrates systems thinking, not just feature building.",
        "This project shows the ability to design, deploy, and maintain a distributed AI system with real data flowing through it daily — not a tutorial project, but infrastructure that runs my professional life.",
      ),
    ],
    status: "Production",
    summary:
      "Research Commander is a distributed AI research system. Perplexity agents search the internet, Claude agents analyze findings, Temporal orchestrates the pipeline, and a glass-card dashboard makes it all scannable.",
    tags: ["Next.js", "LangGraph", "Temporal", "pgvector", "Python", "Docker"],
    technicalThemes: ["agent orchestration", "distributed systems", "RAG pipelines", "vector search"],
    title: "Research Commander",
    videos: [],
    year: "2025–2026",
  },
  {
    category: "Developer Tools",
    chapters: [],
    demo: createDemoGuide(
      "CLI walkthrough",
      "Detect architecture, enforce boundaries",
      "arch-drift scans your codebase, detects layer boundaries from actual import patterns, and catches violations on every commit — whether the code was written by a human or an AI agent.",
    ),
    featured: true,
    gallery: [],
    highlights: [
      "Published on npm — installable with npm install arch-drift.",
      "Auto-detects architecture via init — captures what the codebase IS, not what you wish it was.",
      "Catches boundary violations, banned imports, file size thresholds, and config errors.",
      "Designed for AI-assisted codebases where agents write fast but don't know layer rules.",
    ],
    id: "arch-drift",
    links: [
      createProjectLink("npm package", "https://www.npmjs.com/package/arch-drift", "demo"),
      createProjectLink("Source", "https://github.com/omendivil/arch-drift", "repo"),
    ],
    oneLiner:
      "An npm CLI that prevents architecture drift — define layer boundaries, detect violations, enforce on every commit.",
    poster: posterArchDrift,
    presentation: "terminal",
    role: "Developer tooling design and implementation",
    story: [
      createStoryBeat(
        "ad-what",
        "What it is",
        "A CLI that catches architecture violations at commit time.",
        "arch-drift reads an architecture.yml config describing your project's layer boundaries, then checks imports for violations. It auto-detects your current architecture and enforces it going forward.",
      ),
      createStoryBeat(
        "ad-tech",
        "Technical lens",
        "Advisor, not cop — warnings first, errors when you're ready.",
        "The tool scans import graphs, validates config for dead paths, and reports boundary violations, banned imports, and threshold breaches. JSON output for CI, pretty output for humans.",
      ),
      createStoryBeat(
        "ad-why",
        "Why it matters",
        "AI agents write code fast but don't know your architecture.",
        "Traditional linters check syntax. arch-drift checks structure: should this file be importing from that module? It's the guardrail that makes AI-assisted development safe at scale.",
      ),
    ],
    status: "Published",
    summary:
      "arch-drift exists because AI coding agents write code fast but don't respect architecture boundaries. It captures your project's real import patterns, then enforces them on every commit.",
    tags: ["TypeScript", "CLI", "npm", "Developer Tools"],
    technicalThemes: ["static analysis", "import graph traversal", "architecture enforcement"],
    title: "arch-drift",
    videos: [],
    year: "2026",
  },
  {
    category: "Developer Tools",
    chapters: [],
    demo: createDemoGuide(
      "DX preview",
      "Glance at your tab bar, know what Claude is doing",
      "Claude Notifier hooks into Claude Code lifecycle events and translates them into visual tab states — permission needed (amber blink), done (green pulse), working (blue flash).",
    ),
    featured: true,
    gallery: [],
    highlights: [
      "Uses Claude Code hooks — shell commands that fire on lifecycle events, zero polling.",
      "Three notification modes: blink (tab flash), color (persistent tab tint), desktop (OS native).",
      "Zero background processes, zero network calls, zero dependencies beyond bash and jq.",
      "One-command install with automatic hook injection and Kitty config detection.",
    ],
    id: "claude-notifier",
    links: [
      createProjectLink("Source", "https://github.com/omendivil/claude-notifier", "repo"),
    ],
    oneLiner:
      "Visual tab indicators for Claude Code in Kitty terminal — glance at your tab bar and instantly know what Claude is doing.",
    poster: posterClaudeNotifier,
    presentation: "terminal",
    role: "Developer experience tooling",
    story: [
      createStoryBeat(
        "cn-what",
        "What it is",
        "A DX tool that makes Claude Code sessions visible at a glance.",
        "When running multiple Claude Code sessions, you need to know which ones need attention without switching tabs. Claude Notifier uses Kitty's remote control API to blink or color tabs based on Claude's state.",
      ),
      createStoryBeat(
        "cn-tech",
        "Technical lens",
        "Event-driven, not polling — hooks fire, tab updates, done.",
        "The architecture is deliberately minimal: Claude Code fires hook events, a bash script reads the JSON payload, and kitten @ commands update the tab. No daemon, no config server, no dependencies.",
      ),
      createStoryBeat(
        "cn-why",
        "Why it matters",
        "Developer tools should be invisible until needed.",
        "This project demonstrates the philosophy that the best DX tools don't add complexity — they surface information where you're already looking. The entire system is under 200 lines of bash.",
      ),
    ],
    status: "Published",
    summary:
      "Claude Notifier solves a real workflow problem: when you have 4 Claude Code sessions running, which ones need your attention? The answer is in your tab bar.",
    tags: ["Bash", "Claude Code", "Hooks", "Kitty"],
    technicalThemes: ["event-driven architecture", "terminal APIs", "developer experience"],
    title: "Claude Notifier",
    videos: [],
    year: "2026",
  },
  {
    category: "iOS",
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
    tags: ["SwiftUI", "OpenAI", "iOS", "Product Design"],
    technicalThemes: ["prompt classification", "Jikan API integration", "SwiftUI state handling"],
    title: "Anime AI",
    videos: [videoAnimeAiPrimary],
    year: "2025",
  },
  {
    category: "iOS",
    chapters: [],
    demo: createDemoGuide(
      "Chat system",
      "Real-time messaging with clean architecture",
      "Atlas Chat demonstrates consumer-grade messaging: optimistic sends, cursor-based pagination, secure token handling, and a UI that stays responsive under real conversation load.",
    ),
    featured: true,
    gallery: [],
    highlights: [
      "MVVM architecture with protocol-based dependency injection for testability.",
      "Keychain-stored auth tokens with proactive refresh — no expired session interruptions.",
      "Optimistic message sends with cursor-based pagination for smooth infinite scroll.",
      "Conversation CRUD with real-time updates and clean state management.",
    ],
    id: "atlas-chat",
    links: [
      createProjectLink("Source", "https://github.com/omendivil/AtlasChatApp", "repo"),
    ],
    oneLiner:
      "A SwiftUI chat app with MVVM architecture, Keychain auth, optimistic sends, and cursor-based pagination.",
    poster: posterAtlasChat,
    presentation: "device",
    role: "iOS architecture and real-time systems",
    story: [
      createStoryBeat(
        "atlas-what",
        "What it is",
        "A consumer-style chat app built with production patterns.",
        "Atlas Chat isn't a tutorial project — it uses the same patterns you'd find in a shipping messaging app: dependency injection, token lifecycle management, and optimistic UI updates.",
      ),
      createStoryBeat(
        "atlas-tech",
        "Technical lens",
        "The architecture is the product, not the chat bubbles.",
        "Protocol-based DI means every dependency is swappable for testing. Keychain storage with proactive token refresh eliminates expired-session UX. Cursor pagination keeps scroll performance flat regardless of conversation depth.",
      ),
      createStoryBeat(
        "atlas-why",
        "Why it matters",
        "It proves iOS architecture discipline on a complex surface.",
        "Chat apps expose every architectural weakness: state management under real-time updates, auth edge cases, pagination under scroll, and optimistic UI consistency. This project handles all of them cleanly.",
      ),
    ],
    status: "Prototype",
    summary:
      "Atlas Chat is a study in iOS architecture discipline applied to a demanding surface. The interesting work lives in the patterns — MVVM, protocol-based DI, Keychain auth, cursor pagination — not the chat bubbles.",
    tags: ["SwiftUI", "MVVM", "iOS", "Real-time"],
    technicalThemes: ["dependency injection", "token lifecycle", "cursor pagination", "optimistic UI"],
    title: "Atlas Chat",
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
    href: videoAnimeAiPrimary.url,
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

