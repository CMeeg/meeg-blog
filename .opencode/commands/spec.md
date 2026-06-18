---
description: Design, architecture and specification through structured brainstorming. Owns docs/specs/ and docs/ARCHITECTURE.md.
agent: plan
---

# spec

> 🎯 **Design for change.** Every architectural decision here is judged by one question: when this changes, how big is the diff? Pick the boundaries, seams, and data shapes that make the *next* change small and local.

Decide *how* to build what `/explore` defined. Delegates to the Superpowers `brainstorming` skill.

## Scope

- IN: components & boundaries, data model, database (schema **and** platform), runtime, sync vs async, build-vs-buy, key tradeoffs, behavioral requirements, `docs/ARCHITECTURE.md`.
- OUT: the problem/why (that's `/explore` — read it, don't redo it), task breakdown (`/plan`), prose docs/README (`/document`).

## Preflight

0. Verify Superpowers is loaded. If not, stop with: `This command requires Superpowers to run. Install it, then try again.`
1. Read `docs/PROJECT.md` if it exists. If it's full of TODOs or doesn't define scope, **stop** — send back to `/explore`.

## Process

The `brainstorming` skill drives the specification:

1. Load the skill — it handles context exploration, questions, approaches, design sections, and spec writing.
2. Output goes to `docs/specs/YYYY-MM-DD-<topic>-design.md`.
3. Append architectural decisions to `docs/MEMORY.md` — the choice, the why, the rejected alternative.
4. Produce or update `docs/ARCHITECTURE.md` to reflect the architecture decisions in this spec. If it doesn't exist yet, create it with a system overview, key decisions, and data flow.

## Hand off

Once the specification doc is written and approved: `Suggested next: /plan`
