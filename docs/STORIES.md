<!-- OWNED BY /plan -->

# Stories — meeg-blog

> Canonical backlog. Consumed by the `bdd-specs` skill: each Story becomes a Feature, each acceptance criterion becomes a Scenario, and each distinct outcome becomes one Specification (one assertion).

## Definition of Ready

A story is ready to be picked up when:

- The role, capability, and value are all stated and non-hollow.
- Acceptance criteria exist, in Given/When/Then form, covering the happy path.
- Out-of-scope notes make the boundary explicit.
- It is small enough that its criteria can be enumerated (passes INVEST).

## Definition of Done

A story is done when:

- All acceptance criteria pass as executable specs (via `bdd-specs`).
- Edge/error criteria are covered, not just the happy path.
- All routes wired into the production binary and verified via a real request.

---

## Epic: Foundation & Infrastructure

_Establish the project scaffold, Dato CMS integration, and design system so content pages can be built on a working stack._

### STORY-001 — Project foundation

As a **developer**,
I want the project scaffolded as a pnpm monorepo with Astro SSR on Cloudflare Workers and Dato CMS integration,
so that I can begin building content pages on a working stack.

**Size:** M  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Dev server starts without errors
  Given a fresh checkout with all dependencies installed
  When  I run `pnpm dev` from the repo root
  Then  the dev server starts and listens on a local port

AC2 — Astro configures SSR + Cloudflare adapter
  Given the astro config file in `apps/blog`
  When  I inspect the output configuration
  Then  `output` is set to `'server'` and `@astrojs/cloudflare` adapter is registered

AC3 — Monorepo workspace configured with monorepo structure
  Given the project root
  When  I inspect `pnpm-workspace.yaml`
  Then  it includes `apps/*` and `packages/*` workspace directories

AC4 — storyblok-migration package exists with CMA client
  Given the `packages/storyblok-migration` directory
  When  I inspect its `package.json`
  Then  it has `@datocms/cma-client-node` as a dependency and a tsconfig

AC5 — Dato schema models exist after migrations
  Given a Dato CMS project with API tokens configured
  When  I run the schema migrations
  Then  models exist for Article, Tag, Series, Author, Page, and Global Settings with fields matching ARCHITECTURE.md

AC6 — CDA client returns published content
  Given the Dato CMS project has at least one Article record
  When  I call `executeQuery` with a published query
  Then  it returns typed response data containing the article

AC7 — CSS design tokens exist for light and dark themes
  Given the `apps/blog/src/styles/tokens.css` file
  When  I inspect its rules
  Then  CSS custom properties exist for color palette, typography, spacing, radii, and shadows under both `:root` and `[data-theme="dark"]`

AC8 — Base layout renders valid HTML5 document
  Given a page using BaseLayout
  When  it renders
  Then  the output has `<!DOCTYPE html>`, `<html>`, `<head>`, and `<body>` elements
```

**Out of scope:** Deploying to Cloudflare (delayed until after development), content migration (STORY-002), any page-level rendering.

---

### STORY-002 — Content migration

As a **blog owner**,
I want existing Storyblok articles migrated to Dato CMS via the Storyblok CLI and a throw-away migration script,
so that my published content is available on the new platform without manual copy-paste.

**Size:** M  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Storyblok CLI pulls all data locally
  Given a Storyblok space with articles, components, and assets
  When  I run `storyblok stories pull`, `components pull`, and `assets pull`
  Then  JSON files and asset files are saved to `.storyblok/` directory

AC2 — Migration script creates Article records from Storyblok stories
  Given local Storyblok export data with articles containing title, slug, summary, body, publish_date, and tags
  When  I run the migration script
  Then  each Storyblok story creates a Dato Article record with all fields populated correctly

AC3 — Tags migrated as Dato Tag records
  Given Storyblok export data with tag references
  When  I run the migration script
  Then  Dato Tag records are created and linked to Article records

AC4 — Rich text body transformed to Dato Structured Text
  Given a Storyblok article with formatted body content (headings, paragraphs, lists, code blocks, images)
  When  the migration script processes it
  Then  the body is stored as Dato Structured Text rendering equivalently

AC5 — Assets uploaded to Dato
  Given Storyblok article images
  When  the migration script runs
  Then  images are uploaded to Dato and referenced in Article records

AC6 — Migrated content queryable via CDA
  Given imported records exist in Dato
  When  I query via executeQuery
  Then  articles, tags, and all fields return with correct values
```

_Sad path:_

```
AC7 — Duplicate slug handled without crash
  Given a slug conflict during migration (same slug in both Storyblok and Dato)
  When  the script encounters it
  Then  it logs the conflict and skips or renames without crashing

AC8 — Complex transform flagged when identified
  Given body content with unsupported or ambiguous formatting during development
  When  the migration script encounters it
  Then  the transform is logged for manual resolution
```

**Out of scope:** Automated incremental sync from Storyblok; monitoring or ongoing migration support.

---

## Epic: Content Pages

_Deliver the core reading experience: browse, filter, and read articles._

### STORY-003 — Core reading experience (blog listing + article page)

As a **visitor**,
I want to browse a list of articles and read individual posts,
so that I can consume blog content.

**Size:** L  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Blog listing shows articles ordered by publish_date descending
  Given multiple Article records in Dato with varying publish dates
  When  I visit `/blog`
  Then  articles are displayed in reverse chronological order

AC2 — Article card shows title, excerpt, date, and tags
  Given an article card in the listing
  When  I view it
  Then  it displays the title, summary excerpt, publish date, and tag links pointing to `/tags/[tag]`

AC3 — Article card links to full article
  Given an article card
  When  I click the title
  Then  I navigate to `/blog/[slug]`

AC4 — Pagination appears when articles exceed page size
  Given more articles than the configured page size
  When  I visit `/blog`
  Then  older/newer pagination controls are visible and functional

AC5 — Article page renders full content
  Given a valid article slug
  When  I visit `/blog/[slug]`
  Then  I see the title, publish date, tags, and rendered Structured Text body

AC6 — Structured Text renders all supported elements
  Given article body with headings (h2-h4), paragraphs, bold/italic/code inline, code blocks, blockquotes, lists, and images
  When  rendered
  Then  each element renders as its semantic HTML equivalent with correct styling

AC7 — Code blocks use shiki syntax highlighting
  Given a code block with a language annotation
  When  rendered
  Then  the output is `<pre><code class="language-...">` with syntax-highlighted tokens applied server-side

AC8 — Series context shown on article page
  Given an article that belongs to a series
  When  I view the article page
  Then  the series title and links to other articles in the series are displayed

AC9 — Article page has canonical URL
  Given an article page
  When  rendered
  Then  it includes `<link rel="canonical">` pointing to the article's full URL
```

_Sad path:_

```
AC10 — Invalid slug returns 404
  Given a non-existent article slug
  When  I visit `/blog/invalid-slug`
  Then  I receive a 404 response
```

**Out of scope:** Visual Editing (STORY-011), comment system, social sharing buttons.

---

### STORY-004 — Tag filtering

As a **visitor**,
I want to view articles filtered by a specific tag,
so that I can find content on topics I care about.

**Size:** S  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Tag page shows filtered articles
  Given articles with the tag "typescript"
  When  I visit `/tags/typescript`
  Then  I see only articles tagged "typescript", ordered by publish_date descending

AC2 — Tag name displayed as page heading
  Given a tag page
  When  rendered
  Then  the tag name is shown as the page heading

AC3 — Pagination on tag pages
  Given more articles with the tag than the page size
  When  I visit `/tags/[tag]`
  Then  pagination controls are visible and functional
```

_Sad path:_

```
AC4 — Unknown tag returns empty or 404
  Given no articles with the tag "nonexistent"
  When  I visit `/tags/nonexistent`
  Then  I see an empty state or a 404 response
```

---

### STORY-005 — Home page

As a **visitor**,
I want to see recent articles highlighted on the home page,
so that I can quickly find the latest content.

**Size:** S  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Home shows recent articles
  Given published articles in Dato
  When  I visit `/`
  Then  I see a list of recent articles ordered by publish_date descending

AC2 — Site title and tagline displayed
  Given Global Settings with site_title and tagline
  When  I visit `/`
  Then  the site title and tagline are displayed

AC3 — Article cards link to full article
  Given a home page article card
  When  I click it
  Then  I navigate to `/blog/[slug]`
```

---

### STORY-006 — About page

As a **visitor**,
I want to read about the blog author,
so that I can learn who writes the content.

**Size:** S  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — About page shows author info
  Given the Author singleton in Dato with name, bio, and avatar
  When  I visit `/about`
  Then  I see the author name, rendered bio from Structured Text, and avatar image

AC2 — About page has SEO metadata
  Given the Author singleton has SEO fields configured
  When  I view the about page
  Then  it emits proper `<title>` and `<meta>` tags from the SEO field
```

---

## Epic: Site Chrome

_Consistent navigation, theming, and appearance across all pages._

### STORY-007 — Site chrome (navigation, footer, theme toggle)

As a **visitor**,
I want consistent navigation and appearance across all pages,
so that I can easily explore the site.

**Size:** M  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Header shows site logo and navigation links
  Given Global Settings with logo, site_title, and main_nav links
  When  any page renders
  Then  the header displays the logo (or title) and navigation links

AC2 — Current section visually indicated in nav
  Given a page in the /blog section
  When  the header renders
  Then  the "Blog" navigation link has an active/current visual indicator

AC3 — Footer shows copyright and social links
  Given Global Settings with copyright text and social_links
  When  any page renders
  Then  the footer displays the copyright notice and social media links

AC4 — Theme toggle switches between light and dark
  Given the theme toggle button in the header
  When  I click it
  Then  the theme switches from light to dark (or vice versa) and the `data-theme` attribute on `<html>` updates

AC5 — Theme preference persists across page loads
  Given a theme preference saved in localStorage
  When  I reload the page
  Then  the saved theme is applied without flashing

AC6 — No saved preference respects system preference
  Given no saved theme in localStorage and `prefers-color-scheme: dark`
  When  the page loads
  Then  the dark theme is applied

AC7 — No flash of wrong theme on page load
  Given the page HTML
  When  inspected
  Then  a critical inline script in `<head>` sets the `data-theme` attribute before the first paint
```

---

## Epic: SEO & Discoverability

_Make content discoverable by search engines and presentable when shared on social platforms._

### STORY-008 — Global SEO

As a **search engine** and **social platform**,
I want every page to have proper meta tags and structured data,
so that content is discoverable and looks good when shared.

**Size:** M  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Every page has title and description meta tags
  Given any page
  When  rendered
  Then  it emits `<title>` and `<meta name="description">`

AC2 — Every page has Open Graph meta tags
  Given any page
  When  rendered
  Then  it emits `og:title`, `og:description`, `og:type`, `og:url`, and `og:image`

AC3 — Every page has Twitter Card meta tags
  Given any page
  When  rendered
  Then  it emits `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image`

AC4 — Every page has canonical link
  Given any page
  When  rendered
  Then  it includes `<link rel="canonical">`

AC5 — Article pages emit article-specific OG tags
  Given an article page
  When  rendered
  Then  it emits `og:type: article`, `article:published_time`, and `article:tag`

AC6 — Article pages include JSON-LD structured data
  Given an article page
  When  rendered
  Then  the HTML includes a `<script type="application/ld+json">` block with BlogPosting or NewsArticle schema

AC7 — Page-specific SEO overrides Global Settings defaults
  Given a page with its own SEO field and Global Settings with different values
  When  rendered
  Then  page-specific values take precedence over defaults
```

---

### STORY-009 — Crawler support (sitemap + robots.txt)

As a **search engine crawler**,
I want to discover all public pages via sitemap and robots.txt,
so that content is indexed.

**Size:** S  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Sitemap lists all published article URLs
  Given published articles in Dato
  When  I fetch `/sitemap.xml`
  Then  it contains a `<url>` entry for each article with `<lastmod>`

AC2 — Sitemap includes page URLs
  Given the sitemap
  When  I inspect it
  Then  it also includes entries for `/`, `/about`, and `/blog`

AC3 — Sitemap conforms to XML protocol
  Given the sitemap
  When  I validate it
  Then  it is valid XML matching the sitemaps.org schema

AC4 — Robots.txt allows all crawlers and points to sitemap
  Given `/robots.txt`
  When  I fetch it
  Then  it contains `Allow: /` and `Sitemap: <full sitemap URL>`
```

---

### STORY-010 — Custom 404 page

As a **visitor**,
I want to see a friendly custom page when I visit a non-existent URL,
so that I'm not confused by a default browser or Cloudflare error.

**Size:** XS  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Custom 404 page displayed for unknown routes
  Given a non-existent URL
  When  I visit it
  Then  I see a custom 404 page with a user-friendly message

AC2 — 404 page has noindex
  Given the 404 page
  When  rendered
  Then  it includes `<meta name="robots" content="noindex">`
```

---

## Epic: Visual Editing

_Enable draft previewing and inline editing through DatoCMS Visual Editing features._

### STORY-011 — Visual Editing (Draft Mode, Content Link, Web Previews)

As a **content editor**,
I want to preview draft changes and edit content inline in DatoCMS,
so that I can see how content looks before publishing and make quick edits.

**Size:** L  ·  **Status:** drafting

**Acceptance criteria**

_Happy path:_

```
AC1 — Draft mode enable sets signed cookie and redirects
  Given a valid token and a relative redirect path
  When  I call `GET /api/draft-mode/enable?token=<valid>&redirect=/blog/post`
  Then  it sets a signed JWT cookie with sameSite:none, secure:true, partitioned:true and redirects to `/blog/post`

AC2 — Draft mode disable removes cookie
  Given an active draft mode session
  When  I call `GET /api/draft-mode/disable`
  Then  the cookie is removed and the response redirects

AC3 — Draft mode uses draft CDA token
  Given draft mode is active
  When  a page calls executeQuery
  Then  it uses `DATOCMS_DRAFT_CONTENT_CDA_TOKEN` with `includeDrafts: true`

AC4 — Content Link stega present in draft mode
  Given draft mode is active
  When  a page renders article content
  Then  stega-encoded metadata is present in field values

AC5 — Content Link stega absent in published mode
  Given draft mode is inactive
  When  a page renders
  Then  no stega metadata is present in the response

AC6 — Content Link component renders in draft mode
  Given draft mode is active
  When  a page renders
  Then  the Content Link overlay component is present in the DOM

AC7 — Web Previews endpoint returns preview links
  Given a valid POST from DatoCMS with an article record
  When  I call `/api/preview-links`
  Then  it returns 200 with `{ previewLinks: [{ label, url }] }`

AC8 — Web Previews handles unmatched records
  Given a record type that has no frontend route
  When  I call `/api/preview-links`
  Then  it returns 200 with `{ previewLinks: [] }`

AC9 — CORS headers set on preview-links endpoint
  Given an OPTIONS preflight request to `/api/preview-links`
  When  I inspect the response
  Then  it includes `Access-Control-Allow-Origin: *`

AC10 — CSP allows DatoCMS iframe embedding
  Given any page rendered with draft mode
  When  I inspect the CSP header
  Then  it includes `frame-ancestors 'self' https://plugins-cdn.datocms.com`

AC11 — Draft responses bypass CDN cache
  Given a draft mode request
  When  I inspect response headers
  Then  Cache-Control is absent or set to `private`
```

_Sad path:_

```
AC12 — Invalid token returns 401
  Given a request with an invalid or missing token
  When  I call `/api/draft-mode/enable`
  Then  it returns HTTP 401

AC13 — Absolute redirect URL rejected
  Given a request with an absolute redirect URL
  When  I call `/api/draft-mode/enable?token=<valid>&redirect=https://evil.com`
  Then  it returns HTTP 422 with an error
```
