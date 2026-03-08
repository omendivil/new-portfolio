# Work Plan Pass Two

## Scope

Refine the existing portfolio build into a polished, motion rich, fully responsive experience.

This pass is not about building from scratch.
This pass is about improving the current implementation.

Agents must follow:
AGENTS.md
MEDIA.md
WORK_PASS_TWO.md

## Main goals

1. Make the entire site fully mobile friendly
2. Add meaningful motion throughout the site
3. Redesign the projects section so demos feel like live app experiences inside device frames
4. Remove any obvious video player feeling from project demos
5. Preserve performance while improving visual quality

## Project demo requirements

The projects section must no longer feel like a standard video player.

Required behavior

1. Demo videos should appear embedded inside an iPhone style device frame
2. Videos should feel like part of the interface, not a media player
3. Do not show obvious play, pause, restart, or next controls in the main presentation
4. Do not make the demo feel like a user is watching a raw video file
5. The presentation should feel closer to a product showcase or live app preview
6. If a project has chapters or multiple demo states, the UI should present them in a polished way
7. Transitions between project states should feel integrated with page motion
8. Demo sections should feel premium on both desktop and mobile

## Motion requirements

1. Add motion throughout the site, not just in one place
2. Motion must remain subtle, clean, and premium
3. Motion should support:
   section entrance
   hover feedback
   nav state changes
   drawer and panel transitions
   project card transitions
   project detail transitions
4. Motion should not feel flashy or distracting
5. Reduced motion support must still work

## Mobile requirements

1. The entire site must be fully responsive
2. Every major section must be tested and adjusted for mobile
3. Typography, spacing, and layout must feel intentional on small screens
4. Project demos must be especially polished on mobile
5. No broken overflow, clipped content, or awkward control placement

## Projects section redesign

The projects area should be upgraded to feel more like a modern product showcase.

Direction

1. Featured projects should look curated and premium
2. The selected project should display in a device frame
3. The layout should feel alive, similar to polished design showcase sites
4. The project presentation should support scroll based or section based transitions if appropriate
5. If the current drawer or peek panel architecture still works, improve it rather than replacing it unnecessarily
6. A single active showcase may autoplay when in view if that remains the approved direction
7. Non-active projects should remain lightweight and not behave like parallel live previews

## Performance requirements

1. Do not preload all videos
2. Load videos only when needed
3. Keep poster based previews where possible
4. Preserve good performance on mobile
5. If a live featured stage exists, only the active project should request preview media

## Code standards

1. Improve the current codebase rather than rewriting everything
2. Reuse existing structure when possible
3. Avoid duplicated mobile and desktop trees
4. Keep the data layer as the source of truth
5. Do not hardcode media URLs in components

## Workstreams

Agent 1 mobile responsiveness pass
Agent 2 motion system and site wide motion improvements
Agent 3 projects section redesign and device frame experience
Agent 4 project demo behavior and chapter based presentation refinement
Agent 5 integration and QA pass across all sections

## Acceptance checklist

1. Site feels polished on desktop
2. Site feels polished on mobile
3. Project demos no longer feel like raw video players
4. No obvious playback controls in the main project presentation
5. Animations exist throughout the site and feel cohesive
6. Mobile layout is intentional across all sections
7. Build passes
8. Lint passes
