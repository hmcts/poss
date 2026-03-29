# Story 3: Auto-Walk Recalculation, Reset, and Toggle Interaction

## User Story

**As a** business analyst using the Digital Twin,
**I want** the auto-walk path and reachable terminal state to update immediately when I toggle WA tasks, and for all toggles to reset cleanly,
**so that** I can explore caseworker availability scenarios across different claim types and trust that the simulation reflects my current toggle choices.

## Context / Scope

This story verifies the end-to-end integration: task toggle changes flow through `computeEffectiveEnabledEvents` (Story 1) into the existing `autoWalk` function, which recalculates the reachable path. It also covers edge cases such as single-task events, the WA toggle on/off interaction, and the reset flow.

The key integration point is that `autoWalk` already accepts `enabledIds: Set<string>`. The effective set produced by `computeEffectiveEnabledEvents` is passed directly to `autoWalk`. This story validates that the derivation chain works correctly across representative scenarios.

Test approach: call `computeEffectiveEnabledEvents` with various toggle combinations and verify the resulting set, then (where feasible) call `autoWalk` with that set and confirm the simulation terminates differently.

## Acceptance Criteria

### AC-3-1: Single-task event -- unchecking immediately blocks
**Given** an event has exactly one WA task mapping,
**When** that single task ID is added to `disabledTasks`,
**Then** `computeEffectiveEnabledEvents` removes that event from the effective set.

### AC-3-2: Toggling WA tasks off reverts to event-level-only blocking
**Given** some tasks are in `disabledTasks` causing one event to be blocked,
**When** `showWaTasks` is set to false,
**Then** `computeEffectiveEnabledEvents` returns a set equal to `enabledEvents` (task blocking fully disengaged). When `showWaTasks` is set back to true, the `disabledTasks` set is still intact and the event is blocked again.

### AC-3-3: Re-checking a task restores the event
**Given** an event has two WA tasks and both are in `disabledTasks` (event is blocked),
**When** one task ID is removed from `disabledTasks`,
**Then** `computeEffectiveEnabledEvents` includes that event in the effective set again.

### AC-3-4: Reset clears task toggles and restores all events
**Given** `disabledTasks` contains several task IDs causing multiple events to be blocked,
**When** the reset handler sets `disabledTasks` to an empty set and `enabledEvents` to all event IDs,
**Then** `computeEffectiveEnabledEvents` returns the full set of all event IDs.

### AC-3-5: Task toggles and event toggles are independent
**Given** an event has WA tasks and is enabled at event level, and one task is unchecked,
**When** the event is disabled via event-level toggle then re-enabled,
**Then** the task remains unchecked (its ID is still in `disabledTasks`), and if that was the only task, the event is still blocked by the task toggle.

### AC-3-6: Events with no WA tasks pass through regardless of disabledTasks content
**Given** a mix of events -- some with WA task mappings, some without,
**When** `computeEffectiveEnabledEvents` is called with arbitrary `disabledTasks`,
**Then** events without WA task mappings are in the result set if and only if they are in `enabledEvents`, regardless of `disabledTasks` content.

## Dependencies

- Story 1 (`computeEffectiveEnabledEvents` function)
- Story 2 (visual state derivation -- not required for this story's tests but contextually related)
- `src/wa-task-engine/index.ts` -- `getTasksForEvent` (existing)
- `src/ui-case-walk/index.ts` -- `initializeSimulation`, `advanceSimulation`, etc. (existing, for integration-level tests)
- `app/digital-twin/page.tsx` -- `autoWalk` function (existing)

## Out of Scope

- Keyboard accessibility testing (requires DOM, out of scope for logic-layer tests)
- CSS/visual transition verification
- Performance testing across all seven claim types (manual verification)
- Persisting toggle state across navigation
