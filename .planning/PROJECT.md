# @tsparticles/preact Modernization

## What This Is

`@tsparticles/preact` is the official Preact wrapper for the tsParticles engine, published as an npm package and demonstrated via the local Preact app in this monorepo. It lets developers initialize the engine, render particle canvases, and configure behavior through URL or inline options. This project initializes a focused modernization effort for maintainers and contributors so the package is reliable, well-tested, and straightforward to integrate.

## Core Value

A Preact developer can install `@tsparticles/preact`, initialize the engine, and render particles with predictable behavior and a stable public API.

## Requirements

### Validated

- ✓ Consumers can install and import `@tsparticles/preact` from npm package entrypoints — existing
- ✓ Consumers can initialize tsParticles engine via `initParticlesEngine` before rendering — existing
- ✓ Consumers can render particles using `<Particles />` with URL or inline options — existing
- ✓ Demo app proves basic route-driven integration with presets/configs — existing

### Active

- [ ] Public API exports are consistent with documentation (including provider/hook pattern)
- [ ] Runtime behavior is covered by automated tests for lifecycle, updates, and exports
- [ ] Build and CI toolchain runs on modern Node without legacy OpenSSL flags
- [ ] Version alignment across workspace avoids engine skew and duplicate runtime risk
- [ ] Docs and examples match current API and recommended integration patterns

### Out of Scope

- Native mobile wrappers (React Native/Flutter/etc.) — outside Preact package scope
- New tsParticles visual feature development — handled by engine/config packages, not wrapper integration layer
- Full demo site redesign — not required to validate wrapper API correctness

## Context

This repository is a pnpm monorepo using Lerna/Nx with a reusable `components/preact` package and a demo app in `apps/preact`. Existing codebase mapping identified strong core functionality but also gaps: missing automated tests, provider API export drift, deprecated GitHub Actions patterns, and legacy OpenSSL compatibility flags in demo scripts. The project should preserve the existing package purpose while reducing maintenance risk and improving contributor confidence.

## Constraints

- **Compatibility**: Keep Preact wrapper behavior compatible with existing consumer usage patterns — avoid unnecessary breaking API changes.
- **Runtime**: Maintain Node 18+ and browser-compatible builds used by CI and package consumers.
- **Packaging**: Preserve npm package publishing shape (`main`, `types`, browser bundle artifacts) while improving internals.
- **Scope**: Prioritize reliability, API consistency, and maintainability over adding net-new visual features.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Treat this as a brownfield modernization, not a greenfield rewrite | Existing package already delivers core value and has real consumers | — Pending |
| Keep the existing declarative `<Particles />` usage model as the primary contract | README and ecosystem usage depend on this integration pattern | — Pending |
| Prioritize testing and API/export correctness before larger architecture changes | Reduces regression risk and supports safer future refactors | — Pending |

---
*Last updated: 2026-04-10 after initialization*
