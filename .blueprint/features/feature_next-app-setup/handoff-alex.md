## Handoff Summary
**For:** Nigel (skipping Cass -- technical feature)
**Feature:** next-app-setup

### Key Decisions
- All testable logic lives in `src/next-app-setup/index.ts` as pure functions returning config objects -- no DOM, no React rendering in tests
- Framework files (`app/`, `next.config.js`, `tailwind.config.ts`) are created but not tested via node:test -- they consume the config functions
- Theme provider config delegates to app-shell's `getDefaultTheme()` rather than duplicating the default
- Static export mode (`output: 'export'`) since all data is build-time JSON, no server-side routes needed
- Colour tokens: draft=amber, live=green, end=dark (slate-800), uncertain=grey, warning=amber (same as draft intentionally)
- Bridge file pattern: `src/next-app-setup/index.js` must re-export from `index.ts`

### Files Created
- `.blueprint/features/feature_next-app-setup/FEATURE_SPEC.md`

### Open Questions
- None

### Critical Context
- 5 pure functions to test: `getNextConfig`, `getTailwindThemeTokens`, `getThemeProviderConfig`, `getPathAliases`, `getAppMetadata`
- Test file: `tests/next-app-setup.test.ts`, run with `node --experimental-strip-types --test`
- Import from `../src/next-app-setup/index.js` (bridge pattern)
- Integration check: `getThemeProviderConfig().defaultTheme` must equal `getDefaultTheme()` from app-shell
- All assertions are on plain objects -- no file-system checks, no React rendering
