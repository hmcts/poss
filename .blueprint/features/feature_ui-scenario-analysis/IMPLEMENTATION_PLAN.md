# Implementation Plan: ui-scenario-analysis

## Files to Create
1. `src/ui-scenario-analysis/index.ts` — main module
2. `src/ui-scenario-analysis/index.js` — bridge file

## Dependencies
- Import from `../scenario-analysis/index.ts`: toggleState, toggleRole, toggleEvent, analyzeImpact
- Import types from `../data-model/schemas.ts`: State, Transition, Event

## Function Implementations

### getToggleableStates(states)
Map states to `{ id: s.id, label: s.uiLabel, isToggled: false }`.

### getToggleableRoles(roles)
Map roles to `{ id: role, label: role, isToggled: false }`.

### getToggleableEvents(events)
Map events to `{ id: e.id, label: e.name, state: e.state, isToggled: false }`.

### applyToggles(states, transitions, events, stateIds, roles, eventIds)
1. For each stateId, call toggleState and update states/transitions/events
2. For each eventId, call toggleEvent and update events
3. For each role, call toggleRole and update events
4. Return { states, transitions, events }

### getImpactSummary(states, transitions, events, stateIds, roles, eventIds)
1. Call analyzeImpact with toggles object
2. Format micro: { count: impact.micro.unavailableCount, items: removedEvents mapped to names }
3. Format meso: { count: impact.meso.degradedPaths, items: impact.meso.deadEndStates }
4. Format macro: { count: impact.macro.unreachableStates.length, items: impact.macro.unreachableStates, canReachEnd: impact.macro.canReachEnd }
5. Return with impact.summary

### getImpactHighlights(originalStates, impactResult)
1. Build set of removed stateIds (from toggled states)
2. Build set of unreachable stateIds (from macro.items)
3. For each original state: removed > unreachable > affected > normal
4. Return Map<string, string>

### createEmptyToggleState()
Return `{ stateIds: [], roles: [], eventIds: [] }`.
