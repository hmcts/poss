# Implementation Plan: ui-case-walk

## Files to create

1. `src/ui-case-walk/index.ts` — Main module with 7 exported functions
2. `src/ui-case-walk/index.js` — Bridge file re-exporting from index.ts

## Dependencies

- `src/case-walk/index.ts` — createSimulation, getAvailableEvents, applyEvent, isDeadEnd, isEndState, getHistory, filterEventsByRole, getReturnStates
- `src/uncertainty-display/index.ts` — getCompletenessBadge, getEventIndicator
- `src/data-model/schemas.ts` — State, Transition, Event, BreathingSpaceEntry types

## Type Definitions

```typescript
interface EnrichedSimulation {
  simulation: Simulation;
  currentState: State;
  badge: CompletenessBadge;
}

interface EnrichedEvent extends Event {
  indicator: EventIndicator;
}

interface ActionsPanel {
  events: EnrichedEvent[];
  hasDeadEnd: boolean;
  hasEndState: boolean;
  statusMessage: string;
}

interface TimelineEntry {
  stateId: string;
  stateName: string;
  badge: CompletenessBadge;
  stepNumber: number;
}

interface SimulationStatusResult {
  status: 'active' | 'dead-end' | 'completed';
  message: string;
}

interface BreathingSpaceInfo {
  isInBreathingSpace: boolean;
  returnStates: State[];
}
```

## Implementation approach

Each function is a thin wrapper that composes case-walk + uncertainty-display outputs:
- initializeSimulation: createSimulation -> enrich with state lookup + badge
- getAvailableActionsPanel: getAvailableEvents + optional filterEventsByRole -> map with getEventIndicator
- advanceSimulation: applyEvent -> enrich
- getSimulationTimeline: getHistory -> map with badge lookup
- getSimulationStatus: isEndState/isDeadEnd -> status string
- getRoleFilterOptions: scan actors maps, collect true roles, sort unique
- getBreathingSpaceInfo: getReturnStates -> wrap with boolean flag
