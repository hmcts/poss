# Story 2: Parent Event Override, Disabled States, and Summary Indicator

## User Story

**As a** business analyst using the Digital Twin,
**I want** task checkboxes to be greyed out when their parent event is disabled, and to see clear visual feedback when task toggles cause an event to become blocked,
**so that** I can understand the interaction between event-level and task-level controls and quickly spot which events are affected by my task choices.

## Context / Scope

This story covers the interaction logic between the existing event-level toggles and the new task-level toggles, plus the derivation of visual/state metadata that the React layer will consume. The logic functions determine: (a) whether a task checkbox should be interactive or disabled, (b) whether an event is blocked due to task toggles vs event-level toggle, and (c) the correct disabled-events count that accounts for both levels.

These should be expressed as pure functions testable without DOM/React. Suggested signatures:

```typescript
function isTaskCheckboxDisabled(
  eventId: string,
  enabledEvents: Set<string>,
): boolean

function getEventBlockedReason(
  eventId: string,
  eventName: string,
  enabledEvents: Set<string>,
  disabledTasks: Set<string>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
): 'event-disabled' | 'all-tasks-disabled' | null

function getEffectiveDisabledCount(
  enabledEvents: Set<string>,
  disabledTasks: Set<string>,
  allEvents: Array<{ id: string; name: string }>,
  waTasks: WaTask[],
  waMappings: WaTaskMapping[],
  showWaTasks: boolean,
): number
```

## Acceptance Criteria

### AC-2-1: Parent event disabled makes task checkboxes non-interactive
**Given** an event "Respond to Claim" is NOT in `enabledEvents` (event-level checkbox is off),
**When** `isTaskCheckboxDisabled(eventId, enabledEvents)` is called,
**Then** it returns `true` -- the task checkboxes beneath this event should be greyed out and non-interactive.

### AC-2-2: Parent event enabled makes task checkboxes interactive
**Given** an event "Respond to Claim" IS in `enabledEvents`,
**When** `isTaskCheckboxDisabled(eventId, enabledEvents)` is called,
**Then** it returns `false` -- the task checkboxes are interactive.

### AC-2-3: Event blocked reason distinguishes event-level from task-level
**Given** an event is NOT in `enabledEvents`,
**When** `getEventBlockedReason` is called,
**Then** it returns `'event-disabled'`.

**Given** an event IS in `enabledEvents` but all its WA tasks are in `disabledTasks`,
**When** `getEventBlockedReason` is called,
**Then** it returns `'all-tasks-disabled'`.

**Given** an event IS in `enabledEvents` and at least one WA task is active,
**When** `getEventBlockedReason` is called,
**Then** it returns `null` (event is not blocked).

### AC-2-4: Task toggle state preserved through parent event disable/re-enable
**Given** a task was unchecked (its ID is in `disabledTasks`), then the parent event is disabled via event-level toggle,
**When** the parent event is re-enabled,
**Then** the task ID remains in `disabledTasks` -- the previous unchecked state is preserved, not reset.

### AC-2-5: Effective disabled count includes both event-level and task-blocked events
**Given** 2 events are disabled via event-level toggles and 1 additional event is blocked because all its tasks are unchecked,
**When** `getEffectiveDisabledCount` is called with `showWaTasks` true,
**Then** it returns 3.

### AC-2-6: Effective disabled count ignores task blocking when WA toggle is off
**Given** 2 events are disabled via event-level toggles and 1 event has all tasks unchecked, but `showWaTasks` is false,
**When** `getEffectiveDisabledCount` is called,
**Then** it returns 2 (task-level blocking is disengaged).

## Dependencies

- Story 1 (task toggle state and `computeEffectiveEnabledEvents`)
- `src/wa-task-engine/index.ts` -- `getTasksForEvent` (existing)
- `app/digital-twin/page.tsx` -- existing `enabledEvents` state and event-level toggle handler

## Out of Scope

- CSS transitions and animation specifics (React rendering concern)
- Task checkbox rendering and DOM structure
- Auto-walk recalculation (covered by Story 1 via `computeEffectiveEnabledEvents`)
- Cross-claim-type verification (Story 3)
