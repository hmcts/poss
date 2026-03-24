# Feature Spec: ui-app-shell

## Summary
Pure logic module providing UI-ready data helpers for the application shell: navigation items, claim type selector options, theme toggle state, model health badge, layout constants, and route matching.

## Priority / Effort
P1 / M

## What It Does
Provides a testable logic module (`src/ui-app-shell/index.ts`) exposing pure functions that prepare data structures for the UI layer. These functions compose over existing modules (app-shell, model-health) to produce view-model objects that a React UI can consume directly.

## Consumes
- `src/app-shell/index.ts` -- `ROUTES`, `CLAIM_TYPES`, `toggleTheme`, `getThemeClass`
- `src/model-health/index.ts` -- `getModelHealthSummary`

## Exports (from `src/ui-app-shell/index.ts`)

| Function | Returns | Purpose |
|----------|---------|---------|
| `getNavigationItems()` | `Array<{ path, label, icon, isActive(currentPath) }>` | ROUTES mapped with an `isActive` predicate for active route highlighting |
| `getClaimTypeSelectorOptions()` | `Array<{ value: string, label: string }>` | CLAIM_TYPES mapped to value/label pairs for dropdown |
| `getThemeToggleState(currentTheme)` | `{ currentTheme, nextTheme, cssClass, icon }` | Full theme toggle view-model using toggleTheme/getThemeClass |
| `getHealthBadge(states, transitions, events)` | `{ score, color, label }` | Model health summary mapped to badge display data |
| `getLayoutConfig()` | `{ sidebarWidth, headerHeight, breakpoint }` | Layout dimension constants |
| `isRouteActive(routePath, currentPath)` | `boolean` | Route matching: exact match or prefix match for nested routes |

## Test Strategy (node:test only, no browser/DOM)
1. `getNavigationItems()` returns array with 3 items matching ROUTES
2. Each nav item has `isActive` function that returns true for matching path
3. `isActive` returns false for non-matching paths
4. `getClaimTypeSelectorOptions()` returns 7 options (one per claim type)
5. Each option has `value` and `label` as non-empty strings
6. `getThemeToggleState('dark')` returns nextTheme='light', cssClass matching getThemeClass('dark')
7. `getThemeToggleState('light')` returns nextTheme='dark', cssClass matching getThemeClass('light')
8. Theme toggle icon changes between themes
9. `getHealthBadge` with good-scoring inputs returns score='good' and a green-ish color
10. `getHealthBadge` with poor-scoring inputs returns score='poor' and a red-ish color
11. `getHealthBadge` returns a non-empty label for any score
12. `getLayoutConfig()` returns numeric sidebarWidth, headerHeight, breakpoint
13. `isRouteActive('/state-explorer', '/state-explorer')` returns true (exact match)
14. `isRouteActive('/state-explorer', '/event-matrix')` returns false
15. `isRouteActive('/state-explorer', '/state-explorer/details')` returns true (prefix match)

## Acceptance Criteria
- All 15+ tests pass via `node --experimental-strip-types --test`
- No DOM or React dependencies
- All functions are pure (no side effects)
- Existing tests remain green

---

## React Component Layer (implemented via vibe coding)

The React components in `app/` consume this module's exports:

- **Sidebar** (`app/components/Sidebar.tsx`) — Uses `getNavigationItems()` for nav links with active highlighting, `getClaimTypeSelectorOptions()` for dropdown. Responsive: collapses to hamburger on mobile.
- **Header** (`app/components/Header.tsx`) — Uses `getHealthBadge()` for model health indicator with colour-coded dot and label. Theme toggle was removed (dark-only).
- **Layout** (`app/layout.tsx`) — Uses `getLayoutConfig()` dimensions implicitly. Dark-only slate/indigo theme with Inter font.

**Deviations from original spec:**
- Dark/light theme toggle removed — UI is dark-only
- `getThemeToggleState()` is no longer used by the React layer
- Indigo accent colour (not blue) with slate palette (not gray)
