# Handoff -- react-wa-state-overlay

**From:** Nigel (Tester Agent)
**To:** Codey (Developer)
**Date:** 2026-03-27

## Test artefacts

- **Test spec:** `test/artifacts/feature_react-wa-state-overlay/test-spec.md`
- **Test file:** `test/feature_react-wa-state-overlay.test.js`

## What to implement

Create `src/ui-wa-tasks/state-overlay-helpers.ts` (and `.js` bridge) exporting 5 pure functions:

| Function | Purpose |
|----------|---------|
| `getNodeWaBadge(stateId, events, waTasks, waMappings)` | Returns `{ label, colour }` for graph node badge, or null if no WA tasks. Label is "N tasks"/"1 task". Colour: red if any gap, amber if any partial, green if all aligned. |
| `getStateDetailWaTasks(stateId, events, waTasks, waMappings)` | Returns array of `{ taskName, alignment, badge, tooltip }` objects for the state detail panel. |
| `getEventMatrixWaColumn(eventName, waTasks, waMappings)` | Returns `{ taskName, alignment, colourDot }` for first matching task, or null if no mapping. |
| `getWaTaskFilterOptions(waTasks)` | Returns array of `{ value, label }` including 17 task names + `{ value: '__none__', label: 'No WA Task' }` + `{ value: '__gaps__', label: 'WA Gaps' }`. |
| `filterEventsByWaTask(events, waTaskFilter, waTasks, waMappings)` | Filters events: empty string = all, task name = exact match, `__none__` = no mapping, `__gaps__` = gap alignment. |

## Key contract notes

- Delegate to `getTasksForState`, `getTasksForEvent`, `getAlignmentSummary`, `getWaTaskBadge`, `getWaTaskTooltip` from upstream modules -- do not duplicate logic.
- `getNodeWaBadge` must return null (not an object with count 0) when no WA tasks exist at the state.
- Colour constants: green `#22C55E`, amber `#F59E0B`, red `#EF4444`.
- 19 tests across 5 describe blocks. All test pure functions with real WA data from JSON files.

## Run tests

```bash
node --test test/feature_react-wa-state-overlay.test.js
```
