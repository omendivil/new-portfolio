# Omar Mendivil Portfolio

Production-focused portfolio built with Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, and `next-themes`.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- `next-themes`
- `lucide-react`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Environment

UI contact values stay env-driven.

Recommended variables:

```bash
NEXT_PUBLIC_CONTACT_EMAIL=you@example.com
NEXT_PUBLIC_CONTACT_PHONE=555-555-5555
```

`NEXT_PUBLIC_CONTACT_EMAIL` enables the primary contact lane.
`NEXT_PUBLIC_CONTACT_PHONE` is optional and is only shown when the content config allows it.

## Project Structure

- `app/`: App Router entrypoints and layout
- `components/`: UI sections, motion primitives, project surfaces, and small client islands
- `data/`: typed content source and project helpers
- `styles/`: global theme tokens and shared utilities

## Workflow Docs

- `AGENTS.md`: repo guardrails and current phase instructions
- `REVIEW_PROCESS.md`: issue-by-issue workflow and review checklist
- `AGENT_ISSUES.md`: recurring agent conflicts and prior resolutions
- `WORK.md`: primary implementation direction
- `WORK_PASS_TWO.md`: pass-two refinement direction

## Build Note

Fonts are currently loaded with `next/font/google` in `app/layout.tsx`.
In restricted environments, `npm run build` may need network access to fetch those Google fonts.
