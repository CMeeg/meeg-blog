<!-- OWNED BY /design -->

# Specification — meeg-blog

Behavioral requirements — what the system must do, observably.

---

## Pages

### Home page (`/`)

- Displays a list of recent articles, ordered by `publish_date` descending.
- Shows article cards with title, summary excerpt, publish date, and tags.
- Each card links to the full article at `/blog/[slug]`.
- Shows site title and tagline from Global Settings.
- Includes SEO metadata (title, description, OG, Twitter Card).

### About page (`/about`)

- Displays author name, bio (rendered from Structured Text), and avatar.
- Content sourced from Dato Author singleton.
- Includes SEO metadata.

### Blog listing (`/blog`)

- Displays paginated list of all articles, ordered by `publish_date` descending.
- Shows article cards with title, summary excerpt, publish date, and tags.
- Pagination controls (older / newer navigation).
- Each card links to `/blog/[slug]`.
- Tag links on cards route to `/tags/[tag]`.
- Includes SEO metadata.

### Article page (`/blog/[slug]`)

- Full article view showing title, publish date, tags, series context (if applicable), and rendered body.
- Body rendered from Dato Structured Text supporting:
  - Headings (h2, h3, h4)
  - Paragraphs with inline formatting (bold, italic, links, code)
  - Code blocks with syntax highlighting via shiki (language detected from fenced block metadata)
  - Blockquotes
  - Ordered and unordered lists
  - Images with captions and lazy loading
  - External links
- If article belongs to a series: show series title and links to other articles in the series.
- Tags link to `/tags/[tag]`.
- SEO metadata including Open Graph `article` type with `published_time` and `tag`.
- JSON-LD structured data (BlogPosting or NewsArticle schema).
- Canonical URL set to the article's full URL.

### Tag filter page (`/tags/[tag]`)

- Displays paginated list of articles with the given tag.
- Same card format as blog listing.
- Shows the tag name as the page heading.
- Includes SEO metadata.

### 404 page

- Custom not-found page with user-friendly message.
- Does not show default Cloudflare or browser error page.
- Includes SEO metadata with `robots: noindex`.

### Sitemap (`/sitemap.xml`)

- Lists all published article URLs with their last modified dates.
- Includes page URLs (home, about, blog).
- Conforms to XML sitemap protocol.

### Robots (`/robots.txt`)

- Allows all crawlers (`Allow: /`).
- Points to sitemap URL.

---

## Global behavior

### Navigation

- Header shows site logo (or title) and navigation links configured in Global Settings.
- Current page / section is visually indicated in navigation.
- Footer shows copyright notice from Global Settings and social media links.
- All navigation links resolve correctly (internal → Astro routes, external → full URLs).

### Theme

- Light / dark theme toggle in header.
- Theme preference persisted in `localStorage`.
- Default theme respects `prefers-color-scheme` system preference.
- No flash of wrong theme on page load (critical inline script in `<head>`).
- Toggle updates the `data-theme` attribute on `<html>` and saves preference.

### SEO

- Every page emits `<title>` and `<meta name="description">`.
- Every page emits Open Graph meta tags (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`).
- Every page emits Twitter Card meta tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`).
- Every page has a `<link rel="canonical">` pointing to the full URL.
- Article pages additionally emit `og:type: article`, `article:published_time`, and `article:tag`.
- SEO metadata merges Global Settings defaults with page/article-specific overrides.

### Performance

- Lighthouse Performance score ≥ 90 (desktop and mobile).
- First Contentful Paint (FCP) ≤ 1.5s.
- Largest Contentful Paint (LCP) ≤ 2.5s.
- Cumulative Layout Shift (CLS) ≤ 0.1.
- Total JavaScript bundle size ≤ 10 KB (theme switcher only).
- Fonts are self-hosted or use `font-display: swap`.

### Availability

- Site responds within 5s under normal conditions.
- Dato API unavailability: page renders with available cached content or shows a degraded state rather than crashing.
- Missing or empty content fields are handled gracefully (no blank strings, no broken layout).

---

## CMS integration

### Dato Structured Text rendering

- Heading levels map to semantic HTML elements (`h2`, `h3`, etc.).
- Code blocks rendered as `<pre><code class="language-...">` with shiki highlighting applied server-side.
- Images render with responsive `<img>` tags, `loading="lazy"`, and alt text from Dato.
- Links to internal routes use local paths; external links use full URLs.
- Custom Dato blocks (callouts, embeds) rendered via a block resolver pattern matching their Dato model type.

### Content updates

- Published content changes are reflected on the next request (SSR fetches from Dato CDN on each page load).
- No manual rebuild step required after content changes.

### Caching strategy

- Dato GraphQL CDN API is globally cached by Dato infrastructure.
- Cloudflare Worker sets `Cache-Control: public, max-age=60, s-maxage=300` on responses so Cloudflare edge caches HTML for repeated visits.
- Theme toggle uses `localStorage` — no server-side caching concerns.

### Visual Editing

Visual Editing combines Draft Mode + Content Link + Web Previews. Dato Free plan supports all three.

#### Draft mode

- Draft mode is enabled via a signed JWT cookie set by `GET /api/draft-mode/enable`.
- The enable endpoint validates the `token` query param against `SECRET_API_TOKEN` before setting the cookie.
- The `redirect` query param is validated as a relative URL (rejects absolute URLs) to prevent open redirect attacks.
- The disable endpoint `GET /api/draft-mode/disable` removes the cookie without token validation — safe because it only reduces access.
- The JWT cookie is set with `sameSite: 'none'`, `secure: true`, and `partitioned: true` (CHIPS) for cross-site iframe support.
- When draft mode is active, the `executeQuery` wrapper switches to the draft CDA token (`DATOCMS_DRAFT_CONTENT_CDA_TOKEN`) and sets `includeDrafts: true`.
- Draft API responses bypass the Cloudflare CDN cache (no `Cache-Control` header or `private`).
- All draft mode API routes return appropriate HTTP status codes (401 for invalid token, 422 for invalid redirect, 500 for unexpected errors).

#### Content Link

- Content Link stega metadata is only present in draft API responses — published responses carry no stega.
- `executeQuery` enables stega by passing `contentLink: 'v1'` and `baseEditingUrl: DATOCMS_BASE_EDITING_URL` when draft mode is active.
- The `<ContentLink />` component is placed in `BaseLayout.astro` and only rendered when draft mode is active.
- Click-to-edit overlays are activated by holding **Alt/Option** or by setting `enableClickToEdit` prop.
- Astro's `<ContentLink />` auto-detects navigation — no router props needed.
- Stega-encoded text is safe to render directly in HTML but must be stripped with `stripStega()` from `@datocms/content-link` before any non-render use:
  - `<meta>` tags, `<title>`, Open Graph, Twitter Card content
  - JSON-LD structured data
  - URL generation from text fields (DatoCMS `slug` field type never carries stega — use directly)
  - String comparisons, `split`, `replace`, regex operations
  - Analytics event properties, third-party API payloads
- `<StructuredText>` is wrapped in `data-datocms-content-link-group` to make the entire area clickable; block and inline record renderers are wrapped in `data-datocms-content-link-boundary` to prevent click bubbling.

#### Web Previews

- The `/api/preview-links` endpoint accepts POST requests from the DatoCMS Web Previews plugin.
- It maps records to frontend URLs via `recordToWebsiteRoute`, branching on `item.meta.status`:
  - `status !== 'published'` — return draft version URL (goes through draft-mode enable)
  - `status !== 'draft'` — return published version URL (goes through draft-mode disable)
- Returns HTTP 200 with `{ previewLinks: [{ label, url }] }` or `{ previewLinks: [] }` for unmatched records.
- Returns HTTP 200 with empty `previewLinks` for records without a frontend route — never errors for unmatched records.
- CORS headers (`Access-Control-Allow-Origin: *`) are set on all responses, with `OPTIONS` preflight handled.
- The site serves CSP header `frame-ancestors 'self' https://plugins-cdn.datocms.com` (set via Astro middleware) to allow embedding in the Web Previews Visual tab iframe.
