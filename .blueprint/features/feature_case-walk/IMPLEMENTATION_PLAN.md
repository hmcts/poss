# Implementation Plan: case-walk

## Approach

Single TypeScript module (`src/case-walk/index.ts`) exporting 8 pure functions. No external dependencies beyond the data-model types. Simulation state is an immutable plain object.

## Simulation Type

```typescript
interface Simulation {
  claimTypeId: string;
  currentStateId: string;
  history: { stateId: string; stateName: string }[];
  states: State[];
  transitions: Transition[];
  events: Event[];
}
```

## Functions

1. **createSimulation** — Find initial state (isDraftLike + no incoming transitions), build Simulation object
2. **getAvailableEvents** — Filter events by currentStateId and claimTypeId
3. **applyEvent** — Validate event, find transition from current state, return new sim with updated state/history
4. **isDeadEnd** — No available events AND not end state
5. **isEndState** — Lookup current state's isEndState flag
6. **getHistory** — Return simulation.history
7. **filterEventsByRole** — Filter events where actors[role] === true
8. **getReturnStates** — Filter breathing space entries where stateFrom matches current state, resolve stateTo to State objects

## Files

- `src/case-walk/index.ts` — all logic
- No bridge file needed (--experimental-strip-types handles .ts -> .js import)
