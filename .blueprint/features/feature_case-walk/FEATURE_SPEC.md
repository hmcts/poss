# Feature Spec: Case Walk (Simulation Engine)

**Slug:** case-walk
**Priority:** P1 | **Effort:** XL | **Status:** WIP

---

## 1. Overview

Step-through simulation of a single case journey through the possession process model. The user selects a claim type, which starts the simulation at the initial state. At each state, the system shows available events (optionally filtered by role). The user selects an event, which transitions the case to the next state. A history trail (breadcrumb) tracks the journey. Dead-end detection flags states with no available events that are not valid end states. Cross-cutting states (BREATHING_SPACE, CASE_STAYED) are handled with return options per the breathing space/stayed matrix.

This spec covers the **simulation engine** (pure logic layer, no UI). The engine is testable without a browser.

---

## 2. Domain References

- System Spec sections 5 (Core Domain Concepts), 6 (Lifecycle & State Model), 7 (Governing Rules)
- `.business_context/spec.md` Mode 3, section 3a (Case Walk)
- BACKLOG.md case-walk entry
- `src/data-model/schemas.ts` — State, Transition, Event, BreathingSpaceEntry types
- `src/data-model/enums.ts` — ClaimTypeId, KNOWN_ROLES

---

## 3. Functional Requirements

### 3.1 Simulation State Machine

**FR-CW-01:** `createSimulation(claimTypeId, states, transitions, events)` creates a new simulation object with:
- `currentStateId` set to the initial state for the claim type (the state with `isDraftLike: true` that has no incoming transitions, or conventionally `AWAITING_SUBMISSION_TO_HMCTS`)
- `claimTypeId` stored on the simulation
- `history` initialized with the starting state
- `states`, `transitions`, `events` stored for lookup

**FR-CW-02:** The simulation object is immutable — each operation returns a new simulation object.

### 3.2 Available Events

**FR-CW-03:** `getAvailableEvents(simulation)` returns all events from the simulation's event set where `event.state === simulation.currentStateId` and `event.claimType === simulation.claimTypeId`.

**FR-CW-04:** `filterEventsByRole(events, role)` filters an event list to only those where `event.actors[role] === true`.

### 3.3 Transition Execution

**FR-CW-05:** `applyEvent(simulation, eventId)` finds the event by ID, then finds a transition from the current state triggered by that event's state context, and returns a new simulation with `currentStateId` updated to the transition's `to` state, and the new state appended to `history`.

**FR-CW-06:** If the event ID is not found or there is no valid transition, `applyEvent` throws an error.

### 3.4 Dead-End Detection

**FR-CW-07:** `isDeadEnd(simulation)` returns `true` when:
- There are no available events for the current state, AND
- The current state is NOT an end state (`isEndState === false`)

**FR-CW-08:** `isEndState(simulation)` returns `true` when the current state has `isEndState === true`.

### 3.5 History Tracking

**FR-CW-09:** `getHistory(simulation)` returns the ordered array of `{ stateId, stateName }` objects representing all states visited, in order.

### 3.6 Breathing Space / Case Stayed Handling

**FR-CW-10:** When the current state is BREATHING_SPACE or CASE_STAYED, `getAvailableEvents` should still work normally (returning events for that state). Additionally, `getReturnStates(simulation, breathingSpaceEntries)` returns the possible return states from the breathing space/stayed matrix, including conditional options.

---

## 4. Data Dependencies

| Data | Source | Type |
|------|--------|------|
| States | `src/data-model/schemas.ts` → State | Array |
| Transitions | `src/data-model/schemas.ts` → Transition | Array |
| Events | `src/data-model/schemas.ts` → Event | Array |
| BreathingSpaceEntry | `src/data-model/schemas.ts` | Array |
| ClaimTypeId | `src/data-model/enums.ts` | Enum |

---

## 5. Governing Rules (from System Spec section 7)

1. A case must be in exactly one state at any time
2. Transitions only valid along defined edges — no arbitrary state jumps
3. End states (CLOSED, DRAFT_DISCARDED) have no outgoing transitions
4. BREATHING_SPACE and CASE_STAYED can be entered from any eligible live state
5. Return state from BREATHING_SPACE/CASE_STAYED determined by matrix; conditional returns present both options

---

## 6. Module Exports

```typescript
// src/case-walk/index.ts
export function createSimulation(claimTypeId, states, transitions, events): Simulation
export function getAvailableEvents(simulation): Event[]
export function applyEvent(simulation, eventId): Simulation
export function isDeadEnd(simulation): boolean
export function isEndState(simulation): boolean
export function getHistory(simulation): { stateId: string, stateName: string }[]
export function filterEventsByRole(events, role): Event[]
export function getReturnStates(simulation, breathingSpaceEntries): State[]
```

---

## 7. Acceptance Criteria

- AC-1: Creating a simulation sets the initial state correctly
- AC-2: Available events returns only events for the current state and claim type
- AC-3: Applying a valid event transitions to the correct next state
- AC-4: Applying an invalid event throws an error
- AC-5: Dead-end detection correctly identifies stuck states
- AC-6: End state detection correctly identifies terminal states
- AC-7: History tracks all visited states in order
- AC-8: Role filtering returns only events for the specified role
- AC-9: Breathing space return states are correctly retrieved from the matrix
- AC-10: Multi-step walk through several states works correctly
