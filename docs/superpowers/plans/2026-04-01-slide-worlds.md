# Slide-Based World Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio into a slide deck of full-screen worlds with scroll-snap navigation and terminal command transitions between sections.

**Architecture:** Each section wraps in a `WorldSlide` component (100vh, scroll-snap-aligned). A fixed `TerminalTransition` overlay plays typed terminal commands during section changes. A `useWorldNavigation` hook tracks active/incoming sections and transition state via IntersectionObserver. The existing sticky nav wires through the same hook for click-to-jump navigation.

**Tech Stack:** React 19, Framer Motion 12, CSS scroll-snap, existing motion utilities from `lib/motion.ts`

---

### Task 1: WorldSlide Container Component

**Files:**
- Create: `components/world/world-slide.tsx`

- [ ] **Step 1: Create the WorldSlide component**

```tsx
"use client";

import { type ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

import { useMotionPreference } from "@/lib/motion";
import { cn } from "@/lib/utils";

type WorldSlideProps = {
  id: string;
  children: ReactNode;
  exitLabel?: string;
  nextSectionId?: string;
  className?: string;
  /** Allow content to scroll internally when it exceeds viewport */
  allowOverflow?: boolean;
};

export function WorldSlide({
  id,
  children,
  exitLabel,
  nextSectionId,
  className,
  allowOverflow = false,
}: WorldSlideProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const { reduceMotion } = useMotionPreference();

  function handleExit() {
    if (!nextSectionId) return;
    const target = document.getElementById(nextSectionId);
    target?.scrollIntoView({ behavior: reduceMotion ? "instant" : "smooth" });
  }

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        "section-anchor relative snap-start",
        allowOverflow ? "min-h-screen" : "flex min-h-screen flex-col",
        className,
      )}
    >
      <div className={cn("flex-1", allowOverflow ? "" : "flex flex-col")}>
        {children}
      </div>

      {exitLabel && nextSectionId && (
        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center sm:bottom-10">
          <button
            type="button"
            onClick={handleExit}
            className="group flex flex-col items-center gap-1.5 text-muted/50 transition-colors hover:text-muted"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] sm:text-xs">
              {exitLabel}
            </span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/world/world-slide.tsx
git commit -m "feat: add WorldSlide container component"
```

---

### Task 2: useWorldNavigation Hook

**Files:**
- Create: `components/world/use-world-navigation.ts`

- [ ] **Step 1: Create the navigation hook**

This hook tracks which section is active, detects transitions between sections, and provides imperative navigation. It replaces/extends `useActiveSection` for the world system.

```tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { NavSectionId } from "@/data/types";

type WorldNavigationState = {
  activeSection: NavSectionId;
  previousSection: NavSectionId | null;
  isTransitioning: boolean;
  transitionTarget: NavSectionId | null;
};

type UseWorldNavigationReturn = WorldNavigationState & {
  scrollToSection: (id: NavSectionId) => void;
  sectionOrder: NavSectionId[];
};

export function useWorldNavigation(
  sectionIds: NavSectionId[],
): UseWorldNavigationReturn {
  const [state, setState] = useState<WorldNavigationState>({
    activeSection: sectionIds[0],
    previousSection: null,
    isTransitioning: false,
    transitionTarget: null,
  });
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  // Observe sections to detect which is active
  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) {
          const newSection = visible.target.id as NavSectionId;
          setState((prev) => {
            if (prev.activeSection === newSection) return prev;
            return {
              activeSection: newSection,
              previousSection: prev.activeSection,
              isTransitioning: true,
              transitionTarget: newSection,
            };
          });
        }
      },
      { threshold: [0.4, 0.6, 0.8] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [sectionIds]);

  // Clear transition state after animation completes
  useEffect(() => {
    if (!state.isTransitioning) return;

    transitionTimerRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isTransitioning: false,
        transitionTarget: null,
      }));
    }, 1500); // matches transition duration

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [state.isTransitioning, state.transitionTarget]);

  const scrollToSection = useCallback(
    (id: NavSectionId) => {
      const target = document.getElementById(id);
      if (!target) return;

      setState((prev) => ({
        ...prev,
        isTransitioning: true,
        transitionTarget: id,
        previousSection: prev.activeSection,
      }));

      target.scrollIntoView({ behavior: "smooth" });
    },
    [],
  );

  return {
    ...state,
    scrollToSection,
    sectionOrder: sectionIds,
  };
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/world/use-world-navigation.ts
git commit -m "feat: add useWorldNavigation hook for section tracking"
```

---

### Task 3: TerminalTransition Overlay

**Files:**
- Create: `components/world/terminal-transition.tsx`

- [ ] **Step 1: Create the terminal transition component**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import type { NavSectionId } from "@/data/types";
import { motionEase, useMotionPreference } from "@/lib/motion";

const TERMINAL_COMMANDS: Record<NavSectionId, { command: string; response: string }> = {
  hero: { command: "cd ~/home", response: "ready" },
  projects: { command: "cd ~/projects", response: "5 projects loaded" },
  code: { command: "vim languages.ts", response: "opening..." },
  experience: { command: "cat experience.log", response: "3 entries" },
  contact: { command: 'echo "let\'s talk"', response: "let's talk." },
  // Sections in navSections that might not have commands fall back gracefully
  skills: { command: "cd ~/skills", response: "loaded" },
  writing: { command: "cd ~/writing", response: "loaded" },
};

type TerminalTransitionProps = {
  isTransitioning: boolean;
  target: NavSectionId | null;
};

export function TerminalTransition({ isTransitioning, target }: TerminalTransitionProps) {
  const { reduceMotion } = useMotionPreference();
  const [typedText, setTypedText] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [phase, setPhase] = useState<"idle" | "typing" | "response" | "exit">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const frameRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isTransitioning || !target) {
      setPhase("idle");
      setTypedText("");
      setShowResponse(false);
      return;
    }

    const entry = TERMINAL_COMMANDS[target] ?? { command: `cd ~/${target}`, response: "loaded" };
    const fullCommand = `> ${entry.command}`;

    if (reduceMotion) {
      // Instant: show command + response, then exit
      setTypedText(fullCommand);
      setShowResponse(true);
      setPhase("response");
      timerRef.current = setTimeout(() => setPhase("exit"), 400);
      return;
    }

    // Phase 1: Type command character by character
    setPhase("typing");
    setShowResponse(false);
    let charIndex = 0;
    setTypedText("");

    function typeNext() {
      if (charIndex < fullCommand.length) {
        setTypedText(fullCommand.slice(0, charIndex + 1));
        charIndex++;
        frameRef.current = setTimeout(typeNext, 25 + Math.random() * 20);
      } else {
        // Phase 2: Show response after typing
        timerRef.current = setTimeout(() => {
          setShowResponse(true);
          setPhase("response");
          // Phase 3: Exit after showing response
          timerRef.current = setTimeout(() => {
            setPhase("exit");
          }, 400);
        }, 200);
      }
    }

    typeNext();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [isTransitioning, target, reduceMotion]);

  const isVisible = phase === "typing" || phase === "response";
  const entry = target ? TERMINAL_COMMANDS[target] ?? { command: "", response: "loaded" } : null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: motionEase }}
        >
          <div className="font-mono text-sm sm:text-base">
            <div className="flex items-center">
              <span className="text-muted/60">{typedText}</span>
              {phase === "typing" && (
                <span className="ml-0.5 inline-block h-4 w-[7px] bg-accent/70 animate-[blink_1s_step-end_infinite]" />
              )}
            </div>
            <AnimatePresence>
              {showResponse && entry && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="mt-1 text-muted/40"
                >
                  {entry.response}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/world/terminal-transition.tsx
git commit -m "feat: add TerminalTransition overlay with typed commands"
```

---

### Task 4: Add Scroll-Snap CSS

**Files:**
- Modify: `styles/globals.css`

- [ ] **Step 1: Add scroll-snap utilities to globals.css**

Add at the end of the file (after existing CSS):

```css
/* ─── World slide system ───────────────────────────────────────────────── */

.world-scroll-container {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  height: 100vh;
}

.snap-start {
  scroll-snap-align: start;
}

/* Blink animation for terminal cursor (used by nav and terminal transition) */
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build 2>&1 | tail -5`
Expected: build succeeds

- [ ] **Step 3: Commit**

```bash
git add styles/globals.css
git commit -m "feat: add scroll-snap CSS for world slide system"
```

---

### Task 5: Wire WorldSlide Into HomePage

**Files:**
- Modify: `components/home/home-page.tsx`

- [ ] **Step 1: Rewrite home-page.tsx to use WorldSlide + TerminalTransition**

Replace the entire file content:

```tsx
"use client";

import { useMemo } from "react";

import { VercelGrid } from "@/components/ambient/vercel-grid";
import { WebflowGradient } from "@/components/ambient/webflow-gradient";
import { CodeEditorSection } from "@/components/code-editor/code-editor-section";
import { ExperienceThemeSwitcher } from "@/components/experience/experience-theme-switcher";
import { SiteFooter } from "@/components/footer/site-footer";
import { HeroDiff } from "@/components/hero/hero-diff";
import { StickyNav } from "@/components/navigation/sticky-nav";
import { ProjectsSection } from "@/components/sections/projects-section";
import { TerminalTransition } from "@/components/world/terminal-transition";
import { useWorldNavigation } from "@/components/world/use-world-navigation";
import { WorldSlide } from "@/components/world/world-slide";
import { experience, navSections } from "@/data/site";
import type { NavSectionId } from "@/data/types";

const SECTION_ORDER: NavSectionId[] = ["hero", "projects", "code", "experience", "contact"];

export function HomePage() {
  const world = useWorldNavigation(SECTION_ORDER);
  const navSectionsFiltered = useMemo(
    () => navSections.filter((s) => SECTION_ORDER.includes(s.id)),
    [],
  );

  return (
    <div className="world-scroll-container">
      <a
        href="#hero"
        className="sr-only absolute left-3 top-3 z-40 rounded-full border border-border bg-surface px-4 py-2 text-sm text-text focus:not-sr-only sm:left-4 sm:top-4"
      >
        Skip to content
      </a>
      <StickyNav sections={navSectionsFiltered} />
      <TerminalTransition
        isTransitioning={world.isTransitioning}
        target={world.transitionTarget}
      />

      {/* Hero */}
      <WorldSlide
        id="hero"
        exitLabel="Merge & continue"
        nextSectionId="projects"
      >
        <WebflowGradient>
          <HeroDiff />
        </WebflowGradient>
      </WorldSlide>

      {/* Projects */}
      <WorldSlide
        id="projects"
        exitLabel="Next"
        nextSectionId="code"
        allowOverflow
      >
        <div className="mx-auto max-w-6xl px-2.5 py-8 sm:px-4 sm:py-12">
          <ProjectsSection />
        </div>
      </WorldSlide>

      {/* Languages / Code Editor */}
      <WorldSlide
        id="code"
        exitLabel="Continue"
        nextSectionId="experience"
      >
        <CodeEditorSection />
      </WorldSlide>

      {/* Experience */}
      <WorldSlide
        id="experience"
        exitLabel="Continue"
        nextSectionId="contact"
        allowOverflow
      >
        <div className="mx-auto max-w-2xl px-4 py-16 sm:max-w-3xl sm:py-24 lg:max-w-4xl">
          <div className="mb-6">
            <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.15em] text-muted/50">
              Experience
            </div>
          </div>
          <ExperienceThemeSwitcher experiences={experience} />
        </div>
      </WorldSlide>

      {/* Contact / Footer */}
      <WorldSlide id="contact">
        <VercelGrid>
          <SiteFooter />
        </VercelGrid>
      </WorldSlide>
    </div>
  );
}
```

Note: `HomePage` is now a client component because it uses `useWorldNavigation`. The `"use client"` directive is added at the top.

- [ ] **Step 2: Update app/page.tsx if needed**

Read `app/page.tsx` — it imports `HomePage`. Since `HomePage` is now a client component, the page file just needs to render it. No change needed if it's already:

```tsx
import { HomePage } from "@/components/home/home-page";
export default function Page() { return <HomePage />; }
```

- [ ] **Step 3: Remove the `<main>` wrapper from existing section components if needed**

The `CodeEditorSection` has its own `<section>` tag with `id="code"`. Since `WorldSlide` already wraps with a `<section id="code">`, we need to avoid duplicate IDs. Check each section component:

- `HeroDiff` → has `id="hero"` on its inner section — remove the `id` from `HeroDiff`'s section since `WorldSlide` now provides it
- `ProjectsSection` → has `id="projects"` — remove it, `WorldSlide` provides it
- `CodeEditorSection` → has `id="code"` — remove it, `WorldSlide` provides it
- `SiteFooter` → has `id="contact"` — remove it, `WorldSlide` provides it

Edit each file to remove the duplicate `id` and `section-anchor` class (WorldSlide handles both).

For `components/hero/hero-diff.tsx` (~line 22-24), change:
```tsx
// Before:
<section id="hero" className="section-anchor relative flex min-h-[55vh]...">
// After:
<div className="relative flex min-h-[55vh] items-center justify-center px-4 py-10 sm:min-h-[70vh] sm:py-16 lg:min-h-[80vh] lg:py-24">
```
And close with `</div>` instead of `</section>`.

For `components/sections/projects-section.tsx` (~line 6), change:
```tsx
// Before:
<section id="projects" className="section-anchor section-surface section-grid...">
// After:
<div className="section-surface section-grid gap-y-6 px-4 py-4 sm:gap-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
```
And close with `</div>`.

For `components/code-editor/code-editor-section.tsx` (~line 13-17), change:
```tsx
// Before:
<section id="code" ref={ref} className="section-anchor px-4 py-16...">
// After:
<div ref={ref} className="px-4 py-16 sm:px-6 sm:py-24">
```
And close with `</div>`.

For `components/footer/site-footer.tsx` (~line 25), change:
```tsx
// Before:
<footer id="contact" className="section-anchor px-4 pb-12 pt-20...">
// After:
<footer className="px-4 pb-12 pt-20 sm:pb-16 sm:pt-28">
```

- [ ] **Step 4: Verify it compiles and builds**

Run: `npx tsc --noEmit && npm run build 2>&1 | tail -5`
Expected: no type errors, build succeeds

- [ ] **Step 5: Commit**

```bash
git add components/home/home-page.tsx components/hero/hero-diff.tsx components/sections/projects-section.tsx components/code-editor/code-editor-section.tsx components/footer/site-footer.tsx
git commit -m "feat: wire WorldSlide into HomePage — scroll-snap section layout"
```

---

### Task 6: Wire Nav Through World Navigation

**Files:**
- Modify: `components/navigation/sticky-nav.tsx`

- [ ] **Step 1: Update StickyNav to accept scrollToSection callback**

The nav currently uses hash links (`href="#projects"`) and sets active section via `useActiveSection`. We need it to also work with the world navigation system. Add an optional `onNavigate` prop:

In `sticky-nav.tsx`, update the type and the click handler:

```tsx
type StickyNavProps = {
  sections: NavSection[];
  onNavigate?: (id: NavSectionId) => void;
};
```

In the `handleNavClick` callback, call `onNavigate` if provided:

```tsx
const handleNavClick = useCallback(
  (id: NavSectionId) => {
    setActiveSection(id);
    setMobileOpen(false);
    onNavigate?.(id);
  },
  [setActiveSection, onNavigate],
);
```

Then in `home-page.tsx`, pass the world navigation's `scrollToSection`:

```tsx
<StickyNav sections={navSectionsFiltered} onNavigate={world.scrollToSection} />
```

- [ ] **Step 2: Prevent default hash jump on nav clicks**

In the `<a>` click handlers inside `StickyNav`, add `e.preventDefault()` when `onNavigate` is provided, so the browser doesn't hash-jump (the world system handles scrolling):

For the desktop nav link (~line 58-70):
```tsx
<a
  href={`#${section.id}`}
  onClick={(e) => {
    if (onNavigate) e.preventDefault();
    handleNavClick(section.id);
  }}
  // ... rest unchanged
>
```

Same pattern for the mobile nav link (~line 121-130).

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add components/navigation/sticky-nav.tsx components/home/home-page.tsx
git commit -m "feat: wire sticky nav through world navigation system"
```

---

### Task 7: Update Hero Merge Button to Use Snap Navigation

**Files:**
- Modify: `components/hero/diff-view.tsx`

- [ ] **Step 1: Update handleMerge to scroll to projects WorldSlide**

The current `handleMerge` does `document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })`. This still works with scroll-snap since the WorldSlide has `id="projects"`. No code change needed — just verify it works with the snap system.

However, remove the `scrollIntoView` from `handleMerge` since `WorldSlide`'s exit button now handles navigation. The merge button should just complete its merge animation. The user will then click the exit button or scroll down.

Actually, keep the existing behavior — the merge button is the hero's exit action. It already scrolls to projects. The WorldSlide exit button is a secondary option. Both work.

- [ ] **Step 2: Verify the merge flow works**

Run the dev server, click "Merge & continue", verify it snaps to the projects section.

- [ ] **Step 3: Commit** (only if changes were made)

---

### Task 8: Final Integration Test

**Files:** None (testing only)

- [ ] **Step 1: Type check**

Run: `npx tsc --noEmit`
Expected: no errors

- [ ] **Step 2: Lint**

Run: `npm run lint 2>&1 | grep -c error`
Expected: 0 errors

- [ ] **Step 3: Convention tests**

Run: `npm run test:conventions`
Expected: all pass

- [ ] **Step 4: Production build**

Run: `npm run build 2>&1 | tail -10`
Expected: build succeeds

- [ ] **Step 5: Manual testing checklist**

Start dev server: `npm run dev`

Verify:
- [ ] Page loads with hero section full-screen
- [ ] Scrolling down snaps to projects section
- [ ] Terminal command overlay appears briefly during transition
- [ ] Terminal shows typed command for the target section
- [ ] Scrolling continues through all 5 sections
- [ ] Clicking nav items jumps to the correct section
- [ ] "Merge & continue" button on hero scrolls to projects
- [ ] Exit buttons at bottom of each section work
- [ ] Scrolling back up works (reverse transitions)
- [ ] Reduced motion: transitions are instant, no typing animation
- [ ] Mobile: scroll-snap works with touch

- [ ] **Step 6: Commit all remaining changes**

```bash
git add -A
git commit -m "feat: slide-based world navigation with terminal transitions"
```
