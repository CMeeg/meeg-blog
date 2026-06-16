---
description: Decompose specifications into tasks and execution plan. Owns docs/plans/.
agent: plan
---

# plan

> 🎯 **Design for change.** Slice tasks so each one touches one seam. A task that edits five unrelated files is a coupling smell — re-slice before you ship it.

Turn specifications into an execution plan. Delegates to the Superpowers `writing-plans` skill.

## Scope

- IN: task decomposition, file mapping, dependency ordering from the specification doc
- OUT: gathering requirements (`/explore`/`/spec`), building. This authors a plan; it does not consume it.

## Preflight

1. Read the latest specification doc from `docs/specs/`. If none exists or it's full of TODOs, **stop** — send back to `/spec`.
2. Read existing plans in `docs/plans/`. Re-entrant: reconcile and extend; never silently drop completed tasks.

## Process

The `writing-plans` skill drives the planning:

1. Load the skill — it handles task decomposition, file mapping, sequencing, and plan writing.
2. Output goes to `docs/plans/YYYY-MM-DD-<feature-name>.md`.
3. Append sequencing decisions to `docs/MEMORY.md` — why X blocks Y, why a slice was deferred.

## Hand off

Once the plan is written and saved: `Suggested next: /build`
