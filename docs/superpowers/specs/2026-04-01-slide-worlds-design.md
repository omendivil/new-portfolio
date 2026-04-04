# Slide-Based World Navigation

## Overview
Transform the portfolio from sections-on-a-page into a slide deck of full-screen worlds. Each section occupies 100vh with scroll-snap, terminal command transitions between sections, and exit actions to guide the user through the story.

## Scroll Architecture

### Snap behavior
- Scroll container: `scroll-snap-type: y mandatory`
- Each section: `scroll-snap-align: start`, `min-height: 100vh`
- Sections overflow internally if content exceeds viewport (experience themes, projects canvas)

### Section order
1. **Hero** — Webflow gradient + diff view (existing, unchanged)
2. **Projects** — canvas viewport + pills (background TBD in future pass)
3. **Languages/Code Editor** — typing animation + tabs (background TBD)
4. **Experience** — theme switcher with 4 themes (background TBD)
5. **Contact/Footer** — "Let's talk" + links (background TBD)

### Navigation
- **Scroll:** Natural scroll snaps between sections
- **Sticky nav:** `~/omar . home . projects . experience . contact` — click jumps to section with fast transition
- **Exit buttons:** Each section has a bottom prompt to advance (e.g., "Merge & continue" on hero)

## Terminal Transitions

### The overlay
A fixed-position overlay (`TerminalTransition`) that activates during section changes.

### Transition sequence (natural scroll, ~1-1.5s)
1. Current world fades/scales back
2. Terminal overlay fades in — dark bg, monospace text
3. Command types out character-by-character
4. Brief response line appears
5. Terminal fades out, new world materializes with stagger animations

### Transition sequence (nav click, ~0.5s)
Same phases but compressed — command appears instantly (no typing), quick fade in/out.

### Transition sequence (scroll back)
Reverse — current world dissolves, terminal shows the "go back" command, previous world rebuilds.

### Command map
| Section | Command | Response |
|---------|---------|----------|
| Hero | `> cd ~/home` | `ready` |
| Projects | `> cd ~/projects` | `5 projects loaded` |
| Languages | `> vim languages.ts` | `opening...` |
| Experience | `> cat experience.log` | `3 entries` |
| Contact | `> echo "let's talk"` | `let's talk.` |

### Styling
- Background: `#0a0a0a` or very dark with subtle scanline/noise
- Font: project's mono font (`--font-plex-mono`)
- Text color: muted green or the existing `text-muted` color
- Command prefix: `>` character, typed with cursor blink
- Response: appears after a brief delay, different color (dimmer)

## Component Architecture

### New files
- `components/world/world-slide.tsx` — 100vh snap-aligned container for each section
- `components/world/terminal-transition.tsx` — fixed overlay that plays terminal commands
- `components/world/use-world-navigation.ts` — hook managing active section, transition state, snap detection

### WorldSlide
```
Props:
  id: string              — section identifier (matches nav)
  children: ReactNode     — existing section content
  exitLabel?: string      — text for the "continue" button
  exitIcon?: ReactNode    — icon next to exit label
  onExit?: () => void     — callback when exit is clicked (default: scroll to next)
```
Responsibilities:
- Renders a 100vh scroll-snap container
- Manages entrance/exit animation state via scroll position
- Shows exit button at bottom when section is active
- Passes animation progress to children (for future per-section entrance effects)

### TerminalTransition
```
Props: none (reads from useWorldNavigation)
```
Responsibilities:
- Fixed overlay, z-index above all sections
- Watches transition state from the navigation hook
- Types out the command for the incoming section
- Handles timing: type command -> show response -> fade out
- Supports fast mode (nav click) vs natural mode (scroll)

### useWorldNavigation
```
Returns:
  activeSection: string
  isTransitioning: boolean
  transitionTarget: string | null
  scrollToSection: (id: string) => void
```
Responsibilities:
- Tracks which section is snapped/active via IntersectionObserver or scroll position
- Detects transition moments (between snaps)
- Provides imperative `scrollToSection` for nav clicks
- Manages transition state that TerminalTransition reads

## Modifications to Existing Files

### home-page.tsx
- Wrap each section in `<WorldSlide>`
- Remove spacer divs between sections
- Add `<TerminalTransition />` once at the top level
- Add scroll-snap class to the main container

### styles/globals.css
- Add scroll-snap utility classes
- Terminal transition styles (typing cursor animation, scanline effect)

### sticky-nav.tsx
- Wire nav clicks through `useWorldNavigation.scrollToSection()` instead of default hash scroll

## Exit Buttons Per Section
| Section | Exit label | Notes |
|---------|-----------|-------|
| Hero | "Merge & continue" | Already exists, wire to snap |
| Projects | "Next ↓" or "Continue ↓" | Simple, doesn't compete with project UI |
| Languages | "Run next ↓" | Code-themed |
| Experience | "Continue ↓" | Simple |
| Contact | None | End of page |

## What This Does NOT Include
- Individual section backgrounds/worlds (separate future work per section)
- Custom per-section entrance animations beyond shared fade-in
- Mobile-specific transition tuning (get desktop right, then adapt)
- The live-app-in-portfolio idea for projects section

## Performance Considerations
- Terminal transition is lightweight (DOM text + CSS animation, no canvas/WebGL)
- Scroll-snap is native CSS, no JS scroll hijacking
- IntersectionObserver for section detection (already used in the project)
- Respect `prefers-reduced-motion`: skip typing animation, instant transitions

## Success Criteria
- Scrolling between sections feels like entering new worlds
- Terminal commands add personality without blocking navigation
- You can freely scroll up/down and nav-jump without getting stuck
- Hero section works exactly as before, just participates in the snap system
- Mobile scroll feels natural (no janky snap behavior)
