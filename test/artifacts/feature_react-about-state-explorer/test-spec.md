# Test Spec: react-about-state-explorer

## Scope
Unit tests for the content constants exported from `src/ui-about-state-explorer/index.js`.

## Test file
`test/feature_react-about-state-explorer.test.js`

## Test groups

### Group A: getAboutSection — content strings are non-empty

| ID | Description | Input | Expected |
|----|-------------|-------|----------|
| A-1 | whatItDoes section has non-empty heading | `getAboutSection('whatItDoes').heading` | typeof string, length > 0 |
| A-2 | whatItDoes section has non-empty body | `getAboutSection('whatItDoes').body` | typeof string, length > 0 |
| A-3 | graphLayout section has non-empty heading | `getAboutSection('graphLayout').heading` | typeof string, length > 0 |
| A-4 | graphLayout section has non-empty body | `getAboutSection('graphLayout').body` | typeof string, length > 0 |
| A-5 | nodeColour section has non-empty heading | `getAboutSection('nodeColour').heading` | typeof string, length > 0 |
| A-6 | nodeColour section has non-empty body | `getAboutSection('nodeColour').body` | typeof string, length > 0 |
| A-7 | completenessBadge section has non-empty heading | `getAboutSection('completenessBadge').heading` | typeof string, length > 0 |
| A-8 | completenessBadge section has non-empty body | `getAboutSection('completenessBadge').body` | typeof string, length > 0 |
| A-9 | waTaskBadge section has non-empty heading | `getAboutSection('waTaskBadge').heading` | typeof string, length > 0 |
| A-10 | waTaskBadge section has non-empty body | `getAboutSection('waTaskBadge').body` | typeof string, length > 0 |
| A-11 | edgeStyle section has non-empty heading | `getAboutSection('edgeStyle').heading` | typeof string, length > 0 |
| A-12 | edgeStyle section has non-empty body | `getAboutSection('edgeStyle').body` | typeof string, length > 0 |

### Group B: getAboutSection — structural

| ID | Description | Expected |
|----|-------------|----------|
| B-1 | All known section keys return objects with heading and body | Pass for all 6 keys |
| B-2 | Unknown key returns null | `getAboutSection('__unknown__')` === null |

### Group C: getAboutSections — ordered list

| ID | Description | Expected |
|----|-------------|----------|
| C-1 | Returns array of 6 section objects | `length === 6` |
| C-2 | Every entry has non-empty heading and body | All pass |
| C-3 | First section is whatItDoes | `sections[0].key === 'whatItDoes'` |
