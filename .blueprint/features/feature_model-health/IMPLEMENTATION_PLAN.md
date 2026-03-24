# Implementation Plan: model-health

## Files to Create
1. `src/model-health/index.ts` — all 5 exported functions
2. `src/model-health/index.js` — bridge file

## Function Implementations

### getOpenQuestionCount
Filter events by `hasOpenQuestions === true`, return length.

### getLowCompletenessStates
Filter states by `completeness < threshold` (default 50).

### getUnreachableStates
1. Build `Set<string>` of all transition `to` targets.
2. Filter states where `id` not in set AND `isDraftLike === false`.

### canReachEndState
1. Find initial states (`isDraftLike === true`).
2. Find end state IDs (`isEndState === true`).
3. Build adjacency map from transitions.
4. BFS from each initial state; if any end state reached, return true.

### getModelHealthSummary
Call all 4 functions, compute overallScore based on rules:
- good: 0 open questions, no low completeness, no unreachable, has valid end path
- poor: no valid end path OR unreachable states exist
- fair: everything else
