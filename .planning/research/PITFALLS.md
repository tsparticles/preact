# Pitfalls Research

**Domain:** Framework wrapper library maintenance (Preact wrapper around tsParticles engine)
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Critical Pitfalls

### Pitfall 1: Public API drift between docs, runtime exports, and types

**What goes wrong:**
Documented APIs (like provider/hook patterns) exist in source but are not exported at package root, or `.d.ts` files don’t match runtime shape.

**Why it happens:**
Manual declaration files and manual barrel exports are maintained separately from implementation, so contract drift is silent until users fail.

**How to avoid:**
- Make `src/index.ts` the single source of truth for public API.
- Generate declarations from source (`tsc`), do not hand-maintain root `index.d.ts`.
- Add contract tests that assert both ESM/CJS exports and type-level surface.
- Treat docs updates + export updates + type updates as one PR checklist item.

**Warning signs:**
- Issues like “symbol exists in docs but import fails”.
- Type-only fields differ from runtime state (already seen with `IParticlesState.init`).
- Users importing from deep internals (`@pkg/src/...`) as workaround.

**Phase to address:**
Phase 1 — API Contract Stabilization (exports/types/docs parity)

---

### Pitfall 2: Incorrect dependency model for host framework/engine (peer vs dep)

**What goes wrong:**
Wrapper ships or pulls its own copy of host runtime (`preact`, `@tsparticles/engine`), causing duplicate instances, version skew, and hard-to-debug behavior.

**Why it happens:**
Wrappers are plugin-like packages but are often modeled like standalone apps; maintainers add hard dependencies “to make builds pass”.

**How to avoid:**
- Keep host framework/engine in `peerDependencies` with tested semver ranges.
- Avoid shipping a conflicting runtime copy unless there is an explicit, intentional fallback strategy.
- Add CI matrix over supported peer ranges and workspace constraints to prevent skew.
- Fail CI if demo app and package use incompatible engine majors.

**Warning signs:**
- `npm ls`/`pnpm why` shows multiple engine versions.
- Reports of callbacks/state/events behaving inconsistently between environments.
- Frequent “works in demo, breaks in consumer app” bugs.

**Phase to address:**
Phase 2 — Dependency & Version Governance

---

### Pitfall 3: Packaging boundary breakage from partial `exports` migration

**What goes wrong:**
Introducing `package.json#exports` (or changing entry layout) accidentally removes historical import paths, causing breaking changes for consumers.

**Why it happens:**
Maintainers tighten package boundaries without mapping previously used entry points and without compatibility tests.

**How to avoid:**
- Add `exports` deliberately and include legacy subpaths for one major cycle if previously relied upon.
- Keep `main` + `exports` aligned during transition.
- Run import smoke tests for default, named, CJS, ESM, and documented subpaths.
- Announce and version boundary reductions as explicit breaking changes.

**Warning signs:**
- Consumer errors: `ERR_PACKAGE_PATH_NOT_EXPORTED`.
- Sudden increase in “cannot import X from @pkg” regressions right after release.
- Ad hoc runtime shims added post-release to restore behavior.

**Phase to address:**
Phase 3 — Packaging & Distribution Hardening

---

### Pitfall 4: Class lifecycle + async engine initialization race conditions

**What goes wrong:**
Unmount/update order races cause destroy/reload thrash, stale container mutation, leaked listeners, or no-op callbacks.

**Why it happens:**
Wrapper bridges declarative UI lifecycle and imperative engine lifecycle without single-flight guards and stale-instance checks.

**How to avoid:**
- Enforce single-flight load/refresh pipeline with cancellation or stale-token checks.
- Guard async completion paths against unmounted/stale instances.
- Make update path diff-aware (reload only on particle-relevant prop changes).
- Add deterministic tests for mount/update/unmount interleavings.

**Warning signs:**
- Intermittent flakes around route changes or rapid prop updates.
- CPU spikes due to frequent destroy/recreate cycles.
- “Cannot read property of undefined” around container during teardown.

**Phase to address:**
Phase 4 — Runtime Lifecycle Reliability

---

### Pitfall 5: Full deep-compare + unconditional refresh on every update

**What goes wrong:**
Wrapper reinitializes heavy canvas effects too often, causing poor UX and unnecessary CPU usage.

**Why it happens:**
Naive update logic favors correctness by brute force (deep recursion + always refresh) without change classification.

**How to avoid:**
- Split props into “requires engine reload” vs “DOM/style only”.
- Prefer referential checks and memoized options over generic deep recursion.
- Instrument refresh count and runtime cost in tests/benchmarks.
- Remove debug logging from hot paths.

**Warning signs:**
- Animation restarts on unrelated prop/style updates.
- High main-thread usage with large options objects.
- Console noise from compare utilities.

**Phase to address:**
Phase 4 — Runtime Lifecycle Reliability

---

### Pitfall 6: Dist artifacts are unverified before publish

**What goes wrong:**
Package publishes with missing files, stale typings, or broken CJS/UMD mapping, even though local source looks correct.

**Why it happens:**
Teams test repository source, not packed artifact (`npm pack`/publish output).

**How to avoid:**
- Add pre-publish CI that runs `npm pack` and validates tarball contents.
- Test install-from-tarball in a clean fixture project (type-check + runtime import).
- Explicitly control published files (`files` field or strict build output rules).

**Warning signs:**
- “Works locally, broken from npm” bug reports.
- Missing declaration files or unexpected entrypoint paths in published package.
- Hotfix releases that only adjust packaging metadata.

**Phase to address:**
Phase 3 — Packaging & Distribution Hardening

---

### Pitfall 7: CI workflow rot (deprecated actions patterns + outdated toolchain assumptions)

**What goes wrong:**
Pipelines fail or become brittle due to deprecated GitHub Actions commands and legacy flags (e.g., OpenSSL legacy provider).

**Why it happens:**
Wrapper repos are “set and forget”; CI definitions age faster than library code.

**How to avoid:**
- Replace deprecated workflow commands (`::set-output`) with environment files (`$GITHUB_OUTPUT`).
- Remove legacy runtime flags by upgrading build toolchain.
- Pin/test Node LTS versions and run periodic CI modernization checks.

**Warning signs:**
- Runner warnings about deprecated workflow commands.
- Builds requiring `NODE_OPTIONS=--openssl-legacy-provider`.
- CI failures after hosted runner updates with no code changes.

**Phase to address:**
Phase 5 — CI & Release Pipeline Modernization

---

### Pitfall 8: Security posture gap in maintenance libraries

**What goes wrong:**
Known vulnerable transitive dependencies remain untracked; maintainers only discover issues after advisories or user reports.

**Why it happens:**
Library CI often verifies build success but not vulnerability thresholds/signatures.

**How to avoid:**
- Add audit/SCA gate (`npm audit` or equivalent policy) with explicit severity threshold.
- Automate dependency update flow and triage cadence.
- Track advisories for engine and build-chain dependencies.

**Warning signs:**
- No security-check step in CI.
- Large lag between dependency releases and wrapper updates.
- Repeated emergency patches for outdated build-time packages.

**Phase to address:**
Phase 5 — CI & Release Pipeline Modernization

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Manual `index.d.ts` edits | Fast local fix | Guaranteed API/type drift | Never for maintained public API |
| Unconditional `refresh()` on updates | Easy correctness | Performance regressions + lifecycle flakiness | Only as temporary patch behind issue + test plan |
| Runtime CJS export mutation shim | Quick compatibility patch | Breaks with bundler output shape changes | Only during short migration window |
| Legacy OpenSSL flag in scripts | Unblocks old bundler | Locks repo to outdated toolchain | Never in actively maintained package |

## Integration Gotchas

Common mistakes when connecting wrapper + host ecosystem.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Preact host app | Treating wrapper as React-compatible by default event semantics | Document Preact-specific behavior; validate demos with real Preact event patterns |
| tsParticles engine loading | Re-initializing engine on every render/update | Initialize once, then apply targeted container updates |
| Consumer imports | Depending on undocumented deep paths | Expose stable root/subpath contract and test it in CI |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Deep recursive compare in update path | High CPU during prop churn | Prop partitioning + memoized options + targeted diff | Medium-large options objects, frequent updates |
| Destroy/reload container for non-engine changes | Animation restarts, frame drops | Reload only on engine-relevant changes | Interactive UIs with frequent state updates |
| Excessive logging in hot utilities | Devtools noise, slower renders | Strip debug logs from hot path and lint against console calls | Immediately visible in development |

## Security Mistakes

Domain-specific security issues for package maintainers.

| Mistake | Risk | Prevention |
|---------|------|------------|
| No dependency audit gate | Vulnerable transitive deps ship to users | Add CI audit threshold + remediation policy |
| Legacy crypto compatibility flags in builds | Weak/obsolete crypto path reliance | Upgrade toolchain and remove legacy provider dependency |
| Publishing without artifact verification | Accidental secret/config leakage or broken tarball | Inspect packed files and test install from tarball in CI |

## UX Pitfalls

Common developer experience failures (wrapper consumers are your users).

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Docs advertise non-exported APIs | Immediate integration failure | Docs generated/checked against actual exports |
| Example app uses different dependency majors than package | Consumers reproduce behavior that differs in production | Keep demo and library dependency majors aligned by policy |
| Breaking import path changes without migration notes | Upgrade friction and support burden | Provide migration guide and deprecation cycle |

## "Looks Done But Isn't" Checklist

- [ ] **Export contract:** Verify documented symbols import from package root in both ESM and CJS.
- [ ] **Type contract:** Verify generated `.d.ts` matches runtime API surface and state shape.
- [ ] **Lifecycle reliability:** Verify rapid mount/update/unmount tests pass without leaks/races.
- [ ] **Publish artifact:** Verify `npm pack` tarball contents + install-from-tarball smoke test.
- [ ] **Dependency alignment:** Verify single supported engine major across wrapper and demo.
- [ ] **CI modernity:** Verify no deprecated workflow commands and no legacy OpenSSL flags.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| API/type/export drift shipped | MEDIUM | Patch release restoring exports + regenerated types, then add contract tests |
| Packaging boundary break (`exports`) | HIGH | Reintroduce compatibility subpaths, publish hotfix, schedule major-only hard removal |
| Lifecycle race regressions | HIGH | Add guard rails (single-flight/stale checks), ship targeted fix, backfill race tests |
| Dependency skew in consumer apps | MEDIUM | Broaden/fix peer range, align workspace versions, publish compatibility matrix |
| CI/toolchain rot | MEDIUM | Update workflows/toolchain, remove deprecated commands/flags, add scheduled maintenance job |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| API/docs/types drift | Phase 1 — API Contract Stabilization | Contract test suite + docs/import parity check |
| Peer/dependency/version skew | Phase 2 — Dependency Governance | CI matrix across peer ranges, no duplicate engine in lockfile checks |
| Packaging/export boundary breaks | Phase 3 — Packaging Hardening | ESM/CJS/subpath import tests + pack artifact validation |
| Lifecycle race conditions | Phase 4 — Runtime Reliability | Deterministic mount/update/unmount stress tests |
| Refresh/deep-compare performance traps | Phase 4 — Runtime Reliability | Refresh count/perf regression benchmarks |
| CI deprecations + legacy flags | Phase 5 — Pipeline Modernization | Zero deprecated command warnings; Node LTS build passes without legacy flags |
| Missing security vulnerability gate | Phase 5 — Pipeline Modernization | CI fails on configured vulnerability threshold |

## Sources

- Node.js package entry points and `exports` behavior (including breaking-change implications): https://nodejs.org/api/packages.html
- npm package metadata guidance (`peerDependencies`, `files`, `exports`, etc.): https://docs.npmjs.com/cli/v10/configuring-npm/package-json
- npm audit command behavior and CI thresholds: https://docs.npmjs.com/cli/v10/commands/npm-audit
- npm pack for publish artifact verification workflows: https://docs.npmjs.com/cli/v10/commands/npm-pack
- TypeScript declaration publishing guidance (`types`, `typesVersions`, packaging red flags): https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html
- Preact behavior differences relevant to wrapper compatibility expectations: https://preactjs.com/guide/v10/differences-to-react
- GitHub Actions deprecation notice for `set-output` and migration to environment files: https://github.blog/changelog/2022-10-10-github-actions-deprecating-save-state-and-set-output-commands/
- GitHub Actions environment files (`GITHUB_OUTPUT`, `GITHUB_ENV`): https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#environment-files
- Project-specific baseline concerns (local): `.planning/codebase/CONCERNS.md`

---
*Pitfalls research for: @tsparticles/preact wrapper-library maintenance*
*Researched: 2026-04-10*
