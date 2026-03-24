# Handoff: Alex -> Nigel

**Feature:** case-walk (Simulation Engine)
**Date:** 2026-03-24

## What was done

Created FEATURE_SPEC.md defining the case-walk simulation engine — a pure logic layer with 8 exported functions for step-through case simulation. No UI components; this is the testable engine only.

## Key decisions

1. Simulation objects are immutable — each operation returns a new object
2. Initial state is determined by finding a draft-like state with no incoming transitions
3. Dead-end = no available events AND not an end state
4. Breathing space handling uses the existing BreathingSpaceEntry schema from data-model
5. Event filtering by role uses the actors map on each Event

## For Nigel

Write tests for the 8 exported functions in `src/case-walk/index.ts`:
- `createSimulation`, `getAvailableEvents`, `applyEvent`, `isDeadEnd`, `isEndState`, `getHistory`, `filterEventsByRole`, `getReturnStates`

Test with fixture data (mock states, transitions, events) — do not depend on real JSON data files. Use node:test runner. Keep under 200 lines.

## Files

- `.blueprint/features/feature_case-walk/FEATURE_SPEC.md`
