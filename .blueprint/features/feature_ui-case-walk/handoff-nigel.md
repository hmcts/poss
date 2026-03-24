# Handoff: Nigel -> Codey

**Feature:** ui-case-walk (Simulation UI Logic)
**Date:** 2026-03-24

## What was done

Created test suite with 17 test cases covering all 7 exported functions. Tests use mock fixture data (5 states, 3 transitions, 3 events, 1 breathing space entry). Uses node:test runner.

## Test file

- `test/feature_ui-case-walk.test.js` — 17 tests across 7 describe blocks (prefix UCW-)

## For Codey

Implement `src/ui-case-walk/index.ts` exporting these 7 functions:
- `initializeSimulation(claimTypeId, states, transitions, events)` -> EnrichedSimulation
- `getAvailableActionsPanel(simulation, roleFilter?)` -> ActionsPanel
- `advanceSimulation(simulation | enriched, eventId)` -> EnrichedSimulation
- `getSimulationTimeline(simulation)` -> TimelineEntry[]
- `getSimulationStatus(simulation)` -> { status, message }
- `getRoleFilterOptions(events)` -> string[]
- `getBreathingSpaceInfo(simulation, breathingSpaceEntries)` -> BreathingSpaceInfo

Key implementation notes:
- Import from `../case-walk/index.ts` and `../uncertainty-display/index.ts`
- EnrichedSimulation = { simulation: Simulation, currentState: State, badge: CompletenessBadge }
- advanceSimulation accepts either EnrichedSimulation or raw Simulation (tests pass both)
- getAvailableActionsPanel enriches events with EventIndicator from uncertainty-display
- getRoleFilterOptions extracts roles where actors[role] === true, returns sorted unique array
- Timeline entries: { stateId, stateName, badge, stepNumber }

Run: `node --experimental-strip-types --test test/feature_ui-case-walk.test.js`

## Files

- `test/feature_ui-case-walk.test.js`
- `test/artifacts/feature_ui-case-walk/test-spec.md`
- `.blueprint/features/feature_ui-case-walk/handoff-nigel.md`
