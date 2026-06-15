<!-- OWNED BY /explore -->

# Project — meeg-blog

## Problem

Chris Meagher's personal blog (v3, built on Astro + Storyblok + Render) has hit a wall: the design is stale, Storyblok feels heavy for a solo blog, and paying for Plausible and hosting isn't worth it. Interest in maintaining the blog has waned. The setup needs a refresh — new tech, new look, lower cost — to re-invigorate the desire to write and publish.

## Who it's for

**Primary:** Chris Meagher (the author) — must be a pleasure to write for and maintain.

**Secondary:** Career audience — recruiters and peers who find the blog through search or links.

**Tertiary:** General tech audience — any developer who lands on a post.

**Not for:** Multi-author, commenters, subscribers, or social audiences.

## Goals

1. **Re-invigorate writing** — make it fun and frictionless to publish regularly.
2. **Lower cost** — total monthly operating cost ≤ $10.
3. **Excellent performance** — fast loads, good Core Web Vitals.
4. **Design I'm proud of** — unique look, no template, even without a design background.
5. **Learn the stack** — deepen understanding of Dato CMS, Cloudflare Workers, and modern Astro patterns.

## Success

Observable signs this project was worth doing:

- Publishing at least one new post in the first month after launch.
- Writing and posting feels good — low friction, enjoyable workflow.
- Monthly bill ≤ $10.
- Lighthouse / Core Web Vitals scores in the green.
- I want to show someone the design.
- I can explain the architecture decisions confidently.

## Scope

### In scope

- Home page (post listing)
- About page
- Blog listing with pagination and tag filtering
- Blog article page (with code syntax highlighting)
- Visual editor via Dato CMS
- Content migrated from Storyblok (existing posts)
- At least one new article to publish at launch
- Dato CMS integration (Free plan)
- Deployment to Cloudflare (Workers or Pages)
- Cloudflare analytics (built-in, free)

### Out of scope

- Comments system
- Newsletter / email subscriptions
- Paid content / e-commerce
- Multi-author / user accounts
- Social features (likes, shares, following)
- External analytics (Plausible, GA, etc.) — Cloudflare built-in is sufficient
- Error tracking (Sentry) — no need identified

## Constraints

- Dato CMS on the Free plan
- Deploy to Cloudflare to keep costs near zero
- Total monthly budget ≤ $10
- Existing Astro expertise is a baseline, but open to changing framework if Astro-on-Cloudflare has known issues or a better stack emerges.

## Design decisions

See `docs/MEMORY.md` for full decision log. Key architectural choices:

- **Astro 6 on Cloudflare Workers** (SSR) — `@astrojs/cloudflare` adapter. No compatibility issues found.
- **Dato CMS Free plan** — 300 record limit covers projected ~72 records. 100k API calls/month sufficient with worker-side caching.
- **Dato Structured Text** for article and page bodies — reject Markdown.
- **CSS custom properties + Open Design AI** — design tokens from DESIGN.md map to CSS vars. No Tailwind, no template.
- **Vanilla JS theme toggle** — no Preact for a single button.
- **Cloudflare Web Analytics** — free, built-in. Reject Plausible and Sentry.

## Open questions

- ~~**Astro on Cloudflare** — any known issues or limitations?~~ ✅ Resolved — `@astrojs/cloudflare` adapter works well on Astro 6.
- ~~**Dato CMS Free plan record limits** — enough?~~ ✅ Resolved — 300 records, 100k API calls/month; projected ~72 records.
- ~~**Design approach** — no template, no design skill.~~ ✅ Resolved — Open Design AI for design tokens; CSS custom properties.
- **Content migration** — what's the effort to move posts from Storyblok to Dato? Manual copy? Scripted?

## Riskiest unknowns

1. **Design velocity** — not a designer; risk of getting stuck or settling for something that doesn't feel "proud of." Open Design AI chosen to mitigate.
2. **Maintaining momentum** — rebuild itself could stall if interest drops. Need to ship fast and small.
3. ~~**Cloudflare + Astro compatibility** — edge rendering, SSR, or build limits might surprise.~~ ✅ Mitigated — no known issues with `@astrojs/cloudflare`.
