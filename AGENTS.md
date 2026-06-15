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
- Each doc in `docs/` has one owning phase command (see below).

## Phase commands

| Command | Owns | Purpose |
|---|---|---|
| `/explore` | `docs/PROJECT.md` | Define what the project is and why |
| `/design` | `docs/ARCHITECTURE.md`, `docs/SPEC.md` | Architecture and specification |
| `/plan` | `docs/STORIES.md`, `docs/PLAN.md` | Stories and task breakdown |
| `/document` | `docs/MEMORY.md`, `README.md` | Decision log and public docs |
