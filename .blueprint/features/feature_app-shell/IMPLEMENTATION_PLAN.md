# Implementation Plan -- app-shell

## Feedback on Tests
FEEDBACK: {"rating":4,"issues":["No explicit contract for exported non-UI utilities","Digital Twin sub-routes not in ROUTES","CL-4 only checks name != id, not deeper readability"],"rec":"proceed"}

## Approach
Pure-function module in `src/app-shell/index.ts` with a JS bridge file for ESM import compatibility.

## Files to Create

### 1. `src/app-shell/index.ts` (main module)
Exports:
- **ROUTES**: 3-element array `[{path,label,icon}]` for /state-explorer, /event-matrix, /digital-twin
- **CLAIM_TYPES**: 7-element array `[{id,name}]` derived from `ClaimTypeId` enum in data-model
- **getDefaultTheme()**: returns `'dark'`
- **toggleTheme(theme)**: returns `'light'` if dark, `'dark'` otherwise
- **getThemeClass(theme)**: returns `'theme-dark'` or `'theme-light'`
- **createAppStore()**: Zustand vanilla store with `activeClaimType: null` and `setActiveClaimType` action

### 2. `src/app-shell/index.js` (bridge)
Single-line re-export: `export * from './index.ts';`

## Dependencies
- `zustand/vanilla` (already installed)
- `src/data-model/enums.ts` (ClaimTypeId enum)

## Validation
```bash
node --experimental-strip-types --test test/feature_app-shell.test.js
```
All 19 test cases across 4 groups must pass.

## Key Decisions
- CLAIM_TYPES names are human-readable transformations of enum keys (e.g. MAIN_CLAIM_ENGLAND -> "Main Claim (England)")
- Theme classes use `theme-dark` / `theme-light` prefix pattern
- Store is independent from data-model store; focuses on UI shell state only
