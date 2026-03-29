# Test Spec: react-about-digital-twin

## Test file
`test/feature_react-about-digital-twin.test.js`

## Helper module under test
`src/ui-about-digital-twin/index.js`

## Test approach
Unit tests using Node.js built-in test runner (`node:test`). No DOM or React rendering required — tests validate the content constants exported from the helper module.

## Test cases

| # | Name | Assertion |
|---|------|-----------|
| 1 | ABOUT_WHAT_PAGE_DOES is a non-empty string | `typeof === 'string'` and `length > 0` |
| 2 | ABOUT_AVAILABLE_EVENTS is a non-empty string | `typeof === 'string'` and `length > 0` |
| 3 | ABOUT_DEAD_END_DETECTION is a non-empty string | `typeof === 'string'` and `length > 0` |
| 4 | ABOUT_AUTO_WALK is a non-empty string | `typeof === 'string'` and `length > 0` |
| 5 | ABOUT_WA_TASK_CARDS is a non-empty string | `typeof === 'string'` and `length > 0` |
| 6 | ABOUT_ROLE_FILTER is a non-empty string | `typeof === 'string'` and `length > 0` |
| 7 | Each constant mentions a key concept | Keyword checks per section |

## Run command
```bash
cd /workspaces/poss/.claude/worktrees/feat-react-about-digital-twin
node --test test/feature_react-about-digital-twin.test.js
```

## Expected result
7/7 passing, 0 failing
