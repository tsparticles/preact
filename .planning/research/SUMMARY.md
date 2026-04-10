# Project Research Summary

**Project:** @tsparticles/preact modernization
**Domain:** Preact framework wrapper library for an imperative canvas engine (tsParticles) with demo app + npm publishing
**Researched:** 2026-04-10
**Confidence:** HIGH

## Executive Summary

This project is a wrapper-library modernization effort, not a net-new product. Mature wrappers in this category succeed by keeping a thin, predictable declarative API (`<Particles />`) over a well-guarded imperative lifecycle (`load/update/destroy`), with explicit engine initialization for bundle control. The research strongly supports a “contract-first” approach: lock public exports/types/docs parity first, then harden lifecycle behavior and packaging boundaries.

Recommended implementation strategy is: Node 22 + Vite 8 + TS 6 + strict peer-dependency governance (`preact`, `@tsparticles/engine`) + architecture split between `core` (engine bootstrap/lifecycle/diff) and `bindings` (Preact component/provider/hook). Launch scope should prioritize P1 table stakes: stable component API, explicit init helper, lifecycle correctness tests, TS-complete exports, and compatibility documentation. Provider/hook productization, SSR recipes, and performance playbooks are valuable but should follow baseline reliability.

Key risk is integration drift: docs/runtime/types/export maps and peer/version boundaries can diverge silently, while async lifecycle races create flaky behavior and perf churn. Mitigation is clear and testable: source-of-truth API barrel, generated declarations, ESM/CJS/subpath import smoke tests, deterministic mount/update/unmount stress tests, and pre-publish tarball validation in CI.

## Key Findings

### Recommended Stack

Research converges on a modern and low-friction toolchain centered on Node 22 LTS, Vite library mode, and strict TypeScript/lint/test gates. This stack aligns with current ecosystem requirements and avoids legacy compromises (Node 18 baselines, webpack-heavy setup, token-based npm publishing).

**Core technologies:**
- **Node.js 22.13+ LTS**: local/CI runtime baseline — satisfies Vite 8, ESLint 10, modern actions/release tooling.
- **Preact 10.29.1**: wrapper peer target — stable ecosystem support and aligns with published peer range.
- **TypeScript 6.0.2**: public API typing — strong contract safety, compatible with `typescript-eslint` support window.
- **Vite 8.0.8 (library mode)**: package + demo build system — single toolchain, fast DX, modern exports workflow.
- **@tsparticles/engine 3.9.1**: wrapped runtime engine — keep aligned with wrapper peer range to avoid duplicate/skewed engine instances.

Critical supporting tools: Vitest + Testing Library + jsdom for lifecycle/contract tests, Playwright for demo smoke tests, Changesets for release workflow, plus `publint` and `@arethetypeswrong/cli` as publish-quality gates.

### Expected Features

The feature research is explicit: wrapper credibility depends on reliability and predictability more than breadth.

**Must have (table stakes):**
- Stable declarative `<Particles />` contract (`id/options/url/style/callbacks`) with docs parity.
- Explicit engine init helper (`initParticlesEngine`) with module-loading guidance (`loadSlim`/`loadFull`).
- Lifecycle-safe mount/update/unmount with automated regression tests.
- Strong TypeScript surface (typed props + exported container/engine-related types).
- Clear peer dependency and compatibility matrix documentation.

**Should have (competitive):**
- First-class `ParticlesProvider` + `useParticlesEngine` path for app-scale coordination.
- Multi-instance performance playbook (shared init, slim-first guidance, bundle/runtime tradeoffs).
- Preact-specific advanced usage patterns (hooks/class interop; optional Signals examples).

**Defer (v2+):**
- Wrapper-level debug/diagnostic mode.
- Optional helper utilities/presets only if validated by repeated user pain.
- Avoid custom wrapper DSL and auto-full-engine loading defaults.

### Architecture Approach

Architecture research recommends a clean boundary model: **public API contract → engine bootstrap singleton → container lifecycle adapter/diff utilities → thin Preact bindings → compatibility shims → demo/docs → architecture-level tests**. The most important structural decision is isolating framework-agnostic runtime behavior in `src/core/` and keeping component/provider/hook concerns in `src/bindings/`.

**Major components:**
1. **Public API module (`api/index.ts`)** — single source of truth for exported symbols and compatibility contract.
2. **Engine bootstrap service (`core/engineBootstrap`)** — one-time init promise and plugin/preset registration path.
3. **Container lifecycle adapter (`core/containerLifecycle` + diff)** — deterministic load/update/destroy semantics.
4. **Preact bindings (`Particles`, `ParticlesProvider`, `useParticlesEngine`)** — declarative consumer interface over core services.
5. **Demo shell + compatibility layer** — validates real usage and protects existing import patterns.

### Critical Pitfalls

1. **API/docs/types/export drift** — prevent with source-of-truth `index.ts`, generated `.d.ts`, and contract tests for runtime + types.
2. **Incorrect peer/dependency model** — keep host runtime/engine as peers, enforce semver policy and CI version matrix.
3. **`exports` migration breakage** — preserve legacy subpaths for transition window and smoke-test ESM/CJS/subpath imports.
4. **Async lifecycle race conditions** — implement single-flight/stale-instance guards and stress-test mount/update/unmount interleavings.
5. **Unverified publish artifacts** — gate releases with `npm pack` tarball validation, install-from-tarball tests, `publint`, and ATTW.

## Implications for Roadmap

Based on dependencies and failure modes, suggested phase structure:

### Phase 1: API Contract Stabilization
**Rationale:** Everything else depends on a stable public surface; drift here invalidates docs and downstream adoption.
**Delivers:** Canonical export map, generated types, compatibility table, docs/runtime/types parity checks.
**Addresses:** Stable component API, TS-complete exports, peer/compatibility clarity (FEATURES P1).
**Avoids:** Pitfall 1 (API drift).

### Phase 2: Runtime Foundation (Bootstrap + Lifecycle Core)
**Rationale:** Deterministic init and lifecycle correctness are the core functional value of the wrapper.
**Delivers:** Singleton engine init service, diff-aware container lifecycle adapter, mount/update/unmount reliability tests.
**Implements:** Architecture core layer before UI binding expansion.
**Avoids:** Pitfalls 4 and 5 (race conditions, refresh thrash).

### Phase 3: Dependency & Packaging Governance
**Rationale:** Once runtime behavior is stable, lock distribution boundaries to prevent consumer breakage.
**Delivers:** Peer dependency policy enforcement, exports/main alignment, ESM/CJS/subpath import tests, pack artifact verification.
**Uses:** Changesets + `publint` + ATTW + tarball smoke fixture checks.
**Avoids:** Pitfalls 2, 3, and 6 (peer skew, path breakage, broken published artifacts).

### Phase 4: Consumer Experience (Provider/Hook + Docs + Demo)
**Rationale:** Differentiate only after baseline contract and packaging are trustworthy.
**Delivers:** Productized provider/hook path, multi-instance guidance, SSR-safe recipes, updated demo paths (direct + provider).
**Addresses:** FEATURES P2 differentiators and adoption quality.
**Avoids:** UX pitfalls (docs mismatch, demo/package skew).

### Phase 5: CI/Release Hardening and Ongoing Reliability
**Rationale:** Prevent maintenance regressions and release-quality decay over time.
**Delivers:** Modern GitHub Actions patterns, Node 22 policy, security/audit gates, release automation with trusted publishing.
**Uses:** OIDC npm publish, scheduled dependency/CI modernization checks.
**Avoids:** Pitfalls 7 and 8 (workflow rot, security posture gaps).

### Phase Ordering Rationale

- **Contract before internals:** export/type/docs parity must be stable before adding more surface area.
- **Core runtime before differentiators:** provider/hook and SSR recipes are valuable only if lifecycle behavior is deterministic.
- **Packaging before scale-up adoption:** avoid “works in repo, breaks from npm” failures before promoting advanced patterns.
- **CI hardening as sustained quality layer:** codifies all safeguards so modernization remains durable.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3 (Dependency & Packaging Governance):** verify current real-world consumer import paths and historical subpath usage before finalizing `exports` transition policy.
- **Phase 4 (Consumer Experience):** SSR recipes and performance guidance may need framework-specific validation (e.g., route transitions/client boundaries in target host setups).

Phases with standard patterns (can likely skip research-phase):
- **Phase 1 (API Contract Stabilization):** established TypeScript + export-contract practices are well documented.
- **Phase 5 (CI/Release Hardening):** modern GitHub Actions/OIDC/quality-gate patterns are mature and directly documented.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Mostly official docs + current version checks; strong ecosystem consensus. |
| Features | HIGH | Strong cross-wrapper pattern consistency (tsParticles React/Vue + mature wrapper norms). |
| Architecture | HIGH | Directly grounded in current codebase structure and established wrapper patterns. |
| Pitfalls | MEDIUM | Well-supported by standards/docs and repo concerns, but some impact estimates are inference-driven until validated in CI/usage telemetry. |

**Overall confidence:** HIGH

### Gaps to Address

- **Historical import-path usage unknown:** audit consumer patterns before finalizing strict `exports` boundary reductions.
- **Quantified performance thresholds missing:** add benchmark targets (refresh count/CPU budget) during runtime phase.
- **SSR guidance scope not fully bounded:** validate and document explicit supported vs unsupported SSR integration patterns.
- **Peer range breadth validation pending:** run CI matrix across intended Preact/engine ranges before locking long-term support table.

## Sources

### Primary (HIGH confidence)
- STACK.md aggregated official references: Preact docs, Vite library mode docs, Vitest docs, ESLint/TS-ESLint docs, Playwright docs, Changesets docs, npm trusted publishing docs, npm registry version validation.
- ARCHITECTURE.md sources: Preact guides (hooks/context/getting started), current wrapper implementation in repository, tsParticles wrapper ecosystem patterns.
- PITFALLS.md standards sources: Node package exports docs, npm package metadata/audit/pack docs, TypeScript declaration publishing docs, GitHub Actions deprecation/environment files docs.

### Secondary (MEDIUM confidence)
- FEATURES.md comparator wrappers and ecosystem analogs: `@tsparticles/react`, `@tsparticles/vue3`, wrapper-library pattern references (`react-chartjs-2`, `vue-chartjs`, `react-leaflet`, `swiper/react`).

### Tertiary (LOW confidence)
- None identified as critical; low-confidence assumptions are captured as planning gaps above rather than accepted conclusions.

---
*Research completed: 2026-04-10*
*Ready for roadmap: yes*
