# Feature Spec: ui-scenario-analysis

## Slug
`ui-scenario-analysis`

## Summary
Pure-logic UI adapter layer for the what-if scenario analysis panel. Wraps the `scenario-analysis` module's toggle and impact functions with UI-friendly data structures suitable for rendering toggle checkboxes, impact summaries at three levels (micro/meso/macro), visual diff highlights, and reset functionality.

## Module
`src/ui-scenario-analysis/index.ts`

## Dependencies
- `src/scenario-analysis/index.ts` — toggleState, toggleRole, toggleEvent, analyzeImpact, findUnreachableStates, canReachEndState
- `src/data-model/schemas.ts` — State, Transition, Event types

## Exported Functions

### getToggleableStates(states: State[])
Returns an array of `{ id, label, isToggled: false }` objects for each state, suitable for rendering a checkbox list.

### getToggleableRoles(roles: string[])
Returns an array of `{ id, label, isToggled: false }` objects for each role string.

### getToggleableEvents(events: Event[])
Returns an array of `{ id, label, state, isToggled: false }` objects for each event.

### applyToggles(states, transitions, events, toggledStateIds, toggledRoles, toggledEventIds)
Applies state, role, and event toggles in sequence using the scenario-analysis toggle functions. Returns the modified `{ states, transitions, events }`.

### getImpactSummary(states, transitions, events, toggledStateIds, toggledRoles, toggledEventIds)
Calls `analyzeImpact` and formats the result into a UI-friendly structure:
```
{
  micro: { count, items },
  meso: { count, items },
  macro: { count, items, canReachEnd },
  summary: string
}
```

### getImpactHighlights(originalStates, impactResult)
Maps each original state to a highlight category: `'removed'`, `'unreachable'`, `'affected'`, or `'normal'` for visual diff rendering.

### createEmptyToggleState()
Returns a fresh toggle state object: `{ stateIds: [], roles: [], eventIds: [] }`.

## Acceptance Criteria
- All functions are pure (no side effects)
- Toggle lists preserve input ordering
- Impact summary counts match analyzeImpact output
- Highlights cover all original states
- Empty toggle state resets all selections
