# Test Spec: ui-model-health

## Test IDs: UMH-1 through UMH-18

### getHealthSummaryCard
- UMH-1: Returns correct shape with all expected keys
- UMH-2: Good score when all healthy (no open questions, all complete, all reachable, valid end path)
- UMH-3: Poor score when unreachable states exist
- UMH-4: Fair score when open questions exist but no structural problems

### getOpenQuestionsList
- UMH-5: Filters to only events with open questions
- UMH-6: Returns count matching filtered events length
- UMH-7: Empty events returns count 0 and empty array
- UMH-8: Each returned event has id, name, state, notes

### getLowCompletenessPanel
- UMH-9: Default threshold of 50 filters correctly
- UMH-10: Custom threshold filters correctly
- UMH-11: Empty states returns empty array
- UMH-12: Each state entry has id, label, completeness, level, color

### getUnreachableStatesPanel
- UMH-13: Returns unreachable non-draft states
- UMH-14: Empty result when all states are reachable

### getEndStateReachability
- UMH-15: Returns entry per claim type in map
- UMH-16: Correct icon for reachable vs unreachable claim types
- UMH-17: Empty map returns empty array

### getOverallHealthColor
- UMH-18: Returns correct colour objects for good, fair, poor
