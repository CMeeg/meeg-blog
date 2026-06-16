<!-- OWNED BY /plan -->

# Plan — meeg-blog

Executable checklist for `/build-loop`. Each task is a reviewable, committable unit of work. Tasks run top-to-bottom respecting `depends-on`; tasks with the same `parallel-group` tag have no ordering between them.

---

## Legend

| Tag | Meaning |
|-----|---------|
| `story:` | The user story this task implements |
| `depends-on:` | Task(s) that must be completed first |
| `parallel-group:` | Tasks that can run concurrently (same letter = no ordering constraint) |

---

## Checklist

### STORY-001 — Project foundation

- [ ] **T001-scaffold-monorepo** — Initialize pnpm workspace at repo root: update `pnpm-workspace.yaml` with `packages: ['apps/*', 'packages/*']`, create root `package.json` (private, `type: module`, node engine >=22.12, pnpm engine 11, scripts forwarding dev/build/preview to `apps/blog`), create root `tsconfig.json` (composite references), create root `.editorconfig`, create root `.gitignore` (node_modules, dist, .wrangler, .env), create root `.env.example` with all required env vars from ARCHITECTURE.md
  - `story:` STORY-001
  - `depends-on:` (none)
  - `parallel-group:` A

- [ ] **T002-scaffold-blog-app** — Create `apps/blog/package.json` with Astro 6, `@astrojs/cloudflare`, `@datocms/cda-client`, `@datocms/astro`, `@datocms/content-link`, `@datocms/rest-client-utils`, `jose`, `serialize-error`, `vitest`; create `apps/blog/astro.config.mjs` with `output: 'server'`, `@astrojs/cloudflare` adapter, site URL; create `apps/blog/wrangler.jsonc` with `compatibility_date`, `observability` enabled; create `apps/blog/tsconfig.json` extending root; run `pnpm install` from root to link workspace; move existing `src/`, `public/`, `tests/` content into `apps/blog/`
  - `story:` STORY-001
  - `depends-on:` T001-scaffold-monorepo
  - `parallel-group:` A

- [ ] **T003-scaffold-migration-package** — Create `packages/storyblok-migration/package.json` with `@datocms/cma-client-node` dependency, `type: module`; create `packages/storyblok-migration/tsconfig.json` extending root; create `packages/storyblok-migration/src/index.ts` entry point with placeholder; run `pnpm install` from root
  - `story:` STORY-001
  - `depends-on:` T001-scaffold-monorepo
  - `parallel-group:` A

- [ ] **T004-setup-dato-schema** — Create Dato CMS account (if needed), define models via `datocms migrations:new` for Article, Tag, Series, Author, Page, and Global Settings with fields matching ARCHITECTURE.md; create baseline migration; run `datocms migrations:run`
  - `story:` STORY-001
  - `depends-on:` T002-scaffold-blog-app
  - `parallel-group:`

- [ ] **T005-build-cda-client** — Create `apps/blog/src/lib/datocms/executeQuery.ts` with `executeQuery` wrapper using `@datocms/cda-client`; support published + draft CDA tokens, `includeDrafts`, `contentLink: 'v1'`, `baseEditingUrl`; use `astro:env/server` for env var access; include `isDraftModeEnabled(Astro.cookies)` helper; include `stripStega` wrapper for non-render text
  - `story:` STORY-001
  - `depends-on:` T002-scaffold-blog-app
  - `parallel-group:` B

- [ ] **T006-create-design-tokens** — Create `apps/blog/src/styles/tokens.css` with CSS custom properties for light and dark themes: color palette, typography (font-family, sizes, weights), spacing scale, border radii, shadows, breakpoints; also create `apps/blog/src/styles/global.css` with reset and base element styles
  - `story:` STORY-001
  - `depends-on:` T002-scaffold-blog-app
  - `parallel-group:` B

- [ ] **T007-create-base-layout** — Create `apps/blog/src/layouts/BaseLayout.astro` with HTML5 document shell, `<slot />`, CSS imports, and critical inline theme script (reads localStorage, sets `data-theme` before paint); create `apps/blog/src/layouts/SiteLayout.astro` wrapping BaseLayout with Header + Footer slots
  - `story:` STORY-001
  - `depends-on:` T006-create-design-tokens
  - `parallel-group:`

### STORY-002 — Content migration

- [ ] **T008-pull-storyblok-data** — Install `storyblok` CLI globally or locally, run `storyblok login`, pull stories (`storyblok stories pull --space <id>`), components (`storyblok components pull --space <id>`), and assets (`storyblok assets pull --space <id>`) to `.storyblok/` at repo root
  - `story:` STORY-002
  - `depends-on:` T001-scaffold-monorepo
  - `parallel-group:`

- [ ] **T009-write-migration-tool** — Write throw-away Node.js/TypeScript script in `packages/storyblok-migration/src/` that: reads local Storyblok JSON from `.storyblok/`, maps articles/tags/series to Dato schema, transforms Storyblok rich text to Dato Structured Text, uploads assets to Dato via CMA, creates records via `@datocms/cma-client-node`; flag and log complex transforms encountered
  - `story:` STORY-002
  - `depends-on:` T003-scaffold-migration-package, T008-pull-storyblok-data
  - `parallel-group:`

- [ ] **T010-run-migration** — Execute the migration script against the Dato project; handle errors (duplicate slugs, missing fields) gracefully; re-run as needed until clean
  - `story:` STORY-002
  - `depends-on:` T009-write-migration-tool, T004-setup-dato-schema
  - `parallel-group:`

- [ ] **T011-verify-migration** — Query Dato CDA to confirm all records exist with correct field values; spot-check Structured Text rendering for content fidelity across headings, paragraphs, lists, code blocks, and images
  - `story:` STORY-002
  - `depends-on:` T010-run-migration, T005-build-cda-client
  - `parallel-group:`

### STORY-003 — Core reading experience

- [ ] **T012-create-article-card** — Create `apps/blog/src/components/ArticleCard.astro` displaying title, summary excerpt, publish date, tags with links to `/tags/[tag]`, and link to `/blog/[slug]`
  - `story:` STORY-003
  - `depends-on:` T005-build-cda-client, T007-create-base-layout
  - `parallel-group:` C

- [ ] **T013-create-pagination** — Create `apps/blog/src/components/Pagination.astro` with older/newer links, accepting page number and total pages props; handles first/last/edge states
  - `story:` STORY-003
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` C

- [ ] **T014-create-structured-text** — Create `apps/blog/src/components/StructuredText.astro` wrapping `@datocms/astro/StructuredText` with block resolvers (CodeBlock, Image, custom blocks); add `data-datocms-content-link-group` wrapper
  - `story:` STORY-003
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` C

- [ ] **T015-create-code-block** — Create `apps/blog/src/components/CodeBlock.astro` using shiki for syntax highlighting; renders `<pre><code class="language-...">` with server-side highlighted tokens; language detection from fenced block metadata
  - `story:` STORY-003
  - `depends-on:` T006-create-design-tokens
  - `parallel-group:` C

- [ ] **T016-create-image** — Create `apps/blog/src/components/Image.astro` wrapping `@datocms/astro/Image` with responsive `<img>`, `loading="lazy"`, alt text, captions
  - `story:` STORY-003
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` C

- [ ] **T017-build-blog-listing** — Create `apps/blog/src/pages/blog/index.astro` querying all articles via CDA, paginated, using ArticleCard + Pagination; handles empty state
  - `story:` STORY-003
  - `depends-on:` T012-create-article-card, T013-create-pagination, T011-verify-migration
  - `parallel-group:`

- [ ] **T018-build-article-page** — Create `apps/blog/src/pages/blog/[slug].astro` querying single article via CDA, rendering with StructuredText, CodeBlock, Image, series context, tags, canonical URL; returns 404 for missing slug
  - `story:` STORY-003
  - `depends-on:` T014-create-structured-text, T015-create-code-block, T016-create-image, T011-verify-migration
  - `parallel-group:`

- [ ] **T019-wire-blog** — Verify `blog/index.astro` and `blog/[slug].astro` routes through production binary: `pnpm build` succeeds from `apps/blog`, preview server serves real HTML at `/blog` and `/blog/[slug]`
  - `story:` STORY-003
  - `depends-on:` T017-build-blog-listing, T018-build-article-page
  - `parallel-group:`

### STORY-004 — Tag filtering

- [ ] **T020-build-tag-page** — Create `apps/blog/src/pages/tags/[tag].astro` querying articles by tag via CDA, paginated, using ArticleCard + Pagination; shows tag name as heading; handles empty/unknown tag with 404
  - `story:` STORY-004
  - `depends-on:` T012-create-article-card, T013-create-pagination, T019-wire-blog
  - `parallel-group:`

- [ ] **T021-wire-tags** — Verify `/tags/[tag]` route through production binary: `pnpm build` succeeds, preview serves real HTML for a known tag
  - `story:` STORY-004
  - `depends-on:` T020-build-tag-page
  - `parallel-group:`

### STORY-005 — Home page

- [ ] **T022-build-home-page** — Create/update `apps/blog/src/pages/index.astro` to query recent articles via CDA and display using ArticleCard; show site title and tagline from Global Settings
  - `story:` STORY-005
  - `depends-on:` T012-create-article-card, T005-build-cda-client
  - `parallel-group:` D

- [ ] **T023-wire-home** — Verify `/` route through production binary: build succeeds, preview serves recent articles
  - `story:` STORY-005
  - `depends-on:` T022-build-home-page
  - `parallel-group:`

### STORY-006 — About page

- [ ] **T024-build-about-page** — Create `apps/blog/src/pages/about.astro` querying Author singleton via CDA; render name, bio (StructuredText), avatar (Image component)
  - `story:` STORY-006
  - `depends-on:` T014-create-structured-text, T016-create-image, T005-build-cda-client
  - `parallel-group:` D

- [ ] **T025-wire-about** — Verify `/about` route through production binary
  - `story:` STORY-006
  - `depends-on:` T024-build-about-page
  - `parallel-group:`

### STORY-007 — Site chrome

- [ ] **T026-build-header** — Create `apps/blog/src/components/Header.astro` displaying site logo/title (from Global Settings), navigation links, theme toggle button; highlights current page/section
  - `story:` STORY-007
  - `depends-on:` T005-build-cda-client, T006-create-design-tokens
  - `parallel-group:` E

- [ ] **T027-build-footer** — Create `apps/blog/src/components/Footer.astro` displaying copyright notice and social media links from Global Settings
  - `story:` STORY-007
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` E

- [ ] **T028-build-theme-toggle** — Implement theme toggle: inline script in BaseLayout reading localStorage + `prefers-color-scheme`, setting `data-theme` on `<html>`; toggle button in Header; theme preference saved to localStorage on click
  - `story:` STORY-007
  - `depends-on:` T007-create-base-layout
  - `parallel-group:` E

- [ ] **T029-wire-chrome** — Wire Header into SiteLayout, Footer into SiteLayout, theme toggle into BaseLayout; verify across all page routes
  - `story:` STORY-007
  - `depends-on:` T026-build-header, T027-build-footer, T028-build-theme-toggle
  - `parallel-group:`

### STORY-008 — Global SEO

- [ ] **T030-create-seo-component** — Create `apps/blog/src/components/Seo.astro` wrapping `@datocms/astro/Seo` with fallback to Global Settings defaults; emits title, description, OG, Twitter Card, canonical; includes `stripStega()` for meta text fields
  - `story:` STORY-008
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` E

- [ ] **T031-add-jsonld** — Create `apps/blog/src/components/JsonLd.astro` generating `<script type="application/ld+json">` with BlogPosting/NewsArticle schema for article pages; uses `stripStega()` for text values
  - `story:` STORY-008
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` E

- [ ] **T032-wire-seo** — Wire Seo component into BaseLayout (for defaults) and into each page (for overrides); wire JsonLd into article page; verify meta tags present in rendered HTML across all routes
  - `story:` STORY-008
  - `depends-on:` T030-create-seo-component, T031-add-jsonld, T029-wire-chrome
  - `parallel-group:`

### STORY-009 — Crawler support

- [ ] **T033-build-sitemap** — Create `apps/blog/src/pages/sitemap.xml.ts` generating XML sitemap with all article URLs (+ lastmod) and page URLs; conforms to sitemaps.org protocol
  - `story:` STORY-009
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` F

- [ ] **T034-build-robots** — Create `apps/blog/src/pages/robots.txt.ts` with `Allow: /` and `Sitemap:` pointing to full sitemap URL
  - `story:` STORY-009
  - `depends-on:` T033-build-sitemap
  - `parallel-group:`

- [ ] **T035-wire-crawler** — Verify `/sitemap.xml` and `/robots.txt` through production binary
  - `story:` STORY-009
  - `depends-on:` T034-build-robots
  - `parallel-group:`

### STORY-010 — Custom 404 page

- [ ] **T036-build-404** — Create `apps/blog/src/pages/404.astro` with user-friendly message and `noindex`; rendered via SiteLayout
  - `story:` STORY-010
  - `depends-on:` T029-wire-chrome
  - `parallel-group:`

- [ ] **T037-wire-404** — Verify unknown routes display custom 404 through production binary
  - `story:` STORY-010
  - `depends-on:` T036-build-404
  - `parallel-group:`

### STORY-011 — Visual Editing

- [ ] **T038-build-draft-enable** — Create `apps/blog/src/pages/api/draft-mode/enable.ts`: validates `token` query param against `SECRET_API_TOKEN` (401 if invalid), validates `redirect` is relative URL (422 if absolute), sets signed JWT cookie with `jose` (sameSite:none, secure:true, partitioned:true), redirects
  - `story:` STORY-011
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` G

- [ ] **T039-build-draft-disable** — Create `apps/blog/src/pages/api/draft-mode/disable.ts`: removes JWT cookie, redirects
  - `story:` STORY-011
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` G

- [ ] **T040-build-preview-links** — Create `apps/blog/src/pages/api/preview-links.ts`: accepts POST from DatoCMS, maps records to frontend URLs via `recordToWebsiteRoute`, handles CORS (OPTIONS preflight, `Access-Control-Allow-Origin: *`), returns `{ previewLinks: [...] }` or empty array for unmatched records
  - `story:` STORY-011
  - `depends-on:` T005-build-cda-client
  - `parallel-group:` G

- [ ] **T041-add-content-link** — Add `<ContentLink />` from `@datocms/astro` to SiteLayout (rendered only when draft mode is active); wrap StructuredText in `data-datocms-content-link-group`, block/inline renderers in `data-datocms-content-link-boundary`; update `executeQuery` to pass `contentLink: 'v1'` and `baseEditingUrl` when draft active
  - `story:` STORY-011
  - `depends-on:` T038-build-draft-enable, T007-create-base-layout
  - `parallel-group:`

- [ ] **T042-add-middleware** — Create `apps/blog/src/middleware/index.ts` setting CSP header `frame-ancestors 'self' https://plugins-cdn.datocms.com`; set `Cache-Control` headers (`public, max-age=60, s-maxage=300` for published, absent/private for draft)
  - `story:` STORY-011
  - `depends-on:` T032-wire-seo
  - `parallel-group:`

- [ ] **T043-wire-visual-editing** — Verify all Visual Editing endpoints through production binary: enable/disable draft mode, preview-links POST, CSP header present, Cache-Control header present
  - `story:` STORY-011
  - `depends-on:` T038-build-draft-enable, T039-build-draft-disable, T040-build-preview-links, T041-add-content-link, T042-add-middleware
  - `parallel-group:`
