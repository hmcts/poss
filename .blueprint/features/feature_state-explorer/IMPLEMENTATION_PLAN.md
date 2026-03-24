# Implementation Plan -- state-explorer

## Approach
Implement pure data transformation functions in `src/state-explorer/index.ts`. No React dependency. All functions consume types from `src/data-model/schemas.ts`.

## Files to Create
1. `src/state-explorer/index.ts` -- all 6 exported functions
2. No additional dependencies required

## Implementation Order
1. `getStateColor(state)` -- colour mapping logic
2. `getEdgeStyle(transition)` -- edge style logic
3. `statesToNodes(states)` -- uses getStateColor
4. `transitionsToEdges(transitions)` -- uses getEdgeStyle
5. `getStateDetail(stateId, states, events)` -- filtering and aggregation
6. `buildGraph(states, transitions)` -- composition of statesToNodes + transitionsToEdges

## Run Tests
```bash
node --experimental-strip-types --test test/feature_state-explorer.test.js
```
