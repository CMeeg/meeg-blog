---
name: baseline-styling
description: >-
  CSS patterns for making long-form content (articles, blog posts, documentation) look polished, readable, and well-composed with minimal CSS. Based on Andy Bell's "Some simple ways to make content look good". Covers CSS reset, type scales, fluid typography via Utopia, flow/rhythm utility, line heights, line lengths (ch units), color/contrast, and progressive enhancement with text-wrap: balance. Use when asked to improve the look of prose-heavy pages or to style article/blog/documentation content.
---

# Baseline Styling

CSS techniques for making long-form content look polished with minimal code. Follows the CUBE CSS principle: do as much as possible, as high as possible, globally.

## Sources

| Resource | URL |
|----------|-----|
| Original article | https://piccalil.li/blog/some-simple-ways-to-make-content-look-good/ |
| Modern CSS Reset | https://github.com/Andy-set-studio/modern-css-reset |
| Fluid Type Calculator | https://utopia.fyi/type/calculator/ |
| Fluid Space Calculator | https://utopia.fyi/space/calculator/ |
| Every Layout | https://every-layout.dev/ |
| Flow Utility explainer | https://andy-bell.co.uk/my-favourite-3-lines-of-css/ |
| `text-wrap: balance` explainer | https://clagnut.com/blog/2424/ |

## When to use

- Styling blog posts, articles, documentation pages
- Any page with long-form prose content
- Asked to "make this content look good" or "improve readability"
- Starting a content-focused page from scratch

## Quick Reference

| Pattern | Description | Reference |
|---------|-------------|-----------|
| CSS Reset | Modern reset: box-sizing, margin removal, body defaults, reduced motion | `references/reset.md` |
| Custom properties | Design tokens for color, type scale steps | `references/foundations.md` |
| Type scale | Major Third ratio (`--size-step-0` through `--size-step-4`) | `references/foundations.md` |
| Fluid type | Utopia `clamp()` — Minor Third → Perfect Fourth | `references/foundations.md` |
| Flow utility | `.flow > * + *` — vertical rhythm between siblings | `references/composition.md` |
| Line heights | Tight (1.1) headings, generous (1.7) body | `references/composition.md` |
| Line lengths | `ch` units — 65ch article, 20ch h1, 28ch h2/h3, 50ch blockquote | `references/composition.md` |
| Color contrast | Off-black `#252525` on off-white `#efefef` | `references/composition.md` |
| Link underlines | `text-decoration-color`, `text-decoration-thickness`, `text-underline-offset` | `references/composition.md` |
| Text wrap balance | `text-wrap: balance` on headings and lede (progressive enhancement) | `references/composition.md` |
| Centering | `max-width` + `margin-inline: auto` on article | `references/composition.md` |

## Workflow

```
Baseline Styling Checklist:
[ ] Phase 1: CSS Reset (references/reset.md)
[ ] Phase 2: Core Global Styles (references/foundations.md)
[ ] Phase 3: Type Scale (references/foundations.md)
[ ] Phase 4: Fluid Type (references/foundations.md)
[ ] Phase 5: Flow & Rhythm (references/composition.md)
[ ] Phase 6: Line Heights (references/composition.md)
[ ] Phase 7: Line Lengths (references/composition.md)
[ ] Phase 8: Color & Contrast (references/composition.md)
[ ] Phase 9: Text Wrap Balance (references/composition.md)
[ ] Phase 10: Centering (references/composition.md)
```

### Phase 1: CSS Reset

Apply a modern CSS reset to normalize browser differences. See `references/reset.md` for the full reset stylesheet.

Key actions:
- Set `box-sizing: border-box` globally
- Remove default margins from body, headings, paragraphs, figures, blockquotes
- Remove list styles from `ul[role='list']` / `ol[role='list']`
- Set `min-height: 100vh` and `line-height: 1.5` on body
- Make images block-level with `max-width: 100%`
- Add `prefers-reduced-motion` media query to disable animations
- Inherit fonts for form elements

### Phase 2: Core Global Styles

Define design tokens and element-level styles. See `references/foundations.md`.

Key actions:
- Set `--color-dark`, `--color-light`, `--color-primary` on `:root`
- Style `body` with background, color, padding, and font-family
- Style `h1, h2, h3` with a display font (e.g. Inter) and heavy weight
- Apply `padding-inline-start` to lists
- Style `blockquote` with left border and padding

### Phase 3: Type Scale

Define and apply a ratio-based type scale. See `references/foundations.md`.

Key actions:
- Define `--size-step-0` through `--size-step-4` (Major Third: 1.25)
- Set `font-size: var(--size-step-0)` on body
- Map headings to steps: h1 → step-4, h2 → step-3, h3 → step-2
- Style `blockquote` at step-1 with italic

### Phase 4: Fluid Type

Replace fixed step sizes with Utopia-generated `clamp()` values. See `references/foundations.md`.

Key actions:
- Replace each `--size-step-*` with a `clamp()` expression
- Configure: Minor Third (1.25) at 320px, Perfect Fourth (1.333) at 1240px
- All heading/body mappings remain unchanged — fluid values cascade automatically

### Phase 5: Flow & Rhythm

Add vertical rhythm between content siblings. See `references/composition.md`.

Key actions:
- Add `.flow > * + *` with `margin-block-start: var(--flow-space, 1em)`
- Increase flow space before headings and blockquotes: `--flow-space: 1.5em`
- Reduce flow space between a heading and its direct sibling: `--flow-space: 0.5em`

### Phase 6: Line Heights

Tune line heights for readability. See `references/composition.md`.

Key actions:
- Set `line-height: 1.7` on body for generous reading rhythm
- Set `line-height: 1.1` on headings to prevent awkward gaps with large type

### Phase 7: Line Lengths

Cap line widths using `ch` units. See `references/composition.md`.

Key actions:
- `article > * { max-width: 65ch }` — prose limit
- `blockquote { max-width: 50ch }` — tighter for quoted text
- `h1 { max-width: 20ch }` — prevent single-word wraps
- `h2, h3 { max-width: 28ch }` — wider than h1 but still constrained

### Phase 8: Color & Contrast

Soften contrast and style links. See `references/composition.md`.

Key actions:
- Change `--color-dark` to off-black `#252525`
- Change `--color-light` to off-white `#efefef`
- Style `a` with `color: currentColor` and primary-colored underline
- Use `text-decoration-thickness: 0.3ex` and `text-underline-offset: 0.3ex`
- Style `.lede` intro paragraph: larger, italic, narrower width, extra flow space

### Phase 9: Text Wrap Balance (progressive enhancement)

Add `text-wrap: balance` to headings and lede. Safe to use — unsupported browsers ignore it. See `references/composition.md`.

### Phase 10: Centering

Center the content container. See `references/composition.md`.

Key actions:
- Replace `article > * { max-width }` with `article { max-width: 65ch; margin-inline: auto }`
- Content is now both line-length constrained and horizontally centered

## Notes

- Every phase in this workflow is a **progressive enhancement** — you can stop at any point and the content will still look good
- The type scale and flow utility use `em` units, making spacing relative to each element's font size
- For production sites, generate custom Utopia scales with your actual typeface's x-height and your project's viewport breakpoints
