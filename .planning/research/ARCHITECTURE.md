# Architecture Research

**Domain:** Preact wrapper library for tsParticles + demo app
**Researched:** 2026-04-10
**Confidence:** HIGH

## Standard Architecture

### System Overview

```text
┌──────────────────────────────────────────────────────────────────────┐
│                      Consumer App Layer (Preact)                    │
├──────────────────────────────────────────────────────────────────────┤
│  App root  ──► Engine init entry  ──► <Particles /> instances       │
│    │                  │                     │                        │
│    └──── optional ◄── Provider/Hook context ┘                        │
├──────────────────────────────────────────────────────────────────────┤
│                    Wrapper Library Public API Layer                  │
├──────────────────────────────────────────────────────────────────────┤
│  index.ts exports:                                                   │
│  - default/named <Particles />                                       │
│  - initParticlesEngine()                                             │
│  - types + provider/hook exports                                     │
├──────────────────────────────────────────────────────────────────────┤
│                     Wrapper Runtime Adapter Layer                    │
├──────────────────────────────────────────────────────────────────────┤
│  Engine bootstrap singleton  │  Container lifecycle adapter          │
│  (one-time init)             │  (mount/load/update/destroy)          │
│                              │  + prop diff + callback bridge        │
├──────────────────────────────────────────────────────────────────────┤
│                     tsParticles Engine / Plugins                     │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| Public API module | Stable contract for consumers; backward-compatible exports | `src/index.ts` + package exports map + typed entrypoints |
| Engine bootstrap service | Initialize engine once, register plugins/presets, expose readiness | `initParticlesEngine()` + cached Promise/singleton |
| Rendering adapter | Translate declarative Preact props into imperative `tsParticles.load()` + container lifecycle | `Particles` component with `useEffect`/cleanup or class lifecycle bridge |
| Provider + hook (optional but recommended) | Share engine readiness and errors across subtree, avoid repeated init in large apps | `ParticlesProvider` + `useParticlesEngine()` using modern Context API |
| Prop normalization + diff | Prevent unnecessary destroy/recreate churn; support URL or inline options | small utility module with deterministic compare and normalization |
| Demo shell | Prove reference integration and compatibility paths | app using both direct init and provider pattern examples |

## Recommended Project Structure

```text
components/preact/
├── src/
│   ├── api/
│   │   └── index.ts                # Public exports only (no heavy logic)
│   ├── core/
│   │   ├── engineBootstrap.ts      # Singleton init + plugin registration
│   │   ├── containerLifecycle.ts   # create/update/destroy adapter helpers
│   │   └── optionsDiff.ts          # Normalization + deep compare utilities
│   ├── bindings/
│   │   ├── Particles.tsx           # Preact-facing component
│   │   ├── ParticlesProvider.tsx   # Context provider
│   │   └── useParticlesEngine.ts   # Hook
│   ├── types/
│   │   ├── IParticlesProps.ts
│   │   └── IParticlesState.ts
│   └── index.ts                    # Re-export from api/
├── index.js                        # CJS compatibility bridge
├── index.d.ts                      # Published type surface (generated/aligned)
└── README.md                       # Canonical usage, provider + direct patterns

apps/preact/
└── src/
    ├── integration/
    │   ├── direct-init-example.tsx
    │   └── provider-example.tsx
    └── components/
        └── app.js
```

### Structure Rationale

- **`src/core/` split out from UI bindings:** keeps lifecycle/engine logic framework-agnostic and easier to test.
- **`src/bindings/` isolated:** Preact API changes stay localized; core behavior remains stable.
- **`api/index.ts` as contract boundary:** avoids accidental export drift and improves compatibility discipline.

## Architectural Patterns

### Pattern 1: Singleton Engine Bootstrap

**What:** Maintain one initialization promise for the engine lifecycle.
**When to use:** Always, unless wrapper intentionally supports isolated engine instances.
**Trade-offs:** Great for consistency and performance; less flexible for multi-tenant plugin sets.

**Example:**
```typescript
let initPromise: Promise<void> | undefined;

export function initParticlesEngineOnce(
  init: (engine: Engine) => Promise<void> | void,
): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      tsParticles.init();
      await init(tsParticles);
    })();
  }

  return initPromise;
}
```

### Pattern 2: Declarative-to-Imperative Adapter Boundary

**What:** Component receives stable props, adapter performs imperative `load/destroy/refresh` against engine container.
**When to use:** Any canvas/runtime library wrapper (maps, charts, particles, editors).
**Trade-offs:** Slightly more code, but dramatically cleaner component API and testability.

**Example:**
```typescript
useEffect(() => {
  let container: Container | undefined;

  void (async () => {
    container = await tsParticles.load({ id, options, url });
    await particlesLoaded?.(container);
  })();

  return () => {
    container?.destroy();
  };
}, [id, normalizedOptionsHash, url]);
```

### Pattern 3: Optional Provider for App-Scale Coordination

**What:** Provider centralizes readiness/error state while keeping direct API available.
**When to use:** Apps with multiple particle instances, route transitions, or shared bootstrap logic.
**Trade-offs:** Extra concept for small apps; major maintainability win for medium/large apps.

## Data Flow

### Initialization Flow (Explicit Direction)

```text
Consumer App
  ↓ calls
initParticlesEngine(initCallback)
  ↓
Engine bootstrap singleton
  ↓ invokes
initCallback(engine)  (e.g., loadSlim/loadFull/custom plugins)
  ↓
Engine ready state
  ↓
<Particles /> mount allowed
```

### Runtime Flow (Explicit Direction)

```text
Props/options/url change
  ↓
Normalization + diff
  ↓ (if changed)
Container adapter destroy old instance
  ↓
tsParticles.load(new config)
  ↓
container ref/callback update (particlesLoaded)
  ↓
UI continues with new container
```

### Error Flow

```text
Bootstrap/load error
  ↓
Provider/hook error state OR rejected init promise
  ↓
Consumer fallback UI / telemetry
```

## Suggested Build Order (Roadmap Dependency Input)

1. **Public contract first (`api` + types + exports map)**
   - Lock API shape before internals to protect compatibility.
2. **Engine bootstrap singleton (`core/engineBootstrap`)**
   - All bindings depend on deterministic init behavior.
3. **Container lifecycle adapter (`core/containerLifecycle` + diff utilities)**
   - Core runtime behavior needed by component and tests.
4. **Preact bindings (`Particles`, `ParticlesProvider`, `useParticlesEngine`)**
   - Thin layer consuming core services.
5. **Compatibility shims (`default` export + CJS bridge + legacy prop aliases)**
   - Preserve existing consumer imports while modernizing internals.
6. **Demo integration updates (direct + provider examples)**
   - Validate real usage patterns and docs parity.
7. **Architecture-level tests (init once, cleanup, update behavior, export surface)**
   - Final gate for maintainability and compatibility claims.

Dependency chain:

```text
API contract → bootstrap → lifecycle adapter → bindings → compatibility shims → demo/docs → tests hardening
```

## Anti-Patterns

### Anti-Pattern 1: Lifecycle Logic Embedded Only in UI Component

**What people do:** Keep all init/load/destroy/diff logic inside one big `Particles.tsx` class/function.
**Why it's wrong:** Hard to test, hard to evolve for provider/hook mode, high regression risk.
**Do this instead:** Move engine/container behavior to `core/` and keep component thin.

### Anti-Pattern 2: Unstable Export Surface

**What people do:** Add provider/hook internally but forget to export consistently in `index.ts`, `index.js`, and `.d.ts`.
**Why it's wrong:** Docs and runtime drift; breaking integration surprises.
**Do this instead:** Treat exports as versioned API contract with test coverage for entrypoints.

### Anti-Pattern 3: Full Recreate on Every Render

**What people do:** Call refresh/load whenever parent re-renders regardless of semantic option changes.
**Why it's wrong:** Canvas churn, perf issues, flicker.
**Do this instead:** Normalize props and diff deterministically before destroy/reload.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| `@tsparticles/engine` | Peer dependency + runtime import | Keep version alignment strict across monorepo to avoid duplicate engine instances |
| Optional feature bundles (`@tsparticles/slim`, `tsparticles`, presets) | Consumer-supplied init callback | Wrapper should not force full bundle; let app choose size/features |
| Preact (`preact`, `preact/hooks`, `preact/compat`) | Peer dependency + typed bindings | Prefer modern hooks/context internals; keep compat for ecosystem interop |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `api` ↔ `bindings` | direct imports | `api` re-exports only; no business logic |
| `bindings` ↔ `core` | function calls + typed contracts | One-way dependency to prevent UI/core coupling |
| `demo app` ↔ `library` | npm-style package import only | Demo should consume package as external user would |

## Sources

- Preact Guide: Getting Started (integration + aliasing patterns) — https://preactjs.com/guide/v10/getting-started *(HIGH)*
- Preact Guide: Hooks (functional side-effect/lifecycle model) — https://preactjs.com/guide/v10/hooks *(HIGH)*
- Preact Guide: Context (modern provider/consumer patterns) — https://preactjs.com/guide/v10/context *(HIGH)*
- Current wrapper implementation (`Particles`, `initParticlesEngine`, provider draft) — `components/preact/src/*` in this repo *(HIGH)*
- tsParticles official wrappers (React/Vue/Svelte READMEs; shared ecosystem patterns) —
  - https://raw.githubusercontent.com/tsparticles/react/main/README.md *(MEDIUM)*
  - https://raw.githubusercontent.com/tsparticles/vue3/main/README.md *(MEDIUM)*
  - https://raw.githubusercontent.com/tsparticles/svelte/main/README.md *(MEDIUM)*

---
*Architecture research for: modern Preact wrapper library maintainability + compatibility*
*Researched: 2026-04-10*
