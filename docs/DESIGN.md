# meeg-blog Visual Design

Design direction, token reference, and component specifications for agentic workers implementing the blog frontend.

## Design Direction

**Technical & Utilitarian.** A developer's personal blog. Functional, intentional, no decoration for its own sake. Inspired by the Dracula theme the author uses in their editor and terminal.

## Colour System

### Palette

Dark mode is canonical Dracula. Light mode is an adapted "Draco" palette — same hue structure, shifted for light ground.

| Token | Dark | Light |
|---|---|---|
| Background | `#282a36` | `#f8f8f2` |
| Surface | `#1e1f29` | `#ffffff` |
| Muted / tertiary | `rgba(68,71,90,0.12)` | `rgba(224,224,224,0.5)` |
| Text primary | `#f8f8f2` | `#282a36` |
| Text secondary (comment) | `#6272a4` | `#6272a4` |
| Links | `#ffb86c` | `#d96c00` |
| Cyan | `#8be9fd` | `#0891b2` |
| Green | `#50fa7b` | `#16a34a` |
| Pink | `#ff79c6` | `#db2777` |
| Purple | `#bd93f9` | `#7c3aed` |
| Orange | `#ffb86c` | `#d96c00` |
| Red | `#ff5555` | `#dc2626` |
| Yellow | `#f1fa8c` | `#ca8a04` |

**Light link colour:** `#d96c00` (burnt orange). Chosen over `#e07c1f`, `#c95100`, and `#a020f0` — it passes WCAG AA 4.5:1 on `#f8f8f2`, is visually distinct from cyan code syntax, and preserves the dark mode orange association.

### Colour mode strategy

- `:root` = light mode (default)
- `[data-theme="dark"]` = dark mode override
- `@media (prefers-color-scheme: dark)` = system dark mode (excluded when `[data-theme="light"]` is set)
- Fallback: dark mode

### Usage conventions

| Use | Token/Colour |
|---|---|
| Body text | `--color-text-primary` |
| Meta, dates, secondary | `--color-text-secondary` (#6272a4) |
| Links | `--color-text-link` with `text-decoration-thickness: 0.15em` and `text-underline-offset: 0.2em` |
| Mugshot ring | `--color-mugshot-ring` (purple) |
| Blockquote border | `--color-blockquote-border` (purple, 4px left) |
| Tag pills | Accent colours at `--tag-alpha` (0.15) background opacity |
| Inline code | `--color-accent-cyan` text, dark pill bg |
| Card surfaces | `--color-surface-card` |

## Typography

### Fonts

| Use | Font | Source |
|---|---|---|
| Prose (body, headings, UI) | Inter (400, 600, 700) | `@fontsource/inter` |
| Code | JetBrains Mono (400, 500, 700) | `@fontsource/jetbrains-mono` |

### Fluid type scale (Utopia)

Major third (1.25) at 320px, perfect fourth (1.333) at 1140px. All sizes use `clamp()`:

```css
--size-step-0: clamp(1rem, 0.96rem + 0.22vw, 1.13rem);  /* body */
--size-step-1: clamp(1.125rem, 1.06rem + 0.33vw, 1.25rem);
--size-step-2: clamp(1.25rem, 1.16rem + 0.43vw, 1.5rem);
--size-step-3: clamp(1.5rem, 1.36rem + 0.7vw, 1.875rem);
--size-step-4: clamp(1.75rem, 1.53rem + 1.1vw, 2.5rem);
--size-step-5: clamp(1.875rem, 1.56rem + 1.58vw, 2.75rem);
```

### Line heights

- Headings: `1.1`
- Body: `1.7`

### Rhythm (.flow pattern)

Piccalilli flow utility using `em`-based spacing so rhythm scales with font size:

```css
.flow > * + * {
  margin-block-start: var(--flow-space, 1em);
}
:is(h1, h2, h3, blockquote) {
  --flow-space: 1.5em;
}
:is(h1, h2, h3) + * {
  --flow-space: 0.5em;
}
```

### Other typography rules

- `text-wrap: balance` on headings and the lede
- Lede: larger than body (`--size-step-1`), `max-width: 50ch`, same typeface (not italic)
- Link underlines: `text-decoration-thickness: 0.15em`, `text-underline-offset: 0.2em`

## Layout

### Common to all pages

- **Content column:** centered, `max-width: 45rem` (~65ch), `.wrapper` class with `1.5rem` side padding
- **Code blocks:** break out to full viewport width with `width: 100vw` + negative margins, dark surface background (`#1e1f29` dark / `#e0e0e0` light), top/bottom border
- **Header:** `position: sticky; top: 0; z-index: 10`
  - State A (top): fully transparent, no background or border
  - State B (scrolled): `--color-surface-glass` with `backdrop-filter: blur(12px)`, bottom border
  - Mugshot 32px with purple ring, name, nav links (Home, About, Archive)
  - State transition: controlled by IntersectionObserver watching hero section

### Page structures

**Home:** Hero tagline + bio, "Latest posts" label, 2 post cards in 2-column grid, footer. No pagination.

**Article:** Date + tags, h1 title, lede, body with `.flow` rhythm including headings, inline code, code blocks (full-bleed), blockquotes. No featured image, no read time, no share links. Back-to-posts link at bottom.

**About:** Mugshot (96px, purple ring), name, role, GitHub link, bio paragraphs, skills as tag pills, experience list (role/company/dates/description). Same layout as article.

**Archive:** Title, card grid (reuses home card component, 2 columns, 4+ cards), footer.

**Footer:** Minimal. Left: © name, GitHub, RSS. Right: scroll-to-top pill. All `--color-text-secondary` at `0.8125rem`. Top border same as header bottom border. Present on every page.

## Components

### Post card

- Background: `--color-surface-card`
- Border: `--color-border-subtle`, square corners
- Shadow: 4-layer layered box-shadow (`--card-shadow`)
- Image slot at top
- Tags row (coloured pills)
- Title (alt colour on hover via `--color-text-link`)
- Date (`--color-text-secondary`)
- Excerpt (`--color-text-primary`)

### Tag pill

- Inline rounded pill, `border-radius: 999px`, no border
- Font: `0.8125rem`, padding `0.25em 0.6em`
- Background: accent colour at `--tag-alpha` (15%) opacity
- Text: full accent colour

### Code block

- Full-bleed breakout (viewport width)
- Background: `#1e1f29` (dark) / `#e0e0e0` (light)
- Filename header: comment-colour text, small
- Syntax highlighting: Shiki with Dracula theme — use `<pre class="astro-code dracula">` with inline `style` attributes on spans
- No line numbers
- `<code>` wrapper inside `<pre>`
- `line-height: 1.25` on the pre/code

### Inline code

- `--color-accent-cyan` text
- Dark pill background (same as code block surface)
- JetBrains Mono

### Blockquote

- 4px solid purple left border (`--color-blockquote-border`)
- Italic text
- Purple accent text colour
- Slightly reduced width compared to body text

### Progressive glass header

- State A (top): fully transparent — mugshot, name, nav on page content
- State B (scrolled): `--color-surface-glass` + `backdrop-filter: blur(12px)` + bottom `--color-border-subtle`
- Mugshot placeholder: 32px rounded, "CM" initials, purple ring

## CSS Implementation

### tokens.css

Location: `apps/blog/src/styles/tokens.css`

Structure:
1. `@fontsource/inter/*.css` and `@fontsource/jetbrains-mono/*.css` imports
2. `:root` — light mode defaults + shared tokens (fonts, fluid scale, line heights, layout, rhythm, shadows, link styling)
3. `[data-theme='dark']` — dark mode colour overrides
4. `@media (prefers-color-scheme: dark)` — system dark mode, excluded if `[data-theme='light']`

### Layout.astro

Location: `apps/blog/src/layouts/Layout.astro`

- Imports `../styles/tokens.css`
- Sets `<html data-theme="dark">` (can toggle per-page or via user preference)
- Global reset (box-sizing, margin, padding)
- Body typography from tokens
- Link styling from tokens
- `.flow` rhythm utility
- `.wrapper` class for content column

## Open Design Artifacts

**Project:** `meeg-blog-design-system` — all HTML mockups are in OD storage, browsable via the OD raw URLs.

| Artifact | Description |
|---|---|
| `index.html` | Design system entry — palette, type scale, spacing |
| `tokens-dark.html` | Dark mode CSS token reference with swatches |
| `tokens-light.html` | Light mode CSS token reference |
| `component-header.html` | Progressive glass header (states A + B) |
| `component-post-card.html` | Blog post card |
| `component-footer.html` | Site footer |
| `component-code-block.html` | Code block with Shiki-compatible markup |
| `component-blockquote.html` | Blockquote in prose context |
| `component-tag-pills.html` | Coloured tag pills |
| `page-home.html` / `page-home-light.html` | Home page (dark + light) |
| `page-article.html` / `page-article-light.html` | Article page (dark + light) |
| `page-about.html` | About page |
| `page-archive.html` | Archive page |

## Known Open Issues

- **Code block line-height:** `line-height: 1.25` may need tuning — the OD mockups produce inflated spacing because Shiki wraps every token in a `<span>` with inline `style`, and the `line-height` value interacts with OD's CSS cascade. Final adjustment should happen when rendering actual Shiki output in the Astro app.
- **Code block HTML:** Shiki output uses `<pre class="astro-code dracula">` with a `<code>` wrapper and `<span class="line">` per line, each child `<span>` with inline `style` for Dracula colours. No `<link>` CSS needed for syntax colours. OD mockups reproduce this structure.
- **Light mode accents:** Some light mode accent values (red `#dc2626`, yellow `#ca8a04`, orange `#d96c00`) are reasonable choices but not rigorously tested for WCAG AA against all permitted backgrounds. Accept for now, adjust if contrast issues arise.
- **Glass header transition:** Not implemented yet — the IntersectionObserver logic for the transparent-to-glass transition is JavaScript the Astro components will need.
