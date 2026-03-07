# Work Plan

## Scope

Build a brand new portfolio using Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and next themes.

This project must follow the rules in `AGENTS.md` and use `MEDIA.md` as the source of truth for media references.

## Primary goal

Create a clean, minimal, modern portfolio with a Notion style motion vibe.

The site should feel polished and interactive, but restrained.
Motion should be subtle and intentional.
The home page should stay focused and not become a giant wall of projects.

## Core product requirements

1. Single page home at route slash

2. Sticky navigation with active section highlight

3. Light mode and dark mode using CSS variables and a toggle

4. One typed data source for all site content

5. A scalable projects experience that does not dump every project on the page at once

6. Featured projects shown on the home page by default

7. A structured browse experience for all projects through a bottom drawer

8. A right side peek panel for viewing project details and demo media

9. Video must load only after a project is opened

10. No hardcoded contact info in tracked files

## Home sections

The home page must include these sections in this order unless a strong reason comes up during implementation.

1. Hero

2. Projects

3. Skills

4. Experience

5. Writing and videos

6. Contact

## Design direction

1. Minimal surfaces

2. Soft borders

3. Restrained shadows

4. Large clean typography

5. Generous spacing

6. Notion style motion language

7. No loud gradients

8. No personal hobby content

## Theme system

Use CSS variables for theme tokens.

Required tokens

1. background

2. surface

3. surface 2

4. border

5. text

6. muted

7. accent

8. accent soft

All components should use token based styling rather than hardcoded surface colors.

## Data layer requirements

Create a single typed data source that exports the following

1. projects array

2. skills array

3. experience array

4. writing array

5. contact configuration

All media URLs must live in the typed data layer.

Agents may read `MEDIA.md` to find URLs, but must not hardcode URLs directly inside components.

## Projects experience

### Featured projects on home

1. Show 3 to 5 featured projects only

2. Use poster images only

3. No video loading in the featured area

4. Horizontal interaction should feel smooth and premium

5. Must work well on mobile and desktop

### Browse drawer

1. Open from a clear control like View all projects

2. Opens from the bottom

3. Contains lightweight project rows only

4. Supports search

5. Supports category filters

6. Does not render videos

7. Clicking a row opens the peek panel

### Peek panel

1. Opens from the right

2. Shows title, one liner, highlights, tags, links, and poster

3. Loads video only after panel opens

4. If chapters exist, show a chapter list and allow jumping

5. Must support keyboard close behavior and focus handling

## Performance requirements

1. Do not preload all videos

2. Do not load videos in the featured deck

3. Do not load videos in the browse drawer

4. Use posters everywhere until a project is opened

5. Keep client components limited to places that actually need interactivity

6. Avoid unnecessary bundle weight

## Motion system

Create shared motion utilities and presets.

Required motion presets

1. fade in up

2. stagger children

3. drawer enter and exit

4. panel enter and exit

5. shared layout pill transition

Reduced motion support must be included.

## Contact and analytics

### Contact

1. Use env values for display when needed

2. Read from `NEXT_PUBLIC_CONTACT_EMAIL`

3. Read from `NEXT_PUBLIC_CONTACT_PHONE` only if explicitly enabled in data

4. Primary action should be copy to clipboard

5. Secondary actions can include mailto and tel

6. No hardcoded phone or email in tracked files

### Analytics

Add the following

1. Vercel Analytics

2. GA scaffold through env id

3. Event helper utility

Track these events

1. theme toggle

2. open browse drawer

3. open project

4. close project

5. play video

6. chapter click

7. outbound link click

8. copy contact

## Accessibility requirements

1. Semantic headings

2. Focus visible states

3. Keyboard navigation for nav, drawer, and panel

4. Reduced motion support

5. Reasonable focus management when opening and closing overlays

## Code standards

1. Use App Router only

2. No separate desktop and mobile component trees

3. Avoid duplicated code

4. Prefer server components by default

5. Mark only necessary components as client

6. Use strict TypeScript

7. Keep naming predictable and clean

## File expectations

### Theme system

1. `components/theme-provider.tsx`

2. `components/theme-toggle.tsx`

3. `styles/globals.css`

4. `lib/utils.ts`

### Data layer

1. `content` or `data` folder with typed content source

2. shared types for projects, skills, experience, writing, and contact

### Home shell

1. section components

2. sticky nav component

3. active section logic

### Projects system

1. featured deck component

2. browse drawer component

3. peek panel component

4. video player component

### Motion system

1. shared motion presets

2. reduced motion helpers

### Contact and analytics

1. contact section component

2. analytics helper

## Workstreams

1. Agent 1 theme system

2. Agent 2 data layer

3. Agent 3 home shell and nav

4. Agent 4 projects experience

5. Agent 5 motion primitives

6. Agent 6 contact and analytics

## Acceptance checklist

1. `npm run dev` works

2. `npm run build` passes

3. `npm run lint` passes

4. Light and dark themes both look correct

5. Sticky nav highlights the active section

6. Browse drawer opens and closes smoothly

7. Peek panel opens and closes smoothly

8. Videos only load after opening a project

9. No email or phone appears in tracked files

10. Media URLs are stored in the typed data layer, not in components
