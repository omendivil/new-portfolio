# Portfolio Project — CLAUDE.md

## Stack
- Next.js 16 (App Router), React 19, TypeScript 5
- Tailwind v4 (`@tailwindcss/postcss`), Framer Motion 12, next-themes, lucide-react
- Vercel Analytics + optional Google Analytics
- No test framework — verification is `npm run lint` + `npm run build`
- `npm run build` requires network access for Google Fonts (approved exception)

## Architecture

### Single-page, section-based
All content lives on one page (`app/page.tsx` → `HomePage`). Sections: hero, projects, skills, experience, writing, contact.

### Data-driven
- Content source of truth: `data/site.ts` (exports `siteContent`)
- Types: `data/types.ts`
- Never hardcode content in components — pull from `siteContent`
- Contact info comes from env vars (`NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`)

### Component patterns
- **SectionShell** + **SectionHeading**: Every section wraps in `SectionShell` with an `id`, uses `SectionHeading` for eyebrow/title/description
- **FadeIn**: The only reveal primitive. Do not create alternatives or use `SectionReveal`
- **useModalBehavior**: Shared hook for focus trap + scroll lock (drawer & peek panel)
- Components are server components by default; client state isolated to leaf components with `"use client"`

### Motion
- All presets centralized in `lib/motion.ts`
- Primary easing: `motionEase = [0.16, 1, 0.3, 1]`
- Use `useMotionPreference()` — always respect `prefers-reduced-motion`
- HUD overlays use staggered cinematic delays (0.3s–2.2s)

### Projects section (complex — read before editing)
- Full-width featured showcase with active project state + pill selector
- `ProjectLivePreview`: fixed-height stage (`h-[26rem] sm:h-[34rem]`), absolute-positioned content, HUD overlays
- Device frame: single div, small Dynamic Island, no fake status bar
- Canvas frame: thin black border, 16/10 aspect, no browser chrome
- Video remounted on project switch via `key={previewVideo.id}`
- Supporting UI: `ProjectsBrowseDrawer` (lightweight), `ProjectPeekPanel` (deep detail)

### Styling
- CSS custom properties in `styles/globals.css` for light/dark themes
- Component classes: `preview-outer-shell`, `preview-inner-stage`, `section-surface`, `surface-card`, `surface-pill`
- Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for class composition

### Analytics
- `lib/analytics.ts` for event tracking
- Tracked events: project open/close, video play, chapter click, theme toggle, outbound links, contact copy

## Canonical field names
- `MediaAsset`: `alt` + `url` (never `src`)
- `Skill`: `name` + `summary` (never `label`/`note`)
- Use `project.presentation` directly (no `getProjectPresentation`, no `ProjectShowcaseVariant` alias)

## Do not reintroduce
- `SectionReveal` component — use `FadeIn`
- `ProjectShowcaseVariant` type alias
- `forwardRef` on `ProjectVideoPlayer`
- Browser chrome on canvas frame (dots, title bar, fake URL)
- Fake phone status bar (time, dots, battery)
- Bottom dark bar overlay on live preview
- "Curated showcase" metadata card in projects section
- Static `SectionHeading` in projects section
- Empty `hooks/` or `analytics/` root directories
- `alternateHeadshot`, `optionalPersonalImage` media assets
- `iconLinkedIn` contact icon

## Process
- Follow `REVIEW_PROCESS.md` for major changes (issue-by-issue workflow)
- Check `AGENT_ISSUES.md` for prior resolutions before debugging recurring issues
- `WORK_PASS_THREE.md` has full design context for the current projects section
- Multi-agent work: disjoint file ownership, reviewer stays read-only

## Remote media
- Videos/images hosted on Cloudflare R2: `pub-8845c4797eee47adbbeb7077d3509851.r2.dev`
- Configured in `next.config.ts` under `images.remotePatterns`

## Reference images
- `public/claude_assests/` — reference screenshots for design discussions
- `cs/` subfolder = current site screenshots
