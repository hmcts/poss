# Implementation Plan: ui-app-shell

## Files to Create
1. `src/ui-app-shell/index.ts` -- Main module with 6 exported functions
2. `src/ui-app-shell/index.js` -- Bridge file re-exporting from index.ts

## Dependencies
- `src/app-shell/index.ts` -- ROUTES, CLAIM_TYPES, toggleTheme, getThemeClass
- `src/model-health/index.ts` -- getModelHealthSummary

## Implementation Details

### isRouteActive(routePath, currentPath)
- Exact match: `currentPath === routePath`
- Prefix match: `currentPath.startsWith(routePath + '/')`

### getNavigationItems()
- Map over ROUTES, adding `isActive: (currentPath) => isRouteActive(route.path, currentPath)`

### getClaimTypeSelectorOptions()
- Map CLAIM_TYPES to `{ value: ct.id, label: ct.name }`

### getThemeToggleState(currentTheme)
- nextTheme via toggleTheme, cssClass via getThemeClass
- Icon: dark -> 'sun', light -> 'moon'

### getHealthBadge(states, transitions, events)
- Delegate to getModelHealthSummary, map score to color/label
- good: green (#16a34a), fair: amber (#d97706), poor: red (#dc2626)

### getLayoutConfig()
- Return `{ sidebarWidth: 256, headerHeight: 64, breakpoint: 768 }`

## Test Command
```bash
node --experimental-strip-types --test test/feature_ui-app-shell.test.js
```
