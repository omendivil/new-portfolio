# Portfolio Redesign — Living Portfolio

**Date**: 2026-03-14
**Status**: Draft
**Stack**: Next.js 16, React 19, Tailwind v4, Framer Motion 12, next-themes

## Overview

Full redesign of Omar Mendivil's portfolio from a section-card-based layout to an ambient, interactive experience inspired by Figma, Webflow, and Cursor. The portfolio IS the proof of skill — every section has a "wow" moment.

**Design philosophy**: Nothing static. The page feels alive. Every interaction earns its place. Performance is non-negotiable — find the fastest implementation, never remove the effect.

## Page Structure

```
Build Log (first visit only, 3-4s) → dissolves into:
1. Hero — Diff View (permanent)
2. Projects — Infinite Canvas
3. Code Editor (replaces Skills)
4. Experience — Swipeable Card Stack
5. Footer — Minimal links + availability
```

**Removed**: Section card wrappers (`section-surface`), Skills section (replaced by Code Editor), Writing section (YouTube links moved into projects), Contact form (replaced by footer).

## Ambient Background Layer

A global `AmbientBackground` component in `layout.tsx` provides 4 ambient effects across the entire page.

### Noise Grain
- SVG `feTurbulence` data URI as `background-image` on a `position: fixed` div
- Light mode: black noise, 2.5% opacity, `mix-blend-mode: multiply`
- Dark mode: white noise (via `filter: invert(1)`), 4% opacity, `mix-blend-mode: soft-light`
- Zero performance cost. Always on, including `prefers-reduced-motion`.

### Aurora Blobs
- 2-3 large `radial-gradient` divs with `filter: blur(var(--aurora-blur))`, positioned behind the hero
- Slow drift animation (20-30s loops) via Framer Motion `animate` on `x`/`y`
- Light mode: warm desaturated pastels at 5-8% opacity, blur 140px
- Dark mode: teal/purple at 12-15% opacity, blur 100px
- Mobile: reduce to 1 blob, disable animation (static position)
- `prefers-reduced-motion`: show static, no animation

### Cursor Glow (desktop only)
- Radial gradient follows mouse via CSS custom properties (`--glow-x`, `--glow-y`)
- Set in a `mousemove` listener with `{ passive: true }`
- Disabled on touch devices via `(pointer: fine)` media query
- Light mode: `rgba(45, 111, 102, 0.06)`. Dark mode: `rgba(138, 201, 189, 0.08)`
- `prefers-reduced-motion`: disabled entirely

### Scroll-Linked Color Wash
- Fixed-position gradient div whose color shifts based on the active section
- Uses Framer Motion `useScroll` + section detection via `getBoundingClientRect`
- Each section has a CSS custom property pair (light/dark) for its wash color
- Transition: `transition: background 1s ease-out` in CSS
- Mobile: simplified or disabled
- `prefers-reduced-motion`: disabled

### CSS Variables
All ambient colors defined in `globals.css` under `:root` and `.dark` blocks. Registered in `@theme inline` for Tailwind access.

### Component Architecture
```
components/ambient/
  ambient-background.tsx   — wrapper, manages reduced-motion
  noise-overlay.tsx        — noise grain
  aurora-blobs.tsx         — hero blobs
  cursor-glow.tsx          — desktop cursor follow
  scroll-wash.tsx          — scroll-linked color
```

Mounted in `app/layout.tsx` inside `ThemeProvider`, before `{children}`.

---

## Section 1: Hero — Build Log + Diff View

### Build Log (first visit only)
- Full-viewport terminal overlay with dark background (hardcoded dark, ignores theme)
- Traffic light dots in title bar, `~/portfolio` path
- 4-5 build steps, each typed character-by-character via `setTimeout` chain (35ms/char with random jitter)
- Results appear instantly after typing completes (e.g., "5 found", "done ✓")
- Green `$` prompt, green cursor, monospace font
- Total duration: ~3-4 seconds
- On completion: terminal scales down to 96%, drifts up 20px, blurs 6px, fades out (0.5s)
- `sessionStorage` key `portfolio-build-seen` prevents replay. `try/catch` for private browsing.
- `prefers-reduced-motion`: skip entirely, show diff view immediately

### Diff View (permanent hero)
- GitHub-style unified diff of `about-omar.ts`
- File header with filename and changes badge (`-12 +18`)
- ~13-15 lines of TypeScript with:
  - Context lines (neutral background)
  - Deletion lines (red background): generic dev descriptions being removed
  - Addition lines (green background): Omar's specific descriptions being added
  - Final line: `export default OmarMendivil;`
- Syntax highlighting via manual `<span>` tokens (no library) — 7 token types with CSS custom properties for colors
- Lines stagger-animate in via `staggerChildren: 0.06` (total ~1.4s)
- Each line: `opacity: 0, x: -8` → `opacity: 1, x: 0` with `motionEase`
- "Merge & continue ↓" button at bottom scrolls to projects
- Light mode: solid pastel backgrounds (`#e6ffec`, `#ffebe9`). Dark mode: alpha-based (`rgba(63,185,80,0.15)`)
- Mobile: hide dual line-number columns, reduce font to 11px, `overflow-x: auto` for long lines

### Component Architecture
```
HeroDiffHero ("use client")
  useFirstVisit() → boolean
  useReducedMotion() → boolean
  <div relative>
    <DiffView startAnimation={!showTerminal} />
    <AnimatePresence>
      {showTerminal && <BuildTerminal onComplete={...} />}
    </AnimatePresence>
  </div>
```

Data: `DIFF_LINES` array of `{ type, lineNumOld?, lineNumNew?, tokens: Token[], plainText }`.

---

## Section 2: Projects — Infinite Canvas

### Desktop: Full Interactive Canvas
A pannable, zoomable canvas (like Figma/Excalidraw) containing project frames positioned at fixed coordinates.

**Core architecture:**
- Three-layer DOM: viewport (overflow hidden) → dot grid background → single transformed wrapper div
- Transform: `translate(${x}px, ${y}px) scale(${s})` with `transformOrigin: '0 0'`
- State via `useMotionValue` (not React state) for 60fps pan/zoom without re-renders
- `useMotionTemplate` for zero-overhead transform string interpolation

**Pan:** Pointer drag on the canvas. `setPointerCapture` for reliable tracking. Delta applied to `x`/`y` motion values.

**Zoom:** Scroll wheel with zoom-to-cursor math:
```
newOffsetX = cursorX - ((cursorX - offsetX) / scale) * newScale
newOffsetY = cursorY - ((cursorY - offsetY) / scale) * newScale
```
Multiplicative zooming: `scale * Math.exp(-deltaY * 0.001)`. Range: 0.15–3.0.

**Dot grid background:**
- CSS `radial-gradient` on the viewport element (NOT the transformed wrapper)
- `backgroundSize` and `backgroundPosition` computed from `scale`, `offsetX`, `offsetY`
- Scales and moves with the canvas naturally

**Project frames on the canvas:**
- Each project is `position: absolute` in canvas coordinates
- Phone frames for iOS projects, canvas/browser frames for web projects
- Videos auto-play when the frame is near the viewport center
- Project info cards float near each frame (title, tech tags, YouTube link)
- Clicking a pill in the selector animates the canvas to center that project (spring physics via `animate()`)

**Iframe embedding (web projects):**
- Render iframe at native resolution (e.g., 1440x900) with `transform: scale(0.25)` and `transformOrigin: '0 0'`
- Only load iframe for the focused project, show screenshots for others
- Fallback: "View Live" button opens in new tab
- `sandbox="allow-scripts allow-same-origin"` for security

**Touch handling:**
- `touch-action: none` on the canvas surface
- `overscroll-behavior: contain` on the viewport
- Pointer Events API for unified mouse/touch handling

### Mobile: Horizontal Snap Gallery + Optional Full-Screen Canvas
- Inline: horizontal scroll gallery with `scroll-snap-type: x mandatory`, each card at 85vw
- Each card shows project poster, title, tech tags, links
- Swipe horizontally to browse, vertical scroll passes through normally
- "Explore canvas" button opens the full canvas as a `position: fixed` overlay
- Overlay uses `useModalBehavior` for scroll lock, full gesture support
- Close button in corner

### Canvas Section Layout
```
ProjectsCanvasSection ("use client")
  PillSelector (teleport to project on canvas)
  CanvasViewport (desktop: interactive canvas, mobile: hidden)
    DotGridBackground
    motion.div style={{ transform }}
      CanvasProjectFrame × N
        DeviceFrame or CanvasFrame
          VideoPlayer
        ProjectInfoCard
  MobileGallery (mobile only: horizontal snap scroll)
    ProjectCard × N
```

### Project Data Extension
Add to `Project` type:
- `canvasX: number` — X position on canvas
- `canvasY: number` — Y position on canvas
- `ambientColors: { primary, secondary, glow }` — per-project color palette
- `youtubeUrl?: string` — YouTube walkthrough link

---

## Section 3: Code Editor (replaces Skills)

### Component
A styled code editor that types out real code snippets from Omar's projects, auto-cycling through 5 tabs.

**Snippets (locked in):**
1. `AnimatedText.tsx` — TypeScript/React — Groundworks Website
2. `MessageRow.swift` — Swift/SwiftUI — Atlas Chat App
3. `List.js` — JavaScript/React — Anime YouTube App
4. `cache.swift` — Swift — Appetizer App
5. `config.sh` — Bash — Claude Notifier

**Typing engine:**
- Pre-tokenized arrays: `CodeLine = CodeToken[]` where `CodeToken = { text, type }`
- Helper functions (`kw`, `str`, `fn`, `typ`, etc.) for concise token authoring
- Single `charIndex` counter incremented via `setTimeout` chain (15ms/char)
- `CompletedLine` wrapped in `React.memo` — only the current typing line re-renders per tick

**Editor chrome:**
- One Dark Pro color scheme (exact hex values from theme)
- Tab bar with `layoutId` animated indicator (matches project pill pattern)
- Line numbers shown upfront, current line highlighted
- Cursor: inline `<span>`, solid while typing, blinks (`step-end`) when done
- Neon aura glow border: `box-shadow` with accent blue (`#528bff`)

**Auto-advance:**
- After typing completes, a progress bar fills over 4s (`motion.div` with `key` reset)
- `onAnimationComplete` triggers tab advance
- Manual tab click resets timer
- Loops through all 5 tabs

**Section label:** "from my projects" above editor, project name + filename below progress bar.

**Mobile:** Font size 12px, `overflow-x: auto`, auto-scroll to cursor, faster typing (10ms/char).

**`prefers-reduced-motion`:** Show all code immediately, no typing animation. Progress bar still advances.

### Component Architecture
```
components/code-editor/
  code-editor-section.tsx     — section wrapper
  code-editor-animation.tsx   — main component, state management
  tab-bar.tsx                 — tabs with layoutId
  typed-code.tsx              — typing renderer
  line-numbers.tsx            — line number column
  progress-bar.tsx            — auto-advance bar
  use-typing-animation.ts    — charIndex timer hook
  use-tab-auto-advance.ts    — tab cycling hook
data/
  code-snippets.ts            — 5 pre-tokenized snippets
```

---

## Section 4: Experience — Swipeable Card Stack

### Component
3 experience cards stacked on top of each other. Drag/swipe the top card to dismiss, revealing the next.

**Entries:**
1. **Apple — Perception Triage Engineer** (Career Experience Program, 2025). Stat: "Top 10%"
2. **Aer Digital — Web Developer** (2022–2025). Stat: "Client sites shipped"
3. **Independent Developer** (2024–now). Stat: "6+ projects"

**Stack layout:**
- All cards `position: absolute` in a relative container
- Top card: `y: 0, scale: 1.0, zIndex: 30`
- Second: `y: 8px, scale: 0.97, zIndex: 20`
- Third: `y: 16px, scale: 0.94, opacity: 0.8, zIndex: 10`

**Drag gesture:**
- `drag="x"` with `dragSnapToOrigin` and `dragElastic={0.85}`
- Dismiss threshold: `|offset.x| > 100px` OR `|velocity.x| > 500px/s`
- Dismiss animation: `x: direction * screenWidth * 1.2, rotate: 18deg, opacity: 0` (0.35s tween)
- Live drag rotation: `useTransform(x, [-200, 200], [-12, 12])`

**Next card promotion:**
- Spring: `stiffness: 300, damping: 25, mass: 0.8`
- Cards spring from stacked position to new position

**Rewind:** "Back" button + ArrowUp/Backspace. Card flies back from off-screen with `stiffness: 200, damping: 28`.

**Wiggle hint:** Top card does `x: [0, -6, 6, -3, 3, 0]` after 1.5s delay. Only once.

**Per-card themes:** Each card has a unique gradient background and accent color.

**State:** `useReducer` with actions: DISMISS, REWIND, ANIMATION_DONE, WIGGLE_DONE. Dismissed cards stay mounted (off-screen) for instant rewind.

**Counter:** "1/3" with dot indicators below the stack.

**Accessibility:** Arrow keys for navigation, `aria-live` announcements, `aria-roledescription="card stack"`.

**`prefers-reduced-motion`:** Render as a simple vertical list, no swipe mechanics.

**Mobile:** Touch drag works naturally via Pointer Events. `dragElastic: 0.85` gives 1:1 feel.

---

## Section 5: Footer

### Layout
Centered, compact. No form.

- Availability badge: green pulsing dot + "Open to frontend & iOS roles"
- "Let's talk." heading
- "Arizona · Remote-friendly" subtext
- Link row: Copy email (with green flash + checkmark feedback), LinkedIn, GitHub, Groundwork Studios
- Built-with credit: "Built with Next.js, Tailwind, and Framer Motion"

### Email Copy Interaction
On click: button background flashes green, text changes to "✓ Copied", resets after 1.8s. Reuses existing clipboard logic from `contact-action-buttons.tsx`.

---

## Navigation

### Sticky pill nav (refined)
- Keep current structure: Home, Projects, Experience, Contact + theme toggle
- Remove Skills and Writing nav items (sections removed/replaced)
- Backdrop blur with theme-specific tuning:
  - Light: `rgba(244, 241, 235, 0.82)`, `saturate(1.2)`
  - Dark: `rgba(17, 16, 13, 0.78)`, `saturate(1.6)`
- Thin top edge shadow in light mode: `0 1px 0 rgba(0,0,0,0.04)`

---

## Light Mode Strategy

Light mode is NOT inverted dark mode. Key principles:
- Ambient effects at 40-60% of dark mode opacity
- Shadows replace glows for depth
- Warm cream background (`#f4f1eb`) stays
- Noise grain uses `multiply` blend (paper-like)
- Aurora blobs use warm desaturated pastels
- The terminal in the build log stays dark regardless of theme

---

## Performance Budget

| Effect | Desktop | Mobile | GPU Load |
|---|---|---|---|
| Noise grain | Always | Always | Negligible |
| Aurora blobs | Animated | Static | Low (dark), negligible (static) |
| Cursor glow | Always | Disabled | Low |
| Scroll wash | Always | Simplified | Negligible |
| Canvas pan/zoom | `useMotionValue` (no re-renders) | Snap gallery (CSS) | Low |
| Code typing | `setTimeout` + memo | Faster speed | Low |
| Card swipe | `drag` + `useAnimate` | Same | Low |
| Diff stagger | 18 `motion.div` | Same | Low |

All animations use `transform` and `opacity` only (compositor properties). No `filter`, `width`, or `layout` animations during interactions.

---

## Files to Create

```
components/
  ambient/
    ambient-background.tsx
    noise-overlay.tsx
    aurora-blobs.tsx
    cursor-glow.tsx
    scroll-wash.tsx
  hero/
    hero-diff.tsx
    build-terminal.tsx
    diff-view.tsx
    diff-data.ts
  projects/
    projects-canvas-section.tsx
    canvas-viewport.tsx
    canvas-controls.ts (useCanvasControls hook)
    dot-grid-background.tsx
    canvas-project-frame.tsx
    mobile-gallery.tsx
  code-editor/
    code-editor-section.tsx
    code-editor-animation.tsx
    tab-bar.tsx
    typed-code.tsx
    line-numbers.tsx
    progress-bar.tsx
    use-typing-animation.ts
    use-tab-auto-advance.ts
  experience/
    experience-card-stack.tsx
  footer/
    site-footer.tsx
data/
  code-snippets.ts
```

## Files to Modify

- `app/layout.tsx` — add `AmbientBackground`
- `app/page.tsx` / `components/home/home-page.tsx` — update section order
- `data/types.ts` — add `CodeToken`, `CodeSnippet`, canvas position fields to `Project`
- `data/site.ts` — add canvas coordinates, ambient colors, YouTube URLs per project
- `styles/globals.css` — add ambient CSS variables, diff colors, dot grid utility, remove `section-surface` usage
- `components/navigation/sticky-nav.tsx` — remove Skills/Writing links, refine backdrop

## Files to Delete

- `components/sections/skills-section.tsx`
- `components/sections/writing-section.tsx`
- `components/sections/contact-section.tsx`
- `components/sections/hero-section.tsx`
- `components/projects/animated-border-glow.tsx` (already deleted)

---

## Implementation Order

1. **Ambient layer** — noise, aurora, cursor glow (foundation for everything)
2. **Hero** — diff view + build log (first thing visitors see)
3. **Code Editor** — typing animation (replaces skills, self-contained)
4. **Experience** — card stack (self-contained)
5. **Footer** — minimal (quick)
6. **Projects canvas** — most complex, built last when everything else is stable
7. **Polish** — light mode tuning, mobile QA, performance audit
