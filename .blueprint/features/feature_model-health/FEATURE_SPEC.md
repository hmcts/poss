# Feature Spec: model-health

## Overview
Model health panel provides aggregate model quality metrics across the possessions data model. It analyses states, transitions, and events to surface completeness gaps, unreachable states, open questions, and path connectivity.

## Module
`src/model-health/index.ts` — pure logic, no UI dependencies.

## Exported Functions

### `getOpenQuestionCount(events: Event[]): number`
Returns the total number of events where `hasOpenQuestions === true`.

### `getLowCompletenessStates(states: State[], threshold?: number): State[]`
Returns all states whose `completeness` value is strictly below `threshold`. Default threshold is 50.

### `getUnreachableStates(states: State[], transitions: Transition[]): State[]`
Returns states that have no incoming transitions. Initial states (identified as `isDraftLike === true` with no incoming transitions) are excluded from the result since they are expected entry points.

Logic:
1. Build a set of all state IDs that appear as a `to` target in any transition.
2. For each state, if its `id` is NOT in that set and it is NOT an initial state (`isDraftLike === true`), it is unreachable.

### `canReachEndState(states: State[], transitions: Transition[]): boolean`
Returns `true` if there exists a path from any initial state (`isDraftLike === true`) to any end state (`isEndState === true`) via transitions. Uses BFS.

Returns `false` if there are no initial states, no end states, or no connecting path.

### `getModelHealthSummary(states: State[], transitions: Transition[], events: Event[]): ModelHealthSummary`
Aggregates all metrics into a single object:

```typescript
interface ModelHealthSummary {
  openQuestions: number;
  lowCompletenessStates: State[];
  unreachableStates: State[];
  hasValidEndPath: boolean;
  overallScore: 'good' | 'fair' | 'poor';
}
```

**overallScore logic:**
- `'good'`: openQuestions === 0 AND lowCompletenessStates is empty AND unreachableStates is empty AND hasValidEndPath is true
- `'poor'`: hasValidEndPath is false OR unreachableStates.length > 0
- `'fair'`: everything else

## Dependencies
- Types from `src/data-model/schemas.ts` (State, Transition, Event)

## Non-goals
- No UI rendering
- No store integration
- No file I/O
