# External Integrations

**Analysis Date:** 2026-04-10

## APIs & External Services

**Particle Rendering Engine:**
- tsParticles Engine - In-process rendering/animation engine used by the Preact component wrapper.
  - SDK/Client: `@tsparticles/engine` in `components/preact/package.json` and imports in `components/preact/src/Particles.tsx`.
  - Auth: Not applicable.

**Particle Presets/Bundle Loader (Demo):**
- tsParticles Full Bundle and Config Presets - Demo app loads full feature set and predefined configs.
  - SDK/Client: `tsparticles` and `@tsparticles/configs` in `apps/preact/package.json`, usage in `apps/preact/src/components/app.js`.
  - Auth: Not applicable.

**Package Registry Publishing:**
- npm Registry - Package metadata indicates npm distribution for `@tsparticles/preact`.
  - SDK/Client: npm publishing via package metadata in `components/preact/package.json` (`publishConfig`, `main`, `unpkg`, `jsdelivr`).
  - Auth: External token expected in publisher environment (not stored in repo).

## Data Storage

**Databases:**
- Not detected.
  - Connection: Not applicable.
  - Client: Not applicable.

**File Storage:**
- Local filesystem only (source/assets in repository and build outputs).

**Caching:**
- GitHub Actions cache for pnpm store in `.github/workflows/nodejs.yml` (`actions/cache@v3`).

## Authentication & Identity

**Auth Provider:**
- None for application runtime.
  - Implementation: Not applicable in `apps/preact/src` and `components/preact/src`.

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry/Datadog/Bugsnag SDK imports in source files).

**Logs:**
- Local console logging appears in utility code (`console.log` in `components/preact/src/Utils.ts`).

## CI/CD & Deployment

**Hosting:**
- Demo app supports static serving with `sirv` (`apps/preact/package.json` script `start`).
- Library distribution targets npm/CDN consumers (`components/preact/package.json` fields `unpkg`, `jsdelivr`).

**CI Pipeline:**
- GitHub Actions workflow in `.github/workflows/nodejs.yml`.
- Pipeline installs with pnpm and runs `npx lerna run build:ci`.

## Environment Configuration

**Required env vars:**
- `NODE_ENV` for webpack mode toggles in `components/preact/webpack.config.js` and build scripts in `components/preact/package.json`.
- `NODE_OPTIONS` used for demo build compatibility in `apps/preact/package.json`.
- No runtime API credential variables detected in source (`apps/preact/src`, `components/preact/src`).

**Secrets location:**
- GitHub Actions secrets may be used by CI context (commented NX Cloud token reference in `.github/workflows/nodejs.yml`).
- No checked-in secret files detected via `.env*` scan at repository root.

## Webhooks & Callbacks

**Incoming:**
- None detected (no webhook endpoint/server implementation files present).

**Outgoing:**
- None detected in application/library source code.
- Component-level callback props exist for local lifecycle integration (e.g., `particlesLoaded` in `components/preact/src/IParticlesProps.ts` and `components/preact/src/Particles.tsx`), but this is not an external webhook.

---

*Integration audit: 2026-04-10*
