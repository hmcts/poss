# Handoff: Alex -> Nigel

**Feature:** ui-case-walk (Simulation UI Logic)
**Date:** 2026-03-24

## What was done

Created FEATURE_SPEC.md defining the ui-case-walk module — a pure logic layer with 7 exported functions that wrap case-walk and uncertainty-display to produce UI-ready view-model objects. No DOM rendering; this is testable without a browser.

## Key decisions

1. Each function wraps one or more case-walk functions and enriches the output with uncertainty-display badges/indicators
2. initializeSimulation and advanceSimulation return the same EnrichedSimulation shape for consistency
3. getSimulationStatus uses a simple priority: isEndState -> completed, isDeadEnd -> dead-end, else -> active
4. getRoleFilterOptions extracts roles from actors maps where value is true, returns sorted unique list
5. getBreathingSpaceInfo uses presence of return states to determine isInBreathingSpace flag

## For Nigel

Write tests for the 7 exported functions in `src/ui-case-walk/index.ts`:
- `initializeSimulation`, `getAvailableActionsPanel`, `advanceSimulation`, `getSimulationTimeline`, `getSimulationStatus`, `getRoleFilterOptions`, `getBreathingSpaceInfo`

Test with fixture data (mock states, transitions, events) — same fixture pattern as case-walk tests. Use node:test runner. Prefix test IDs with UCW-.

## Files

- `.blueprint/features/feature_ui-case-walk/FEATURE_SPEC.md`
