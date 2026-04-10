# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```
preact/
├── apps/                    # Application packages (active demo + legacy artifacts)
│   ├── preact/              # Current demo app consuming @tsparticles/preact
│   └── preact-old/          # Legacy app/build artifacts retained in repo
├── components/              # Reusable package implementations
│   ├── preact/              # Published @tsparticles/preact package source and build config
│   └── preact-old/          # Legacy package artifacts retained in repo
├── .github/workflows/       # CI pipeline definitions
├── .husky/                  # Commit hook scripts
├── .planning/codebase/      # Generated codebase mapping documents
├── package.json             # Workspace-level scripts and dependency tooling
├── pnpm-workspace.yaml      # Workspace package globs and build allowances
├── lerna.json               # Versioning/release and multi-package orchestration
└── nx.json                  # Build cache and target defaults
```

## Directory Purposes

**`apps/preact/`:**
- Purpose: Host runnable demo application for package usage examples.
- Contains: Preact app source, route components, UI components, static assets, app package config.
- Key files: `apps/preact/src/index.js`, `apps/preact/src/components/app.js`, `apps/preact/package.json`

**`components/preact/`:**
- Purpose: Implement and package the reusable `@tsparticles/preact` component.
- Contains: TypeScript source, provider/hook utilities, build config, typings, package metadata.
- Key files: `components/preact/src/Particles.tsx`, `components/preact/src/index.ts`, `components/preact/webpack.config.js`, `components/preact/package.json`

**`apps/preact-old/`:**
- Purpose: Legacy app subtree with historical source and generated build outputs.
- Contains: Built assets (`build/`), old source (`src/`), local dependency directory.
- Key files: `apps/preact-old/src/`, `apps/preact-old/build/`

**`components/preact-old/`:**
- Purpose: Legacy package subtree with historical build/output folders.
- Contains: Empty/legacy output folders and local dependency directory.
- Key files: `components/preact-old/cjs/`, `components/preact-old/umd/`, `components/preact-old/src/`

**` .github/workflows/` (repository root `.github/workflows/`):**
- Purpose: Define CI jobs for push and pull request builds.
- Contains: GitHub Actions workflow YAML.
- Key files: `.github/workflows/nodejs.yml`

## Key File Locations

**Entry Points:**
- `apps/preact/src/index.js`: Demo app root module.
- `apps/preact/src/components/app.js`: Demo app shell, router composition, and particles initialization trigger.
- `components/preact/src/index.ts`: Library public runtime/type entry.
- `components/preact/index.js`: CommonJS export bridge for built package output.

**Configuration:**
- `package.json`: Root workspace scripts (`build`, `build:ci`, `build:lerna`, `build:nx`).
- `pnpm-workspace.yaml`: Workspace package globs (`apps/*`, `components/*`).
- `lerna.json`: Package discovery and release message conventions.
- `nx.json`: Build target cache defaults.
- `components/preact/webpack.config.js`: Library bundling setup for CJS/UMD targets.
- `components/preact/tsconfig.json`: TypeScript compiler behavior for library source.
- `apps/preact/.babelrc`: App transpilation configuration file presence.

**Core Logic:**
- `components/preact/src/Particles.tsx`: Core rendering/lifecycle integration with tsParticles engine.
- `components/preact/src/lib/ParticlesProvider.tsx`: Optional context/provider-based engine sharing.
- `components/preact/src/Utils.ts`: Deep comparison utility used in update decisions.
- `components/preact/src/IParticlesProps.ts`: Public props contract.
- `components/preact/src/IParticlesState.ts`: Internal component state contract.

**Testing:**
- Not detected: no committed `*.test.*` or `*.spec.*` files in `apps/preact/` or `components/preact/`.

## Naming Conventions

**Files:**
- Use PascalCase for exported component/type files in library source: `components/preact/src/Particles.tsx`, `components/preact/src/IParticlesProps.ts`.
- Use lower-case `index` module pattern for directory entry files: `apps/preact/src/routes/home/index.js`, `apps/preact/src/components/header/index.js`.
- Use colocated style file naming with `style.css` or `style` import alias: `apps/preact/src/routes/profile/style.css`.

**Directories:**
- Use domain-oriented folders for app code: `apps/preact/src/components/`, `apps/preact/src/routes/`, `apps/preact/src/style/`.
- Use package-scoped top-level layout under workspace buckets: `apps/<package-name>/`, `components/<package-name>/`.

## Where to Add New Code

**New Feature:**
- Primary code: put reusable API/features in `components/preact/src/` and demo usage in `apps/preact/src/`.
- Tests: place alongside source once introduced (recommended patterns: `components/preact/src/**/*.test.ts` and `apps/preact/src/**/*.test.js`).

**New Component/Module:**
- Implementation: add library-facing components under `components/preact/src/` (e.g., `components/preact/src/NewFeature.tsx`) and export from `components/preact/src/index.ts`.

**Utilities:**
- Shared helpers: add non-UI helper logic to `components/preact/src/` (following `components/preact/src/Utils.ts` pattern).

## Special Directories

**`node_modules/` (root and package-local):**
- Purpose: Installed dependencies.
- Generated: Yes.
- Committed: No (standard behavior expected from `.gitignore`).

**`.nx/`:**
- Purpose: Nx cache/workspace data (`.nx/workspace-data/`, `.nx/cache/`).
- Generated: Yes.
- Committed: No (cache data should remain local).

**`apps/preact-old/build/`:**
- Purpose: Legacy compiled application assets.
- Generated: Yes.
- Committed: Yes (currently present in repository tree).

**`.planning/codebase/`:**
- Purpose: Machine-generated codebase mapping reference documents.
- Generated: Yes.
- Committed: Yes (intended as planning artifacts).

---

*Structure analysis: 2026-04-10*
