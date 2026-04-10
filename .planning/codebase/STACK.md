# Technology Stack

**Analysis Date:** 2026-04-10

## Languages

**Primary:**
- TypeScript - Library source in `components/preact/src/Particles.tsx`, `components/preact/src/index.ts`, and typings in `components/preact/src/IParticlesProps.ts`.
- JavaScript (ES Modules/CommonJS) - Demo app and package entrypoints in `apps/preact/src/components/app.js`, `apps/preact/src/index.js`, and `components/preact/index.js`.

**Secondary:**
- YAML - Workspace/CI configuration in `pnpm-workspace.yaml` and `.github/workflows/nodejs.yml`.
- JSON - Monorepo and package configuration in `package.json`, `apps/preact/package.json`, `components/preact/package.json`, `nx.json`, and `lerna.json`.

## Runtime

**Environment:**
- Node.js (CI uses 18) configured in `.github/workflows/nodejs.yml`.
- Browser runtime target for distributed bundle (`target: "web"`) in `components/preact/webpack.config.js`.

**Package Manager:**
- pnpm (workspace manager) declared in root `package.json` (`packageManager`) and `lerna.json` (`npmClient: pnpm`).
- Lockfile: present at `pnpm-lock.yaml`.

## Frameworks

**Core:**
- Preact (`preact`) - UI framework for demo app and component compatibility (`apps/preact/package.json`, `components/preact/package.json`, `components/preact/src/Particles.tsx`).
- tsParticles engine (`@tsparticles/engine`) - Rendering/particle engine used by the Preact wrapper (`components/preact/src/Particles.tsx`, `components/preact/src/index.ts`).
- Preact Router (`preact-router`) - Demo routing in `apps/preact/src/components/app.js`.

**Testing:**
- Not detected (no active Jest/Vitest config files found in repository root or package folders).

**Build/Dev:**
- webpack 5 - Library build output for CJS/UMD in `components/preact/webpack.config.js`.
- preact-cli - Demo app build/watch in `apps/preact/package.json` scripts.
- Lerna + Nx - Monorepo task orchestration in root `package.json`, `lerna.json`, and `nx.json`.
- ESLint + Prettier - Lint/format in `components/preact/.eslintrc.js` and package scripts.

## Key Dependencies

**Critical:**
- `@tsparticles/engine` - Core engine API consumed by wrapper component (`components/preact/src/Particles.tsx`, `components/preact/src/index.ts`).
- `@tsparticles/preact` - Workspace package consumed by demo app (`apps/preact/package.json`).
- `tsparticles` and `@tsparticles/configs` - Demo initialization and preset configs in `apps/preact/src/components/app.js`.

**Infrastructure:**
- `lerna` and `nx` - Workspace build orchestration in root `package.json` and `nx.json`.
- `husky` + `@commitlint/*` - Commit workflow tooling declared in root `package.json`.
- `typescript`, `babel-loader`, `ts-loader`, `webpack-cli` - Transpile and bundle toolchain in `components/preact/package.json`.

## Configuration

**Environment:**
- Build-time `NODE_ENV` is used to switch production/dev webpack behavior in `components/preact/webpack.config.js` and set in scripts in `components/preact/package.json`.
- Demo build scripts set `NODE_OPTIONS=--openssl-legacy-provider` in `apps/preact/package.json`.
- `.env` files: Not detected in repository root (checked via `.env*` glob).

**Build:**
- Monorepo/project config: `package.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`.
- Library build config: `components/preact/webpack.config.js`, `components/preact/tsconfig.json`.
- CI build config: `.github/workflows/nodejs.yml`.

## Platform Requirements

**Development:**
- Use Node.js 18-compatible environment (CI baseline from `.github/workflows/nodejs.yml`).
- Use pnpm workspace install (`pnpm-lock.yaml`, `pnpm-workspace.yaml`, root `package.json`).

**Production:**
- Library is built and published as npm package artifacts (`components/preact/package.json` with `main`, `types`, `unpkg`, `jsdelivr`).
- Demo app builds to static assets with `preact build` and serves via `sirv` (`apps/preact/package.json`).

---

*Stack analysis: 2026-04-10*
