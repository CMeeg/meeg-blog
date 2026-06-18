# Solution Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the flat Astro project into a pnpm monorepo with Turborepo, Biome lint/format, Vitest test infrastructure, DatoCMS CLI config, and CI pipeline.

**Architecture:** pnpm monorepo with `apps/blog` (Astro) and `packages/dato-cms` (TypeScript library). Turborepo orchestrates tasks. Biome handles JS/TS/CSS linting and formatting. Vitest with a root workspace file discovers tests in every package. DatoCMS CLI is configured at root with migrations stored in `packages/dato-cms/migrations/`.

**Tech Stack:** pnpm 11, Turborepo, Biome, Vitest, Astro 6, TypeScript, DatoCMS CLI

## Global Constraints

- pnpm workspace monorepo — root `pnpm-workspace.yaml` with `apps/*` and `packages/*`
- Astro project lives in `apps/blog/` as `@meeg-blog/blog`
- DatoCMS code lives in `packages/dato-cms/` as `@meeg-blog/dato-cms`
- Shared tool versions via pnpm catalogs (`typescript`, `vitest`, `datocms`)
- Biome for JS/TS/CSS lint+format; Astro files handled by Astro VS Code extension
- Vitest with per-package configs and root workspace file
- Co-located tests (`src/foo.test.ts` beside `src/foo.ts`)
- `.env` at root for DatoCMS tokens (already gitignored)
- Node >=22.12.0, pnpm 11.5.2

---

### Task 1: Create Directory Structure & Move Astro Project

**Files:**
- Create: `apps/blog/` directory structure
- Create: `packages/dato-cms/src/`
- Create: `packages/dato-cms/migrations/`
- Create: `packages/dato-cms/migrations/.gitkeep`
- Move: `src/` → `apps/blog/src/`
- Move: `public/` → `apps/blog/public/`
- Move: `astro.config.mjs` → `apps/blog/astro.config.mjs`
- Move: `tsconfig.json` → `apps/blog/tsconfig.json`

- [ ] **Step 1: Create target directories**

```bash
mkdir -p apps/blog/src apps/blog/public packages/dato-cms/src packages/dato-cms/migrations
touch packages/dato-cms/migrations/.gitkeep
```

- [ ] **Step 2: Move Astro project files into `apps/blog/`**

```bash
mv src/* apps/blog/src/
mv public/* apps/blog/public/
mv astro.config.mjs apps/blog/
mv tsconfig.json apps/blog/
```

The root `tsconfig.json` gets replaced with a base config in Task 3.

- [ ] **Step 3: Commit**

```bash
git add apps/ packages/
git commit -m "chore: scaffold monorepo directory structure, move Astro to apps/blog/"
```

---

### Task 2: Configure Workspace Root & Package Manifests

**Files:**
- Modify: `pnpm-workspace.yaml` — add packages globs and catalogs
- Modify: `package.json` — workspace root with turbo scripts
- Create: `apps/blog/package.json`
- Create: `packages/dato-cms/package.json`

- [ ] **Step 1: Rewrite `pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
allowBuilds:
  esbuild: true
  sharp: true
catalog:
  typescript: ^5.8.0
  vitest: ^3.1.0
  datocms: ^4.0.0
```

- [ ] **Step 2: Replace root `package.json`**

```json
{
  "name": "meeg-blog",
  "version": "3.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "astro": "astro",
    "dev": "turbo dev",
    "build": "turbo build",
    "preview": "pnpm --filter @meeg-blog/blog preview",
    "lint": "biome check .",
    "format": "biome check --write .",
    "test": "turbo test"
  },
  "engines": {
    "node": ">=22.12.0"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "11.5.2",
      "onFail": "download"
    }
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "turbo": "^2.5.0"
  }
}
```

- [ ] **Step 3: Create `apps/blog/package.json`**

```json
{
  "name": "@meeg-blog/blog",
  "version": "3.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^6.4.4",
    "@meeg-blog/dato-cms": "workspace:*"
  },
  "devDependencies": {
    "vitest": "catalog:"
  }
}
```

- [ ] **Step 4: Create `packages/dato-cms/package.json`**

```json
{
  "name": "@meeg-blog/dato-cms",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest run"
  },
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./migrations/*": "./migrations/*.ts"
  },
  "devDependencies": {
    "datocms": "catalog:",
    "typescript": "catalog:",
    "vitest": "catalog:"
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add pnpm-workspace.yaml package.json apps/blog/package.json packages/dato-cms/package.json
git commit -m "chore: configure pnpm workspace with catalogs, create per-package manifests"
```

---

### Task 3: TypeScript Configuration

**Files:**
- Create: `tsconfig.json` — root base config (strict, no emit)
- Create: `apps/blog/tsconfig.json` — extends root + astro/tsconfigs/strict
- Create: `packages/dato-cms/tsconfig.json` — extends root, compiles to dist/
- Create: `packages/dato-cms/tsconfig.migrations.json` — for DatoCMS CLI

- [ ] **Step 1: Create root `tsconfig.json`**

```json
{
  "compilerOptions": {
    "esModuleInterop": true,
    "skipLibCheck": true,
    "target": "es2022",
    "allowJs": true,
    "resolveJsonModule": true,
    "moduleDetection": "force",
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "exclude": ["node_modules", "dist", ".agents", ".opencode"]
}
```

- [ ] **Step 2: Create `apps/blog/tsconfig.json`**

```json
{
  "extends": ["../../tsconfig.json", "astro/tsconfigs/strict"],
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 3: Create `packages/dato-cms/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "lib": ["es2022"]
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Create `packages/dato-cms/tsconfig.migrations.json`**

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler"
  },
  "include": ["./migrations/**/*.ts"]
}
```

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json apps/blog/tsconfig.json packages/dato-cms/tsconfig.json packages/dato-cms/tsconfig.migrations.json
git commit -m "chore: configure TypeScript — root base config, per-package tsconfigs"
```

---

### Task 4: Build Orchestration & Linting

**Files:**
- Create: `turbo.json`
- Create: `biome.json`

- [ ] **Step 1: Create `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

- [ ] **Step 2: Create `biome.json`**

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true
  }
}
```

All formatting options use Biome defaults (tab indent, double quotes, trailingCommas all, arrowParentheses always, lineWidth 120).

- [ ] **Step 3: Commit**

```bash
git add turbo.json biome.json
git commit -m "chore: add Turborepo pipeline and Biome lint/format config"
```

---

### Task 5: Test Infrastructure, DatoCMS Config & VS Code

**Files:**
- Create: `vitest.workspace.ts`
- Create: `apps/blog/vitest.config.ts`
- Create: `packages/dato-cms/vitest.config.ts`
- Create: `datocms.config.json`
- Create: `.vscode/settings.json`
- Modify: `.vscode/extensions.json`

- [ ] **Step 1: Create root `vitest.workspace.ts`**

```ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'apps/*',
  'packages/*',
]);
```

- [ ] **Step 2: Create `apps/blog/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Create `packages/dato-cms/vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 4: Create `datocms.config.json`**

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

- [ ] **Step 5: Create `.vscode/settings.json`**

```json
{
  "vitest.workspaceConfig": "vitest.workspace.ts",
  "[astro]": {
    "editor.defaultFormatter": "astro-build.astro-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biome"
  }
}
```

- [ ] **Step 6: Update `.vscode/extensions.json`**

```json
{
  "recommendations": [
    "astro-build.astro-vscode",
    "biomejs.biome",
    "vitest.explorer"
  ],
  "unwantedRecommendations": []
}
```

- [ ] **Step 7: Commit**

```bash
git add vitest.workspace.ts apps/blog/vitest.config.ts packages/dato-cms/vitest.config.ts datocms.config.json .vscode/
git commit -m "chore: add Vitest workspace, DatoCMS config, VS Code settings"
```

---

### Task 6: Throwaway Test Code & Full Verification

**Files:**
- Create: `packages/dato-cms/src/index.ts`
- Create: `packages/dato-cms/src/index.test.ts`
- Create: `packages/dato-cms/src/test-lint.ts`
- Create: `packages/dato-cms/src/test-format.ts`
- Create: `apps/blog/src/greet.ts`
- Create: `apps/blog/src/greet.test.ts`

- [ ] **Step 1: Write `packages/dato-cms/src/index.ts`**

```ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

- [ ] **Step 2: Write `packages/dato-cms/src/index.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { greet } from './index.js';

describe('greet', () => {
  it('returns a greeting', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});
```

- [ ] **Step 3: Write `packages/dato-cms/src/test-lint.ts`**

```ts
export function lintMe() {
  const unused = 'should trigger no-unused-vars';
  return 'ok';
}
```

- [ ] **Step 4: Write `packages/dato-cms/src/test-format.ts`**

```ts
export function   formatMe(  )   {
return   "badly formatted"   ;
}
```

- [ ] **Step 5: Write `apps/blog/src/greet.ts`**

```ts
export function add(a: number, b: number): number {
  return a + b;
}
```

- [ ] **Step 6: Write `apps/blog/src/greet.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { add } from './greet.js';

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

- [ ] **Step 7: Install dependencies**

```bash
pnpm install
```

Expected: workspace links resolved, catalog versions pinned.

- [ ] **Step 8: Verify Turbo build succeeds**

```bash
pnpm exec turbo build
```

Expected: `@meeg-blog/dato-cms:build` (tsc emits dist/), `@meeg-blog/blog:build` (astro build succeeds).

- [ ] **Step 9: Verify Turbo test succeeds**

```bash
pnpm exec turbo test
```

Expected: both test suites pass (greet/add tests).

- [ ] **Step 10: Verify Biome lint catches issues**

```bash
pnpm exec biome check .
```

Expected: reports unused variable in `test-lint.ts`, formatting issue in `test-format.ts`.

- [ ] **Step 11: Verify Biome format fixes issues**

```bash
pnpm exec biome check --write .
```

Expected: `test-format.ts` reformatted, `test-lint.ts` still reports unused-var (lint, not format).

- [ ] **Step 12: Delete all throwaway test files**

```bash
rm packages/dato-cms/src/index.ts packages/dato-cms/src/index.test.ts packages/dato-cms/src/test-lint.ts packages/dato-cms/src/test-format.ts apps/blog/src/greet.ts apps/blog/src/greet.test.ts
```

- [ ] **Step 13: Verify build still passes after cleanup**

```bash
pnpm exec turbo build
```

Expected: both packages build (dato-cms may produce empty dist/, blog builds).

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "chore: verify monorepo toolchain, remove throwaway test code"
```

---

### Task 7: CI Pipeline

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: pnpm
      - run: pnpm install
      - run: pnpm exec biome ci .
      - run: pnpm --filter @meeg-blog/blog exec astro check
      - run: pnpm exec turbo build
      - run: pnpm exec turbo test
```

- [ ] **Step 2: Commit**

```bash
git add .github/
git commit -m "ci: add quality pipeline — lint, type-check, build, test"
```
