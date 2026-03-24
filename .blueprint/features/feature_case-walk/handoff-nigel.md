# Handoff: Nigel -> Codey

**Feature:** case-walk (Simulation Engine)
**Date:** 2026-03-24

## What was done

Created test suite with 15 test cases covering all 8 exported functions. Tests use mock fixture data (3 states, 2 transitions, 3 events, 1 breathing space entry). Uses node:test runner, under 200 lines.

## Test file

- `test/feature_case-walk.test.js` — 15 tests across 8 describe blocks

## For Codey

Implement `src/case-walk/index.ts` exporting these 8 functions:
- `createSimulation(claimTypeId, states, transitions, events)` -> Simulation
- `getAvailableEvents(simulation)` -> Event[]
- `applyEvent(simulation, eventId)` -> Simulation
- `isDeadEnd(simulation)` -> boolean
- `isEndState(simulation)` -> boolean
- `getHistory(simulation)` -> { stateId, stateName }[]
- `filterEventsByRole(events, role)` -> Event[]
- `getReturnStates(simulation, breathingSpaceEntries)` -> State[]

Key implementation notes:
- Simulation is immutable (spread + new history array)
- Initial state: find state where `isDraftLike === true` with no incoming transitions
- `applyEvent` must find a transition from current state where the event's state matches; the transition's `to` becomes the new state
- `isDeadEnd`: no available events AND current state `isEndState === false`
- Tests import from `../src/case-walk/index.js` (JS extension for strip-types)

Run: `node --experimental-strip-types --test test/feature_case-walk.test.js`

## Files

- `test/feature_case-walk.test.js`
- `test/artifacts/feature_case-walk/test-spec.md`
- `.blueprint/features/feature_case-walk/handoff-nigel.md`
