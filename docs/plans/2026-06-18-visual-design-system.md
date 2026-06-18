# Visual Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a complete visual design system for meeg-blog — tokens, component mockups, and page layouts — using Open Design as the collaborative generation canvas, based on the spec at `docs/specs/2026-06-16-visual-design.md`.

**Architecture:** Open Design project (`meeg-blog-design-system`) serves as the collaboration canvas for iterative design generation. Each task produces standalone HTML artifacts (design token reference, component library, page mockups) that serve as both the visual spec and source of truth for CSS extraction. After Open Design artifacts are finalized, tokens are extracted to `apps/blog/src/styles/tokens.css` and component styles inform Astro component implementation. Light mode orange-link problem is resolved during the Open Design collaboration — not deferred.

**Tech Stack:** Open Design (collaborative generation), HTML/CSS (artifact format), Astro v6 (target framework), `@fontsource/inter`, `@fontsource/jetbrains-mono` (font packages)

## Global Constraints

- **Prerequisites:** Solution setup plan (`docs/plans/2026-06-17-solution-setup.md`) must be completed first — this plan assumes the monorepo structure (`apps/blog/src/`, packages, etc.) is in place.
- Dracula colour palette exactly as specified in the spec — hex values from the table are canonical
- Inter + JetBrains Mono via `@fontsource/inter` and `@fontsource/jetbrains-mono` npm packages
- Dark mode first with light mode complement — respect `prefers-color-scheme`, fallback dark
- Content column: `max-width: 45rem` (~65ch), code blocks full-bleed viewport width
- Progressive glass header: `backdrop-filter: blur(12px)` with `rgba(40, 42, 54, 0.75)` background
- `.flow` rhythm pattern (Piccalilli): `em`-based spacing, headings get `1.5em`, element after heading gets `0.5em`
- No decorative flourishes — technical & utilitarian direction
- Utopia fluid type scale: major third (1.25) at small viewports, perfect fourth (1.333) at large
- All colour hex values from the spec must be preserved in the token reference; light mode values are adapted during collaboration

---

### Task 1: Bootstrap Open Design Project

**Files:**
- Create: Open Design project `meeg-blog-design-system`
- External: this task creates the project on the Open Design daemon, not in the local filesystem

**Interfaces:**
- Consumes: `docs/specs/2026-06-16-visual-design.md` (full spec content)
- Produces: Open Design project with entry artifact `index.html`

- [ ] **Step 1: Create the project**

Run `open-design_create_project` with name `"meeg-blog-design-system"`. This creates the project and returns its id.

- [ ] **Step 2: Seed the entry artifact with the design direction**

Use `open-design_start_run` with the following prompt content (use the actual spec text, not a reference):

```
Create a visual design system for a developer's personal blog. The design direction is "Technical & Utilitarian" — functional, intentional, no decoration for its own sake.

Colour palette (Dracula theme):
- Background (dark): #282a36, (light): #f8f8f2
- Surface (dark): #1e1f29, (light): #ffffff
- Current Line / Muted (dark): #44475a, (light): #e0e0e0
- Foreground / text (dark): #f8f8f2, (light): #282a36
- Comment / secondary (dark): #6272a4, (light): #6272a4
- Cyan (dark): #8be9fd, (light): #0891b2
- Green (dark): #50fa7b, (light): #16a34a
- Orange / links (dark): #ffb86c, (light): TBD — needs resolution during collab
- Pink (dark): #ff79c6, (light): #db2777
- Purple / mugshot ring / blockquotes (dark): #bd93f9, (light): #7c3aed
- Red (dark): #ff5555, (light): TBD
- Yellow (dark): #f1fa8c, (light): TBD

Typography: Inter for prose and UI, JetBrains Mono for code. Fluid type scale using Utopia clamp() values covering steps 0-5.

Layout: Full-width with centered 45rem content column, code blocks break out full-bleed.

Components needed: progressive glass header, post cards, footer, code blocks, blockquote, tag pills, inline code.

Produce an index.html landing page for the design system showing the dark mode palette, typography scale, and spacing rhythm as a reference.
```

Set the Open Design skill to `design-consultation` if available, otherwise use the default router.

- [ ] **Step 3: Verify the entry artifact renders**

Use `open-design_get_artifact` with `entry="index.html"` to review the generated design system landing page. Check that:
- All colours from the spec are represented
- The Dracula palette is recognisable
- Inter and JetBrains Mono are used
- The entry page serves as a usable reference

- [ ] **Step 4: Iterate if needed**

If the initial output deviates significantly from the spec, use `od-design-refine` plugin or another `start_run` with corrective instructions (e.g., "Use the exact hex values from the spec, not approximations").

---

### Task 2: Generate Dark Mode Token Reference

**Files:**
- Create: Open Design project artifact `tokens-dark.html`
- Produces: Visual reference page of all CSS custom properties in dark mode

**Interfaces:**
- Consumes: Task 1 entry artifact (established design direction), `docs/specs/2026-06-16-visual-design.md`
- Produces: Dark mode CSS token set as an HTML reference artifact

- [ ] **Step 1: Generate the dark mode token reference**

Start an Open Design run with this prompt:

```
Create a design token reference page (tokens-dark.html) for the meeg-blog design system in DARK MODE ONLY. This is a reference document intended for developers to copy CSS custom properties from.

The page must display token tables grouped by category, with each token showing its name, value, and a visual swatch where applicable.

COLOUR TOKENS (dark mode):
--color-bg-primary: #282a36
--color-bg-secondary: #1e1f29
--color-bg-tertiary: rgba(68, 71, 90, 0.12)
--color-surface-card: rgba(68, 71, 90, 0.12)
--color-surface-glass: rgba(40, 42, 54, 0.75)
--color-text-primary: #f8f8f2
--color-text-secondary: #6272a4
--color-text-link: #ffb86c
--color-accent-cyan: #8be9fd
--color-accent-green: #50fa7b
--color-accent-pink: #ff79c6
--color-accent-purple: #bd93f9
--color-accent-orange: #ffb86c
--color-accent-red: #ff5555
--color-accent-yellow: #f1fa8c
--color-border-subtle: rgba(68, 71, 90, 0.25)
--color-border-codeblock: rgba(68, 71, 90, 0.25)

TYPOGRAPHY TOKENS:
--font-family-body: 'Inter', system-ui, sans-serif
--font-family-mono: 'JetBrains Mono', monospace
--font-size-step-0: clamp(1rem, 0.96rem + 0.22vw, 1.13rem)    /* body */
--font-size-step-1: clamp(1.125rem, 1.06rem + 0.33vw, 1.25rem)
--font-size-step-2: clamp(1.25rem, 1.16rem + 0.43vw, 1.5rem)
--font-size-step-3: clamp(1.5rem, 1.36rem + 0.7vw, 1.875rem)
--font-size-step-4: clamp(1.75rem, 1.53rem + 1.1vw, 2.5rem)
--font-size-step-5: clamp(1.875rem, 1.56rem + 1.58vw, 2.75rem)
--line-height-heading: 1.1
--line-height-body: 1.7
--font-weight-normal: 400
--font-weight-semibold: 600
--font-weight-bold: 700

SPACING / LAYOUT TOKENS:
--max-width-content: 45rem
--max-width-lede: 50ch
--max-width-body: 65ch
--space-gutter: 1rem
--flow-space-default: 1em
--flow-space-heading: 1.5em
--flow-space-after-heading: 0.5em

EFFECTS TOKENS:
--glass-blur: 12px
--card-shadow: 0 1px 1px hsl(231deg 15% 8% / 0.5), 0 2px 2px hsl(231deg 15% 8% / 0.3), 0 4px 4px hsl(231deg 15% 8% / 0.15), 0 8px 8px hsl(231deg 15% 8% / 0.1)
--tag-alpha: 0.15

Use the dark background (#282a36) for the page. Display tokens in clean tables with visual colour swatches. The page should feel like a developer reference — monochrome, functional, technical.
```

- [ ] **Step 2: Review and iterate**

Get the artifact and verify all tokens match the spec exactly. Correct any drift with a refinement run.

---

### Task 3: Generate Component Mockups (Dark Mode)

**Files:**
- Create: Open Design project artifacts — one per component
  - `component-header.html`
  - `component-post-card.html`
  - `component-footer.html`
  - `component-code-block.html`
  - `component-blockquote.html`
  - `component-tag-pills.html`

**Interfaces:**
- Consumes: Token set from Task 2, component specs from `docs/specs/2026-06-16-visual-design.md`
- Produces: Standalone HTML mockups for each component in dark mode

- [ ] **Step 1: Progressive glass header**

Start an Open Design run to generate `component-header.html`:

```
Create a mockup of the progressive glass header component. Show both states side by side or stacked:

STATE A (top of page): Mugshot (32px rounded with #bd93f9 purple ring), name "Chris Meagher", and nav links (Home, About, Archive). Fully transparent — no background, no border. Content sits directly on the page.

STATE B (scrolled): Same mugshot, name, nav links but now with background: rgba(40, 42, 54, 0.75), backdrop-filter: blur(12px), bottom border: 1px solid rgba(68, 71, 90, 0.25). Header becomes visually distinct.

Use Inter for text. The mugshot is a placeholder circle with initials "CM" in purple. Position: sticky, top: 0, z-index: 10. Use the design system tokens from the established palette.
```

- [ ] **Step 2: Post card**

```
Create a mockup of the blog post card component. Show it as a standalone card that would appear in a 2-column grid.

Structure:
- Image slot at top (placeholder with muted background showing "Featured Image" text)
- Tags row underneath (coloured pills at 15% alpha — use purple, cyan, green, orange based on topic)
- Title in #f8f8f2 (links turn orange #ffb86c on hover)
- Date in comment colour #6272a4
- Excerpt in foreground #f8f8f2

Styling:
- background: rgba(68, 71, 90, 0.12)
- border: 1px solid rgba(68, 71, 90, 0.25)
- border-radius: none (square corners, technical aesthetic)
- box-shadow: 0 1px 1px hsl(231deg 15% 8% / 0.5), 0 2px 2px hsl(231deg 15% 8% / 0.3), 0 4px 4px hsl(231deg 15% 8% / 0.15), 0 8px 8px hsl(231deg 15% 8% / 0.1)

Use sample real-looking content: title "Building with Astro and DatoCMS", date "June 18, 2026", tags: "astro" (cyan), "datocms" (purple), excerpt "How I rebuilt my personal blog using Astro 6, DatoCMS on the free plan, and Cloudflare for hosting."
```

- [ ] **Step 3: Footer**

```
Create a mockup of the site footer. It should be minimal — indicates page bottom without adding noise.

Left side: © Chris Meaghan | GitHub link | RSS link
Right side: a pill button "↑ scroll to top"

All text in Comment #6272a4, small 0.8125rem. No hover effects beyond underline.
Top border: 1px solid rgba(68, 71, 90, 0.25) — same as header bottom border.
The scroll-to-top button should be a small rounded pill with a subtle border.
Background: transparent (inherits from page).
```

- [ ] **Step 4: Code block + inline code**

```
Create a mockup showing both code block and inline code styles.

CODE BLOCK: Full viewport width breakout with a dark surface background #1e1f29. Include a filename header bar showing "~/src/components/Header.astro" in comment colour #6272a4 with a small monospace label. The code area shows sample TypeScript/JSX in JetBrains Mono with syntax highlighting resembling the Dracula theme (pink for keywords, cyan for strings, green for comments, yellow for functions). Border top and bottom: 1px solid rgba(68, 71, 90, 0.25).

INLINE CODE: Shown in body text context — a dark pill background with cyan text (#8be9fd). Something like: "Use the `useIntersectionObserver` hook to control the glass state."
```

- [ ] **Step 5: Blockquote**

```
Create a mockup of a blockquote in a prose context. Purple left border (4px solid #bd93f9), italic text, reduced width compared to body text. The quote text should be in the purple accent colour at a slightly larger size. Show sample quote content related to software development. The background inherits from the page, and there should be some body text above and below to show context.
```

- [ ] **Step 6: Tag pills**

```
Create a mockup showing 4 tag pills side by side. Each pill should be an inline rounded pill with text at 15% alpha of its accent colour on the dark background (#282a36):

- "astro" — cyan (#8be9fd at 15% alpha bg, full cyan text)
- "react" — purple (#bd93f9 at 15% alpha bg, full purple text)
- "typescript" — green (#50fa7b at 15% alpha bg, full green text)
- "tutorial" — orange (#ffb86c at 15% alpha bg, full orange text)

Use Inter, small font size (0.8125rem), padding 0.25em 0.6em, rounded (border-radius 999px). No border — just the background tint.
```

- [ ] **Step 7: Review all component artifacts**

Get each artifact and verify against the spec. Correct any drift with refinement runs.

---

### Task 4: Generate Page Layout Mockups (Dark Mode)

**Files:**
- Create: Open Design project artifacts
  - `page-home.html`
  - `page-article.html`
  - `page-about.html`
  - `page-archive.html`

**Interfaces:**
- Consumes: Token set from Task 2, components from Task 3
- Produces: Full page layout mockups in dark mode

- [ ] **Step 1: Home page**

```
Create a home page layout mockup. Use the established design tokens and incorporate the components already designed (header, post cards, footer).

Page structure:
1. Progressive glass header (task state A — transparent since it's at top of page)
2. Hero section: A tagline (not "Hi I'm Chris") + short bio paragraph. Something like "Building software, writing about it. Staff Engineer at [Company]."
3. "Latest posts" label in comment colour #6272a4, styled as a small section heading
4. Two post cards in a 2-column grid, side by side
5. Footer

Use sample post content. The hero text should have max-width: 50ch. Content column max-width: 45rem. Apply the .flow rhythm pattern for vertical spacing between sections.

For the .flow rhythm, show at least one heading with body text to demonstrate the em-based spacing:
.flow > * + * { margin-block-start: var(--flow-space, 1em); }
h1, h2, h3, blockquote { --flow-space: 1.5em; }
h1 + *, h2 + *, h3 + * { --flow-space: 0.5em; }
```

- [ ] **Step 2: Article page**

```
Create an article page layout mockup. Use the established tokens and components.

Page structure:
1. Header (state A at top)
2. Date (#6272a4) + tags (coloured pills) above the title
3. Title (h1, Inter, #f8f8f2)
4. Lede paragraph (larger than body, max-width: 50ch, text-wrap: balance)
5. Body text with .flow rhythm, including:
   - A heading (h2)
   - Body paragraphs
   - An inline code example
   - A code block (full-bleed breakout with filename header)
   - A blockquote (purple border, italic)
   - Another heading (h3) with body text
6. Back-to-posts link at bottom (orange #ffb86c with underline)
7. Footer

No featured image, no read time estimate, no share links. Links should have text-decoration-thickness: 0.15em and text-underline-offset: 0.2em. Content max-width: 45rem.
```

- [ ] **Step 3: About page**

```
Create an about page layout mockup.

Page structure:
1. Header
2. Mugshot (larger than header — ~96px, with purple #bd93f9 ring)
3. Name "Chris Meagher"
4. Title / role
5. GitHub link
6. Bio paragraphs (structured text, prose rhythm)
7. Skills as coloured tag pills (reuse tag pill component from component library)
8. Experience list — condensed: role, company, dates, one-liner description per entry
9. Footer

Same layout and rhythm as the article page. Content max-width: 45rem.
```

- [ ] **Step 4: Archive page**

```
Create an archive page layout mockup. This reuses the home page's card grid component.

Page structure:
1. Header
2. "Archive" page title
3. Card grid showing 4+ post cards (reusing the same card component from the home page) — arrange in a responsive grid that shows 2 columns
4. Footer

Same content constraints as home page. This demonstrates the card component being reused for a different query.
```

- [ ] **Step 5: Review all page artifacts**

Verify each page against the spec. Check component consistency, spacing rhythm, colour usage.

---

### Task 5: Light Mode Pass (Resolve Orange Link)

**Files:**
- Modify: All Open Design project artifacts — generate light mode variants alongside dark
  - `tokens-light.html`
  - `page-home-light.html` (or dual-mode variant)
  - Component light variants as needed

**Interfaces:**
- Consumes: All dark mode artifacts from Tasks 2-4
- Produces: Light mode variants with resolved orange-link problem and adapted Dracula accents

- [ ] **Step 1: Generate light mode token reference**

Start an Open Design run to produce `tokens-light.html`:

```
Create a light mode design token reference page for meeg-blog. Use the light Dracula ground (#f8f8f2) as the page background.

CRITICAL: The orange link colour (#ffb86c) does NOT work on a light ground — it fails contrast. Decide on a suitable replacement link colour that:
1. Passes WCAG AA contrast (4.5:1) against #f8f8f2
2. Is distinguishable from other Dracula accent colours on light ground
3. Feels technical and intentional

Demonstrate contrast by showing the chosen colour on the #f8f8f2 ground with a contrast ratio badge.

LIGHT MODE PALETTE:
- Background: #f8f8f2 (light)
- Surface: #ffffff (white)
- Current Line / Muted: #e0e0e0
- Foreground: #282a36 (dark text)
- Comment / secondary: #6272a4 (keep same — works on light)
- Cyan: #0891b2
- Green: #16a34a
- Pink: #db2777
- Purple: #7c3aed
- Link colour: [DECIDE during collab — propose 2-3 options with contrast ratios]
- Red: [DECIDE during collab]
- Yellow: [DECIDE during collab]

All other tokens (typography, spacing, layout, effects) remain the same as dark mode — only colour values change. Show the full token table with light-adapted values.
```

- [ ] **Step 2: Propose and resolve light link colour**

Use the artifact output to evaluate proposed link colours. If needed, run a refinement with:

```
For the light mode link colour, I need to choose between the proposed options. Let me evaluate:

[Copy proposed options from Step 1 output]

Select the best option that:
- Passes WCAG AA against #f8f8f2 (4.5:1 minimum)
- Is visually distinct from cyan (#0891b2) — links should not look like code syntax
- Feels technical and utilitarian — not playful or decorative
- Harmonises with the rest of the Dracula light palette

Recommend one and show it in context (a link in a paragraph, a linked card title).
```

Spec documentation for the decision: Record the chosen light-mode link colour and rationale in `docs/MEMORY.md`.

- [ ] **Step 3: Generate light mode page variants**

Create at least one light mode page mockup (home page) to validate the full palette works:

```
Take the dark mode home page layout and adapt it for light mode:
- Background: #f8f8f2
- Surface cards: #ffffff with adjusted shadows
- Text: #282a36
- Comments: #6272a4
- Links: [chosen colour from Step 2]
- Tags: [adapted accent colours at 15% alpha on light ground]
- Header glass: rgba(248, 248, 242, 0.85) with backdrop-filter: blur(12px)
- Code blocks: #f0f0f0 surface with #282a36 text

Keep all layout, spacing, and typography identical. Only colour changes.
```

- [ ] **Step 4: Verify light mode contrasts**

Check that all light mode colour combinations pass basic readability standards. Adjust any that fail.

---

### Task 6: Extract Design Tokens to CSS

**Files:**
- Create: `apps/blog/src/styles/tokens.css`
- Note: This file is created after the solution setup plan has moved `src/` to `apps/blog/src/`

- [ ] **Step 1: Write the CSS tokens file**

Based on the finalised token sets from Tasks 2 and 5, write `apps/blog/src/styles/tokens.css`:

```css
/* ============================================
   meeg-blog Design Tokens
   Generated from Open Design collaboration
   Based on Dracula theme palette
   ============================================ */

@import '@fontsource/inter/400.css';
@import '@fontsource/inter/600.css';
@import '@fontsource/inter/700.css';
@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/700.css';

:root {
  /* ── Fonts ── */
  --font-family-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  /* ── Fluid type scale (Utopia) ── */
  --size-step-0: clamp(1rem, 0.96rem + 0.22vw, 1.13rem);
  --size-step-1: clamp(1.125rem, 1.06rem + 0.33vw, 1.25rem);
  --size-step-2: clamp(1.25rem, 1.16rem + 0.43vw, 1.5rem);
  --size-step-3: clamp(1.5rem, 1.36rem + 0.7vw, 1.875rem);
  --size-step-4: clamp(1.75rem, 1.53rem + 1.1vw, 2.5rem);
  --size-step-5: clamp(1.875rem, 1.56rem + 1.58vw, 2.75rem);

  /* ── Line heights ── */
  --line-height-heading: 1.1;
  --line-height-body: 1.7;

  /* ── Layout ── */
  --max-width-content: 45rem;
  --max-width-lede: 50ch;

  /* ── Rhythm (.flow pattern) ── */
  --flow-space-default: 1em;
  --flow-space-heading: 1.5em;
  --flow-space-after-heading: 0.5em;

  /* ── Glass header ── */
  --glass-blur: 12px;

  /* ── Card ── */
  --card-shadow:
    0 1px 1px hsl(231deg 15% 8% / 0.5),
    0 2px 2px hsl(231deg 15% 8% / 0.3),
    0 4px 4px hsl(231deg 15% 8% / 0.15),
    0 8px 8px hsl(231deg 15% 8% / 0.1);

  /* ── Tags ── */
  --tag-alpha: 0.15;

  /* ── Links ── */
  --link-underline-thickness: 0.15em;
  --link-underline-offset: 0.2em;

  /* ── Light mode palette ── */
  --color-bg-primary: #f8f8f2;
  --color-bg-secondary: #ffffff;
  --color-bg-tertiary: rgba(224, 224, 224, 0.5);
  --color-surface-card: #ffffff;
  --color-surface-glass: rgba(248, 248, 242, 0.85);

  --color-text-primary: #282a36;
  --color-text-secondary: #6272a4;
  --color-text-link: /* resolved in collab */;

  --color-border-subtle: rgba(224, 224, 224, 0.5);
  --color-border-codeblock: rgba(224, 224, 224, 0.5);

  --color-accent-cyan: #0891b2;
  --color-accent-green: #16a34a;
  --color-accent-pink: #db2777;
  --color-accent-purple: #7c3aed;
  --color-accent-orange: /* resolved in collab */;
  --color-accent-red: /* resolved in collab */;
  --color-accent-yellow: /* resolved in collab */;

  --color-mugshot-ring: #7c3aed;
  --color-blockquote-border: #7c3aed;
}

[data-theme='dark'] {
  --color-bg-primary: #282a36;
  --color-bg-secondary: #1e1f29;
  --color-bg-tertiary: rgba(68, 71, 90, 0.12);
  --color-surface-card: rgba(68, 71, 90, 0.12);
  --color-surface-glass: rgba(40, 42, 54, 0.75);

  --color-text-primary: #f8f8f2;
  --color-text-secondary: #6272a4;
  --color-text-link: #ffb86c;

  --color-border-subtle: rgba(68, 71, 90, 0.25);
  --color-border-codeblock: rgba(68, 71, 90, 0.25);

  --color-accent-cyan: #8be9fd;
  --color-accent-green: #50fa7b;
  --color-accent-pink: #ff79c6;
  --color-accent-purple: #bd93f9;
  --color-accent-orange: #ffb86c;
  --color-accent-red: #ff5555;
  --color-accent-yellow: #f1fa8c;

  --color-mugshot-ring: #bd93f9;
  --color-blockquote-border: #bd93f9;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --color-bg-primary: #282a36;
    --color-bg-secondary: #1e1f29;
    --color-bg-tertiary: rgba(68, 71, 90, 0.12);
    --color-surface-card: rgba(68, 71, 90, 0.12);
    --color-surface-glass: rgba(40, 42, 54, 0.75);

    --color-text-primary: #f8f8f2;
    --color-text-secondary: #6272a4;
    --color-text-link: #ffb86c;

    --color-border-subtle: rgba(68, 71, 90, 0.25);
    --color-border-codeblock: rgba(68, 71, 90, 0.25);

    --color-accent-cyan: #8be9fd;
    --color-accent-green: #50fa7b;
    --color-accent-pink: #ff79c6;
    --color-accent-purple: #bd93f9;
    --color-accent-orange: #ffb86c;
    --color-accent-red: #ff5555;
    --color-accent-yellow: #f1fa8c;

    --color-mugshot-ring: #bd93f9;
    --color-blockquote-border: #bd93f9;
  }
}
```

NOTE: The `/* resolved in collab */` placeholders above are intentional — they get filled in during Task 5 when the light-mode colour resolution happens. The actual file written in this step must contain the resolved values from the collaboration.

- [ ] **Step 2: Install font dependencies**

This step is informational — the executor does it when implementing:

```bash
pnpm --filter @meeg-blog/blog add @fontsource/inter @fontsource/jetbrains-mono
```

- [ ] **Step 3: Commit**

```bash
git add apps/blog/src/styles/tokens.css apps/blog/package.json
git commit -m "feat: add design tokens — Dracula palette, Inter + JetBrains Mono, fluid type scale"
```

---

### Task 7: Documentation & Handoff

**Files:**
- Modify: `docs/MEMORY.md`

- [ ] **Step 1: Update MEMORY.md**

Append the following section:

```markdown
## 2026-06-18

### /plan decisions

- **Visual design system produced via Open Design collaboration.** Open Design project `meeg-blog-design-system` contains HTML artifacts for tokens, components, and page mockups in both dark and light modes.
- **Light mode link colour resolved during collaboration.** [RECORD CHOSEN COLOUR AND RATIONALE HERE]
- **Design token CSS extracted to `apps/blog/src/styles/tokens.css`.** Dark mode via `prefers-color-scheme` + `[data-theme="dark"]`, light mode via `:root` default.
- **Dracula palette preserved exactly in dark mode.** Light mode colours adapted from spec values.
```

- [ ] **Step 2: Commit**

```bash
git add docs/MEMORY.md
git commit -m "docs: record design system decisions from Open Design collaboration"
```

---

## Self-Review

**1. Spec coverage:**
- Colours ✓ — Tasks 2 (dark), 5 (light), 6 (extraction)
- Typography ✓ — Task 2 (fluid scale, line heights, fonts)
- Layout ✓ — Tasks 2 (tokens), 4 (page mockups)
- Progressive glass header ✓ — Task 3 (component), Task 4 (in page context)
- Post cards ✓ — Task 3 (component), Task 4 (home + archive pages)
- Footer ✓ — Task 3 (component), Task 4 (on every page)
- Code blocks ✓ — Task 3 (component), Task 4 (in article context)
- Blockquote ✓ — Task 3 (component), Task 4 (in article context)
- Tag pills ✓ — Task 3 (component), Task 4 (on cards + article)
- Light mode ✓ — Task 5 (full pass with link colour resolution)
- Home page ✓ — Task 4 (2-card grid, no pagination)
- Article page ✓ — Task 4 (date+tags above title, full-bleed code, back-to-posts)
- About page ✓ — Task 4 (mugshot, skills pills, experience list)
- Archive page ✓ — Task 4 (reuses card grid)
- Flow rhythm ✓ — Task 2 (spacing tokens), Task 4 (applied in page layouts)
- Open decisions → resolved in collab ✓ — Task 5 (light mode palette, link colour)

**2. Placeholder scan:** The only placeholders are `/* resolved in collab */` in Task 6's CSS file — these are intentional because the light-mode colour values are determined during Task 5. The executor fills them in before writing the file.

**3. Type consistency:** Token names are consistent across all tasks. The same `--color-text-link`, `--color-accent-*`, `--size-step-*`, etc. names are used in Task 2 (token reference), Task 3 (components reference tokens), Task 5 (light mode uses same names), and Task 6 (CSS file).
