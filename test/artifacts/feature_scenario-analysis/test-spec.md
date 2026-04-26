# Test Spec: scenario-analysis

## Test Strategy
Unit tests for all 7 exported functions using node:test with fixtures.

## Fixtures
- Linear chain: s1 -> s2 -> s3 (s1 initial/draft, s3 end)
- Branching: s2 -> s3 (end) and s2 -> s4 (alternate)
- Orphan state s5 with no transitions
- Events with various actor combinations (sole performer, multi-performer)

## Test Cases
- SA-01: toggleState removes state and its transitions
- SA-02: toggleState removes events in toggled state
- SA-03: toggleRole removes sole-performer events for that role
- SA-04: toggleRole keeps multi-performer events
- SA-05: toggleEvent removes specific event
- SA-06: toggleEvent with non-existent ID returns same events
- SA-07: findUnreachableStates finds disconnected states
- SA-08: findUnreachableStates returns empty when all reachable
- SA-09: findBlockedEvents finds events in missing states
- SA-10: findBlockedEvents returns empty when all states present
- SA-11: canReachEndState true for connected graph
- SA-12: canReachEndState false when path to end severed
- SA-13: canReachEndState false for empty model
- SA-14: analyzeImpact computes all three levels
- SA-15: analyzeImpact with no toggles returns clean result
- SA-16: analyzeImpact summary string format
- SA-17: toggleState on initial state makes all states unreachable
- SA-18: toggleRole with role that has no sole events changes nothing
