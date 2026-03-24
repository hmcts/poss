# Feature Spec: ui-model-health

## Overview
Pure-logic UI view-model module that transforms model-health and uncertainty-display data into presentation-ready structures for a model health dashboard. Provides summary cards, open-question lists, low-completeness panels, unreachable-state panels, per-claim-type end-state reachability, and colour theming.

## Inputs
- `State[]`, `Transition[]`, `Event[]` from `data-model/schemas`
- `ClaimTypeId` from `data-model/enums`
- Functions from `model-health` (getModelHealthSummary, getOpenQuestionCount, getLowCompletenessStates, getUnreachableStates, canReachEndState)
- Functions from `uncertainty-display` (getUncertaintyLevel, getUncertaintyColor)

## Exported Functions

### getHealthSummaryCard(states, transitions, events)
Returns `{ score, scoreColor, scoreLabel, openQuestions, lowCompletenessCount, unreachableCount, hasValidEndPath }`.
- `score`: 'good' | 'fair' | 'poor' from model-health summary
- `scoreColor`: colour object from getOverallHealthColor
- `scoreLabel`: human-readable label ('Good', 'Fair', 'Poor')
- Numeric counts derived from model-health summary

### getOpenQuestionsList(events)
Returns `{ count, events: { id, name, state, notes }[] }` filtered to events with open questions.

### getLowCompletenessPanel(states, threshold?)
Returns `{ threshold, states: { id, label, completeness, level, color }[] }` for states below threshold. Default threshold 50.

### getUnreachableStatesPanel(states, transitions)
Returns `{ count, states: { id, label }[] }`.

### getEndStateReachability(claimTypeDataMap)
Accepts `Record<string, { states, transitions }>`. Returns array of `{ claimTypeId, claimTypeName, canReach, icon }`.
- icon: checkmark for reachable, cross for unreachable

### getOverallHealthColor(score)
Returns `{ background, text, border }` colour object.
- good: green palette
- fair: amber palette
- poor: red palette

## Non-goals
- No React/DOM rendering
- No side effects or async operations
