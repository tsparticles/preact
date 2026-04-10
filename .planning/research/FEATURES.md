# Feature Research

**Domain:** Framework wrapper library for an imperative canvas engine (Preact wrapper for tsParticles)
**Researched:** 2026-04-10
**Confidence:** HIGH (official docs/readmes for comparable mature wrappers)

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = wrapper feels incomplete or risky.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Declarative render component (`<Particles />`) with `id`, `options`, `url`, sizing/style props | Every mature wrapper exposes a framework-native component API (React/Vue examples consistently do this). | LOW | Already present in `@tsparticles/preact`; keep API stable and fully documented. |
| Explicit engine initialization hook/helper (`initParticlesEngine`/plugin init callback) | Mature wrappers let consumers control engine module loading (`loadSlim`/`loadFull`) for bundle control. | MEDIUM | Critical for tsParticles because engine features are composable packages. |
| Lifecycle-safe mount/update/unmount management | Core reason wrappers exist: imperative engine should not leak containers or duplicate instances on rerenders. | MEDIUM | Must guarantee destroy/reload correctness on prop changes and unmount. |
| Strong TypeScript surface (typed props + exported engine/container types) | Modern wrapper users expect typed config and callback contracts by default. | MEDIUM | Include docs for TS import patterns and peer type expectations. |
| Peer dependency clarity + compatibility matrix | Mature wrappers document required peer deps and versions clearly (framework + engine). | LOW | Prevents support churn and engine skew. |
| Events/callback bridge to engine instance (`particlesLoaded`, error/init callbacks) | Wrappers typically expose underlying instance/events to avoid capability loss vs imperative API. | MEDIUM | Keep callback names consistent and stable; document container access pattern. |
| SSR-safe usage guidance | Framework wrappers are often used in SSR apps; users expect docs on client-only rendering boundaries. | MEDIUM | Even if full SSR rendering is unsupported, documented pattern is table stakes. |
| Minimal "getting started" docs + runnable example | Mature wrappers provide copy/paste quickstart and one production-like example. | LOW | Should include both object-options and remote-url examples. |

### Differentiators (Competitive Advantage)

Features that set the wrapper apart. Not required for baseline viability, but high leverage.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| First-class Provider + hook pattern (`ParticlesProvider` + `useParticlesEngine`) | Enables one-time engine init across app tree; cleaner architecture in large apps and multi-canvas scenarios. | MEDIUM | Existing pattern is strong differentiator; make it fully exported, tested, and documented as “recommended for multi-instance apps.” |
| Performance-oriented multi-instance guidance (shared init, lazy load, recommended slim presets) | Mature users care about startup cost; concrete guidance improves adoption and perceived quality. | MEDIUM | Add docs + benchmarks for 1 vs N instances and bundle-size tradeoffs. |
| Framework-native advanced patterns (Preact hooks + class component interoperability + optional Signals examples) | Preact-specific depth differentiates from wrappers that are only React-ported patterns. | MEDIUM | Keep examples practical; avoid coupling core API to optional ecosystems. |
| Test-backed behavioral contract for lifecycle and update semantics | Many wrappers underinvest in tests; strong runtime contract reduces regressions and maintainer risk. | HIGH | Especially valuable for modernization goal: prevents subtle destroy/recreate bugs. |
| Migration/documentation discipline (versioned examples + upgrade notes) | Teams evaluate wrappers by maintenance reliability, not only API shape. | MEDIUM | Add “from previous major” notes and compatibility table. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem attractive but create long-term cost.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Auto-load full tsParticles feature set by default | “It should just work with every config.” | Bloats bundle size, hides performance costs, and removes explicit control over loaded modules. | Keep explicit init; document `loadSlim` default recommendation and when `loadFull` is justified. |
| Wrapper-level reimplementation of engine config DSL | “Make config easier with custom shorthand props.” | Creates parallel API drift from tsParticles core docs and increases maintenance burden. | Pass-through engine options; add typed helpers/examples, not a new DSL. |
| Over-automated deep diff magic for every options change | “Automatically patch engine efficiently.” | Hard to reason about, can introduce stale state bugs and surprising behavior. | Keep predictable refresh semantics; document recommended memoization patterns. |
| Embedding app-level state orchestration into the wrapper | “Handle global state/theme/router integration for me.” | Bloats library scope and locks users into specific app architecture choices. | Provide integration examples (Redux/signals/router) externally; keep core wrapper thin. |

## Feature Dependencies

```text
[Typed public API + peer dependency policy]
    └──requires──> [Stable declarative component contract]
                        └──requires──> [Lifecycle-safe mount/update/unmount]
                                              └──requires──> [Runtime tests for mount/update/destroy]

[Explicit engine init helper]
    └──enables──> [Provider + hook pattern]
                      └──enables──> [Multi-instance performance guidance]

[SSR-safe guidance]
    └──requires──> [Lifecycle contract clarity + client-only examples]

[Wrapper-level custom DSL]
    └──conflicts──> [Pass-through compatibility with tsParticles ecosystem docs]
```

### Dependency Notes

- **Stable declarative component contract requires typed API + peer policy:** users need compile-time and install-time predictability before trusting runtime behavior.
- **Lifecycle safety requires runtime tests:** update/unmount correctness regresses easily without automated coverage.
- **Provider/hook pattern depends on explicit engine init model:** shared initialization only works if init is deterministic and centralized.
- **SSR guidance depends on lifecycle clarity:** without explicit client-boundary patterns, SSR apps fail in confusing ways.
- **Custom DSL conflicts with pass-through compatibility:** any wrapper-specific config language increases drift from upstream tsParticles options.

## MVP Definition

### Launch With (v1)

Minimum viable modernization release for a high-quality wrapper.

- [ ] Stable `<Particles />` API parity with docs (props + callbacks) — baseline trust contract.
- [ ] Explicit, documented engine initialization (`initParticlesEngine`) — required for bundle control.
- [ ] Lifecycle correctness with automated tests (mount/update/unmount/destroy) — prevents production leaks/regressions.
- [ ] TypeScript-complete exports and examples — expected by modern framework users.
- [ ] Clear peer dependency/version compatibility table — reduces integration friction.

### Add After Validation (v1.x)

- [ ] Fully productized `ParticlesProvider`/`useParticlesEngine` path — add once base API contract is stable.
- [ ] Performance playbook (shared init, slim/full decision tree, multi-instance recommendations) — add after baseline reliability is proven.
- [ ] SSR framework recipes (Next/Preact SSR patterns) — add after core behavior tests are stable.

### Future Consideration (v2+)

- [ ] Optional dev warnings/debug mode for common misconfiguration — defer until telemetry/support patterns justify complexity.
- [ ] Thin helper utilities for common presets (without DSL drift) — only if repeated user pain is validated.

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Lifecycle-safe behavior + tests | HIGH | MEDIUM | P1 |
| Stable component API + docs parity | HIGH | LOW | P1 |
| Explicit init + module-loading guidance | HIGH | LOW | P1 |
| TypeScript-complete public exports | HIGH | MEDIUM | P1 |
| Provider + hook first-class docs/tests | MEDIUM | MEDIUM | P2 |
| SSR recipes | MEDIUM | MEDIUM | P2 |
| Performance benchmarking docs | MEDIUM | MEDIUM | P2 |
| Debug/developer diagnostics layer | LOW | MEDIUM | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature | Competitor A (`@tsparticles/react`) | Competitor B (`@tsparticles/vue3`) | Our Approach (`@tsparticles/preact`) |
|---------|-------------------------------------|-------------------------------------|---------------------------------------|
| Declarative component API | `Particles` component with options/url/callback patterns | `<vue-particles>` component with options/url/events | Keep `<Particles />` as primary contract; enforce docs parity and tests. |
| Explicit engine initialization | `initParticlesEngine` + `loadSlim/loadFull` pattern | Plugin `init` function in `createApp(...).use(...)` | Preserve explicit init helper; recommend slim-first loading strategy. |
| Typed ecosystem support | TS examples + engine type imports | TS caveats explicitly documented | Provide first-class TS examples for both class and hooks patterns. |
| Advanced wrapper ergonomics | Primarily component-level API | Plugin-level integration style | Differentiate with robust provider/hook + multi-instance guidance. |
| Accessibility guidance | Limited wrapper-specific a11y guidance in tsParticles docs/readmes | Limited wrapper-specific a11y guidance | Add practical accessibility notes for decorative vs informative particle canvases. |

## Sources

- Project context and requirements: `/Users/matteo/Projects/GitHub/tsparticles/preact/.planning/PROJECT.md` (internal, HIGH)
- Current architecture context: `/Users/matteo/Projects/GitHub/tsparticles/preact/.planning/codebase/ARCHITECTURE.md` (internal, HIGH)
- `@tsparticles/preact` README (official package docs): https://github.com/tsparticles/preact/blob/main/components/preact/README.md (HIGH)
- `@tsparticles/preact` provider/hook guidance: `/Users/matteo/Projects/GitHub/tsparticles/preact/components/preact/HOOKS_PATTERN.md` (internal, HIGH)
- `@tsparticles/react` README: https://github.com/tsparticles/react#readme (HIGH)
- `@tsparticles/vue3` README: https://github.com/tsparticles/vue3#readme (HIGH)
- `react-chartjs-2` docs/readme: https://react-chartjs-2.js.org/ and https://github.com/reactchartjs/react-chartjs-2 (MEDIUM-HIGH)
- `vue-chartjs` guide/readme: https://vue-chartjs.org/guide/ and https://github.com/apertureless/vue-chartjs (MEDIUM-HIGH)
- `react-leaflet` docs: https://react-leaflet.js.org/docs/start-installation/ (MEDIUM)
- `swiper/react` docs: https://swiperjs.com/react (MEDIUM)

---
*Feature research for: @tsparticles/preact wrapper modernization (features dimension)*
*Researched: 2026-04-10*
