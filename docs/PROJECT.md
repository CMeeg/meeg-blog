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

## Framework decision

After evaluating RedwoodSDK, Fresh, React Router v7, Remix v3, and Void against the project's goals and the broader aim of evaluating a potential Next.js alternative for work:

**Decision: Stick with Astro v6.**

Astro's v4-v6 additions (Actions, Sessions, SSR, middleware, server islands) make it far more capable for general-purpose apps than its "content site" reputation suggests. For the blog it's ideal; for work, it could serve many use cases (e-commerce, CRUD, marketing) where Next.js is overkill or its Vercel lock-in is a concern. The `.astro` syntax is the main adoption barrier for a React team, but the fundamentals are solid.

Also considered and ruled out:

| Framework | Ruled out because |
|---|---|
| **RedwoodSDK** | Cloudflare-only — work requires Azure support |
| **Fresh** | Deno + Preact — hard sell at a React/.NET shop |
| **React Router v7** | Excellent multi-cloud story but Shopify-owned — business partnership conflict at work |
| **Remix v3** | Complete rewrite of Remix — new component model, beta, different framework entirely |
| **Void** | Cloudflare-only (private beta) |

## Open questions

- **Dato CMS Free plan record limits** — how many posts/models does it support? Will it cover the full migrated archive?
- **Design approach** — no template, but no design skill. How to get a unique look without hiring a designer? (e.g. utility CSS framework + good typography?)
- **Content migration** — what's the effort to move posts from Storyblok to Dato? Manual copy? Scripted?

## Riskiest unknowns

1. **Design velocity** — not a designer; risk of getting stuck or settling for something that doesn't feel "proud of."
2. **Maintaining momentum** — rebuild itself could stall if interest drops. Need to ship fast and small.
3. **Cloudflare + Astro compatibility** — edge rendering, SSR, or build limits might surprise.
