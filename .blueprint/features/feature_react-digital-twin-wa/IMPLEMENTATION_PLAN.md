# Implementation Plan -- react-digital-twin-wa

## Overview

Create 6 pure helper functions in `src/ui-wa-tasks/digital-twin-helpers.ts` that compose existing `wa-task-engine` and `ui-wa-tasks` functions to supply display logic for the Digital Twin WA overlay. Then update `app/digital-twin/page.tsx` to integrate WA task display.

## Files to Create

### 1. `src/ui-wa-tasks/digital-twin-helpers.ts` (source)

Six exported functions, all pure, delegating to upstream modules:

| Function | Delegates to | Logic |
|----------|-------------|-------|
| `shouldShowWaToggle(waTasks, waMappings)` | None (simple null/length check) | Return true only when both arrays are non-null and have length > 0 |
| `getEventTaskCards(eventName, waTasks, waMappings)` | `getTasksForEvent` (wa-task-engine), `getWaTaskBadge` (ui-wa-tasks) | For each task returned by getTasksForEvent, build a card object with collapsed fields (taskName, badge) and expanded fields (triggerDescription, notes from mapping, context from task.taskContext) |
| `getTimelineChips(eventName, waTasks, waMappings)` | `getTasksForEvent` (wa-task-engine), `getWaTaskBadge` (ui-wa-tasks) | For each task, return { taskName, alignment, colour } where colour comes from getWaTaskBadge |
| `getAlignmentWarning(eventName, waTasks, waMappings)` | `getTasksForEvent` (wa-task-engine) | If any matched task has alignment === 'partial', return { type: 'partial', message } with a descriptive message; otherwise null |
| `isPaymentRelatedState(technicalName)` | None | Return true if technicalName contains 'PAYMENT' (case-insensitive) OR equals 'PENDING_CASE_ISSUED'; handle null/undefined/empty safely |
| `getEmptyStateMessage(stateId, events, waTasks, waMappings)` | `getTasksForEvent` (wa-task-engine) | If data arrays are empty, return null (graceful degradation). Otherwise check if any event at the state triggers WA tasks; if none do, return the message string |

### 2. `src/ui-wa-tasks/digital-twin-helpers.js` (bridge)

Re-export all 6 functions from the .ts source, following the same pattern as `src/ui-wa-tasks/index.js`.

### 3. `app/digital-twin/page.tsx` (modify)

- Import helper functions and wa data (JSON)
- Add `showWaTasks` toggle state (default false)
- When toggle is on: show task cards under events, chips on timeline entries, alignment warnings
- Use `shouldShowWaToggle` to control toggle visibility
- Use `getEventTaskCards` for card rendering beneath events
- Use `getTimelineChips` for timeline chip display
- Use `getAlignmentWarning` for partial alignment amber info boxes
- Use `isPaymentRelatedState` for gap banner at payment states
- Use `getEmptyStateMessage` for info note at task-free states

## Implementation Order

1. Create `digital-twin-helpers.ts` with all 6 functions
2. Create `digital-twin-helpers.js` bridge
3. Run tests, iterate until all 23 tests pass
4. Update `app/digital-twin/page.tsx` with WA integration

## Test Command

```bash
node --test test/feature_react-digital-twin-wa.test.js
```
