# New Portfolio Agent Instructions

## Goal

Build a brand new production grade portfolio for Omar Mendivil using a Notion style layout and a Notion style motion vibe.

## Stack

1. Next.js App Router
2. TypeScript
3. Tailwind CSS
4. Framer Motion
5. next themes for light and dark mode
6. lucide react for icons

Do not introduce additional UI libraries unless explicitly requested.

## Product requirements

1. Single page home at route slash
2. Home is section based with anchor ids and sticky navigation
3. Light mode and dark mode supported with a toggle
4. Content is data driven from a single typed source
5. Projects browsing must be scalable and Notion like.
   Show a curated featured view by default and provide a structured browse view via drawer or panel with search and filters.
   Default featured view must use posters only.
   Video must load only inside the peek panel after a project is opened.
6. Browse view should be lightweight rows plus search and category filters.
7. Clicking a project opens a right side peek panel with details and demo media
8. Animations are subtle, consistent, and Notion like
9. Accessibility basics required
   semantic headings
   focus visible
   keyboard navigation
   reduced motion support
10. Performance matters
    lazy load video
    do not preload all media
    avoid heavy client bundles

## Contact info and repo safety

1. Do not hardcode phone or email in any committed file
2. Phone and email must come from `.env.local` during development
3. `.env.local` must remain git ignored
4. For any value that must display in the UI, it may be sourced from `NEXT_PUBLIC_` env vars
5. Prefer showing email and using a contact form
6. Prefer not showing phone unless explicitly requested

## Design constraints

1. Minimal surfaces, soft borders, restrained shadows
2. Clean typographic hierarchy
3. No loud gradients
4. Use CSS variables for theme tokens
5. Keep spacing generous
6. No personal hobby sections or content

## Content scope

Include these sections on the home page

1. Hero
2. Projects
3. Skills
4. Experience
5. Writing and videos
6. Contact

Project detail routes are optional, but home is the main experience.

## Code standards

1. No separate desktop and mobile component trees
2. Avoid duplicated code
3. Components must be small and reusable
4. Prefer server components by default
5. Mark only necessary components as client
6. Use strict TypeScript
7. Keep naming consistent and predictable

## Deliverable format for agents

When implementing a task

1. Provide a short file plan listing files to add or modify
2. Provide code per file with full contents
3. Explain any follow up steps needed to run or verify

## Testing checklist before handing off

1. `npm run lint` passes
2. `npm run build` passes
3. Light and dark themes both look correct
4. Keyboard navigation works for nav and project panel
5. Reduced motion mode behaves reasonably
6. Projects open and close panel correctly
7. No hardcoded contact info in tracked files
