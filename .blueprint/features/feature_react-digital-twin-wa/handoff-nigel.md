# Handoff -- react-digital-twin-wa

**From:** Nigel (Tester Agent)
**To:** Codey (Developer)
**Date:** 2026-03-27

## Test artefacts

- **Test spec:** `test/artifacts/feature_react-digital-twin-wa/test-spec.md`
- **Test file:** `test/feature_react-digital-twin-wa.test.js`

## What to implement

Create `src/ui-wa-tasks/digital-twin-helpers.js` exporting 6 pure functions:

| Function | Purpose |
|----------|---------|
| `shouldShowWaToggle(waTasks, waMappings)` | Returns boolean; true only when both arrays are non-null and non-empty |
| `getEventTaskCards(eventName, waTasks, waMappings)` | Returns array of card objects with collapsed fields (taskName, badge) and expanded fields (triggerDescription, notes, context) |
| `getTimelineChips(eventName, waTasks, waMappings)` | Returns array of chip objects { taskName, alignment, colour } |
| `getAlignmentWarning(eventName, waTasks, waMappings)` | Returns { type: 'partial', message } if any mapped task is partial; null otherwise |
| `isPaymentRelatedState(technicalName)` | Returns true if name contains PAYMENT (case-insensitive) or equals PENDING_CASE_ISSUED |
| `getEmptyStateMessage(stateId, events, waTasks, waMappings)` | Returns "No caseworker tasks at this state" when no events at state trigger WA tasks and data is available; null otherwise |

## Key contract notes

- Delegate to existing `wa-task-engine` (`getTasksForEvent`, `getEventWaContext`) and `ui-wa-tasks` (`getWaTaskBadge`) -- do not duplicate logic.
- `getEmptyStateMessage` must return null (not the message) when data arrays are empty, to support graceful degradation (Story 4 AC-4/5).
- `isPaymentRelatedState` must handle null/undefined safely and match PAYMENT case-insensitively.
- 23 tests cover all 4 stories and 24 ACs. AC-7 (keyboard a11y) and toggle/auto-walk rendering ACs are UI-only and excluded.

## Run tests

```bash
node --test test/feature_react-digital-twin-wa.test.js
```
