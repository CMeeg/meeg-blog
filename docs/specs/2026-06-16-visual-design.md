# Visual Design — meeg-blog

> 2026-06-16

## Design Direction

**Technical & Utilitarian.** A developer's personal blog that looks like it belongs to someone who builds software. Functional, intentional, no decoration for its own sake. Inspired by terminal UIs and code editors but not slavishly imitative — the coding motifs (`//` comments, `~` prompts) were tried and removed after feedback.

## Colour

### Palette

Based on the [Dracula theme](https://draculatheme.com/), chosen because the author already uses it in their editor and terminal.

| Token | Dark | Light |
|---|---|---|
| Background | `#282a36` | `#f8f8f2` |
| Surface | `#1e1f29` | `#ffffff` |
| Current Line / Muted | `#44475a` | `#e0e0e0` |
| Foreground (text) | `#f8f8f2` | `#282a36` |
| Comment / secondary | `#6272a4` | `#6272a4` |
| Cyan | `#8be9fd` | `#0891b2` |
| Green | `#50fa7b` | `#16a34a` |
| Orange (links) | `#ffb86c` | — |
| Pink | `#ff79c6` | `#db2777` |
| Purple (mugshot ring, blockquotes) | `#bd93f9` | `#7c3aed` |
| Red | `#ff5555` | — |
| Yellow | `#f1fa8c` | — |

### Colour mode

Support both dark and light modes. Respect `prefers-color-scheme`, fallback to dark. Light mode gets a complementary version of each accent (lower saturation, higher lightness to work on a light ground).

### Usage

- **Primary text** — Foreground
- **Secondary / meta** — Comment
- **Links** — Orange (`#ffb86c`) with underline. Not cyan — that was tested in-context and clashed with the Dracula coding palette.
- **Mugshot ring** — Purple
- **Blockquote border** — Purple
- **Tags in cards** — One of {purple, cyan, green, orange} based on topic, at 12–15% alpha on the background

## Typography

### Fonts

| Use | Font | Source |
|---|---|---|
| Prose (body, headings, UI) | [Inter](https://rsms.me/inter/) | `@fontsource/inter` (npm) |
| Code blocks, inline code | [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | `@fontsource/jetbrains-mono` (npm) |

Atlassian Sans was the initial preference for prose, but it has no public CDN. Inter is the typeface Atlassian Sans is derived from — visually near-identical and freely available.

### Fluid type scale

Utopia-generated clamp() values — a major third scale (1.25) at small viewports, perfect fourth (1.333) at large:

```css
--size-step-0: clamp(1rem, 0.96rem + 0.22vw, 1.13rem);
--size-step-1: clamp(1.125rem, 1.06rem + 0.33vw, 1.25rem);
--size-step-2: clamp(1.25rem, 1.16rem + 0.43vw, 1.5rem);
--size-step-3: clamp(1.5rem, 1.36rem + 0.7vw, 1.875rem);
--size-step-4: clamp(1.75rem, 1.53rem + 1.1vw, 2.5rem);
--size-step-5: clamp(1.875rem, 1.56rem + 1.58vw, 2.75rem);
```

### Rhythm (Piccalilli .flow pattern)

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

Using `em` units means spacing scales with each element's own font size — headings get proportionally more space, the element after a heading gets less.

### Line heights

- Headings: `1.1`
- Body: `1.7`

### Line lengths

- Body text: `max-width: 65ch` (implemented as `45rem` in the content column)
- Lede/intro: `max-width: 50ch`
- Headings: shorter than body (browser-wrap handles this via the parent constraint)

### Other

- `text-wrap: balance` on all headings and the lede
- Link underlines use `text-decoration-thickness: 0.15em` and `text-underline-offset: 0.2em` (em units so they scale with font size)
- The lede is not italic — kept in the same typeface as body, just larger

## Layout

### Page structure

All pages share:
- **Sticky glass header** — `backdrop-filter: blur(12px)` with semi-transparent background (`rgba(40, 42, 54, 0.75)`), bottom border at 25% opacity Current Line. Contains mugshot (small, purple ring), name, and nav links (Home, About, Archive).
- **Full-width layout** — content constrained to a centered column (`max-width: 45rem` / ~65ch) for readability
- **Code blocks break out** — full viewport width with a dark surface background (`#1e1f29`), bordered top/bottom

### Home page

- Intro text (avoids "Hi I'm Chris" opener — uses a tagline + short bio instead)
- "Latest posts" label
- Two post cards in a 2-column grid
  - Card background: `rgba(68, 71, 90, 0.12)` — barely perceptible lift from page bg
  - Card border: `rgba(68, 71, 90, 0.25)`
  - Card shadow: 4-layer layered box-shadow, colour-matched to the bg hue (hsl 231°)
  - Image placeholder at top, then tags, title, date, excerpt
- No pagination or infinite scroll

### Article page

- Date + tags above title
- Title + lede
- Body text with `.flow` rhythm
- Code blocks: full-bleed, with filename header (`~/src/filename.ts`)
- Inline code: dark pill bg + cyan text
- Blockquote: purple left border, italic, reduced width
- No featured image, no read time, no share links
- Back-to-posts link at bottom

### About page

- Mugshot (larger, in content area), name, title, GitHub link
- Bio paragraphs
- Skills as coloured tag pills
- Experience list (condensed — role, company, dates, one-liner description)
- Same overall layout and rhythm as article page

### Archive page

Reuses the home page's card grid — same component, different query (all posts instead of latest 2).

### Footer

Present on every page. Minimal — indicates page bottom without adding noise:

```
© Chris Meagher    GitHub    RSS           ↑ scroll to top
```

- Left side: copyright mark (personal branding, not legal), GitHub link, RSS icon/link
- Right side: scroll-to-top pill button
- All in Comment (`#6272a4`), small (`0.8125rem`), no hover effects beyond underline
- Top border: same `1px solid rgba(68, 71, 90, 0.25)` as the header bottom border
- Scroll-to-top appears only when the footer is in view (IntersectionObserver); clicking scrolls smoothly to `#top`

## Components

### Progressive glass header

- `position: sticky; top: 0; z-index: 10`
- **State A (top of page):** fully transparent — no background, no border, no glass. Mugshot, name, and nav sit directly on the page hero content.
- **State B (scrolled):** glass effect fades in — `background: rgba(40, 42, 54, 0.75)` with `backdrop-filter: blur(12px)`, subtle bottom border `1px solid rgba(68, 71, 90, 0.25)`. Header becomes visually distinct from content.
- Transition controlled by IntersectionObserver or scroll-driven CSS — triggers when the hero section scrolls out of view.
- Mugshot (32px, rounded, purple `#bd93f9` border ring)
- Name and nav links
- Falls back to opaque bg in browsers without backdrop-filter support

### Post cards

- Subtle surface: `background: rgba(68, 71, 90, 0.12)`, `border: 1px solid rgba(68, 71, 90, 0.25)`
- Layered shadow (Josh Comeau technique):
  ```css
  box-shadow:
    0 1px 1px hsl(231deg 15% 8% / 0.5),
    0 2px 2px hsl(231deg 15% 8% / 0.3),
    0 4px 4px hsl(231deg 15% 8% / 0.15),
    0 8px 8px hsl(231deg 15% 8% / 0.1);
  ```
- Image slot at top (screenshots or copyright-free images)
- Tags (coloured pills using Dracula accent colours at 15% alpha)
- Title (orange on hover for links, white by default)
- Date (comment colour)
- Excerpt (foreground)

## Content model implications

The Dato CMS content model should support:
- **Post**: title, slug, date, featured image (optional, for cards), excerpt, body (structured text), tags (many-to-many)
- **Tag**: name, slug, colour (optional — for card tag pills)
- **About page**: bio, skills (repeating text), experience (repeating: role, company, dates, description), GitHub URL, mugshot image
- **Global**: site name, nav links, social links

## Open decisions

- Syntax highlighting theme for Shiki — Dracula (the code mockups used Dracula token colours)
- Light mode palette refinement — exact values for link colour (orange won't work on the light ground), tag colours, etc. to be tuned when implemented
- Whether code block filename comes from Dato CMS metadata or is derived from the code language/buffer

---

*Part of meeg-blog rebuild. Generated through the `/spec` phase.*
