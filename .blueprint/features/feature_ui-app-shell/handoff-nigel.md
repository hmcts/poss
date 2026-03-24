## Handoff Summary
**For:** Codey (implementer)
**Feature:** ui-app-shell

### What to Build
Create `src/ui-app-shell/index.ts` and bridge `src/ui-app-shell/index.js` exporting 6 pure functions.

### Functions & Expected Returns
1. **getNavigationItems()** -- Maps `ROUTES` from app-shell to `{ path, label, icon, isActive(currentPath) }`. `isActive` uses `isRouteActive` internally.
2. **getClaimTypeSelectorOptions()** -- Maps `CLAIM_TYPES` from app-shell to `{ value: id, label: name }`.
3. **getThemeToggleState(currentTheme)** -- Returns `{ currentTheme, nextTheme: toggleTheme(currentTheme), cssClass: getThemeClass(currentTheme), icon }`. Icon must differ between 'dark' and 'light' (e.g., 'sun' vs 'moon').
4. **getHealthBadge(states, transitions, events)** -- Calls `getModelHealthSummary` then maps score to `{ score, color, label }`. Colors: good='#16a34a' (green), fair='#d97706' (amber), poor='#dc2626' (red). Labels: good='Good', fair='Fair', poor='Poor' (or similar non-empty strings).
5. **getLayoutConfig()** -- Returns `{ sidebarWidth: 256, headerHeight: 64, breakpoint: 768 }` (or similar positive numbers).
6. **isRouteActive(routePath, currentPath)** -- Returns true if currentPath equals routePath or starts with routePath + '/'.

### Bridge File
`src/ui-app-shell/index.js` must contain `export * from './index.ts';`

### Test File
`test/feature_ui-app-shell.test.js` -- 18 tests, IDs UAS-1 through UAS-18.

### Run Tests
```bash
node --experimental-strip-types --test test/feature_ui-app-shell.test.js
```

### Key Constraints
- Import ROUTES, CLAIM_TYPES, toggleTheme, getThemeClass from `../app-shell/index.ts`
- Import getModelHealthSummary from `../model-health/index.ts`
- Theme toggle icon must differ between dark and light
- Health badge color must contain recognisable colour hex codes (green for good, red for poor)
- isRouteActive must support both exact and prefix matching
- All functions return plain objects, no side effects
