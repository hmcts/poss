# Feature Spec: scenario-analysis

## Intent

Pure analysis engine for what-if scenario testing on HMCTS possession case state machines. Allows toggling states, events, and roles on/off, then computes reachability and impact analysis at micro, meso, and macro levels.

## Scope

### Toggle Operations
- **Toggle State:** Remove a state and sever all transitions to/from it. Events in that state become unavailable.
- **Toggle Event:** Mark a specific event as unavailable (removed from consideration).
- **Toggle Role:** For a given role, mark all events where that role is the sole performer as unavailable.

### Analysis Levels
- **Micro:** Which specific events are directly affected/unavailable due to toggles.
- **Meso:** Which paths through the process are blocked or degraded (states with no available events that are not end states).
- **Macro:** Which states become unreachable from initial state. Whether any end state is still reachable. Which claim types are affected.

### Summary Output
A human-readable summary string: "X states unreachable, Y events blocked, Z dead-end states"

## Exported API (`src/scenario-analysis/index.ts`)

### `toggleState(states, transitions, events, stateId)`
Returns `{ states, transitions, events }` with the target state removed, its transitions severed, and its events removed.

### `toggleRole(events, role)`
Returns modified events array. Events where the given role is the only actor with `true` are marked unavailable (removed from result).

### `toggleEvent(events, eventId)`
Returns events array with the target event removed.

### `findUnreachableStates(states, transitions)`
Returns array of state IDs that have no path from any initial state (isDraftLike with no incoming transitions). Uses BFS/DFS from initial states following transitions.

### `findBlockedEvents(events, states)`
Returns events that reference states not present in the states array (i.e., events in removed/unreachable states).

### `canReachEndState(states, transitions)`
Returns boolean indicating whether any end state is reachable from any initial state via transitions.

### `analyzeImpact(states, transitions, events, toggles)`
Accepts toggles object `{ states?: string[], events?: string[], roles?: string[] }`. Applies all toggles, then computes:
- `micro`: `{ removedEvents: Event[], unavailableCount: number }`
- `meso`: `{ deadEndStates: string[], degradedPaths: number }`
- `macro`: `{ unreachableStates: string[], canReachEnd: boolean }`
- `summary`: string

## Non-Goals
- No UI/React code
- No persistence
- No mutation of input data (all functions return new arrays/objects)
