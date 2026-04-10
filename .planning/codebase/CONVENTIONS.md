# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**
- TypeScript interfaces use `I*` prefix and PascalCase filenames in `components/preact/src/IParticlesProps.ts` and `components/preact/src/IParticlesState.ts`.
- Main component files use PascalCase for classes/components in `components/preact/src/Particles.tsx` and `components/preact/src/lib/ParticlesProvider.tsx`.
- Utility files use PascalCase or neutral utility names in `components/preact/src/Utils.ts`.
- Demo app files in `apps/preact/src/` follow lower-case directory names and `index.js` entry files (for example `apps/preact/src/routes/home/index.js`, `apps/preact/src/components/header/index.js`).

**Functions:**
- Use camelCase for functions and methods (for example `initParticlesEngine` in `components/preact/src/index.ts`, `deepCompare` in `components/preact/src/Utils.ts`, `switchFrame` in `apps/preact/src/components/app.js`).
- React/Preact lifecycle methods use framework naming (`componentDidMount`, `componentWillUnmount`, `shouldComponentUpdate`) in `components/preact/src/Particles.tsx` and `apps/preact/src/routes/profile/index.js`.

**Variables:**
- Local variables use camelCase (`contextValue`, `baseOutput`, `particlesInitialized`) in `components/preact/src/lib/ParticlesProvider.tsx`, `components/preact/webpack.config.js`, and `apps/preact/src/components/app.js`.
- Short semantic names are common in callbacks (`cb`, `err`) in `components/preact/src/index.ts` and `components/preact/src/lib/ParticlesProvider.tsx`.

**Types:**
- Interfaces use PascalCase with `I` prefix (`IParticlesProps`, `IParticlesState`) in `components/preact/src/IParticlesProps.ts` and `components/preact/src/IParticlesState.ts`.
- Internal context/provider types use PascalCase descriptive names (`ParticlesContextValue`, `ParticlesProviderProps`) in `components/preact/src/lib/ParticlesProvider.tsx`.

## Code Style

**Formatting:**
- Tool used: Prettier configured via `components/preact/.prettierrc` and package-level Prettier preset in `components/preact/package.json` (`"prettier": "@tsparticles/prettier-config"`).
- Key settings in `components/preact/.prettierrc`:
  - `printWidth: 120`
  - `endOfLine: "lf"`
  - `tabWidth: 4` for `*.ts` and `*.tsx`
- Style is mixed across subprojects:
  - Library TypeScript (`components/preact/src/*.ts*`) uses 4-space indentation and trailing commas.
  - Demo app JS (`apps/preact/src/**/*.js`) mixes single/double quotes and uses tabs in files like `apps/preact/src/components/header/index.js`.

**Linting:**
- Tool used: ESLint in `components/preact/.eslintrc.js` and scripts in `components/preact/package.json`.
- Key rules in `components/preact/.eslintrc.js`:
  - `@typescript-eslint/no-explicit-any`: `warn`
  - `@typescript-eslint/no-var-requires`: `warn`
  - `@typescript-eslint/ban-types`: `warn`
  - `@typescript-eslint/explicit-member-accessibility`: require explicit accessibility except `public`
- Demo app uses `eslint-config-preact` extension via `apps/preact/package.json` under `eslintConfig`.

## Import Organization

**Order:**
1. Framework/runtime imports (`preact`, `preact/hooks`, `preact-router`) in `components/preact/src/lib/ParticlesProvider.tsx` and `apps/preact/src/components/app.js`
2. External package imports (`@tsparticles/engine`, `tsparticles`, `@tsparticles/configs`) in `components/preact/src/Particles.tsx` and `apps/preact/src/components/app.js`
3. Relative internal imports (`./IParticlesProps`, `./Utils`, `../routes/home`) in `components/preact/src/Particles.tsx` and `apps/preact/src/components/app.js`

**Path Aliases:**
- Not detected in source imports. Imports are package names or relative paths in `components/preact/src/*.ts*` and `apps/preact/src/**/*.js`.

## Error Handling

**Patterns:**
- Provider-level async initialization uses `try/catch` and stores error in component state in `components/preact/src/lib/ParticlesProvider.tsx`.
- Defensive guard clauses return early for missing state/resources in `components/preact/src/Particles.tsx` (`destroy`, `loadParticles`).
- Hook misuse fails fast with explicit error throw in `components/preact/src/lib/ParticlesProvider.tsx` (`useParticlesEngine` throws outside provider).

## Logging

**Framework:** console

**Patterns:**
- A direct debug log exists in utility recursion (`console.log("key")`) at `components/preact/src/Utils.ts`.
- No centralized logger abstraction detected in `components/preact/src/` or `apps/preact/src/`.

## Comments

**When to Comment:**
- Comments describe lifecycle/intent in class components and routing demo code (for example `apps/preact/src/routes/profile/index.js`).
- Brief comments are used for edge behavior in internals, such as circular reference handling in `components/preact/src/Utils.ts` and alias ordering note in `components/preact/webpack.config.js`.

**JSDoc/TSDoc:**
- Light JSDoc/TSDoc usage exists on classes and provider/hook exports in `components/preact/src/Particles.tsx` and `components/preact/src/lib/ParticlesProvider.tsx`.
- Most functions are self-documented by naming and types rather than full docblocks.

## Function Design

**Size:**
- Prefer small focused helpers for pure logic (`deepCompare`, `deepCompareArrays`) in `components/preact/src/Utils.ts`.
- UI/stateful class components can be medium-sized and lifecycle-driven (`components/preact/src/Particles.tsx`, `apps/preact/src/components/app.js`).

**Parameters:**
- Typed params for public API functions in library code (`initParticlesEngine(cb: ...)` in `components/preact/src/index.ts`).
- Callback props and optional parameters are used for extensibility (`particlesInit?`, `particlesLoaded?`) in `components/preact/src/lib/ParticlesProvider.tsx` and `components/preact/src/IParticlesProps.ts`.

**Return Values:**
- Async flows return `Promise<void>` when side-effect-only (`components/preact/src/index.ts`, `components/preact/src/Particles.tsx`).
- Hooks return structured objects (`ParticlesContextValue`) in `components/preact/src/lib/ParticlesProvider.tsx`.

## Module Design

**Exports:**
- Index entrypoint re-exports types and named/default exports in `components/preact/src/index.ts`.
- Component modules default-export primary component class/function (`components/preact/src/Particles.tsx`, `apps/preact/src/components/header/index.js`).

**Barrel Files:**
- Single barrel-style entrypoint exists in `components/preact/src/index.ts`.
- No deep barrel hierarchy detected in `components/preact/src/` or `apps/preact/src/`.

---

*Convention analysis: 2026-04-10*
