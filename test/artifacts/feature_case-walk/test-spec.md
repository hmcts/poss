# Test Spec: case-walk (Simulation Engine)

## Test Strategy

Unit tests for the case-walk simulation engine using mock fixture data. All tests use the node:test runner with node:assert/strict.

## Fixtures

Mock data representing a minimal claim type with 3 states, 2 transitions, and 3 events, plus breathing space entries.

## Test Cases

| ID | Function | Scenario | Expected |
|----|----------|----------|----------|
| CW-01 | createSimulation | Valid claim type and data | Simulation with currentStateId = initial state, history length 1 |
| CW-02 | getAvailableEvents | Current state has events | Returns matching events for state and claim type |
| CW-03 | getAvailableEvents | End state with no events | Returns empty array |
| CW-04 | applyEvent | Valid event ID | Returns new simulation with updated state and history |
| CW-05 | applyEvent | Invalid event ID | Throws error |
| CW-06 | isDeadEnd | State with no events, not end state | Returns true |
| CW-07 | isDeadEnd | End state with no events | Returns false |
| CW-08 | isDeadEnd | State with available events | Returns false |
| CW-09 | isEndState | End state | Returns true |
| CW-10 | isEndState | Non-end state | Returns false |
| CW-11 | getHistory | After multiple transitions | Returns ordered array of all visited states |
| CW-12 | filterEventsByRole | Role with matching events | Returns filtered subset |
| CW-13 | filterEventsByRole | Role with no events | Returns empty array |
| CW-14 | getReturnStates | Breathing space entry exists | Returns matching return states |
| CW-15 | getReturnStates | No breathing space entry | Returns empty array |
