# Implementation Plan: scenario-analysis

## Files to Create
1. `src/scenario-analysis/index.ts` — All logic
2. `src/scenario-analysis/index.js` — Bridge re-export

## Function Implementation Order
1. `toggleEvent` — simplest, just filter
2. `toggleState` — filter state, transitions, events
3. `toggleRole` — find sole-performer events, filter them
4. `findUnreachableStates` — BFS from initial states
5. `findBlockedEvents` — cross-reference events against states
6. `canReachEndState` — BFS from initial, check if any end state reached
7. `analyzeImpact` — orchestrate all above, compute summary

## Key Algorithms
- **Initial state detection:** isDraftLike && no incoming transitions (same as case-walk)
- **Reachability BFS:** Start from initial states, follow transitions forward, collect visited set
- **Dead-end detection:** Reachable states with no outgoing transitions that are not end states
