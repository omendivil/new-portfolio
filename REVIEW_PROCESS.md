# Review and Multi-Agent Process

## Purpose

This file defines how style and interaction changes should be made from this point forward.

The portfolio structure is considered stable enough to refine in place.
The workflow is now iterative and issue-by-issue.

The goal is to allow freer styling changes without letting complexity, regressions, or abandoned code accumulate.

Agents should also review `AGENT_ISSUES.md` before major work so recurring conflicts and prior resolutions do not have to be rediscovered.

## Default workflow

For each major change:

1. Identify one issue only.
2. Explain the issue clearly.
3. Get approval before implementing the major change.
4. Assign implementation ownership.
5. Implement the change.
6. Run a read-only guardrail review.
7. Clean up any dead code or follow-up issues created by that change.
8. Only then move to the next issue.

Minor fixes that are necessary to complete the approved change may be included in the same pass.
Unrelated rewrites should be deferred.

## What counts as a major change

Examples:

1. redesigning the featured projects stage
2. changing drawer or panel behavior
3. restructuring project storytelling content
4. changing the contact section interaction model
5. reworking section-level motion patterns

Small spacing tweaks, copy edits, or minor polish updates do not need their own separate review run if they are part of the same approved major change.

## Godwell reviewer

The Godwell reviewer is the dedicated read-only review step after each major change.

The reviewer does not expand scope.
The reviewer does not redesign the feature.
The reviewer checks whether the completed pass stayed clean, coherent, and safe.

If a separate reviewer agent is available, use it.
If not, the lead agent must still run the same checklist before continuing.

## Reviewer timeout mitigation

Reviewer-agent timeouts should be treated as a process problem first, not as a reason to keep retrying the same prompt blindly.

For narrow cleanup or single-file passes:

1. run the local guardrail review first
2. avoid forking the full conversation context into the reviewer
3. give the reviewer only the current issue, changed files, and the specific review question
4. prefer one longer wait over repeated short polling
5. if the reviewer still stalls, close it, report the incident, and continue with the local review result

For broader architectural reviews:

1. a reviewer agent is still preferred
2. keep the scope explicit
3. close completed agents promptly so thread limits do not cause avoidable failures

## Required review checklist

Every major-change review must check:

1. architecture drift
2. dead code and abandoned components
3. duplicated logic, duplicated UI, or duplicated typed data
4. performance regressions
5. accessibility regressions
6. responsiveness issues
7. security basics
8. typed data layer compliance
9. whether the pass changed more than the approved issue required

## Security checklist

Even for a portfolio site, every major review must check for:

1. hardcoded private data in tracked files
2. unsafe or incomplete external link handling
3. accidental exposure of unnecessary env values to the client
4. risky rendering patterns such as untrusted HTML injection
5. unnecessary third-party scripts or tracking expansion
6. media-loading behavior that creates avoidable cost or risk

## Dead-code rule

Exploration is expected.
Abandoned ideas are expected.
Dead code is not expected to remain indefinitely.

After each major pass, the reviewer must explicitly check:

1. which files became unused
2. which data fields became unused
3. whether old UI paths still exist in parallel with the new path
4. whether documentation drift was introduced

If removal is needed, call it out clearly in the review.

## Multi-agent coordination

When multiple agents are used:

1. assign each agent a narrow, disjoint scope
2. assign file ownership when possible
3. do not let two implementation agents edit the same file at the same time
4. keep the reviewer read-only by default
5. stop and report if overlapping edits or architecture conflicts appear

## Agent incident reporting

Every major review should include an `Agent incidents` section.

Report:

1. interrupted agents
2. errored agents
3. overlapping file ownership
4. lost work due to interruption or stale context
5. any process improvement needed to avoid the same issue next time

If there were no incidents, say so explicitly.

## Expected review output

The review should return:

1. findings first, ordered by severity
2. simplification suggestions
3. security notes
4. dead-code and duplication notes
5. agent incidents
6. verification status
7. go or no-go recommendation for the next change

## Verification expectations

When relevant to the change, run:

1. `npm run lint`
2. `npm run build`

If a build requires external font fetching or another approved escalation, note that clearly in the review.

Current repo-specific note:

1. This project currently uses `next/font/google` in `app/layout.tsx`.
2. Because of that, `npm run build` may require approved network access only for Google font fetching during build verification.
3. That approval does not broaden into general network access for unrelated tasks.
