# New Portfolio Agent Instructions

## Goal

Build a brand new production grade portfolio for Omar Mendivil using a Notion style layout and a Notion style motion vibe.

## Current working phase

The portfolio is no longer in first-build mode.
The overall structure is considered stable enough to refine rather than replace.

From this point forward, the primary mode is style refinement and interaction polish.
Agents should also follow `REVIEW_PROCESS.md` for major-change workflow and review expectations.

What this means for agents

1. Prefer improving the current implementation over re-architecting it.
2. Styling, spacing, motion, hierarchy, storytelling, and project presentation may evolve more freely than in earlier passes.
3. Do not assume that a visual or interaction change should force a structural rewrite.
4. Keep the core guardrails intact unless the user explicitly approves a change to them.
5. If a requested design change conflicts with an older rule, surface the conflict and get approval before breaking the rule.

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

## Change workflow

Agents are expected to work issue by issue, not by broad uncontrolled rewrites.

1. Before a major change, restate the issue being solved.
2. Get approval before implementing that major change.
3. Make one major change at a time whenever possible.
4. Minor supporting fixes may be bundled into the same approved pass.
5. After each major change, run a read-only review pass before starting the next issue.

Examples of a major change

1. Redesigning the featured projects stage
2. Reworking project detail behavior
3. Changing the contact section structure
4. Reworking motion patterns across a section

## Mandatory review pass

Every major change must be followed by a read-only guardrail review.

The guardrail review must check:

1. architecture drift
2. dead code left behind by abandoned ideas
3. duplicated logic or duplicated data fields
4. performance regressions
5. accessibility regressions
6. security basics
7. typed data layer compliance
8. responsiveness
9. whether the change solved only the approved issue or spilled into unrelated rewrites

If a dedicated reviewer agent is available, use it.
If not, the lead agent must still perform the same review checklist before moving on.

## Security review basics

Even though this is a portfolio site, agents must still review for basic security and safety issues during major passes.

Check for:

1. hardcoded secrets, phone numbers, or email addresses in tracked files
2. unsafe external link behavior
3. unnecessary client-side exposure of environment values
4. untrusted HTML injection or risky rendering patterns
5. accidental broadening of third-party script usage
6. avoidable media or asset loading behavior that exposes unnecessary risk or cost

## Agent coordination

When multiple agents are used:

1. Assign disjoint file ownership whenever possible.
2. Do not overwrite another agent's in-progress area.
3. Reviewer agents must stay read-only unless explicitly told to perform a minimal cleanup pass.
4. If an agent is interrupted, errors, or collides with another agent's work, that incident must be reported in the next review output.
5. Exploration and cleanup are both valid outcomes. If an idea is abandoned, reviewers must check whether code or data should be removed.

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
