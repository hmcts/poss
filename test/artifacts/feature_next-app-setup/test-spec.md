# Test Spec: next-app-setup

## Module Under Test
`src/next-app-setup/index.ts` (imported via bridge `index.js`)

## Test File
`test/feature_next-app-setup.test.js`

## Run Command
```bash
node --experimental-strip-types --test test/feature_next-app-setup.test.js
```

## Test Plan

### 1. getNextConfig() — 4 tests
| ID | Description | Assertion |
|----|-------------|-----------|
| NAS-1 | Returns a non-null object | `typeof result === 'object' && result !== null` |
| NAS-2 | Port is 3000 | `result.port === 3000` |
| NAS-3 | Output set to 'export' | `result.output === 'export'` |
| NAS-4 | Images unoptimized is true | `result.images.unoptimized === true` |

### 2. getTailwindThemeTokens() — 6 tests
| ID | Description | Assertion |
|----|-------------|-----------|
| NAS-5 | Returns all 5 domain keys | Object has draft, live, end, uncertain, warning |
| NAS-6 | draft maps to amber colour | Value contains 'amber' or is a hex in amber range |
| NAS-7 | live maps to green colour | Value contains 'green' or is a hex in green range |
| NAS-8 | end maps to dark colour | Value contains 'slate' or 'dark' or is a dark hex |
| NAS-9 | uncertain maps to grey colour | Value contains 'gray'/'grey' or is a grey hex |
| NAS-10 | draft and warning are identical (same amber) | `tokens.draft === tokens.warning` |

### 3. getThemeProviderConfig() — 4 tests
| ID | Description | Assertion |
|----|-------------|-----------|
| NAS-11 | Returns a non-null object | `typeof result === 'object'` |
| NAS-12 | defaultTheme matches app-shell getDefaultTheme() | `result.defaultTheme === getDefaultTheme()` |
| NAS-13 | themes array contains light and dark | `deepEqual(result.themes, ['light', 'dark'])` |
| NAS-14 | storageKey is a non-empty string | `typeof result.storageKey === 'string' && length > 0` |

### 4. getPathAliases() — 2 tests
| ID | Description | Assertion |
|----|-------------|-----------|
| NAS-15 | Has '@/src/*' key | `'@/src/*' in result` |
| NAS-16 | Value resolves to './src/*' | `deepEqual(result['@/src/*'], ['./src/*'])` |

### 5. getAppMetadata() — 3 tests
| ID | Description | Assertion |
|----|-------------|-----------|
| NAS-17 | title is a non-empty string | `typeof result.title === 'string' && length > 0` |
| NAS-18 | description is a non-empty string | `typeof result.description === 'string' && length > 0` |
| NAS-19 | title includes HMCTS or Possessions | regex test on title |

**Total: 19 tests**
