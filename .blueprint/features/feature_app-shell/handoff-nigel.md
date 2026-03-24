## Handoff -- Nigel (Test Agent)
**Feature:** app-shell
**For:** Devon (Implementation Agent)

### Feedback on Spec
FEEDBACK: {"rating":4,"issues":["No explicit contract for exported non-UI utilities (ROUTES, CLAIM_TYPES, theme functions)","Persistence via localStorage mentioned but no utility function contract defined","Digital Twin sub-routes not reflected in ROUTES export"],"rec":"proceed"}

### Test Artefacts
- `test/artifacts/feature_app-shell/test-spec.md` -- 19 test cases across 4 groups
- `test/feature_app-shell.test.js` -- Node.js built-in test runner, 130 lines

### What the Tests Expect
The implementation must export from `src/app-shell/index.js`:
- `ROUTES` -- array of 3 objects `{ path, label, icon }` starting with `/state-explorer`
- `CLAIM_TYPES` -- array of 7 objects `{ id, name }` matching `ClaimTypeId` enum values
- `getDefaultTheme()` -- returns `'dark'`
- `toggleTheme(theme)` -- swaps `'dark'`/`'light'`
- `getThemeClass(theme)` -- returns distinct CSS class strings per theme
- `createAppStore()` -- Zustand vanilla store with `activeClaimType` (null default) and `setActiveClaimType` action

### Notes
- Tests are pure-function only; no DOM, no browser, no React rendering
- Store tests use `zustand/vanilla` `getState()` pattern consistent with existing data-model tests
