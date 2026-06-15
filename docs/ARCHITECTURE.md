<!-- OWNED BY /design -->

# Architecture — meeg-blog

## Stack

| Concern | Choice |
|---|---|
| Framework | Astro 6 |
| SSR adapter | `@astrojs/cloudflare` |
| Hosting | Cloudflare Workers (SSR, on-demand) |
| CMS | Dato CMS (Free plan) |
| Content API | `@datocms/cda-client` via `executeQuery` |
| Rich text | Dato Structured Text |
| Analytics | Cloudflare Web Analytics (built-in) |
| Code highlighting | shiki |
| CSS | CSS custom properties (tokens from Open Design AI) |
| Client interactivity | Theme switcher only (vanilla JS, no framework) |
| Astro integration | `@datocms/astro` (StructuredText, Seo, Image, ContentLink) |
| CLI / migrations | `datocms` (schema management, codegen) |
| Env vars | `astro:env/server` with typed schema |

## Runtime mode

SSR on Cloudflare Workers via `@astrojs/cloudflare` (`output: 'server'`). Each request hits the Cloudflare Worker, which fetches content from Dato's GraphQL CDN API and renders HTML. Content is fresh on every request; Dato's CDN layer provides global edge caching.

## Data model (Dato CMS)

~72 records total — well within Free plan limit of 300.

### Global Settings (singleton)

| Field | Type |
|---|---|
| site_title | string |
| logo | file / image |
| main_nav | repeated group (label + url) |
| copyright | string |
| social_links | repeated group (platform + url) |
| Built-in SEO field | Dato `_seoMetaTags` (auto-handles title, description, OG, Twitter Card) |

### Page (collection)

| Field | Type |
|---|---|
| title | string |
| slug | string (unique) |
| body | Structured Text |
| Built-in SEO field | Dato `_seoMetaTags` |

### Article (collection)

| Field | Type |
|---|---|
| title | string |
| slug | string (unique) |
| summary | text |
| body | Structured Text |
| publish_date | date |
| tags | references to Tag (many) |
| series | reference to Series (single) |
| featured_image | file / image (`required_alt_title` validator) |
| Built-in SEO field | Dato `_seoMetaTags` |

### Author (singleton)

| Field | Type |
|---|---|
| name | string |
| bio | Structured Text |
| avatar | file / image (`required_alt_title` validator) |
| Built-in SEO field | Dato `_seoMetaTags` |

### Tag (collection)

| Field | Type |
|---|---|
| name | string |
| slug | slug (auto-fill from `name`) |

### Series (collection)

| Field | Type |
|---|---|
| title | string |
| summary | text |
| articles | reverse reference from Article → series (requires `inverse_relationships_enabled` on model) |

## Component tree

```
Cloudflare Worker (@astrojs/cloudflare)
└── Astro SSR renderer
    ├── BaseLayout.astro
    │   └── SiteLayout.astro
    │       ├── Header.astro        (nav, theme toggle)
    │       ├── [slot]              (page content)
    │       └── Footer.astro
    ├── Pages (routes)
    │   ├── / → index.astro
    │   ├── /about → about.astro
    │   ├── /blog → blog/index.astro
    │   ├── /blog/[slug] → blog/[slug].astro
    │   ├── /tags/[tag] → tags/[tag].astro
    │   ├── /404 → 404.astro
    │   ├── /robots.txt → robots.txt.ts
    │   └── /sitemap.xml → sitemap.xml.ts
    ├── API routes
    │   ├── /api/draft-mode/enable  (enable draft mode, redirect)
    │   ├── /api/draft-mode/disable (disable draft mode, redirect)
    │   └── /api/preview-links      (Web Previews plugin endpoint)
    └── Shared components
        ├── ArticleCard.astro       (listing card)
        ├── Pagination.astro
        ├── StructuredText.astro    (@datocms/astro/StructuredText wrapper with data-datocms-content-link-group)
        ├── CodeBlock.astro         (shiki via nodeOverrides)
        ├── Seo.astro               (@datocms/astro/Seo wrapper)
        ├── Image.astro             (@datocms/astro/Image wrapper)
        └── ContentLink.astro       (@datocms/astro/ContentLink, draft only)
```

## Data flow

### Content rendering

```
Browser ──GET──▶ Cloudflare CDN
                    │ (cache miss)
              Cloudflare Worker
                    │
              Astro route match
                    │
              lib/datocms/executeQuery.ts  (@datocms/cda-client)
              → executeQuery(query, { includeDrafts, contentLink, baseEditingUrl })
                    │
              Dato GraphQL CDN API
                    │ (cached at Dato edge)
              Structured content with optional stega (JSON)
                    │
              Astro renders HTML
              (StructuredText, Seo, Image, CodeBlock components)
                    │
              HTML response ──▶ Browser
```

### Draft mode flow

```
Editor publishes in Dato CMS ──▶ Dato webhook (optional)
                                      │
Draft mode request ──▶ GET /api/draft-mode/enable?token=<secret>&redirect=/blog/post
                           │
                      Set signed cookie (JWT)
                           │
                      Redirect → /blog/post
                           │
                      Astro page calls executeQuery()
                      with includeDrafts: true,
                      contentLink: 'v1',
                      baseEditingUrl: <admin URL>
                           │
                      Dato returns stega-encoded content
                           │
                      <ContentLink /> scans DOM for stega
                      and renders click-to-edit overlays
```

- Draft mode enabled via signed JWT cookie (`sameSite: 'none'`, `secure: true`, `partitioned: true` — CHIPS for iframe support in DatoCMS Web Previews Visual tab)
- `executeQuery` wrapper checks `isDraftModeEnabled(Astro.cookies)` → sets `includeDrafts`, `contentLink`, `baseEditingUrl`
- Content Link stega only present on draft responses — published content has no stega
- `stripStega()` before piping text into `<meta>` tags, JSON-LD, URL generation (slug fields never carry stega — use directly)
- `revealStega()` / `decodeStega()` from `@datocms/content-link` for debugging stega issues
- CSP header: `frame-ancestors 'self' https://plugins-cdn.datocms.com` set via Astro middleware to allow iframe embedding in Web Previews Visual tab

### Caching

- Dato GraphQL CDN API globally cached by Dato infrastructure
- Worker sets `Cache-Control: public, max-age=60, s-maxage=300` for CDN edge caching
- Draft responses bypass CDN cache (no `Cache-Control` or `private`)

## Environment variables

| Variable | Context | Description |
|---|---|---|
| `DATOCMS_PUBLISHED_CONTENT_CDA_TOKEN` | server (secret) | Published content CDA token |
| `DATOCMS_DRAFT_CONTENT_CDA_TOKEN` | server (secret) | Draft content CDA token |
| `SECRET_API_TOKEN` | server (secret) | Shared secret for draft/webhook auth |
| `SIGNED_COOKIE_JWT_SECRET` | server (secret) | JWT signing key for draft cookie |
| `DRAFT_MODE_COOKIE_NAME` | client (public) | Cookie name, e.g. `datocms-draft-mode` |
| `DATOCMS_BASE_EDITING_URL` | server (public) | Admin URL for Content Link, e.g. `https://<project>.admin.datocms.com` |

**Local dev:** put all env vars in `.env` (picked up by `astro dev` and `wrangler dev` via `@astrojs/cloudflare`).
**Production:** use `wrangler secret put <KEY>` or Cloudflare dashboard — never commit secrets to source.

## Deployment configuration

`wrangler.jsonc` (generated by `@astrojs/cloudflare` from `astro.config.mjs`) controls Worker settings. Key fields:

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "meeg-blog",
  "compatibility_date": "2026-06-15",
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1
  }
}
```

- `compatibility_date` — set to today on new projects, update quarterly to get new runtime features
- `observability` — enables Worker logs in the Cloudflare dashboard (head sampling rate 1 = all requests)
- Secrets managed via `wrangler secret put`, not in config

No `nodejs_compat` flag needed — `jose` uses Web Crypto API natively available in the Workers runtime.

## CSS / Design tokens

Open Design AI produces a `DESIGN.md` design system file with tokens for colour palette (light + dark), typography, spacing, radii, shadows, and breakpoints. These map directly to CSS custom properties in `src/styles/tokens.css`:

```css
:root {
  --color-primary: #...;
  --font-body: '...', system-ui;
  --space-md: 1rem;
  /* etc. */
}

[data-theme="dark"] {
  --color-primary: #...;
}
```

Component stylesheets reference these variables — no utility framework, no CSS modules pre-processor, just scoped CSS using the token variables.

## Client interactivity

Two interactive elements:

1. **Dark/light theme toggle** — vanilla JS inline script with `client:idle` directive. No framework needed. Theme preference in `localStorage`; default respects `prefers-color-scheme`.
2. **Content Link overlays** — `@datocms/astro/ContentLink` component in layout, rendered only when draft mode is active. Handles click-to-edit overlay rendering automatically.

## Dependencies

| Package | Purpose |
|---|---|
| `@datocms/cda-client` | GraphQL CDA client (`executeQuery`, `rawExecuteQuery`) |
| `@datocms/astro` | Astro components (StructuredText, Seo, Image, ContentLink) |
| `@datocms/content-link` | Stega utilities, click-to-edit controller |
| `@datocms/rest-client-utils` | Record deserialization for Web Previews |
| `jose` | JWT signing/verification for draft mode cookie (Web Crypto API, Workers-native) |
| `serialize-error` | Error serialization in API routes |
| `datocms` (dev) | CLI for schema management, migrations, codegen |

## Key decisions

| Decision | Choice | Rejected | Rationale |
|---|---|---|---|
| Runtime | SSR (Workers, `output: 'server'`) | Static rebuild, full static | On-demand fresh content; Dato CDN caches GraphQL responses; Cloudflare Worker free tier sufficient |
| Rich text | Dato Structured Text | Markdown, custom blocks | Structured data allows reliable rendering of code blocks, images, embeds; familiar from Storyblok workflow |
| CSS approach | CSS custom props + Open Design AI tokens | Tailwind, CSS Modules from scratch, pre-built template | Open Design AI outputs tokens as DESIGN.md → map to CSS vars; flexible, no framework lock-in, unique design possible |
| Client framework | Vanilla JS | Preact (from old blog) | Theme toggle only; Preact bundle is unnecessary for one interactive element |
| Analytics | Cloudflare Web Analytics | Plausible, none | Free, built-in, privacy-friendly, zero config on Cloudflare infra |
| Error tracking | None | Sentry | No need identified for a personal blog |
| Hosting | Cloudflare Workers | Cloudflare Pages static, Render | Workers support SSR; free tier covers personal blog traffic |
| Visual Editing | Draft Mode + Content Link + Web Previews | Full static (incompatible) | Available on Dato Free plan; Draft Mode + stega via `contentLink: 'v1'` in `executeQuery` |
| GraphQL client | `@datocms/cda-client` via `executeQuery` | Custom fetch, Storyblok SDK | Official Dato client; auto-retry, caching, draft mode, Content Link support |
| Frontend components | `@datocms/astro` (StructuredText, Seo, Image, ContentLink) | Custom RichText renderer, manual SEO | Official Dato package; handles stega, responsive images, SEO meta tags |
| JWT library | `jose` | `jsonwebtoken` | `jose` uses Web Crypto API (`crypto.subtle`) natively available in Workers runtime; `jsonwebtoken` depends on Node.js `crypto`/`Buffer` with limited Workers compatibility |
| Content model | Dato built-in SEO field type | Manual metadata text fields | Single field handles title, description, OG, Twitter Card — no manual field management |
| Schema management | `datocms` CLI via migrations | Direct CMA mutations | Versioned, reviewable schema changes using `migrations:new` / `migrations:run` |
| Image fields | `required_alt_title` validator | Unvalidated file fields | Ensures editors always provide alt text and title for accessibility |
