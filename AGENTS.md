# meeg-blog

Chris Meagher's personal blog, rebuilt on Dato CMS + Cloudflare.

## Stack

| Concern | Choice |
|---|---|
| Framework | Astro 6 |
| Language | TypeScript |
| Package manager | pnpm 11 |
| Node | >=22.12.0 |

## Commands

| Command | Action |
|---|---|
| `pnpm run dev` | Start dev server |
| `pnpm run build` | Build for production |
| `pnpm run preview` | Preview production build |

## Rules

- DO NOT REPORT SOMETHING IS FIXED IF YOU HAVEN'T BUILT THE APP.
- DO NOT SEARCH `node_modules` for answers. GO ONLINE.
- Use emoji in markdown documents for readability.
- Get to the point, be terse, do not over explain.
- Never install a package by editing the manifest; always use `pnpm install`.
- Phase commands may delegate to Superpowers skills.
- Each doc in `docs/` has one owning phase command (see below).

## Commands

| Command | Owns | Purpose |
|---|---|---|
| `/explore` | `docs/PROJECT.md` | Define what the project is and why |
| `/spec` | `docs/specs/`, `docs/ARCHITECTURE.md` | Architecture and specification |
| `/plan` | `docs/plans/` | Implementation plans |
| `/document` | `docs/MEMORY.md`, `README.md` | Decision log, public docs, and reconciliation |

**Agent convention:** `agent: plan` for commands that produce docs and specifications (research/writing). `agent: build` for commands that execute code changes.

## Skill Dispatch

Use the `skill` tool to load the relevant skill when the task matches:

| When the task involves... | Load this skill |
|---|---|
| Cloudflare Workers, Pages, storage, AI, networking, security, or IaC | `cloudflare` |
| Wrangler CLI commands or configuration | `wrangler` |
| Cloudflare Durable Objects (DO) | `durable-objects` |
| Cloudflare Workers code review or best practices | `workers-best-practices` |
| Cloudflare Turnstile CAPTCHA setup | `turnstile-spin` |
| DatoCMS GraphQL content queries (CDA) | `datocms-cda` |
| DatoCMS CLI commands or migrations | `datocms-cli` |
| DatoCMS CMA scripts or content automation | `datocms-cma` |
| DatoCMS content modeling decisions | `datocms-content-modeling` |
| DatoCMS frontend components (React, Astro, Svelte) | `datocms-frontend-integrations` |
| DatoCMS plugins (SDK, hooks, UI) | `datocms-plugin` |
| DatoCMS project setup (one-shot, greenfield, onboarding) | `datocms-setup` |
| DatoCMS feedback or dead-end MCP experiences | `datocms-feedback` |
| Design tokens, color palettes, spacing scales | `design-tokens` |
| UI polish, micro-interactions, hover/enter states | `make-interfaces-feel-better` or `interaction-design` |
| Modern CSS, HTML APIs, client-side JS patterns | `modern-web-guidance` |
| OKLCH colors, gamut, contrast, palette generation | `oklch-skill` |
| WCAG accessibility audit and remediation | `wcag-audit-patterns` |
| Writing or running tests | `vitest` or `playwright-cli` |
| Debugging a bug or test failure | `systematic-debugging` |
| Test-driven development | `test-driven-development` |
| Writing implementation plans | `writing-plans` |
| Executing a written implementation plan | `executing-plans` |
| Getting code review | `requesting-code-review` |
| Receiving and evaluating code review feedback | `receiving-code-review` |
| Finishing a development branch (merge, PR, cleanup) | `finishing-a-development-branch` |
| TypeScript best practices, design patterns | `typescript-best-practices`, `solid-principles`, `gof-patterns`, or `design-principles` |
| Project brainstorming or creative exploration | `brainstorming` |
| Web performance audit or Core Web Vitals | `web-perf` |
| Baseline HTML/CSS styling for prose content | `baseline-styling` |
| npm/pnpm dependency management or workspace config | `pnpm` |
| Discovering or installing new agent skills | `find-skills` |
| Looking up library/framework documentation or APIs | `find-docs` |
| Dispatching 2+ independent tasks in parallel | `dispatching-parallel-agents` |
| Implementing plan tasks via subagents in current session | `subagent-driven-development` |
| Verifying work is complete before committing | `verification-before-completion` |
| Creating, editing, or verifying skills | `writing-skills` |
| Starting feature work needing workspace isolation | `using-git-worktrees` |
