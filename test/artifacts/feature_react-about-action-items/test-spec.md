# Test Spec: react-about-action-items

## Scope
Unit tests for `src/ui-about-action-items/index.js` content constants.

## Test Groups

### Group A: getAboutSection — content strings are non-empty
Tests each known section key (whatItDoes, twoSources, priorityAlgorithm, modelHealthScore, waAlignmentPct, suggestions, notPersisted) for non-empty heading and body strings.

- A-1 through A-14: heading and body for each of the 7 sections

### Group B: getAboutSection — structural
- B-1: all known section keys return objects with heading and body
- B-2: unknown key returns null

### Group C: getAboutSections — ordered list
- C-1: returns array of 7 section objects
- C-2: every entry has non-empty heading and body
- C-3: first section is whatItDoes

## Known Keys
whatItDoes, twoSources, priorityAlgorithm, modelHealthScore, waAlignmentPct, suggestions, notPersisted

## Run Command
```
cd /workspaces/poss/.claude/worktrees/feat-react-about-action-items && node --test test/feature_react-about-action-items.test.js
```
