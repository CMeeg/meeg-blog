---
description: Scaffold the project files I like — AGENTS.md and the /docs skeleton.
agent: plan
---

# scaffold

> 🎯 **Design for change.** Structure should enable decisions, not make them. Scaffold empty files with clear ownership and move on.

Stand up the working files for a project so the later phase commands have something to fill. You **create structure, not content** — stubs with headings and TODOs, never invented decisions.

## AGENTS.md Template

Use this when creating AGENTS.md

```md
# [project name, ask if this cannot be inferred]

[Project summary, ask if this cannot be inferred]

## Rules

- DO NOT REPORT SOMETHING IS FIXED IF YOU HAVEN'T BUILT/COMPILED THE APP
- DO NOT SEARCH node_modules for answers. GO ONLINE.
- Use emoji for markdown documents for readability.
- Get to the point, be terse, do not over explain. Tokens are water, we're in the desert. Use emoji instead of prose if you can.
- Never install a package by editing the manifest, always use a package install tool, such as `pnpm install`, etc.

```

## Scope

- IN: create AGENTS.md, the `docs/` skeleton (including ARCHITECTURE.md stub), a README stub, `.gitignore`.
- OUT: deciding what the project *is* (that is `/explore`), architecture (`/spec`), tasks (`/plan`). This command does not interview the problem.

## Preflight

1. Re-entrant: if a file already exists, **leave it alone**. Report what was already there vs. what you created. Never clobber.
2. Detect the ground:
   - Code already present → seed AGENTS.md from what's actually there (language, test command, run command, layout). Be factual, no guessing.
   - Empty dir → AGENTS.md gets a stub with those headings and `TODO`.

## Produce

- **AGENTS.md** (root, owned here) — the **how**: stack, conventions, test & run commands, the phase commands available (`/explore`, `/spec`, `/plan`, `/document`), and the rule that each doc has one owner.
- **docs/PROJECT.md** — stub, owned by `/explore`. Headings: Problem, Who it's for, Goals, Scope (in/out), Open questions.
- **docs/ARCHITECTURE.md** — stub, owned by `/spec`. Single heading and ownership annotation, filled later by `/spec`.
- **docs/MEMORY.md** — the project decision log: decisions made with AI, preserved for the coding agent (OpenCode, Claude Code, etc.). Header + an empty dated-entry list. Curated by `/document`; appended to by every phase command. Distinct from the coding agent's own memory system.
- **README.md** — one-line stub, owned by `/document`.

Each stub names its owner command at the top so nobody writes the wrong file.

## Interview

Almost none. Ask at most: project name, and — only if code exists and it's ambiguous — the test and run commands. Otherwise stay silent and scaffold.

## Hand off

End with the file list (created vs. skipped) and: `Suggested next: /explore — to define what this project is and why.`
