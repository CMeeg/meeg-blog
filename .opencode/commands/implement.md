---
description: Execute an implementation plan via Superpowers — worktree isolation, subagent-driven or batched execution.
agent: build
---

# implement

> 🎯 **Design for change.** Each task's diff should be small, local, and behind a stable seam. Skills gate on spec compliance and code quality — think about seam boundaries before dispatching.

Drive a plan from `docs/plans/` to completion using the Superpowers skills workflow. This command **consumes** a plan; it does not author one — see `/plan` for that.

## Scope

- IN: plan resolution, worktree isolation, strategy selection, implementation of all tasks through the Superpowers skill workflow.
- OUT: planning, writing plans, authoring specs, refactoring/refinement passes. This command **consumes** a plan; it does not author one.

## Preflight: Resolve the Plan

0. Verify Superpowers is loaded. If not, stop with: `This command requires Superpowers to run. Install it, then try again.`
1. If `$ARGUMENTS` is provided, resolve it as the plan path.
2. Otherwise, list `docs/plans/` and ask which plan to implement.
3. Read the plan. It must contain task checkboxes (`- [ ]`). If not, stop and report.
4. Confirm a clean git working tree. If dirty, stop and report.

## 1. Isolate

Load the `using-git-worktrees` skill via the `skill` tool and follow its instructions exactly. This creates an isolated workspace on a new branch, runs project setup, and verifies a clean test baseline.

## 2. Choose Strategy

Ask the user to choose an execution strategy:

| Option | Description |
|--------|-------------|
| `subagent-driven-development` | Dispatches a fresh subagent per task. Each task passes a two-stage gate (spec compliance → code quality) before moving on. Same-session, fast iteration. Best for plans with mostly independent tasks. |
| `executing-plans` | You implement each task directly with human checkpoints between batches. Simpler, more oversight. Best for tightly-coupled tasks or when you want closer participation. |

## 3. Execute

Load the chosen skill via the `skill` tool and follow its instructions to implement every unchecked task in the plan.

Tasks flow through quality skills during execution:
- `test-driven-development` for new code (red-green cycle per task)
- `requesting-code-review` before merging branches
- `finishing-a-development-branch` for final PR/merge/cleanup

All skills gate on spec compliance and code quality.

## Rules

- Never start implementation on `main`/`master` without explicit consent.
- Load each skill using the `skill` tool — do not read skill files manually.
- Stop and report if a skill reports an unresolvable blocker.
- Follow each skill's instructions exactly.
- If implementation reveals a spec gap, stop, log the finding in `docs/MEMORY.md`, and suggest: `Spec gap discovered. Re-run /spec to reconcile before continuing.`
