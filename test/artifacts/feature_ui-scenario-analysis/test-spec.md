# Test Spec: ui-scenario-analysis

## Test IDs and Coverage

| ID | Function | Description |
|----|----------|-------------|
| USA-01 | getToggleableStates | Returns correct shape with id, label, isToggled for each state |
| USA-02 | getToggleableStates | Preserves input ordering |
| USA-03 | getToggleableStates | Returns empty array for empty input |
| USA-04 | getToggleableRoles | Returns correct shape for each role |
| USA-05 | getToggleableRoles | Returns empty array for empty input |
| USA-06 | getToggleableEvents | Returns correct shape with id, label, state, isToggled |
| USA-07 | getToggleableEvents | Preserves input ordering |
| USA-08 | applyToggles | Removes toggled states and their transitions/events |
| USA-09 | applyToggles | Removes events when sole-performer role is toggled |
| USA-10 | applyToggles | Removes toggled events directly |
| USA-11 | applyToggles | Returns unmodified data when no toggles applied |
| USA-12 | getImpactSummary | Returns correct micro count and items |
| USA-13 | getImpactSummary | Returns correct meso count and items |
| USA-14 | getImpactSummary | Returns correct macro count, items, and canReachEnd |
| USA-15 | getImpactSummary | Returns summary string |
| USA-16 | getImpactHighlights | Maps removed states to 'removed' |
| USA-17 | getImpactHighlights | Maps unreachable states to 'unreachable' |
| USA-18 | getImpactHighlights | Maps unaffected states to 'normal' |
| USA-19 | createEmptyToggleState | Returns empty arrays for all three fields |
