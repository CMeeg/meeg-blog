---
description: Regenerate the Skill Dispatch table in AGENTS.md from all installed skills
agent: build
---

# update-skills

Regenerate the `## Skill Dispatch` section in `AGENTS.md` by scanning all installed skills.

## Scan these paths

- `.agents/skills/*/SKILL.md` (project-local)
- `.opencode/skills/*/SKILL.md` (project-local alternate)
- `~/.config/opencode/skills/*/SKILL.md` (global config)
- `~/.agents/skills/*/SKILL.md` (global agent-compatible)
- `skills-lock.json` (for remote-installed skills — skip any already covered above)

For each SKILL.md found, read the YAML frontmatter and extract `name` + `description`.

## Generate the dispatch table

Using each skill's name and description, infer what user requests it should trigger on. Produce a `## Skill Dispatch` section like this:

```markdown
## Skill Dispatch

Use the `skill` tool to load the relevant skill when the task matches:

| When the task involves... | Load this skill |
|---|---|
| Cloudflare Workers, DO, Wrangler config | `cloudflare` |
| DatoCMS GraphQL content queries (CDA) | `datocms-cda` |
| DatoCMS CLI commands or migrations | `datocms-cli` |
| DatoCMS CMA scripts or content automation | `datocms-cma` |
| DatoCMS content modeling decisions | `datocms-content-modeling` |
| DatoCMS frontend components (React, Astro, Svelte) | `datocms-frontend-integrations` |
| DatoCMS plugins (SDK, hooks, UI) | `datocms-plugin` |
| DatoCMS project setup (one-shot) | `datocms-setup` |
| Design tokens, color palettes, spacing scales | `design-tokens` |
| UI polish, micro-interactions, hover/enter states | `make-interfaces-feel-better` or `interaction-design` |
| Modern CSS, HTML APIs, client-side JS patterns | `modern-web-guidance` |
| OKLCH colors, gamut, contrast, palette generation | `oklch-skill` |
| WCAG accessibility audit and remediation | `wcag-audit-patterns` |
| Writing or running tests | `vitest` or `playwright-cli` |
| Debugging a bug or test failure | `systematic-debugging` |
| Test-driven development | `test-driven-development` |
| Writing implementation plans | `writing-plans` |
| Getting code review | `requesting-code-review` |
| TypeScript best practices, design patterns | `typescript-best-practices`, `solid-principles`, `gof-patterns`, or `design-principles` |
| Project brainstorming or exploration | `brainstorming` |
| Web performance audit or Core Web Vitals | `web-perf` |
| Baseline HTML/CSS styling for prose content | `baseline-styling` |
```

Cover every skill discovered. Use a concise, readable table format. If multiple skills could apply to the same task, list them all with `or`.

## Update AGENTS.md

1. Read `AGENTS.md`.
2. If a `## Skill Dispatch` section exists, **replace** it entirely with the new one.
3. If none exists, **append** the new section at the end.
4. Preserve everything else in AGENTS.md untouched.
