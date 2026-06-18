# Solution Setup — meeg-blog

> 2026-06-17

## Approach

**pnpm monorepo with Turborepo.** The existing Astro blog moves into `apps/blog/`, DatoCMS tooling lives in `packages/dato-cms/`. Turborepo handles task orchestration and caching. Biome replaces ESLint + Prettier for JS/TS/CSS linting and formatting. Astro files are formatted by the official Astro VS Code extension. Vitest with per-package configs and a root workspace file provides test infrastructure from day one.

## Principles

- **Publishable packages.** The `dato-cms` package has a `tsc` build step from day one, making it extractable for other projects. Migrations are excluded from the package's runtime exports — they stay in-repo as CLI-only.
- **Co-located tests.** Test files sit next to the code they test (`src/foo.ts` + `src/foo.test.ts`). No `__tests__` folders.
- **Unified linting.** One tool (Biome) for JS/TS/CSS. Astro files handled separately by Astro's own tooling.
- **Minimal ceremony.** Workspace root holds shared config only. Per-package configs override where they need different settings (Astro needs `astro/tsconfigs/strict`, dato-cms needs `outDir`).

## Directory Layout

```
meeg-blog/
├── apps/
│   └── blog/                        # @meeg-blog/blog (Astro)
│       ├── astro.config.mjs
│       ├── tsconfig.json             # extends root + astro/tsconfigs/strict
│       ├── vitest.config.ts
│       ├── package.json
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── layouts/
│       │   ├── pages/
│       │   ├── env.d.ts
│       │   ├── greet.ts              # throwaway — proves test/lint/format setup
│       │   └── greet.test.ts
│       └── public/
├── packages/
│   └── dato-cms/                     # @meeg-blog/dato-cms
│       ├── tsconfig.json             # extends root, compiles to dist/
│       ├── tsconfig.migrations.json  # overrides for datocms CLI
│       ├── vitest.config.ts
│       ├── package.json
│       ├── src/
│       │   ├── index.ts              # public API — types, client, entities, services
│       │   ├── index.test.ts         # throwaway — proves test setup
│       │   ├── test-lint.ts          # throwaway — proves biome lint
│       │   └── test-format.ts        # throwaway — proves biome format
│       ├── migrations/               # CLI-only, not exported
│       │   └── .gitkeep
│       └── dist/                     # tsc output (gitignored)
├── .vscode/
│   ├── extensions.json               # Astro, Biome, Vitest
│   └── settings.json                 # formatter associations, vitest workspace
├── .github/
│   └── workflows/
│       └── ci.yml                    # lint, format, type-check, build, test
├── turbo.json                        # Turborepo pipeline
├── pnpm-workspace.yaml               # packages: ['apps/*', 'packages/*']
├── package.json                      # workspace root
├── tsconfig.json                     # base config (strict, ES2022)
├── biome.json                        # lint + format config
├── vitest.workspace.ts               # references apps/* and packages/*
├── datocms.config.json               # root-level, points at packages/dato-cms/migrations/
├── .env                              # DatoCMS tokens
├── .gitignore
└── docs/
    ├── specs/
    ├── plans/
    ├── PROJECT.md
    └── MEMORY.md
```

## Turborepo Pipeline

**`turbo.json`:**
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

**Root `package.json`:**
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
  }
}
```

**`apps/blog/package.json`:**
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

**`packages/dato-cms/package.json`:**
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

## pnpm Workspace & Catalogs

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
allowBuilds:
  esbuild: true
  sharp: true
```

**Root `package.json`** includes a `pnpm.catalog` field (or a `catalog:` entry in `pnpm-workspace.yaml`) for shared tool versions:

```yaml
# pnpm-workspace.yaml
catalog:
  typescript: ^5.8.0
  vitest: ^3.1.0
  datocms: ^4.0.0
```

This ensures `typescript`, `vitest`, and `datocms` are pinned to the same version across all packages.

## TypeScript

**Root `tsconfig.json`** — shared strictness and interop only, no module/emit decisions:

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

**`apps/blog/tsconfig.json`** — extends root + Astro's strict config:
```json
{
  "extends": ["../../tsconfig.json", "astro/tsconfigs/strict"],
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**`packages/dato-cms/tsconfig.json`** — extends root with compilation settings:
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

## Biome

**Root `biome.json`** — single config covering all JS/TS/CSS files:

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
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "all",
      "arrowParentheses": "always"
    }
  },
  "css": {
    "formatter": {
      "enabled": true
    }
  }
}
```

Keys left at defaults unless needed otherwise. The `$schema` URL is generated by `pnpm exec biome init` to match whatever version is installed.

**Astro files (`.astro`) are excluded from Biome.** They are formatted in-editor by the Astro VS Code extension (`astro-build.astro-vscode`). In CI, `astro check` validates type correctness but does not enforce formatting for `.astro` files — formatting consistency is an editor-time concern.

## Vitest & VS Code

**Root `vitest.workspace.ts`:**
```ts
import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'apps/*',
  'packages/*',
]);
```

**`packages/dato-cms/vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

**`apps/blog/vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

**`.vscode/extensions.json`** — recommended extensions:
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

**`.vscode/settings.json`** — formatter associations:
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

## `.env` Management

Root `.env` holds DatoCMS tokens. Astro resolves root `.env` when run with `--root apps/blog` (which `turbo dev` does via the `dev` script). The dato-cms package reads from `process.env` for CMA migrations.

```
# .env (root)
DATOCMS_CDA_TOKEN=readonly-token-for-content-api
DATOCMS_CMA_TOKEN=full-access-token-for-migrations
```

`.gitignore` already excludes `.env`.

## CI/CD Pipeline

**`.github/workflows/ci.yml`:**
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

Sequencing: `biome ci` fails fast on style issues (cheapest check), then `astro check` (type-only, no emit), then `turbo build` + `turbo test` (heaviest last).

## Throwaway Test Code

Co-located files to validate the setup from both CLI and VS Code, deleted after verification.

**`packages/dato-cms/src/index.ts`:**
```ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

**`packages/dato-cms/src/index.test.ts`:**
```ts
import { describe, expect, it } from 'vitest';
import { greet } from './index.js';

describe('greet', () => {
  it('returns a greeting', () => {
    expect(greet('World')).toBe('Hello, World!');
  });
});
```

**`packages/dato-cms/src/test-lint.ts`** — triggers unused-var lint rule:
```ts
export function lintMe() {
  const unused = 'should trigger no-unused-vars';
  return 'ok';
}
```

**`packages/dato-cms/src/test-format.ts`** — triggers format fix:
```ts
export function   formatMe(  )   {
return   "badly formatted"   ;
}
```

**`apps/blog/src/greet.ts`:**
```ts
export function add(a: number, b: number): number {
  return a + b;
}
```

**`apps/blog/src/greet.test.ts`:**
```ts
import { describe, expect, it } from 'vitest';
import { add } from './greet.js';

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

## DatoCMS Config

**`datocms.config.json`** at root:
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

Migrations are executed from the root via `pnpm exec datocms migrations:run`. The `tsconfig.migrations.json` inherits from the package's tsconfig with any CLI-specific overrides.

## Implementation Order

1. Create directory structure (apps/blog/, packages/dato-cms/)
2. Move Astro project into apps/blog/
3. Create all config files (tsconfigs, biome.json, turbo.json, vitest.workspace.ts, etc.)
4. Write throwaway test files
5. Run `pnpm install` to link workspaces
6. Verify: `pnpm exec turbo test` passes, `pnpm exec biome ci .` fails in expected ways, VS Code detects tests
7. Delete throwaway test files
8. Commit

## Next

- `/plan` — implementation plan for executing this spec.
