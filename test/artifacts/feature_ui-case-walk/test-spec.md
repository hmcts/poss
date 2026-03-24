# Test Spec: UI Case Walk

**Feature:** ui-case-walk
**Test prefix:** UCW-
**Runner:** node:test with --experimental-strip-types

## Test Cases

### initializeSimulation (3 tests)
- UCW-01: Returns enriched simulation with currentState object
- UCW-02: Returns completeness badge for initial state
- UCW-03: Underlying simulation has correct claimTypeId and currentStateId

### getAvailableActionsPanel (3 tests)
- UCW-04: Returns enriched events with event indicators
- UCW-05: Filters events by role when roleFilter provided
- UCW-06: Returns hasDeadEnd and hasEndState flags correctly

### advanceSimulation (2 tests)
- UCW-07: Transitions to next state and returns enriched simulation
- UCW-08: New enriched simulation has updated badge for new current state

### getSimulationTimeline (2 tests)
- UCW-09: Returns timeline entries with step numbers starting at 1
- UCW-10: Each timeline entry has a completeness badge

### getSimulationStatus (3 tests)
- UCW-11: Returns 'active' for simulation with available events
- UCW-12: Returns 'dead-end' for stuck simulation
- UCW-13: Returns 'completed' for end state simulation

### getRoleFilterOptions (2 tests)
- UCW-14: Extracts unique roles sorted alphabetically
- UCW-15: Returns empty array when no actors have true values

### getBreathingSpaceInfo (2 tests)
- UCW-16: Detects breathing space with return states
- UCW-17: Returns isInBreathingSpace false when not in breathing space

Total: 17 tests
