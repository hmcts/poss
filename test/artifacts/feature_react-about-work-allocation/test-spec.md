# Test Spec: feature_react-about-work-allocation

## Scope
Unit tests for `src/ui-about-work-allocation/index.js` — the content constants module.
No DOM/browser tests required; content correctness is verified at the module level.

## Test Groups

### Group A: getAboutSection — content strings are non-empty
Tests each named section key individually. For each key:
- `heading` is a non-empty string
- `body` is a non-empty string

Known keys: `whatItDoes`, `alignmentCategories`, `scopeAssumption`, `byContextAssumption`

### Group B: getAboutSection — structural
- B-1: all known section keys return objects with non-empty `heading` and `body`
- B-2: unknown key returns `null`

### Group C: getAboutSections — ordered list
- C-1: returns array of exactly 4 section objects
- C-2: every entry has non-empty `heading` and `body`
- C-3: first section is `whatItDoes`

## File Under Test
`src/ui-about-work-allocation/index.js`

## Test File
`test/feature_react-about-work-allocation.test.js`
