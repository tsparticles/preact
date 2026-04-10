# Stack Research

**Domain:** Preact wrapper library package (tsParticles) with demo app + npm publishing
**Researched:** 2026-04-10
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended | Confidence |
|------------|---------|---------|-----------------|------------|
| Node.js | 22 LTS (minimum 22.13+) | Runtime for local dev, CI, lint/test/build/publish | This is the safest baseline that satisfies modern tooling constraints simultaneously (Vite 8, ESLint 10, npm trusted publishing requirements) while avoiding Node 18 legacy friction. | HIGH |
| Preact | 10.29.1 | Wrapper runtime + peer dependency target | Stable current Preact line with broad ecosystem support; aligns with `@tsparticles/preact` peer range (`^10.19.3`). | HIGH |
| TypeScript | 6.0.2 | Public API typing and strict package authoring | Current TS line gives strongest type safety for wrapper APIs; compatible with `typescript-eslint` support range (`<6.1.0`). | HIGH |
| Vite (library mode) | 8.0.8 | Library bundling + demo app dev/build | Standard 2025+ path for frontend libraries: one toolchain for demo app and package build, fast iteration, built-in library mode and modern exports patterns. | HIGH |
| `@tsparticles/engine` | 3.9.1 | Core wrapped engine API | Keep wrapper pinned to the latest compatible engine family to avoid runtime skew and duplicate-engine risk in consumer apps. | HIGH |

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| Vitest | 4.1.4 | Unit/integration test runner | Default test runner for wrapper lifecycle/props/export tests; best fit with Vite stack. | HIGH |
| `@testing-library/preact` | 3.2.4 | Component behavior testing | For rendering and interaction assertions against `<Particles />` and provider/hook APIs. | HIGH |
| `jsdom` | 29.0.2 | DOM-like test environment | Use for fast component tests in Node CI (no browser boot). | HIGH |
| Playwright | 1.59.1 | Real-browser E2E for demo app | Use for smoke/regression checks of demo routes and browser behavior before release. | HIGH |
| ESLint | 10.2.0 | Static analysis | Use flat config + TS-aware rules for consistent quality gates in CI. | HIGH |
| `typescript-eslint` | 8.58.1 | TS lint parser/rules | Required companion for modern TS linting with ESLint 10. | HIGH |
| Prettier | 3.x | Formatting | Keep formatting non-controversial and separate from lint semantics. | MEDIUM |
| `@changesets/cli` | 2.30.0 | Versioning/changelog workflow | Standard for package releases, especially monorepos and coordinated version bumps. | HIGH |
| `publint` | 0.3.18 | Package publish linting | Run on tarball output to catch exports/entry-point compatibility issues early. | HIGH |
| `@arethetypeswrong/cli` | 0.18.2 | Type export validation | Use in CI to detect broken/misleading type resolution before publishing. | HIGH |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| pnpm 10.33.0 | Workspace package manager | Strong monorepo ergonomics and deterministic installs; keep lockfile committed. |
| Changesets GitHub Action (`changesets/action@v1`) | Release PR automation | Pair with `@changesets/cli`; use PR-based versioning flow. |
| npm trusted publishing (OIDC) | Secure npm publish | Prefer OIDC over long-lived publish tokens; enables provenance on supported providers. |
| GitHub Actions | CI orchestration | Run lint + test + build + publint + ATTW before release/publish jobs. |

## Installation

```bash
# Core (runtime deps)
pnpm add preact @tsparticles/engine

# Supporting (dev)
pnpm add -D typescript vite @preact/preset-vite vite-plugin-dts
pnpm add -D vitest @testing-library/preact jsdom @playwright/test
pnpm add -D eslint @eslint/js typescript-eslint prettier eslint-config-prettier
pnpm add -D @changesets/cli publint @arethetypeswrong/cli
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite library mode | Rollup direct config | Use only if you need deeply custom bundling behavior that Vite abstractions block. |
| Vitest | Jest | Use Jest only when your org has heavy existing Jest infra that would be costly to migrate. |
| Changesets | semantic-release | Use semantic-release if you need fully commit-convention-driven releases with no release PR workflow. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `tsup` for new greenfield setup | Upstream explicitly marks it as not actively maintained and recommends `tsdown` migration. | Vite library mode (or `tsdown` if you specifically want a bundler-focused CLI). |
| Legacy webpack-first wrapper build | Higher config burden and slower day-to-day iteration for this use case; not the current default path for Preact package authoring. | Vite 8 library mode + `vite-plugin-dts`. |
| npm publish via long-lived `NPM_TOKEN` as primary path | Higher credential leak/rotation risk versus OIDC trusted publishing. | npm trusted publishing with OIDC in GitHub Actions. |
| Node 18 baseline for this toolchain | Modern lint/build/test stack now expects Node 20+; keeping Node 18 forces legacy compromises. | Node 22 LTS baseline. |

## Stack Patterns by Variant

**If maintaining a single package + demo app (this project):**
- Use Vite for both demo dev server and library build
- Because one toolchain reduces config drift and keeps contributor onboarding simple

**If evolving to multi-wrapper monorepo releases:**
- Keep pnpm workspaces + Changesets release PR flow
- Because coordinated internal dependency bumps and changelog generation are first-class

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `@tsparticles/preact@3.0.0` | `preact@^10.19.3` | Respect peer range in package metadata. |
| `@tsparticles/preact@3.0.0` | `@tsparticles/engine@^3.0.3` | Keep workspace engine aligned to avoid skew (`3.9.1` currently available). |
| `vitest@4.1.4` | `vite@>=6` and `node@>=20` | Good fit with Vite 8 + Node 22 baseline. |
| `vite@8.0.8` | `node@^20.19.0 || >=22.12.0` | Satisfied by Node 22.13+ baseline. |
| `eslint@10.2.0` | `node@^20.19.0 || ^22.13.0 || >=24` | Node 22.13+ required for ESLint 10. |
| `typescript-eslint@8.58.1` | `eslint ^8.57 || ^9 || ^10`, `typescript <6.1` | Compatible with ESLint 10 + TS 6.0.2. |

## Sources

- Preact docs: https://preactjs.com/guide/v10/getting-started (Vite-first guidance) — HIGH
- Vite docs (library mode, v8): https://vite.dev/guide/build#library-mode — HIGH
- Vitest docs (v4 requirements): https://vitest.dev/guide/ — HIGH
- Testing Library (Preact): https://testing-library.com/docs/preact-testing-library/intro/ — MEDIUM (docs page is older but package still current)
- ESLint docs (v10 + Node requirements): https://eslint.org/docs/latest/use/getting-started — HIGH
- typescript-eslint docs: https://typescript-eslint.io/getting-started/ — HIGH
- Playwright docs: https://playwright.dev/docs/intro — HIGH
- Changesets repo/docs: https://github.com/changesets/changesets and https://github.com/changesets/action — HIGH
- npm trusted publishing docs: https://docs.npmjs.com/trusted-publishers (edited 2026-03-25) — HIGH
- tsup status note: https://github.com/egoist/tsup (README warning: not actively maintained) — HIGH
- Package release/version checks (npm registry, queried 2026-04-10):
  - `preact`, `typescript`, `vite`, `vitest`, `@testing-library/preact`, `jsdom`, `@changesets/cli`, `eslint`, `typescript-eslint`, `@playwright/test`, `vite-plugin-dts`, `publint`, `@arethetypeswrong/cli`, `pnpm`, `@tsparticles/engine`, `@tsparticles/preact` — HIGH

---
*Stack research for: Preact wrapper library modernization*
*Researched: 2026-04-10*
