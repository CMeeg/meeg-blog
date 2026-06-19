<!-- OWNED BY /document - Appended to by every phase command. -->

# Decision Log — meeg-blog

Project decisions preserved for AI agents. Each entry is dated.

---

## 2026-06-15

### /explore decisions

- **Replatform to Dato CMS + Cloudflare.** Moving from Storyblok + Render to cut costs and simplify. Dato on Free plan, Cloudflare for near-zero hosting.
- **Cloudflare analytics over Plausible.** Built-in, free, good enough. No need for a paid analytics service.
- **Sentry dropped.** No error-tracking need identified for a personal blog. One less service to manage.
- **Design must be unique (no templates).** Acknowledged as a risk given no design background. Approach TBD.

## 2026-06-16

### /spec decisions

- **Design direction: Technical & Utilitarian.** Chosen over Clean/Minimal, Bold/Distinctive, and Warm/Approachable. Fits the author's identity as a software engineer.
- **Dracula colour palette.** Chosen because the author already uses the Dracula theme in their editor and terminal. Provides a cohesive dark-mode-first system with recognizable accent colours.
- **Orange links, not cyan.** Cyan was tested in-context on the home page and clashed with the coding palette. Orange provides better distinction from code syntax colours.
- **Link accent colour: orange.** Purple for mugshot ring and blockquotes.
- **Inter + JetBrains Mono.** Atlassian Sans was the initial prose preference but has no public CDN. Inter is the typeface Atlassian Sans is derived from — visually identical and freely available via @fontsource.
- **Full-width layout with readable measure.** Content constrained to 65ch, code blocks break out to full viewport width. Chosen over single-column-centered and two-column-with-sidebar.
- **Dark + light mode, system default, dark fallback.** Standard developer blog expectation.
- **Progressive glass header** — transparent at top of page, glass effect (backdrop-filter blur) fades in on scroll via IntersectionObserver.
- **No featured images on article pages.** Removed after user feedback that decorative hero images add scroll friction.
- **No reading time estimates.** Removed as redundant — readers take as long as they take.
- **No share links.** Users can copy/paste URLs.
- **Home page shows latest 2 posts as cards** with tags, images, excerpts. No pagination/infinite scroll.
- **Archive page reuses home page card grid.**
- **Piccalilli .flow rhythm applied throughout.** em-based spacing so rhythm scales with font size. Key principles: headings get 1.5em flow-space, element after heading gets 0.5em, body gets 1em default.
- **Layered, colour-matched box-shadows on cards** (Josh Comeau technique) for subtle depth without grey wash.
- **Coding motifs (// comments, ~ prompts) removed.** Tested and rejected — felt gimmicky rather than authentic.
- **Footer: minimal, 3 links + scroll-to-top.** Copyright mark (personal branding, not legal), GitHub link, RSS link on left. "Scroll to top" pill on the right. Comment-colour, unobtrusive. IntersectionObserver-driven visibility.

## 2026-06-17

### /explore decisions

- **Framework: Astro v6 confirmed.** Evaluated RedwoodSDK, Fresh, React Router v7, Remix v3, and Void as potential Next.js alternatives. Astro's v4-v6 additions (Actions, Sessions, SSR, middleware) make it viable for general-purpose apps beyond content sites, solving the "learning value for work" concern.
- **React Router v7 ruled out.** Shopify-owned — business partnership conflict at work.
- **Remix v3 is a different framework.** Complete rewrite with new component model (not React-hooks-based). In beta. Not a viable migration path from Remix v2.
- **Cloudflare-only frameworks (RedwoodSDK, Void) ruled out.** Work requires multi-cloud (Cloudflare + Azure) support.
- **Fresh (Deno + Preact) ruled out.** Runtime + framework shift too far from React/.NET team skills.

### /plan decisions

- **Solution setup plan created** (`docs/plans/2026-06-17-solution-setup.md`) — monorepo restructure, toolchain (Turborepo, Biome, Vitest), DatoCMS CLI config, and CI pipeline. 7 tasks, independently executable, must run before content model plan.
- **Content model plan updated** — Task 0 (monorepo restructure) removed. Now depends on solution setup plan being completed first.
- **Content model created via 5 CLI migrations.** Each migration targets one logical group (models, singletons, blocks, wireups, seed). Ran on `uat` fork and promoted to primary after each step.
- **Migrations in packages/dato-cms/migrations/** — configured via `datocms.config.json` at root.
- **uat sandbox** used for all migration testing.
- **Execution order:** Solution setup plan first, then content model plan.

## 2026-06-18

### /plan decisions

- **Visual design system plan created** (`docs/plans/2026-06-18-visual-design-system.md`) — produces design tokens, component mockups, and page layouts via Open Design collaboration, based on spec at `docs/specs/2026-06-16-visual-design.md`.
- **Depends on solution setup plan.** The monorepo structure (`apps/blog/src/styles/`) must be in place before CSS tokens are committed. Execution order: solution setup → design system → content model.
- **Execution mode:** Subagent-driven, on demand (user will trigger when ready).
- **Orange-link light mode resolution deferred to Open Design collaboration.** Task 5 of the plan resolves it within the collab session rather than deferring to implementation.
- **Light mode link colour resolved during collaboration.** Orange `#ffb86c` is illegible on light background (`#f8f8f2`). Resolved to `#d96c00` (burnt orange) for WCAG AA contrast in light mode.
- **Design token CSS extracted to `apps/blog/src/styles/tokens.css`.** Dark mode via `prefers-color-scheme` + `[data-theme="dark"]` override, light mode via `:root` default. Includes colour tokens, Utopia fluid type scale, rhythm tokens, glass header, card shadows, and link styling tokens.
- **Dracula palette preserved exactly in dark mode.** Light mode (Draco) colours adapted with: background `#f8f8f2`, text `#282a36`, surface `#ffffff`, muted `#e0e0e0`, accent colours shifted for light ground (cyans, greens, purples darkened).
- **Open Design project `meeg-blog-design-system`** contains 12 HTML artifacts: 1 entry index, 2 token references (dark + light), 6 component mockups, and 4 page mockups (home, article, about, archive) in both colour modes.
- **`@fontsource/inter` and `@fontsource/jetbrains-mono` installed** via pnpm workspace filter.
