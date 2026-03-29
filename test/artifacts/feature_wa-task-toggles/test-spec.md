# Test Spec — wa-task-toggles

## Understanding

This feature adds per-WA-task toggle checkboxes to the Digital Twin. The core logic is a set of pure functions that compute an effective enabled-event set by combining event-level toggles (`enabledEvents`) with task-level toggles (`disabledTasks`). An event with WA task mappings is blocked only when ALL its tasks are unchecked. Events without WA mappings pass through unaffected. The `showWaTasks` flag acts as a master switch -- when off, task blocking is fully disengaged. Additional helpers derive UI state: checkbox interactivity, blocked-reason metadata, and effective disabled counts.

## AC to Test ID Mapping

| AC | Test ID | Description |
|----|---------|-------------|
| AC-1-1 | T-1-1 | Empty disabledTasks returns enabledEvents unchanged |
| AC-1-2 | T-1-2 | All tasks unchecked blocks the event |
| AC-1-3 | T-1-3 | At least one task checked keeps event enabled |
| AC-1-4 | T-1-4 | Events without WA tasks unaffected |
| AC-1-5 | T-1-5 | showWaTasks=false disengages task blocking |
| AC-1-6 | T-1-6 | getDisabledTaskCount returns correct count |
| AC-1-7 | T-1-7 | Reset (empty set) clears all task toggles |
| AC-2-1 | T-2-1 | Parent event disabled makes task checkbox non-interactive |
| AC-2-2 | T-2-2 | Parent event enabled makes task checkbox interactive |
| AC-2-3a | T-2-3a | getEventBlockedReason returns 'event-disabled' |
| AC-2-3b | T-2-3b | getEventBlockedReason returns 'all-tasks-disabled' |
| AC-2-3c | T-2-3c | getEventBlockedReason returns null (not blocked) |
| AC-2-4 | T-2-4 | Task toggle state preserved through parent disable/re-enable |
| AC-2-5 | T-2-5 | Effective disabled count includes both levels |
| AC-2-6 | T-2-6 | Effective disabled count ignores tasks when WA off |
| AC-3-1 | T-3-1 | Single-task event blocks immediately |
| AC-3-2 | T-3-2 | WA toggle off/on preserves disabledTasks |
| AC-3-3 | T-3-3 | Re-checking a task restores the event |
| AC-3-4 | T-3-4 | Reset clears all and restores full set |
| AC-3-5 | T-3-5 | Task and event toggles are independent |
| AC-3-6 | T-3-6 | Mixed events -- unmapped pass through regardless |

## Key Assumptions

- `computeEffectiveEnabledEvents` will be exported from `src/ui-wa-tasks/digital-twin-helpers.ts` (and the `.js` bridge)
- Helper functions `isEventBlockedByTasks`, `getDisabledTaskCount`, `getTaskToggleState`, `getEventBlockedReason`, `getEffectiveDisabledCount` will also be exported
- `getTasksForEvent` from `wa-task-engine` is consumed internally; tests exercise it indirectly through the new functions
- Real data from `data/wa-tasks.json` and `data/wa-mappings.json` is used for realistic assertions
- Tests are pure-function tests; no DOM, React, or browser required
