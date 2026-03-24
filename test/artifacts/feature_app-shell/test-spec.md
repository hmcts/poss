# Test Specification -- app-shell

## Scope
Non-UI logic exported from `src/app-shell/index.js`: route config, claim type data, theme utilities, and store integration.

## Test Cases

### 1. Route Configuration (ROUTES)
| ID | Description |
|----|-------------|
| RT-1 | ROUTES is an array of exactly 3 entries (State Explorer, Event Matrix, Digital Twin) |
| RT-2 | Each route has path, label, and icon properties (all non-empty strings) |
| RT-3 | Paths match expected values: /state-explorer, /event-matrix, /digital-twin |
| RT-4 | First route is /state-explorer (default landing) |

### 2. Claim Types (CLAIM_TYPES)
| ID | Description |
|----|-------------|
| CL-1 | CLAIM_TYPES is an array of exactly 7 entries |
| CL-2 | Each entry has id and name properties (both non-empty strings) |
| CL-3 | IDs match every value in ClaimTypeId enum from src/data-model/enums.ts |
| CL-4 | Every entry has a human-readable name distinct from the raw enum key |

### 3. Theme Utilities
| ID | Description |
|----|-------------|
| TH-1 | getDefaultTheme() returns 'dark' |
| TH-2 | toggleTheme('dark') returns 'light' |
| TH-3 | toggleTheme('light') returns 'dark' |
| TH-4 | getThemeClass('dark') returns a non-empty string |
| TH-5 | getThemeClass('light') returns a non-empty string |
| TH-6 | getThemeClass('dark') differs from getThemeClass('light') |

### 4. Store Integration (createAppStore)
| ID | Description |
|----|-------------|
| AS-1 | createAppStore is a callable function |
| AS-2 | Store state includes activeClaimType initialised to null |
| AS-3 | Store exposes setActiveClaimType action |
| AS-4 | setActiveClaimType updates activeClaimType in store state |
| AS-5 | setActiveClaimType(null) resets activeClaimType to null |

## Out of Scope
- React component rendering, DOM assertions, CSS validation, localStorage persistence
