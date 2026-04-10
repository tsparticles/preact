# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** Monorepo package architecture with a reusable UI library and a demo application.

**Key Characteristics:**
- Keep reusable particles integration logic in `components/preact/src/` and consume it from applications.
- Use class-based Preact components for runtime rendering (`components/preact/src/Particles.tsx`, `apps/preact/src/components/app.js`) with optional hooks/context support in `components/preact/src/lib/ParticlesProvider.tsx`.
- Orchestrate builds at workspace level through `package.json`, `lerna.json`, and `nx.json`.

## Layers

**Workspace Orchestration Layer:**
- Purpose: Manage packages and run multi-package builds.
- Location: `package.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`
- Contains: Workspace definitions, build scripts, cache behavior, package grouping.
- Depends on: `pnpm`, `lerna`, `nx` configured in `package.json`.
- Used by: All package-level builds in `apps/preact/package.json` and `components/preact/package.json`.

**Library API Layer:**
- Purpose: Expose public API for consumers of `@tsparticles/preact`.
- Location: `components/preact/src/index.ts`, `components/preact/index.js`, `components/preact/index.d.ts`
- Contains: Default export wiring (`Particles`), engine bootstrap (`initParticlesEngine`), exported types.
- Depends on: `@tsparticles/engine` and internal component/type files.
- Used by: Demo app import in `apps/preact/src/components/app.js` and external npm consumers.

**Rendering Integration Layer:**
- Purpose: Bridge Preact component lifecycle with tsParticles container lifecycle.
- Location: `components/preact/src/Particles.tsx`, `components/preact/src/Utils.ts`
- Contains: Mount/update/unmount handling, container load/destroy, prop diff logic.
- Depends on: `tsParticles.load` from `@tsparticles/engine`, component props/state interfaces.
- Used by: Public API layer and all consumers rendering `<Particles />`.

**Provider/Context Layer (Optional):**
- Purpose: Provide centralized engine initialization for hook-based consumers.
- Location: `components/preact/src/lib/ParticlesProvider.tsx`
- Contains: Context creation, async engine init, readiness/error states, `useParticlesEngine` hook.
- Depends on: `preact/hooks` and dynamic import of `@tsparticles/engine`.
- Used by: Hook-based app compositions documented in `components/preact/HOOKS_PATTERN.md`.

**Demo Application Layer:**
- Purpose: Demonstrate package usage and route-based UI composition.
- Location: `apps/preact/src/`
- Contains: App shell (`components/app.js`), route components (`routes/home/index.js`, `routes/profile/index.js`), header/nav (`components/header/index.js`), global entry (`index.js`).
- Depends on: `@tsparticles/preact`, `preact-router`, and `@tsparticles/configs`.
- Used by: Local demo build/run scripts in `apps/preact/package.json`.

## Data Flow

**Demo App Particle Initialization Flow:**

1. App bootstraps from `apps/preact/src/index.js` and renders `apps/preact/src/components/app.js`.
2. `App` constructor calls `initParticlesEngine` from `components/preact/src/index.ts` via package import `@tsparticles/preact`.
3. Init callback loads engine features (`loadFull`) in `apps/preact/src/components/app.js`, then sets `particlesInitialized` state.
4. Render path conditionally mounts `<Particles />`; component in `components/preact/src/Particles.tsx` loads tsParticles container with provided options.
5. Route/UI interactions in `apps/preact/src/components/app.js` update state key (`basic`/`planes`) and trigger Particles refresh.

**Particles Component Lifecycle Flow:**

1. Mount sets `init: true` in `components/preact/src/Particles.tsx`.
2. `loadParticles()` calls `tsParticles.load(...)` and stores container in component state.
3. Prop/state changes run `shouldComponentUpdate` and `componentDidUpdate`, then call `refresh()`.
4. `refresh()` destroys old container and reloads a new one with current props.
5. Unmount runs `destroy()` to clean container resources.

**State Management:**
- Use local component state for UI/runtime data (`apps/preact/src/components/app.js`, `components/preact/src/Particles.tsx`).
- Use context state only in provider-based pattern (`components/preact/src/lib/ParticlesProvider.tsx`).

## Key Abstractions

**Particles Component Abstraction:**
- Purpose: Render and control a tsParticles canvas from declarative Preact props.
- Examples: `components/preact/src/Particles.tsx`, `components/preact/src/IParticlesProps.ts`, `components/preact/src/IParticlesState.ts`
- Pattern: Class component wrapper around imperative engine instance lifecycle.

**Engine Initialization Abstraction:**
- Purpose: Ensure engine initialization is executed before usage.
- Examples: `components/preact/src/index.ts`, `apps/preact/src/components/app.js`
- Pattern: Async init helper that accepts a caller-provided engine loader callback.

**Provider/Hook Abstraction:**
- Purpose: Share one engine instance across a component tree.
- Examples: `components/preact/src/lib/ParticlesProvider.tsx`, `components/preact/HOOKS_PATTERN.md`
- Pattern: Context provider + hook guard (`throw` when hook is used outside provider).

## Entry Points

**Workspace Build Entry:**
- Location: `package.json`
- Triggers: `pnpm run build`, CI workflow in `.github/workflows/nodejs.yml`
- Responsibilities: Run lerna/nx build targets across `apps/*` and `components/*`.

**Demo App Entry:**
- Location: `apps/preact/src/index.js`
- Triggers: `preact-cli` commands in `apps/preact/package.json` (`dev`, `build`).
- Responsibilities: Register global styles and export root app component.

**Library Runtime Entry:**
- Location: `components/preact/src/index.ts`
- Triggers: Consumer import of `@tsparticles/preact`.
- Responsibilities: Export `Particles`, expose `initParticlesEngine`, re-export public types.

**Library Package Bridge Entry:**
- Location: `components/preact/index.js`
- Triggers: CommonJS package resolution.
- Responsibilities: Re-export CJS build output with default/named export compatibility.

## Error Handling

**Strategy:** Defensive component lifecycle checks with minimal runtime guards.

**Patterns:**
- Guard clauses before destructive actions (`components/preact/src/Particles.tsx` `destroy()` early return when no container).
- Hook scope enforcement via explicit thrown error in `components/preact/src/lib/ParticlesProvider.tsx`.
- Async initialization wrapped in `try/catch` with captured error state in `components/preact/src/lib/ParticlesProvider.tsx`.

## Cross-Cutting Concerns

**Logging:** Limited direct console usage in `components/preact/src/Utils.ts`; no centralized logger abstraction.
**Validation:** Compile-time TypeScript interface constraints in `components/preact/src/IParticlesProps.ts` and `components/preact/src/IParticlesState.ts`; no dedicated runtime schema validation layer.
**Authentication:** Not applicable in this codebase.

---

*Architecture analysis: 2026-04-10*
