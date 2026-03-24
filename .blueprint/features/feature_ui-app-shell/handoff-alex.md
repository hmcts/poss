## Handoff Summary
**For:** Nigel (skipping Cass -- technical feature)
**Feature:** ui-app-shell

### Key Decisions
- All testable logic lives in `src/ui-app-shell/index.ts` as pure functions returning view-model objects -- no DOM, no React
- Composes over app-shell (ROUTES, CLAIM_TYPES, toggleTheme, getThemeClass) and model-health (getModelHealthSummary)
- `isRouteActive` supports both exact match and prefix match for nested routes
- Health badge maps score to colour: good=green, fair=amber, poor=red
- Theme toggle state includes an icon field that differs between dark and light themes
- Layout config returns numeric constants for sidebarWidth, headerHeight, and breakpoint
- Bridge file pattern: `src/ui-app-shell/index.js` must re-export from `index.ts`

### Files Created
- `.blueprint/features/feature_ui-app-shell/FEATURE_SPEC.md`

### Open Questions
- None

### Critical Context
- 6 pure functions to test: `getNavigationItems`, `getClaimTypeSelectorOptions`, `getThemeToggleState`, `getHealthBadge`, `getLayoutConfig`, `isRouteActive`
- Test file: `test/feature_ui-app-shell.test.js`, run with `node --experimental-strip-types --test`
- Import from `../src/ui-app-shell/index.js` (bridge pattern)
- Import app-shell exports for integration checks
- All assertions are on plain objects and functions -- no file-system checks, no React rendering
