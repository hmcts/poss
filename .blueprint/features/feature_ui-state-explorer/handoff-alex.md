# Handoff: Alex -> Nigel (ui-state-explorer)

## Feature
ui-state-explorer: Pure logic module preparing React Flow graph data with layout, badges, detail panels, and legends.

## Spec Location
`.blueprint/features/feature_ui-state-explorer/FEATURE_SPEC.md`

## Key Points for Testing
1. `prepareGraphData` should return nodes with x,y positions assigned (not all 0,0)
2. `calculateAutoLayout` should do topological layering -- root nodes at top, dependents below
3. `prepareNodeWithBadge` should combine state info with completeness badge from uncertainty-display
4. `prepareStateDetailPanel` should include formatted events with uncertainty indicators
5. `getGraphLegend` returns exactly 4 entries (Draft, Live, End State, Uncertain)
6. `getEdgeLegend` returns exactly 3 entries (User Action, System Triggered, Time Based)
7. All functions are pure -- same input always produces same output
8. Edge cases: empty arrays, missing states, states with 0% and 100% completeness

## Test ID Prefix
USE-
