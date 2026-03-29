# Story 1: WA Task Checkboxes and Event Blocking Logic

## User Story

**As a** business analyst using the Digital Twin,
**I want** to toggle individual WA task checkboxes on or off,
**so that** I can model caseworker availability constraints and see which events become blocked when specific tasks are unavailable.

## Context / Scope

This story introduces per-task toggle state and the core blocking derivation logic. The Digital Twin already maintains an `enabledEvents: Set<string>` that feeds into `autoWalk`. This story adds a `disabledTasks: Set<string>` alongside it and computes an **effective** enabled event set by removing any event where ALL of its WA tasks are unchecked.

Key functions consumed (already exist, no modifications):
- `getTasksForEvent(eventName, mappings, tasks)` from `src/wa-task-engine/index.ts` -- resolves which WA tasks map to an event
- `getEventTaskCards(eventName, waTasks, waMappings)` from `src/ui-wa-tasks/digital-twin-helpers.ts` -- provides card data for rendering

The blocking derivation logic should be expressed as a **pure function** (or set of pure functions) that can be unit tested independently of React. Suggested signature:

```typescript
function computeEffectiveEnabledEvents(
  enabledEvents: Set<string>,
  disabledTasks: Set<string>,
  events: Array<{ id: string; name: string }>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
  showWaTasks: boolean,
): Set<string>
```

## Acceptance Criteria

### AC-1-1: Default task toggle state
**Given** a simulation is started and "Show WA Tasks" is on,
**When** `computeEffectiveEnabledEvents` is called with an empty `disabledTasks` set,
**Then** the returned set is identical to `enabledEvents` -- no events are blocked by task toggles.

### AC-1-2: All tasks unchecked blocks the event
**Given** an event "Respond to Claim" has two WA tasks (task-A, task-B) and both task IDs are in `disabledTasks`,
**When** `computeEffectiveEnabledEvents` is called,
**Then** the event ID for "Respond to Claim" is NOT in the returned set, even though it IS in `enabledEvents`.

### AC-1-3: At least one task checked keeps the event enabled
**Given** an event "Respond to Claim" has two WA tasks (task-A, task-B) and only task-A is in `disabledTasks`,
**When** `computeEffectiveEnabledEvents` is called,
**Then** the event ID for "Respond to Claim" IS in the returned set (because task-B is still active).

### AC-1-4: Events without WA tasks are unaffected
**Given** an event "Issue Claim" has no WA task mappings (i.e. `getTasksForEvent` returns an empty array),
**When** `computeEffectiveEnabledEvents` is called with any `disabledTasks` set,
**Then** the event ID for "Issue Claim" remains in the returned set if and only if it is in `enabledEvents`.

### AC-1-5: WA toggle off disengages task blocking
**Given** `showWaTasks` is false and some tasks are in `disabledTasks`,
**When** `computeEffectiveEnabledEvents` is called,
**Then** the returned set equals `enabledEvents` -- task toggles have no effect when the WA toggle is off.

### AC-1-6: Disabled task count computation
**Given** `disabledTasks` contains 3 task IDs,
**When** a function `getDisabledTaskCount(disabledTasks)` is called,
**Then** it returns 3. When `showWaTasks` is false or `disabledTasks` is empty, the count is 0 (indicator should not display).

### AC-1-7: Reset clears all task toggles
**Given** `disabledTasks` contains multiple task IDs,
**When** the reset handler is invoked,
**Then** `disabledTasks` is set to an empty `Set<string>`.

## Dependencies

- `src/wa-task-engine/index.ts` -- `getTasksForEvent` (existing, no changes)
- `src/ui-wa-tasks/digital-twin-helpers.ts` -- `getEventTaskCards` (existing, no changes)
- `app/digital-twin/page.tsx` -- existing `autoWalk` function and `enabledEvents` state

## Out of Scope

- Visual styling of disabled/enabled transitions (Story 2)
- Parent event override behaviour (Story 2)
- Auto-walk recalculation verification across claim types (Story 3)
- Persisting toggle state across page navigation
- Modifications to `wa-task-engine` or `ui-wa-tasks` modules
