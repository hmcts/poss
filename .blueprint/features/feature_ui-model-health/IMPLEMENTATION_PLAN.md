# Implementation Plan: ui-model-health

## Approach
Thin view-model layer that delegates to model-health and uncertainty-display, then reshapes outputs for dashboard consumption.

## Files
1. `src/ui-model-health/index.ts` — all 6 exported functions + types
2. `src/ui-model-health/index.js` — bridge re-export

## Dependencies
- `model-health`: getModelHealthSummary, getLowCompletenessStates, getUnreachableStates, canReachEndState
- `uncertainty-display`: getUncertaintyLevel, getUncertaintyColor
- `data-model/schemas`: State, Transition, Event types

## Key decisions
- Colour palettes: green (#D1FAE5), amber (#FEF3C7), red (#FEE2E2) for good/fair/poor
- Score labels: capitalised English strings
- Claim type names: human-readable lookup table
- Icons: Unicode checkmark (U+2713) and cross (U+2717)
- getOverallHealthColor falls back to 'poor' palette for unknown scores
