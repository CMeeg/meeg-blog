# Coding agent workflow

This command-based workflow should be followed when implementing projects and features using a coding agent in this repo. It leans on [superpowers](https://github.com/obra/superpowers) so make sure you have that plugin installed and accessible by your agent.

## The workflow

* `/scaffold` should be run once at the very start of the project
* These commands are then intended to be run in sequence when designing and implementing a new project or feature, each creates an output that is an input to the next:
  * `/explore` is used to explore ideas for the feature and define the scope
  * `/spec` designs the architecture and solution based on the scope
  * `/plan` breaks the spec down into tasks
  * `/implement` builds the solution from the plan
* `/document` can be run at any time to reconcile docs with reality

## Re-entry guide

| Situation | Action |
|---|---|
| Spec doesn't cover what you need | Re-run `/spec` |
| Plan doesn't reflect the spec | Re-run `/plan` |
| Implementation reveals a gap | Log it in `docs/MEMORY.md`, re-run `/spec` |
| Scope or problem changed | Re-run `/explore` |
| Docs or architecture out of date | Re-run `/document` (or `/spec` if decisions changed) |

## Command reference

| Command | What it does | Produces |
|---|---|---|
| `/scaffold` | Creates the working files for decisions | `AGENTS.md`, `docs/` |
| `/explore` | Defines the problem, the user, and the scope | `docs/PROJECT.md` |
| `/spec` | Designs the architecture and solution | `docs/specs/`, `docs/ARCHITECTURE.md` |
| `/plan` | Slices the spec into tasks | `docs/plans/` |
| `/implement` | Builds it | Working code |
| `/document` | Reconciles docs with reality | Updated README, ARCHITECTURE, MEMORY |

## Why

Skipping a step means decisions get made by accident instead of by design. `/explore` catches the wrong problem before you code it. `/spec` catches bad architecture before you commit to it. `/plan` catches missing pieces before you start. `/implement` catches gaps in the plan and feeds them back. `/document` catches docs that drifted from reality.

The workflow is a guide, not a cage. If implementation reveals something the spec missed, loop back to `/spec`. Re-entry is fine — that's how the design improves.

## How Superpowers fits

These commands delegate to Superpowers skills for the heavy lifting. If they can't load Superpowers, they stop with an error. Install it, and try again.

- `/spec` uses the `brainstorming` skill — structured exploration, design sections, spec writing, and `docs/ARCHITECTURE.md`
- `/plan` uses the `writing-plans` skill — task decomposition, file mapping, sequencing
- `/implement` uses `subagent-driven-development` or `executing-plans` with quality gates: `test-driven-development`, `requesting-code-review`, `finishing-a-development-branch`

`/scaffold`, `/explore` and `/document` don't need Superpowers.

## Ownership

Each doc has one owning command. That command is listed at the top of the doc. Nobody else writes to it — they append to `docs/MEMORY.md` for decisions, but each command owns its primary file. This avoids edit conflicts.

| Doc | Owning command |
|---|---|
| `AGENTS.md` | `/scaffold` |
| `docs/PROJECT.md` | `/explore` |
| `docs/ARCHITECTURE.md` | `/spec` |
| `docs/specs/*.md` | `/spec` |
| `docs/plans/*.md` | `/plan` |
| `docs/MEMORY.md` | `/document` (curated, appended by all) |
| `README.md` | `/document` |
