# DatoCMS Content Model Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create and maintain the blog's content model (Post, Tag, Series, About Page, Site Settings + 5 blocks) using DatoCMS CLI migrations.

**Architecture:** pnpm monorepo (established by [solution setup plan](./2026-06-17-solution-setup.md)) with `apps/blog` (Astro) and `packages/dato-cms` (migrations, types, entities, services). Each migration script creates one logical group of models/blocks — independently testable on a `uat` fork, then promotable to primary. The `dato-cms` package is referenced as a workspace dependency by the blog app.

**Tech Stack:** `datocms` CLI, TypeScript migrations, `uat` sandbox env, pnpm workspaces

## Global Constraints

**Prerequisites:** The monorepo structure, toolchain, and DatoCMS CLI config are established by the [solution setup plan](./2026-06-17-solution-setup.md). This plan assumes those are in place.

- pnpm workspace monorepo — root `pnpm-workspace.yaml` with `apps/*` and `packages/*`
- Astro project lives in `apps/blog/`
- DatoCMS code lives in `packages/dato-cms/` — migrations, types, entities, services
- Migration files in `packages/dato-cms/migrations/`
- `datocms.config.json` at root, with `migrations.dir` pointing to `packages/dato-cms/migrations`
- All migrations are TypeScript (`.ts`)
- All models use `draftModeActive: true` (exception: blocks)
- All user-facing models get SEO fallbacks wired (`titleField`, `excerptField`, `imagePreviewField`)
- All collection appearances set explicitly (no reliance on compact default)
- Validators use `"fail"` cascade strategies for editorial content
- Block `api_key`s suffixed with `_block` per DatoCMS naming convention
- Model `api_key`s must be singular



### Task 1: CLI Bootstrap & First Migration Scaffold

**Files:**
- Create: `datocms.config.json` — root-level config pointing to `packages/dato-cms/migrations/`

**Prerequisites (user-driven, interactive):**

- [ ] **Step 1: Create DatoCMS project**

Navigate to `datocms.com` → New Project → name `meeg-blog`

- [ ] **Step 2: Install datocms CLI**

Run: `pnpm add -D datocms`

- [ ] **Step 3: OAuth login**

Run: `pnpm exec datocms login`
Expected: Opens browser for authentication

- [ ] **Step 4: Discover project ID**

Run: `pnpm exec datocms projects:list --json`
Expected: JSON with siteId, name, organization

- [ ] **Step 5: Link repo to project**

Run: `pnpm exec datocms link --site-id=<ID>`
Expected: Created `datocms.config.json`

- [ ] **Step 6: Write `datocms.config.json`**

```json
{
  "profiles": {
    "default": {
      "migrations": {
        "dir": "packages/dato-cms/migrations",
        "tsconfig": "packages/dato-cms/tsconfig.migrations.json"
      }
    }
  }
}
```

- [ ] **Step 7: Scaffold first migration**

Run: `pnpm exec datocms migrations:new "create post tag series models" --ts --schema=all`
Expected: Creates `packages/dato-cms/migrations/<unix_ts>_createPostTagSeriesModels.ts`

- [ ] **Step 8: Verify CLI readiness**

Run: `pnpm exec datocms whoami`
Expected: Returns email and default project

- [ ] **Step 9: Commit**

```bash
git add datocms.config.json packages/dato-cms/migrations/
git commit -m "chore: bootstrap datocms CLI, link project, scaffold first migration"
```

---

### Task 2: Migration 1 — Create Post, Tag, Series Models

**Files:**
- Modify: `packages/dato-cms/migrations/<ts>_createPostTagSeriesModels.ts` (replace scaffolded content)

- [ ] **Step 1: Write migration code**

```ts
import { Client } from 'datocms/lib/cma-client-node';

export default async function (client: Client) {
  // ── Post model ──
  const post = await client.itemTypes.create({
    name: 'Post',
    apiKey: 'post',
    draftModeActive: true,
    draftSavingActive: true,
    collectionAppearance: 'table',
    orderingMeta: 'first_published_at',
    orderingDirection: 'desc',
    inverseRelationshipsEnabled: true,
  });

  const postTitle = await client.fields.create(post.id, {
    label: 'Title',
    apiKey: 'title',
    fieldType: 'string',
    validators: { required: {} },
    appearance: { editor: 'single_line', parameters: { heading: true } },
  });

  const postSlug = await client.fields.create(post.id, {
    label: 'Slug',
    apiKey: 'slug',
    fieldType: 'slug',
    validators: {
      slugTitleField: { titleFieldId: postTitle.id },
      slugFormat: { predefinedPattern: 'webpage_slug' },
      required: {},
    },
  });

  const postExcerpt = await client.fields.create(post.id, {
    label: 'Excerpt',
    apiKey: 'excerpt',
    fieldType: 'text',
    validators: {},
    appearance: { editor: 'textarea', parameters: {} },
  });

  const postBody = await client.fields.create(post.id, {
    label: 'Body',
    apiKey: 'body',
    fieldType: 'structured_text',
    validators: {
      required: {},
      structuredTextBlocks: { itemTypes: [] },
    },
    appearance: {
      editor: 'structured_text',
      parameters: {
        nodes: ['heading', 'list', 'link', 'blockquote', 'code', 'thematicBreak'],
        marks: ['strong', 'emphasis', 'code', 'highlight'],
        headingLevels: [2, 3],
      },
    },
  });

  const postTags = await client.fields.create(post.id, {
    label: 'Tags',
    apiKey: 'tags',
    fieldType: 'links',
    validators: {
      itemsItemType: {
        itemTypes: [],
        onPublishWithUnpublishedReferencesStrategy: 'fail',
        onReferenceUnpublishStrategy: 'fail',
        onReferenceDeleteStrategy: 'fail',
      },
    },
  });

  const postSeries = await client.fields.create(post.id, {
    label: 'Series',
    apiKey: 'series',
    fieldType: 'link',
    validators: {
      itemItemType: {
        itemTypes: [],
        onPublishWithUnpublishedReferencesStrategy: 'fail',
        onReferenceUnpublishStrategy: 'fail',
        onReferenceDeleteStrategy: 'fail',
      },
    },
  });

  const postOrderInSeries = await client.fields.create(post.id, {
    label: 'Order in Series',
    apiKey: 'order_in_series',
    fieldType: 'integer',
    validators: {},
  });

  const postStale = await client.fields.create(post.id, {
    label: 'Stale',
    apiKey: 'stale',
    fieldType: 'boolean',
    validators: {},
  });

  const postSeo = await client.fields.create(post.id, {
    label: 'SEO',
    apiKey: 'seo',
    fieldType: 'seo',
    validators: {
      requiredSeoFields: { title: true, description: true, image: true },
      titleLength: { max: 60 },
      descriptionLength: { max: 160 },
    },
    appearance: {
      editor: 'seo',
      parameters: { fields: ['title', 'description', 'image'], previews: ['google'] },
    },
  });

  await client.itemTypes.update(post.id, {
    titleField: { id: postTitle.id, type: 'field' },
    excerptField: { id: postExcerpt.id, type: 'field' },
    imagePreviewField: null,
  });

  // ── Tag model ──
  const tag = await client.itemTypes.create({
    name: 'Tag',
    apiKey: 'tag',
    draftModeActive: true,
    draftSavingActive: false,
    collectionAppearance: 'compact',
    inverseRelationshipsEnabled: true,
  });

  const tagName = await client.fields.create(tag.id, {
    label: 'Name',
    apiKey: 'name',
    fieldType: 'string',
    validators: { required: {} },
  });

  const tagSlug = await client.fields.create(tag.id, {
    label: 'Slug',
    apiKey: 'slug',
    fieldType: 'slug',
    validators: {
      slugTitleField: { titleFieldId: tagName.id },
      slugFormat: { predefinedPattern: 'webpage_slug' },
      required: {},
    },
  });

  const tagColor = await client.fields.create(tag.id, {
    label: 'Color',
    apiKey: 'color',
    fieldType: 'color',
    validators: {},
  });

  await client.itemTypes.update(tag.id, {
    titleField: { id: tagName.id, type: 'field' },
    imagePreviewField: null,
  });

  // ── Series model ──
  const series = await client.itemTypes.create({
    name: 'Series',
    apiKey: 'series',
    draftModeActive: true,
    draftSavingActive: false,
    collectionAppearance: 'table',
    inverseRelationshipsEnabled: true,
  });

  const seriesName = await client.fields.create(series.id, {
    label: 'Name',
    apiKey: 'name',
    fieldType: 'string',
    validators: { required: {} },
  });

  const seriesSlug = await client.fields.create(series.id, {
    label: 'Slug',
    apiKey: 'slug',
    fieldType: 'slug',
    validators: {
      slugTitleField: { titleFieldId: seriesName.id },
      slugFormat: { predefinedPattern: 'webpage_slug' },
      required: {},
    },
  });

  const seriesDescription = await client.fields.create(series.id, {
    label: 'Description',
    apiKey: 'description',
    fieldType: 'text',
    validators: {},
    appearance: { editor: 'textarea', parameters: {} },
  });

  const seriesSeo = await client.fields.create(series.id, {
    label: 'SEO',
    apiKey: 'seo',
    fieldType: 'seo',
    validators: {
      requiredSeoFields: { title: true, description: true, image: true },
      titleLength: { max: 60 },
      descriptionLength: { max: 160 },
    },
    appearance: {
      editor: 'seo',
      parameters: { fields: ['title', 'description', 'image'], previews: ['google'] },
    },
  });

  await client.itemTypes.update(series.id, {
    titleField: { id: seriesName.id, type: 'field' },
    imagePreviewField: null,
  });

  // ── Wire Post → Tag and Post → Series relationship validators ──
  await client.fields.update(postTags.id, {
    validators: {
      itemsItemType: {
        itemTypes: [tag.id],
        onPublishWithUnpublishedReferencesStrategy: 'fail',
        onReferenceUnpublishStrategy: 'fail',
        onReferenceDeleteStrategy: 'fail',
      },
    },
  });

  await client.fields.update(postSeries.id, {
    validators: {
      itemItemType: {
        itemTypes: [series.id],
        onPublishWithUnpublishedReferencesStrategy: 'fail',
        onReferenceUnpublishStrategy: 'fail',
        onReferenceDeleteStrategy: 'fail',
      },
    },
  });
}
```

- [ ] **Step 2: Run migration on uat sandbox**

Run: `pnpm exec datocms migrations:run --destination=uat`
Expected: Fork creates `uat` environment, migration runs, returns success

- [ ] **Step 3: Verify models in DatoCMS Dashboard**

Navigate to Settings → Content models → Confirm Post, Tag, Series with all fields + validators visible

- [ ] **Step 4: Promote to primary**

Run: `pnpm exec datocms environments:promote uat --to primary`
Expected: `uat` becomes primary

- [ ] **Step 5: Commit**

```bash
git add packages/dato-cms/migrations/
git commit -m "feat(dato-cms): add Post, Tag, Series models via migration"
```

---

### Task 3: Migration 2 — Create Singleton Models (About Page, Site Settings)

**Files:**
- Create: `packages/dato-cms/migrations/<ts>_createSingletons.ts`

- [ ] **Step 1: Scaffold migration**

Run: `pnpm exec datocms migrations:new "create singletons" --ts`

- [ ] **Step 2: Write migration code**

```ts
import { Client } from 'datocms/lib/cma-client-node';

export default async function (client: Client) {
  // ── About Page (singleton) ──
  const aboutPage = await client.itemTypes.create({
    name: 'About Page',
    apiKey: 'about_page',
    singleton: true,
    draftModeActive: true,
    draftSavingActive: false,
    collectionAppearance: 'compact',
  });

  const aboutBio = await client.fields.create(aboutPage.id, {
    label: 'Bio',
    apiKey: 'bio',
    fieldType: 'structured_text',
    validators: { required: {} },
    appearance: {
      editor: 'structured_text',
      parameters: {
        nodes: ['heading', 'list', 'link'],
        marks: ['strong', 'emphasis'],
        headingLevels: [2, 3],
      },
    },
  });

  const aboutMugshot = await client.fields.create(aboutPage.id, {
    label: 'Mugshot',
    apiKey: 'mugshot',
    fieldType: 'file',
    validators: {
      required: false,
      extension: { predefinedList: 'transformable_image' },
      requiredAltTitle: { alt: true, title: false },
    },
  });

  const aboutGithubUrl = await client.fields.create(aboutPage.id, {
    label: 'GitHub URL',
    apiKey: 'github_url',
    fieldType: 'string',
    validators: {
      format: { predefinedPattern: 'url' },
    },
  });

  const aboutSkills = await client.fields.create(aboutPage.id, {
    label: 'Skills',
    apiKey: 'skills',
    fieldType: 'rich_text',
    validators: {
      richTextBlocks: { itemTypes: [] },
    },
  });

  const aboutExperience = await client.fields.create(aboutPage.id, {
    label: 'Experience',
    apiKey: 'experience',
    fieldType: 'rich_text',
    validators: {
      richTextBlocks: { itemTypes: [] },
    },
  });

  const aboutSeo = await client.fields.create(aboutPage.id, {
    label: 'SEO',
    apiKey: 'seo',
    fieldType: 'seo',
    validators: {
      requiredSeoFields: { title: true, description: true, image: true },
      titleLength: { max: 60 },
      descriptionLength: { max: 160 },
    },
    appearance: {
      editor: 'seo',
      parameters: { fields: ['title', 'description', 'image'], previews: ['google'] },
    },
  });

  await client.itemTypes.update(aboutPage.id, {
    titleField: { id: aboutBio.id, type: 'field' },
    imagePreviewField: { id: aboutMugshot.id, type: 'field' },
  });

  // ── Site Settings (singleton) ──
  const siteSettings = await client.itemTypes.create({
    name: 'Site Setting',
    apiKey: 'site_setting',
    singleton: true,
    draftModeActive: true,
    draftSavingActive: false,
    collectionAppearance: 'compact',
  });

  const siteName = await client.fields.create(siteSettings.id, {
    label: 'Site Name',
    apiKey: 'site_name',
    fieldType: 'string',
    validators: { required: {} },
  });

  const navLinks = await client.fields.create(siteSettings.id, {
    label: 'Nav Links',
    apiKey: 'nav_links',
    fieldType: 'rich_text',
    validators: {
      required: true,
      richTextBlocks: { itemTypes: [] },
    },
  });

  const socialLinks = await client.fields.create(siteSettings.id, {
    label: 'Social Links',
    apiKey: 'social_links',
    fieldType: 'rich_text',
    validators: {
      richTextBlocks: { itemTypes: [] },
    },
  });

  await client.itemTypes.update(siteSettings.id, {
    titleField: { id: siteName.id, type: 'field' },
    imagePreviewField: null,
  });
}
```

- [ ] **Step 3: Run and verify**

Run: `pnpm exec datocms migrations:run --destination=uat`
Verify: About Page and Site Setting singletons visible in Dashboard

- [ ] **Step 4: Promote to primary**

Run: `pnpm exec datocms environments:promote uat --to primary`

- [ ] **Step 5: Commit**

```bash
git add packages/dato-cms/migrations/
git commit -m "feat(dato-cms): add About Page and Site Settings singletons"
```

---

### Task 4: Migration 3 — Create Block Models

**Files:**
- Create: `packages/dato-cms/migrations/<ts>_createBlockModels.ts`

- [ ] **Step 1: Scaffold migration**

Run: `pnpm exec datocms migrations:new "create block models" --ts`

- [ ] **Step 2: Write migration code**

```ts
import { Client } from 'datocms/lib/cma-client-node';

export default async function (client: Client) {
  // ── Image Block (embedded in Post.body structured_text) ──
  const imageBlock = await client.itemTypes.create({
    name: 'Image Block',
    apiKey: 'image_block',
    modularBlock: true,
    draftModeActive: false,
  });

  const imageBlockImage = await client.fields.create(imageBlock.id, {
    label: 'Image',
    apiKey: 'image',
    fieldType: 'file',
    validators: {
      required: {},
      extension: { predefinedList: 'transformable_image' },
      requiredAltTitle: { alt: true, title: false },
    },
  });

  await client.itemTypes.update(imageBlock.id, {
    titleField: { id: imageBlockImage.id, type: 'field' },
  });

  // ── Skill Block (used in About Page skills rich_text) ──
  const skillBlock = await client.itemTypes.create({
    name: 'Skill Block',
    apiKey: 'skill_block',
    modularBlock: true,
    draftModeActive: false,
  });

  const skillName = await client.fields.create(skillBlock.id, {
    label: 'Name',
    apiKey: 'name',
    fieldType: 'string',
    validators: { required: {} },
  });

  await client.itemTypes.update(skillBlock.id, {
    titleField: { id: skillName.id, type: 'field' },
  });

  // ── Experience Entry Block (used in About Page experience rich_text) ──
  const experienceEntryBlock = await client.itemTypes.create({
    name: 'Experience Entry Block',
    apiKey: 'experience_entry_block',
    modularBlock: true,
    draftModeActive: false,
  });

  const expRole = await client.fields.create(experienceEntryBlock.id, {
    label: 'Role',
    apiKey: 'role',
    fieldType: 'string',
    validators: { required: {} },
  });

  const expCompany = await client.fields.create(experienceEntryBlock.id, {
    label: 'Company',
    apiKey: 'company',
    fieldType: 'string',
    validators: { required: {} },
  });

  const expDates = await client.fields.create(experienceEntryBlock.id, {
    label: 'Dates',
    apiKey: 'dates',
    fieldType: 'string',
    validators: { required: {} },
  });

  const expDescription = await client.fields.create(experienceEntryBlock.id, {
    label: 'Description',
    apiKey: 'description',
    fieldType: 'text',
    validators: {},
    appearance: { editor: 'textarea', parameters: {} },
  });

  await client.itemTypes.update(experienceEntryBlock.id, {
    titleField: { id: expRole.id, type: 'field' },
  });

  // ── Nav Link Block (used in Site Settings nav_links rich_text) ──
  const navLinkBlock = await client.itemTypes.create({
    name: 'Nav Link Block',
    apiKey: 'nav_link_block',
    modularBlock: true,
    draftModeActive: false,
  });

  const navLabel = await client.fields.create(navLinkBlock.id, {
    label: 'Label',
    apiKey: 'label',
    fieldType: 'string',
    validators: { required: {} },
  });

  const navUrl = await client.fields.create(navLinkBlock.id, {
    label: 'URL',
    apiKey: 'url',
    fieldType: 'string',
    validators: { required: {}, format: { predefinedPattern: 'url' } },
  });

  await client.itemTypes.update(navLinkBlock.id, {
    titleField: { id: navLabel.id, type: 'field' },
  });

  // ── Social Link Block (used in Site Settings social_links rich_text) ──
  const socialLinkBlock = await client.itemTypes.create({
    name: 'Social Link Block',
    apiKey: 'social_link_block',
    modularBlock: true,
    draftModeActive: false,
  });

  const socialPlatform = await client.fields.create(socialLinkBlock.id, {
    label: 'Platform',
    apiKey: 'platform',
    fieldType: 'string',
    validators: { required: {} },
  });

  const socialUrl = await client.fields.create(socialLinkBlock.id, {
    label: 'URL',
    apiKey: 'url',
    fieldType: 'string',
    validators: { required: {}, format: { predefinedPattern: 'url' } },
  });

  await client.itemTypes.update(socialLinkBlock.id, {
    titleField: { id: socialPlatform.id, type: 'field' },
  });

  // Store block IDs in a known structure for later migrations
  // Block IDs are captured in the migration tracking record
  console.log('Block IDs:', {
    imageBlock: imageBlock.id,
    skillBlock: skillBlock.id,
    experienceEntryBlock: experienceEntryBlock.id,
    navLinkBlock: navLinkBlock.id,
    socialLinkBlock: socialLinkBlock.id,
  });
}
```

- [ ] **Step 3: Wire Post.body structured_text to allow image_block**

Note: The Post.body field was created in Migration 1 with empty `structuredTextBlocks`. After image_block exists, update the validator.

This is done in Migration 4 (Task 5) which wires all relationships and validators holistically. Add Post.body structured_text_blocks wiring there along with all other wireups.

- [ ] **Step 4: Run and verify**

Run: `pnpm exec datocms migrations:run --destination=uat`
Verify: All 5 blocks visible in Block Models section

- [ ] **Step 5: Promote to primary**

Run: `pnpm exec datocms environments:promote uat --to primary`

- [ ] **Step 6: Commit**

```bash
git add packages/dato-cms/migrations/
git commit -m "feat(dato-cms): add 5 block models (image, skill, experience, nav, social)"
```

---

### Task 5: Migration 4 — Wire Block Validators, Field Hints, Fieldsets, SEO Fallbacks

**Files:**
- Create: `packages/dato-cms/migrations/<ts>_wireValidatorsAndHints.ts`

- [ ] **Step 1: Scaffold migration**

Run: `pnpm exec datocms migrations:new "wire validators and hints" --ts`

- [ ] **Step 2: Write migration code**

This migration runs after all models and blocks exist. It:
1. Wires Post.body `structuredTextBlocks` to allow `image_block`
2. Wires About Page skills to allow `skill_block`
3. Wires About Page experience to allow `experience_entry_block`
4. Wires Site Settings nav_links to allow `nav_link_block`
5. Wires Site Settings social_links to allow `social_link_block`
6. Adds fieldsets to Post (Content, Taxonomy, Meta)
7. Adds hints to all fields

```ts
import { Client } from 'datocms/lib/cma-client-node';

export default async function (client: Client) {
  // Find all item types by API key
  const allTypes = await client.itemTypes.list();

  const findByApiKey = (apiKey: string) => {
    const found = allTypes.find((t: any) => t.attributes.apiKey === apiKey);
    if (!found) throw new Error(`Item type not found: ${apiKey}`);
    return found;
  };

  const post = findByApiKey('post');
  const aboutPage = findByApiKey('about_page');
  const siteSettings = findByApiKey('site_setting');
  const imageBlock = findByApiKey('image_block');
  const skillBlock = findByApiKey('skill_block');
  const experienceEntryBlock = findByApiKey('experience_entry_block');
  const navLinkBlock = findByApiKey('nav_link_block');
  const socialLinkBlock = findByApiKey('social_link_block');

  // Helper: find field by apiKey within an item type
  const findField = async (itemTypeId: string, apiKey: string) => {
    const fields = await client.fields.list(itemTypeId);
    const found = fields.find((f: any) => f.attributes.apiKey === apiKey);
    if (!found) throw new Error(`Field ${apiKey} not found on item type ${itemTypeId}`);
    return found;
  };

  // ── Wire Post.body structured_text to allow image_block ──
  const postBody = await findField(post.id, 'body');
  await client.fields.update(postBody.id, {
    validators: {
      ...(postBody.attributes.validators || {}),
      structuredTextBlocks: {
        itemTypes: [imageBlock.id],
      },
    },
  });

  // ── Wire About Page skills → skill_block ──
  const aboutSkills = await findField(aboutPage.id, 'skills');
  await client.fields.update(aboutSkills.id, {
    validators: {
      richTextBlocks: { itemTypes: [skillBlock.id] },
    },
  });

  // ── Wire About Page experience → experience_entry_block ──
  const aboutExperience = await findField(aboutPage.id, 'experience');
  await client.fields.update(aboutExperience.id, {
    validators: {
      richTextBlocks: { itemTypes: [experienceEntryBlock.id] },
    },
  });

  // ── Wire Site Settings nav_links → nav_link_block ──
  const siteNavLinks = await findField(siteSettings.id, 'nav_links');
  await client.fields.update(siteNavLinks.id, {
    validators: {
      richTextBlocks: { itemTypes: [navLinkBlock.id] },
    },
  });

  // ── Wire Site Settings social_links → social_link_block ──
  const siteSocialLinks = await findField(siteSettings.id, 'social_links');
  await client.fields.update(siteSocialLinks.id, {
    validators: {
      richTextBlocks: { itemTypes: [socialLinkBlock.id] },
    },
  });

  // ── Add hints to Post fields ──
  const postFields = await client.fields.list(post.id);
  const hintMap: Record<string, string> = {
    title: 'Headline for the blog post',
    slug: 'Auto-filled from title; edit to customise',
    excerpt: 'Short summary for archive cards and SEO',
    body: 'Article prose — use headings, lists, and inline formatting',
    tags: 'Categorise the post (optional)',
    series: 'Group this post into a series',
    order_in_series: 'Position within the series (ascending)',
    stale: 'Mark articles with outdated tech info — renders a notice on the page',
    seo: 'Customise how this post appears in search results',
  };

  for (const field of postFields) {
    const apik = (field as any).attributes.apiKey as string;
    const hint = hintMap[apik];
    if (hint) {
      await client.fields.update(field.id, {
        hint,
      });
    }
  }

  // ── Add hints to Tag fields ──
  const tagFields = await client.fields.list(findByApiKey('tag').id);
  for (const field of tagFields) {
    const apik = (field as any).attributes.apiKey as string;
    if (apik === 'name') {
      await client.fields.update(field.id, { hint: 'Display name for the tag pill' });
    }
    if (apik === 'color') {
      await client.fields.update(field.id, { hint: 'Accent colour for tag cards' });
    }
  }

  // ── Add hints to Series fields ──
  const seriesFields = await client.fields.list(findByApiKey('series').id);
  for (const field of seriesFields) {
    const apik = (field as any).attributes.apiKey as string;
    if (apik === 'description') {
      await client.fields.update(field.id, { hint: 'Shown on the series archive page' });
    }
    if (apik === 'seo') {
      await client.fields.update(field.id, { hint: 'For the series archive page' });
    }
  }

  // ── Add hints to About Page fields ──
  const aboutFields = await client.fields.list(aboutPage.id);
  const aboutHintMap: Record<string, string> = {
    mugshot: 'Profile photo (alt text required)',
    github_url: 'Full URL to your GitHub profile',
    skills: 'Drag skills in from the right panel',
    experience: 'Add experience entries in order (most recent first)',
  };
  for (const field of aboutFields) {
    const apik = (field as any).attributes.apiKey as string;
    const hint = aboutHintMap[apik];
    if (hint) {
      await client.fields.update(field.id, { hint });
    }
  }

  // ── Add hints to Site Setting fields ──
  const siteFields = await client.fields.list(siteSettings.id);
  const siteHintMap: Record<string, string> = {
    site_name: 'Site title — appears in browser tabs and SEO',
    nav_links: 'Reorder by drag-and-drop. At least one link required.',
    social_links: 'Platforms: GitHub, LinkedIn, Bluesky, Mastodon, etc.',
  };
  for (const field of siteFields) {
    const apik = (field as any).attributes.apiKey as string;
    const hint = siteHintMap[apik];
    if (hint) {
      await client.fields.update(field.id, { hint });
    }
  }

  // ── Add fieldsets to Post ──
  // Create Content fieldset (title, slug, excerpt, body)
  const contentFieldset = await client.fieldsets.create(post.id, {
    title: 'Content',
    apiKey: 'content',
    hint: 'Main article content',
  });

  // Create Taxonomy fieldset (tags, series, order_in_series)
  const taxonomyFieldset = await client.fieldsets.create(post.id, {
    title: 'Taxonomy',
    apiKey: 'taxonomy',
    hint: 'Categorisation and series membership',
  });

  // Create Meta fieldset (stale, seo)
  const metaFieldset = await client.fieldsets.create(post.id, {
    title: 'Meta',
    apiKey: 'meta',
    hint: 'Publishing and SEO settings',
  });

  // Reorder fields into fieldsets
  const getFieldId = (fields: any[], apiKey: string) => {
    const f = fields.find((f: any) => f.attributes.apiKey === apiKey);
    if (!f) throw new Error(`Field ${apiKey} not found`);
    return f.id;
  };

  const postFieldList = await client.fields.list(post.id);

  await client.itemTypes.reorderFieldsAndFieldsets(post.id, {
    data: [
      // Content fieldset
      ...['title', 'slug', 'excerpt', 'body'].map((key, i) => ({
        id: getFieldId(postFieldList, key),
        type: 'field' as const,
        position: i + 1,
        fieldset: { id: contentFieldset.id, type: 'fieldset' as const },
      })),
      // Taxonomy fieldset
      ...['tags', 'series', 'order_in_series'].map((key, i) => ({
        id: getFieldId(postFieldList, key),
        type: 'field' as const,
        position: i + 1,
        fieldset: { id: taxonomyFieldset.id, type: 'fieldset' as const },
      })),
      // Meta fieldset
      ...['stale', 'seo'].map((key, i) => ({
        id: getFieldId(postFieldList, key),
        type: 'field' as const,
        position: i + 1,
        fieldset: { id: metaFieldset.id, type: 'fieldset' as const },
      })),
    ],
  });

  console.log('Validators, hints, and fieldsets wired successfully');
}
```

- [ ] **Step 3: Run and verify**

Run: `pnpm exec datocms migrations:run --destination=uat`
Verify: Post body allows image_block; Skill/Experience blocks available in About Page; Nav/Social blocks available in Site Settings; hints visible; fieldsets visible on Post model

- [ ] **Step 4: Promote to primary**

Run: `pnpm exec datocms environments:promote uat --to primary`

- [ ] **Step 5: Commit**

```bash
git add packages/dato-cms/migrations/
git commit -m "feat(dato-cms): wire block validators, field hints, and fieldsets"
```

---

### Task 6: Migration 5 — Seed Singleton Records

**Files:**
- Create: `packages/dato-cms/migrations/<ts>_seedSingletons.ts`

- [ ] **Step 1: Scaffold migration**

Run: `pnpm exec datocms migrations:new "seed singleton records" --ts`

- [ ] **Step 2: Write migration code**

```ts
import { Client } from 'datocms/lib/cma-client-node';

export default async function (client: Client) {
  const allTypes = await client.itemTypes.list();
  const findApiKey = (key: string) =>
    allTypes.find((t: any) => t.attributes.apiKey === key)!;

  const aboutPageType = findApiKey('about_page');
  const siteSettingsType = findApiKey('site_setting');

  // ── Seed About Page ──
  const aboutRecord = await client.items.create({
    itemType: { id: aboutPageType.id, type: 'item_type' },
    bio: {
      schema: 'dast',
      document: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'span', value: 'Your bio goes here.' }],
          },
        ],
      },
    },
  });

  await client.items.publish(aboutRecord.id);
  console.log(`Seeded About Page: ${aboutRecord.id}`);

  // ── Seed Site Settings ──
  const siteRecord = await client.items.create({
    itemType: { id: siteSettingsType.id, type: 'item_type' },
    siteName: 'meeg-blog',
    navLinks: {
      schema: 'dast',
      document: {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [{ type: 'span', value: 'Home → /, About → /about, Archive → /archive' }],
          },
        ],
      },
    },
  });

  await client.items.publish(siteRecord.id);
  console.log(`Seeded Site Settings: ${siteRecord.id}`);
}
```

- [ ] **Step 3: Run and verify**

Run: `pnpm exec datocms migrations:run --destination=uat`
Verify: About Page and Site Settings records exist in Dashboard, published

- [ ] **Step 4: Promote to primary**

Run: `pnpm exec datocms environments:promote uat --to primary`

- [ ] **Step 5: Commit**

```bash
git add packages/dato-cms/migrations/
git commit -m "feat(dato-cms): seed singleton records with placeholder content"
```

---

### Task 7: Final Verification

- [ ] **Step 1: Schema inspection**

Run: `pnpm exec datocms schema:inspect --include-validators --include-appearance --include-fieldsets --include-referenced-models --fields-details=complete`

Expected output: Complete schema dump matching the spec at `docs/specs/2026-06-17-content-model.md`

- [ ] **Step 2: Spec coverage check**

Verify each item from the spec exists in the schema:
- Models: post, tag, series, about_page, site_setting — all present with correct fields
- Blocks: image_block, skill_block, experience_entry_block, nav_link_block, social_link_block — all present
- Validators: structured_text nodes/marks correct, slug auto-fill wired, URL format, SEO constraints
- Hints: present on every field
- Fieldsets: Content, Taxonomy, Meta on Post
- Singletons: seeded with published records

- [ ] **Step 3: Update MEMORY.md**

```markdown
## 2026-06-17

### /plan decisions

- **Content model created via 5 CLI migrations.** Each migration targets one logical group (models, singletons, blocks, wireups, seed). Ran on `uat` fork and promoted to primary after each step.
- **Monorepo setup delegated to solution setup plan.** This plan assumes the monorepo structure, toolchain, and DatoCMS CLI config are already in place.
- **Migrations in packages/dato-cms/migrations/** — configured via `datocms.config.json` at root.
- **uat sandbox** used for all migration testing.
```
