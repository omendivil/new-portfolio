# Agent Issue Log

## Purpose

This file records agent-facing conflicts, clarifications, and resolutions so future agents can review past decisions before making changes.

Use this file when:

1. a recurring conflict shows up between older docs and current direction
2. a process issue appears while coordinating multiple agents
3. a verification exception needs to be remembered
4. a cleanup rule or fallback process is clarified

## Active resolutions

### 2026-03-08: Featured projects contract updated

Issue:
Older docs required poster-only featured projects and video only after opening the peek panel.
The approved direction shifted to a single active live showcase on the home stage.

Resolution:

1. The featured area may use one active live showcase at a time.
2. Only the active featured project may load preview media.
3. Non-active featured projects must stay lightweight and poster-first.
4. The drawer must remain lightweight and should not load demo video.
5. The peek panel remains the deeper case-study surface.

Reference:
[AGENTS.md](/Users/omendivil/Dev/new-portfolio/AGENTS.md)
[WORK.md](/Users/omendivil/Dev/new-portfolio/WORK.md)
[WORK_PASS_TWO.md](/Users/omendivil/Dev/new-portfolio/WORK_PASS_TWO.md)

### 2026-03-08: Google Fonts build verification exception

Issue:
`npm run build` fails in restricted environments because [app/layout.tsx](/Users/omendivil/Dev/new-portfolio/app/layout.tsx) uses `next/font/google`, which fetches fonts during build.

Resolution:

1. Build verification may use approved network access only for Google font fetching.
2. This does not grant broader network access for unrelated tasks.
3. If the font strategy changes later, update this entry.

Reference:
[REVIEW_PROCESS.md](/Users/omendivil/Dev/new-portfolio/REVIEW_PROCESS.md)

### 2026-03-08: Reviewer-agent stalls on narrow cleanup passes

Issue:
Multiple read-only reviewer agents stalled or were interrupted during narrow cleanup reviews.

Resolution:

1. The lead agent must still perform a direct local review for every pass.
2. On narrow cleanup passes, reviewer agents should receive only the current issue, changed files, and explicit review scope.
3. Avoid full-context forking on narrow cleanup or single-file passes.
4. Prefer one longer wait over repeated short waits.
5. Reviewer agents are still useful for broader architectural reviews.
6. Close completed agents promptly to avoid thread-limit failures.
7. If a reviewer still stalls, close it, log the incident, and continue with the local verified result.
8. Report stalled or interrupted reviewer runs in the `Agent incidents` section.

Reference:
[REVIEW_PROCESS.md](/Users/omendivil/Dev/new-portfolio/REVIEW_PROCESS.md)

### 2026-03-08: Projects modal behavior must stay single-surface

Issue:
The drawer and peek panel were able to behave like overlapping modal surfaces.

Resolution:

1. Opening a project from the drawer must close the drawer first.
2. Active modal surfaces must trap focus.
3. Active modal surfaces must lock body scroll while open.

Reference:
[projects-section.tsx](/Users/omendivil/Dev/new-portfolio/components/sections/projects-section.tsx)
[use-modal-behavior.ts](/Users/omendivil/Dev/new-portfolio/lib/use-modal-behavior.ts)

### 2026-03-08: Project media schema aliases collapsed to canonical fields

Issue:
The project data model carried duplicate names for the same media concepts, which made the typed layer harder to trust and easier to drift.

Resolution:

1. `ProjectVideo` now uses `label`, `poster`, and `url` as the canonical fields.
2. `ProjectChapter` now uses `label`, `atSeconds`, and `videoId` as the canonical fields.
3. Projects no longer keep duplicate `media` and `slug` fields when `videos` and `id` already provide the same identity.
4. Follow-on component usage must read the canonical fields only.

Reference:
[data/types.ts](/Users/omendivil/Dev/new-portfolio/data/types.ts)
[data/site.ts](/Users/omendivil/Dev/new-portfolio/data/site.ts)

### 2026-03-08: Site and experience data should not carry dead duplicate fields

Issue:
The site content layer still carried duplicate fields that the app did not use, which made the typed source look broader than the actual UI contract.

Resolution:

1. `navSections` is the canonical site navigation list.
2. Navigation should not be duplicated inside `siteContent` while the top-level `navSections` export remains the live source.
3. Experience entries should keep `bullets` only unless a distinct second field is actually used by the UI.

Reference:
[data/types.ts](/Users/omendivil/Dev/new-portfolio/data/types.ts)
[data/site.ts](/Users/omendivil/Dev/new-portfolio/data/site.ts)

### 2026-03-08: Section and reveal primitives should stay canonical

Issue:
Section surface styling and reveal behavior had drifted into parallel implementations, which made future cleanup and styling changes harder to reason about.

Resolution:

1. `section-surface` is the shared section chrome utility for both `SectionShell` and raw section wrappers.
2. `FadeIn` is the underlying reveal primitive.
3. `SectionReveal` should not be reintroduced while `FadeIn` remains the canonical reveal primitive.
4. Dead shared-motion exports should be removed instead of left as alternate APIs.

Reference:
[styles/globals.css](/Users/omendivil/Dev/new-portfolio/styles/globals.css)
[components/sections/section-shell.tsx](/Users/omendivil/Dev/new-portfolio/components/sections/section-shell.tsx)
[components/motion/fade-in.tsx](/Users/omendivil/Dev/new-portfolio/components/motion/fade-in.tsx)
[components/motion/section-reveal.tsx](/Users/omendivil/Dev/new-portfolio/components/motion/section-reveal.tsx)
[lib/motion.ts](/Users/omendivil/Dev/new-portfolio/lib/motion.ts)

### 2026-03-08: Contact section should stay mostly server-rendered

Issue:
The contact section had grown into a broad client component even though most of its content is static and only the copy and outbound actions require client behavior.

Resolution:

1. The section content should stay server-rendered by default.
2. Copy and outbound tracking behavior should live in a small client action island.
3. Future contact styling passes should avoid widening the client boundary unless the interaction truly requires it.

Reference:
[components/sections/contact-section.tsx](/Users/omendivil/Dev/new-portfolio/components/sections/contact-section.tsx)
[components/contact/contact-action-buttons.tsx](/Users/omendivil/Dev/new-portfolio/components/contact/contact-action-buttons.tsx)
