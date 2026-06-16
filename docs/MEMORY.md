<!-- OWNED BY /document - Appended to by every phase command. -->

# Decision Log — meeg-blog

Project decisions preserved for AI agents. Each entry is dated.

---

## 2026-06-15

### /explore decisions

- **Replatform to Dato CMS + Cloudflare.** Moving from Storyblok + Render to cut costs and simplify. Dato on Free plan, Cloudflare for near-zero hosting.
- **Cloudflare analytics over Plausible.** Built-in, free, good enough. No need for a paid analytics service.
- **Sentry dropped.** No error-tracking need identified for a personal blog. One less service to manage.
- **Design must be unique (no templates).** Acknowledged as a risk given no design background. Approach TBD.

## 2026-06-16

### /spec decisions

- **Design direction: Technical & Utilitarian.** Chosen over Clean/Minimal, Bold/Distinctive, and Warm/Approachable. Fits the author's identity as a software engineer.
- **Dracula colour palette.** Chosen because the author already uses the Dracula theme in their editor and terminal. Provides a cohesive dark-mode-first system with recognizable accent colours.
- **Orange links, not cyan.** Cyan was tested in-context on the home page and clashed with the coding palette. Orange provides better distinction from code syntax colours.
- **Link accent colour: orange.** Purple for mugshot ring and blockquotes.
- **Inter + JetBrains Mono.** Atlassian Sans was the initial prose preference but has no public CDN. Inter is the typeface Atlassian Sans is derived from — visually identical and freely available via @fontsource.
- **Full-width layout with readable measure.** Content constrained to 65ch, code blocks break out to full viewport width. Chosen over single-column-centered and two-column-with-sidebar.
- **Dark + light mode, system default, dark fallback.** Standard developer blog expectation.
- **Progressive glass header** — transparent at top of page, glass effect (backdrop-filter blur) fades in on scroll via IntersectionObserver.
- **No featured images on article pages.** Removed after user feedback that decorative hero images add scroll friction.
- **No reading time estimates.** Removed as redundant — readers take as long as they take.
- **No share links.** Users can copy/paste URLs.
- **Home page shows latest 2 posts as cards** with tags, images, excerpts. No pagination/infinite scroll.
- **Archive page reuses home page card grid.**
- **Piccalilli .flow rhythm applied throughout.** em-based spacing so rhythm scales with font size. Key principles: headings get 1.5em flow-space, element after heading gets 0.5em, body gets 1em default.
- **Layered, colour-matched box-shadows on cards** (Josh Comeau technique) for subtle depth without grey wash.
- **Coding motifs (// comments, ~ prompts) removed.** Tested and rejected — felt gimmicky rather than authentic.
- **Footer: minimal, 3 links + scroll-to-top.** Copyright mark (personal branding, not legal), GitHub link, RSS link on left. "Scroll to top" pill on the right. Comment-colour, unobtrusive. IntersectionObserver-driven visibility.
