# Architecture

> Owned by `/spec`. Reconciled by `/document`.

## System Overview

**meeg-blog** is a personal blog built on a **JAMstack architecture**: content managed in DatoCMS, served by Astro 6 at build time (SSG) and on request (SSR), deployed to Cloudflare Pages. A `@meeg-blog/dato-cms` package provides the typed client, entities, and services for querying the DatoCMS Content Delivery API (CDA) and running Content Management API (CMA) migrations.

```
┌──────────────┐     GraphQL (CDA)     ┌──────────────┐     pnpm workspace     ┌──────────────┐
│   DatoCMS    │ ◄──────────────────► │  @meeg-blog/  │ ◄──────────────────► │  @meeg-blog/  │
│  (Free Plan) │      read-only        │  blog (Astro) │     workspace:*       │  dato-cms     │
│              │                       │               │                       │  (TS library) │
│  Post, Tag,  │                       │  apps/blog/   │                       │  packages/    │
│  Series,     │                       │               │                       │  dato-cms/    │
│  About Page, │                       │  Cloudflare   │                       │               │
│  Site Config │                       │  Pages deploy │                       │  CLI: datocms │
└──────────────┘                       └──────────────┘                       │  migrations   │
                                                                            └──────────────┘
```

### Build & Deploy Pipeline

1. **Author**: writes/edits content in DatoCMS dashboard
2. **Build trigger**: Cloudflare Pages rebuilds on `main` push (or DatoCMS webhook)
3. **Astro build**: at build time, Astro queries DatoCMS CDA via `@meeg-blog/dato-cms`, generates static pages (SSG) with some SSR routes (e.g., archive with pagination)
4. **Deploy**: output goes to Cloudflare Pages global edge network
5. **Migrations**: DatoCMS schema changes are version-controlled in `packages/dato-cms/migrations/`, run via `datocms migrations:run` on a `uat` fork, then promoted to primary

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | **Astro 6** (SSG + SSR) |
| CMS | **DatoCMS** (Free Plan) — CDA for reads, CMA for migrations |
| Hosting | **Cloudflare Pages** |
| Monorepo | **pnpm 11 workspaces** + **Turborepo** task orchestration |
| Language | **TypeScript** (strict) |
| Lint/Format | **Biome** (JS/TS/CSS) — Astro files handled by Astro VS Code extension |
| Testing | **Vitest** — co-located tests (`src/foo.test.ts` beside `src/foo.ts`) |
| Fonts | **Inter** (prose/UI), **JetBrains Mono** (code) — via `@fontsource/inter`, `@fontsource/jetbrains-mono` |
| Design | **Dracula theme** palette — dark mode first, light mode complement, `prefers-color-scheme` with dark fallback |

## Project Structure

```
meeg-blog/
├── apps/
│   └── blog/                     # @meeg-blog/blog — Astro application
│       ├── astro.config.mjs
│       ├── src/
│       │   ├── assets/
│       │   ├── components/       # Astro components
│       │   ├── layouts/          # Page layouts
│       │   ├── pages/            # Routes: /, /about, /archive, /post/[slug]
│       │   └── styles/
│       │       └── tokens.css    # Design tokens (CSS custom properties)
│       └── public/
├── packages/
│   └── dato-cms/                 # @meeg-blog/dato-cms — CMS client, types, services
│       ├── src/
│       │   ├── index.ts          # Public API — types, client, entities, services
│       │   └── ...
│       ├── migrations/           # DatoCMS CLI migrations (version-controlled schema)
│       └── dist/                 # tsc output (gitignored)
├── docs/
│   ├── specs/                    # Design specs
│   ├── plans/                    # Implementation plans
│   ├── PROJECT.md                # Project definition (/explore)
│   ├── MEMORY.md                 # Decision log (/document)
│   └── ARCHITECTURE.md           # This file (/spec)
├── turbo.json                    # Turborepo pipeline
├── pnpm-workspace.yaml
├── biome.json
├── vitest.workspace.ts
└── datocms.config.json           # Points at packages/dato-cms/migrations/
```

## Data Model (DatoCMS)

| Kind | API Key | Purpose |
|---|---|---|
| Model | `post` | Blog articles with `title`, `slug`, `excerpt`, `body` (structured text), `tags`, `series`, `order_in_series`, `stale`, `seo` |
| Model | `tag` | Flat taxonomy — `name`, `slug`, `color` |
| Model | `series` | Ordered article groupings — `name`, `slug`, `description`, `seo` |
| Model | `about_page` | Singleton — `bio`, `mugshot`, `github_url`, `skills`, `experience`, `seo` |
| Model | `site_setting` | Singleton — `site_name`, `nav_links`, `social_links` |
| Block | `image_block` | Inline image in Post body (alt required) |
| Block | `skill_block` | Skill name (About page) |
| Block | `experience_entry_block` | Role, company, dates, description (About page) |
| Block | `nav_link_block` | Label + URL (Site Settings) |
| Block | `social_link_block` | Platform + URL (Site Settings) |

**Key modeling decisions:**
- **Content is data, not pages** — field names describe what content *is*, not how it looks
- **Models** for entities with independent lifecycle (Post, Tag, Series)
- **Blocks** for content that only makes sense inside a parent (skills, experience, nav links)
- **Structured Text (DAST)** for article bodies — native DatoCMS rich text with allowed node/mark constraints
- **Built-in meta** (`_firstPublishedAt`, `_publishedAt`) used directly — no custom date fields
- **Cascade strategy**: `fail` on publish/unpublish/delete for editorial safety

## Data Flow

### Content Query Flow (read path)

```
DatoCMS CDA  ──GraphQL──►  @meeg-blog/dato-cms  ──Types──►  Astro pages
                              (typed client,            (Astro.fetch() or
                               entities, services)       server islands)
```

- **Build time (SSG)**: Astro queries all published content via the typed CDA client, generates static HTML pages
- **Request time (SSR)**: Used for dynamic routes (pagination, tag filtering) or draft previews
- **Images**: DatoCMS imgix transformations serve responsive images; `alt` text required at asset upload
- **SEO**: `_seoMetaTags` queried per page; global SEO from site settings

### Content Management Flow (write path)

```
DatoCMS migrations  ──datocms CLI──►  DatoCMS CMA
(packages/dato-cms/migrations/)       (uat fork → promote to primary)
```

- Schema changes are version-controlled TypeScript migration files
- Each migration targets one logical group: models, singletons, blocks, wireups, seed
- Run on `uat` sandbox environment for testing, then promoted to primary

## Key Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | **Astro 6** | Mature SSG, good SSR support since v4-v6, familiar from v2, avoids Vercel lock-in |
| CMS | **DatoCMS** (Free Plan) | Cost-effective, excellent developer experience, Structured Text is best-in-class |
| Hosting | **Cloudflare Pages** | Near-zero cost, global edge, integrates with Cloudflare analytics (free, replaces Plausible) |
| Monorepo | **pnpm + Turborepo** | Workspace isolation (CMS tooling vs blog), shared tool versions via catalogs, task caching |
| Linting | **Biome** | Single tool for JS/TS/CSS, faster than ESLint+Prettier, no config sprawl |
| Testing | **Vitest** (co-located) | Fast, Jest-compatible, Vite-native |
| Design palette | **Dracula theme** | Author already uses it in editor/terminal — cohesive dark-mode-first system |
| Link colour (dark) | **Orange** (`#ffb86c`) | Tested and chosen over cyan — distinguishable from code syntax colours |
| Layout | **Full-width with 45rem content** | Readable measure (~65ch), code blocks break out full-bleed |
| Header | **Progressive glass** | Transparent at top → `backdrop-filter: blur(12px)` on scroll |
| Analytics | **Cloudflare built-in** | Free, good enough — replaced Plausible |
| Error tracking | **None** (dropped Sentry) | No need identified for a personal blog |
| Content migration | **Manual import** | <10 posts — not worth building an automated pipeline |

## Pages & Routes

| Route | Description | Source |
|---|---|---|
| `/` | Home page — hero + 2 latest post cards | `pages/index.astro` |
| `/archive` | Archive — full card grid (reuses card component) | `pages/archive.astro` |
| `/post/[slug]` | Article — full prose layout with code blocks | `pages/post/[slug].astro` |
| `/about` | About page — bio, skills, experience | `pages/about.astro` |
| `/tag/[slug]` | Tag archive — filtered card grid | `pages/tag/[slug].astro` |
| `/series/[slug]` | Series archive — ordered post listing | `pages/series/[slug].astro` |

## Visual System

- **Dark mode first**: `:root` defaults to light, `prefers-color-scheme: dark` and `[data-theme="dark"]` override
- **Fluid type scale**: Utopia `clamp()` — major third (1.25) at small viewports, perfect fourth (1.333) at large
- **Rhythm**: Piccalilli `.flow` pattern — `em`-based spacing via `--flow-space` custom property
- **Syntax highlighting**: Shiki with Dracula theme for code blocks
- **Components**: Progressive glass header, post cards, footer, code blocks, blockquotes, tag pills
