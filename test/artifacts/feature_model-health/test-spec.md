# Test Spec: model-health

## Test File
`test/feature_model-health.test.js`

## Fixture Strategy
Create states with varying completeness (0, 25, 50, 75, 100), transitions forming both connected and disconnected graphs, and events with mixed open question flags.

## Test Groups

### 1. getOpenQuestionCount
- OQ-1: Returns 0 for empty array
- OQ-2: Returns 0 when no events have open questions
- OQ-3: Counts correctly when some events have open questions
- OQ-4: Counts correctly when all events have open questions

### 2. getLowCompletenessStates
- LC-1: Returns empty for empty states array
- LC-2: Default threshold (50) filters correctly
- LC-3: Custom threshold filters correctly
- LC-4: States at exactly threshold are NOT included (strictly below)
- LC-5: All states below threshold returns all

### 3. getUnreachableStates
- UR-1: Empty arrays return empty
- UR-2: State with incoming transition is reachable
- UR-3: State with no incoming transition and not isDraftLike is unreachable
- UR-4: isDraftLike state with no incoming transition is NOT unreachable (it's initial)
- UR-5: Multiple unreachable states detected

### 4. canReachEndState
- CR-1: Empty states returns false
- CR-2: Connected path from initial to end returns true
- CR-3: Disconnected graph returns false
- CR-4: No end state returns false
- CR-5: No initial state returns false
- CR-6: Multi-hop path works

### 5. getModelHealthSummary
- MS-1: Perfect model returns score 'good'
- MS-2: Model with no valid end path returns score 'poor'
- MS-3: Model with only open questions returns score 'fair'
- MS-4: Aggregates all sub-metrics correctly

### 6. Edge Cases
- EC-1: Single state, no transitions
