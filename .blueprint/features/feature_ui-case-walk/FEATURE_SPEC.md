# Feature Spec: UI Case Walk (Simulation UI Logic)

**Slug:** ui-case-walk
**Priority:** P1 | **Effort:** L | **Status:** WIP

---

## 1. Overview

Pure logic module that wraps the `case-walk` simulation engine and `uncertainty-display` module to provide enriched, UI-ready data structures for the step-through case simulation view. This module does NOT render any DOM elements — it produces view-model objects that a future UI layer will consume.

Functions include: initializing an enriched simulation, getting available actions with status indicators, advancing the simulation, building a timeline with completeness badges, determining simulation status, extracting role filter options, and checking breathing space state.

---

## 2. Domain References

- `src/case-walk/index.ts` — Simulation engine (createSimulation, getAvailableEvents, applyEvent, isDeadEnd, isEndState, getHistory, filterEventsByRole, getReturnStates)
- `src/uncertainty-display/index.ts` — getCompletenessBadge, getEventIndicator
- `src/data-model/schemas.ts` — State, Transition, Event, BreathingSpaceEntry types
- `src/data-model/enums.ts` — KNOWN_ROLES

---

## 3. Functional Requirements

### 3.1 Initialize Simulation

**FR-UCW-01:** `initializeSimulation(claimTypeId, states, transitions, events)` wraps `createSimulation` and returns an enriched object containing:
- The underlying `Simulation` object
- `currentState`: the full State object for the current state
- `badge`: the CompletenessBadge for the current state (from getCompletenessBadge)

### 3.2 Available Actions Panel

**FR-UCW-02:** `getAvailableActionsPanel(simulation, roleFilter?)` returns:
- `events`: array of enriched events (each event plus its EventIndicator from getEventIndicator)
- `hasDeadEnd`: boolean from isDeadEnd
- `hasEndState`: boolean from isEndState
- `statusMessage`: human-readable status string

**FR-UCW-03:** When `roleFilter` is provided and non-empty, events are filtered through `filterEventsByRole` before enrichment.

### 3.3 Advance Simulation

**FR-UCW-04:** `advanceSimulation(simulation, eventId)` wraps `applyEvent` and returns a new enriched simulation state (same shape as initializeSimulation output).

### 3.4 Simulation Timeline

**FR-UCW-05:** `getSimulationTimeline(simulation)` maps `getHistory` entries to enriched timeline entries, each with:
- `stateId`, `stateName` (from history)
- `badge`: CompletenessBadge for the state (looked up from simulation.states)
- `stepNumber`: 1-based index

### 3.5 Simulation Status

**FR-UCW-06:** `getSimulationStatus(simulation)` returns:
- `status`: one of `'active'`, `'dead-end'`, `'completed'`
- `message`: human-readable description

Logic: if isEndState -> 'completed'; if isDeadEnd -> 'dead-end'; else -> 'active'.

### 3.6 Role Filter Options

**FR-UCW-07:** `getRoleFilterOptions(events)` extracts unique role names from the `actors` maps of the provided events where the actor value is `true`. Returns sorted array of role strings.

### 3.7 Breathing Space Info

**FR-UCW-08:** `getBreathingSpaceInfo(simulation, breathingSpaceEntries)` wraps `getReturnStates` and returns:
- `isInBreathingSpace`: boolean (true if return states are non-empty)
- `returnStates`: State[] from getReturnStates

---

## 4. Module Exports

```typescript
// src/ui-case-walk/index.ts
export function initializeSimulation(claimTypeId, states, transitions, events): EnrichedSimulation
export function getAvailableActionsPanel(simulation, roleFilter?): ActionsPanel
export function advanceSimulation(simulation, eventId): EnrichedSimulation
export function getSimulationTimeline(simulation): TimelineEntry[]
export function getSimulationStatus(simulation): SimulationStatusResult
export function getRoleFilterOptions(events): string[]
export function getBreathingSpaceInfo(simulation, breathingSpaceEntries): BreathingSpaceInfo
```

---

## 5. Acceptance Criteria

- AC-1: initializeSimulation returns enriched object with badge and currentState
- AC-2: getAvailableActionsPanel returns enriched events with indicators
- AC-3: Role filter correctly narrows available events
- AC-4: advanceSimulation transitions and returns enriched state
- AC-5: Timeline entries include step numbers and badges
- AC-6: Status correctly identifies active, dead-end, and completed states
- AC-7: getRoleFilterOptions extracts unique roles sorted alphabetically
- AC-8: getBreathingSpaceInfo detects breathing space and return states

---

## React Component Layer (implemented via vibe coding)

The React page at `app/digital-twin/page.tsx` consumes this module and adds interactive features beyond the original spec:

### Event Toggling with Auto-Replay
- All events start checked (enabled) when simulation begins
- Unchecking an event removes it from the available event pool
- The simulation auto-replays from the initial state using only enabled events, advancing through the first available event at each state
- Timeline and terminal state detection recalculate immediately
- Disabled events shown with strikethrough, red border, reduced opacity
- Amber banner shows count of disabled events

### Expandable Event Details
- Events panel below Reset button shows all events grouped by state
- Current state highlighted with indigo indicator
- Each event row has: checkbox, name, SYS badge (if system), amber dot (if open questions), expand chevron
- Expanded view shows: Notes, Actors (as tags), Type (System/User), Open Questions (Yes/No)

### Completeness Tooltips
- Percentage badges in the timeline have a `title` tooltip explaining model completeness

### Deviations from Original Spec
- Combines case-walk and scenario-analysis concepts (event toggling drives simulation replay)
- No manual step-through — simulation auto-walks the path
- No role filter on the main simulation (events panel replaces this)
