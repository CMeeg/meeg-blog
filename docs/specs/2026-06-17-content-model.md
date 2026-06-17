# Content Model — meeg-blog

> 2026-06-17

## Approach

**Idiomatic DatoCMS Structured Text** — native rich text (DAST) for article bodies, models for standalone entities (Post, Tag, Series), blocks for embedded content and repeating sections. Guided by DatoCMS content modeling references throughout.

## Principles Applied

- **Content is data, not pages.** Field names describe what content *is*, not how it looks.
- **Don't recreate built-ins.** Record meta (`_firstPublishedAt`, `_publishedAt`) and asset metadata (`alt`, `title`) used directly — no sibling fields.
- **Models where independent lifecycle exists.** Post, Tag, Series — each has its own page, can exist alone.
- **Blocks where content only makes sense inside a parent.** Skill entries, experience entries, nav links, social links, inline images.
- **Editor-centric.** Hints on every field. `draft_saving_active` so editors can save incomplete work.
- **Migration pragmatism.** <10 posts — manual import into Dato CMS. No need for automated migration pipeline.

## Models

### Post

`api_key: post`

| API Key | Type | Required | Details |
|---|---|---|---|
| `title` | string | ✅ | `heading: true` for editor prominence |
| `slug` | slug | ✅ | Auto-fill from `title`, `webpage_slug` format |
| `excerpt` | text | ❌ | Short summary for archive/home cards |
| `body` | structured_text | ✅ | Article prose. Nodes: heading (h2-h3), list, link, blockquote, code, thematicBreak. Marks: strong, emphasis, code, highlight. Allows embedded `image_block`. |
| `tags` | links → Tag | ❌ | Many-to-many |
| `series` | link → Series | ❌ | Optional series membership |
| `order_in_series` | integer | ❌ | Position within series (ascending) |
| `stale` | boolean | ❌ | Marks tech-outdated articles — frontend renders notice |
| `seo` | seo | ❌ | Title (max 60), description (max 160), image |

**Model configuration:**
- `draft_mode_active: true`, `draft_saving_active: true`
- `ordering_meta: published_at`, direction descending
- `inverse_relationships_enabled: true`
- `collection_appearance: 'table'`
- `title_field` → `title`, `excerpt_field` → `excerpt`

**Post dates:** `_firstPublishedAt` (shown to readers as article age), `_publishedAt` (last updated). Both are editor-editable built-in meta — no custom date fields.

### Tag

`api_key: tag`

| API Key | Type | Required | Details |
|---|---|---|---|
| `name` | string | ✅ | Display name |
| `slug` | slug | ✅ | Auto-fill from `name` |
| `color` | color | ❌ | Optional accent for card tag pills |

**Model configuration:**
- `draft_mode_active: true`
- `collection_appearance: 'compact'` (small reference taxonomy)
- `inverse_relationships_enabled: true` (tag archive page)
- Not sortable, not a tree — flat taxonomy per taxonomy-classification.md

### Series

`api_key: series`

| API Key | Type | Required | Details |
|---|---|---|---|
| `name` | string | ✅ | Series title |
| `slug` | slug | ✅ | Auto-fill from `name` |
| `description` | text | ❌ | Shown on series archive page |
| `seo` | seo | ❌ | For series archive page |

**Model configuration:**
- `draft_mode_active: true`
- `inverse_relationships_enabled: true` — query posts via `_allReferencingPosts`
- `collection_appearance: 'table'`

**Series ↔ Post relationship:** Post has `series` (link → Series, optional) + `order_in_series` (integer). Frontend queries the Series, then posts in ascending `order_in_series`. The series module on article pages and the series archive page share the same query.

### About Page (Singleton)

`api_key: about_page`, `singleton: true`

| API Key | Type | Required | Details |
|---|---|---|---|
| `bio` | structured_text | ✅ | Prose biography |
| `mugshot` | file | ❌ | `transformable_image`, `required_alt_title: { alt: true }` |
| `github_url` | string | ❌ | URL format validator |
| `skills` | rich_text | ❌ | Modular content — allows `skill_block` |
| `experience` | rich_text | ❌ | Modular content — allows `experience_entry_block` |
| `seo` | seo | ❌ | |

**Model configuration:**
- `draft_mode_active: true`
- `collection_appearance: 'compact'`

### Site Settings (Singleton)

`api_key: site_setting`, `singleton: true`

| API Key | Type | Required | Details |
|---|---|---|---|
| `site_name` | string | ✅ | |
| `nav_links` | rich_text | ✅ | Modular content — allows `nav_link_block`. Editor reorders by drag-and-drop. |
| `social_links` | rich_text | ❌ | Modular content — allows `social_link_block`. |

**Model configuration:**
- `draft_mode_active: true`
- `collection_appearance: 'compact'`

## Blocks

All block `api_key`s suffixed with `_block` per DatoCMS naming convention.

### Image Block

`api_key: image_block` — embedded in Post.body structured_text as `structured_text_blocks` item.

| API Key | Type | Required | Details |
|---|---|---|---|
| `image` | file | ✅ | `transformable_image`, `required_alt_title: { alt: true }`. Asset carries `alt` and `title` — no caption/credit sibling field. |

### Skill Block

`api_key: skill_block` — used in About Page skills rich_text.

| API Key | Type | Required | Details |
|---|---|---|---|
| `name` | string | ✅ | Skill display name |

### Experience Entry Block

`api_key: experience_entry_block` — used in About Page experience rich_text.

| API Key | Type | Required | Details |
|---|---|---|---|
| `role` | string | ✅ | Job title |
| `company` | string | ✅ | Employer name |
| `dates` | string | ✅ | e.g. "Jan 2020 — Present" |
| `description` | text | ❌ | One-liner or short paragraph |

### Nav Link Block

`api_key: nav_link_block` — used in Site Settings nav_links rich_text.

| API Key | Type | Required | Details |
|---|---|---|---|
| `label` | string | ✅ | Display text |
| `url` | string | ✅ | URL format validator |

### Social Link Block

`api_key: social_link_block` — used in Site Settings social_links rich_text.

| API Key | Type | Required | Details |
|---|---|---|---|
| `platform` | string | ✅ | Free-text (github, linkedin, bluesky, mastodon, etc.) |
| `url` | string | ✅ | URL format validator |

## Model Summary

| Kind | Name | Purpose |
|---|---|---|
| Model | `post` | Blog articles |
| Model | `tag` | Flat taxonomy |
| Model | `series` | Ordered article groupings |
| Model | `about_page` | Singleton — bio, skills, experience |
| Model | `site_setting` | Singleton — nav, social, site name |
| Block | `image_block` | Inline image in Structured Text |
| Block | `skill_block` | Single skill (About page) |
| Block | `experience_entry_block` | Role, company, dates, description (About page) |
| Block | `nav_link_block` | Label + URL (Site Settings) |
| Block | `social_link_block` | Platform + URL (Site Settings) |

## Implementation Order

1. Create models (Post, Tag, Series, about_page, site_setting)
2. Create block models (image_block, skill_block, experience_entry_block, nav_link_block, social_link_block)
3. Wire model config (orderings, inverse relationships, SEO fallbacks)
4. Wire structured_text validators (nodes, marks, allowed blocks for Post.body)
5. Wire link validators (Post.tags → Tag, Post.series → Series)
6. Add hints to every field, fieldset, and model
7. Seed singleton records (about_page, site_setting)

## Next

- `/plan` — implementation plan for building the content model via DatoCMS CLI migrations and the frontend queries.

---

*Part of meeg-blog rebuild. Generated through the `/spec` phase.*
