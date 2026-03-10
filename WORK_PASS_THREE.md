# Work Plan Pass Three — Design Redesign

## Scope

Redesign the projects section from a functional showcase into a polished, minimal, poppy presentation inspired by Figma, Notion, SST.dev, OpenCode, and OpenTUI.

This pass builds on the stable codebase from pass two and the code cleanup that preceded it.

## What was completed before this pass

### Code cleanup (commit 2e45837)

1. Removed duplicate type fields: `Skill.label`/`Skill.note`, `MediaAsset.src`
2. Removed unused media assets: `alternateHeadshot`, `optionalPersonalImage`, `iconLinkedIn`
3. Removed `ProjectShowcaseVariant` type alias — use `ProjectPresentation` directly
4. Removed `getProjectPresentation` passthrough — use `project.presentation` directly
5. Deduplicated GA measurement ID logic (kept intentional server/client split)
6. Removed `forwardRef` on `ProjectVideoPlayer`
7. Removed empty `hooks/` and `analytics/` root directories

## Design direction

Clean, minimal, and poppy. The projects section is the centerpiece of the portfolio.

### Inspiration

1. Figma — hero-width preview, centered content, confident whitespace
2. Notion — subtle motion language, restrained UI chrome
3. SST.dev — text pill navigation, clean typography hierarchy
4. OpenCode/OpenTUI — HUD-style floating data overlays, cinematic stagger

### Principles

1. Video/poster is the star — everything else supports it
2. No unnecessary chrome — no browser dots, no fake status bars, no player controls
3. Motion is cinematic — staggered reveals that feel like a loading sequence
4. Containers are modular — outer height is fixed, inner content sizes independently
5. Page must not shift when switching between projects of different presentations
6. Mobile gets a reduced but intentional version, not a broken desktop layout

## Changes made in this pass

### featured-projects.tsx — Complete rewrite

Before: 2-column grid with text panel left, preview right, large project selector cards.

After:
1. Dynamic heading at top with AnimatePresence crossfade on project switch
2. Full-width `ProjectLivePreview` in the middle
3. Small text pills at bottom with `layoutId` animated active indicator
4. "All {count}" drawer trigger with divider
5. Removed `onOpenProject` prop, added `drawerTriggerRef`, `onOpenDrawer`, `projectCount`

### project-live-preview.tsx — Major rework

Before: Preview with bottom dark bar overlay and top-left badge pills.

After:
1. HUD-style floating overlays with staggered slide-in animations
   - Top left: status line (delay 0.3s)
   - Top right: tech themes stacked vertically (delay 0.6s+)
   - Left side: two highlights centered to device (delay 1.2s+, desktop only)
   - Bottom: single highlight for mobile (delay 1.0s)
2. Fixed-height stage: `h-[26rem] sm:h-[34rem]`
3. Absolute-positioned content inside stage for decoupled sizing
4. Darker background: `bg-[#141210]`
5. Warmer inner gradient: `rgba(160,168,164,0.82)` to `rgba(148,136,116,0.72)`
6. Video `key={previewVideo.id}` forces remount on project switch
7. Removed bottom bar, removed top-left badges

### project-showcase-frame.tsx — Simplified

Device variant:
1. Collapsed two-div structure (gradient shell + bezel) into single div
2. Removed all borders (outer gradient, bezel border, screen border)
3. Removed fake phone status bar (time, dots, battery)
4. Smaller centered Dynamic Island pill: `h-[1.4rem] w-[5.5rem]`
5. Thicker bezel: `p-2.5` with `rounded-[2.3rem]`
6. Side buttons remain as subtle accents

Canvas variant:
1. Removed browser chrome entirely (dots, title bar, fake URL)
2. Now a clean thin black border with landscape aspect ratio `16/10`
3. `max-w-[28rem]`, `rounded-[1.2rem]` outer, `rounded-[0.8rem]` inner

### projects-section-client.tsx

1. Removed "Curated showcase" surface card with metadata boxes
2. Removed stage behavior, panel behavior, browse button descriptions
3. Passes `drawerTriggerRef`, `onOpenDrawer`, `projectCount` to `FeaturedProjects`

### projects-section.tsx

1. Removed static `SectionHeading` — heading is now dynamic inside `FeaturedProjects`

### project-peek-panel.tsx

1. Updated device `max-w` from `max-w-[21rem]` to `max-w-[22rem]` for consistency with showcase frame

### data/site.ts

1. Updated Frameworks App highlight #2 to: "Built with reusable SwiftUI composition and layered browse states for fast scanning."

## Architecture decisions

### Fixed-height stage with absolute content

The outer preview container uses a fixed height (`h-[26rem] sm:h-[34rem]`) and the inner content (phone or canvas frame) is absolutely positioned with `inset-0 flex items-center justify-center`. This means:

1. Switching between a tall phone and a shorter canvas frame does not shift the page
2. The frame sizes itself via its own `max-w` and `aspect-ratio`, independent of the container
3. HUD overlays are positioned relative to the inner gradient container, not the frame

### Video remounting

The `<video>` element uses `key={previewVideo.id}` so React destroys and recreates it when switching projects. Without this, changing `<source src>` alone does not trigger the browser to reload the video.

### HUD animation pattern

All HUD overlays share a common pattern:
- `hudInitial` / `hudAnimate` for vertical reveals
- `hudSlideIn` / `hudSlideAnimate` for horizontal reveals
- `hudExit` for fast fade-out on project switch
- `hudTransition(delay)` for staggered timing
- All respect `reduceMotion` preference

## Current state

### Committed (through a8af1ab)
- Featured projects rewrite
- HUD overlays
- Phone frame cleanup (borders, status bar, Dynamic Island)
- Video switching fix

### Unstaged
- Fixed-height container with absolute positioning (page shift fix)
- Canvas variant rework (thin border, 16/10 aspect, no browser chrome)
- Peek panel max-width consistency fix

## What remains

1. Commit unstaged changes
2. Continue micro-adjustments to visual polish
3. Review dark mode appearance with new design language
4. Test mobile layout thoroughly across all projects
5. Consider whether other sections need visual alignment with new direction
6. Performance check — ensure video loading remains lazy and poster-first for non-active projects
