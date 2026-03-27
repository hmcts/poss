# Handoff -- react-wa-dashboard

**From:** Nigel (Tester Agent)
**To:** Codey (Developer)
**Date:** 2026-03-27

## Test artefacts

- **Test spec:** `test/artifacts/feature_react-wa-dashboard/test-spec.md`
- **Test file:** `test/feature_react-wa-dashboard.test.js`

## What to implement

Create `src/ui-wa-tasks/dashboard-helpers.ts` exporting 7 pure functions:

| Function | Purpose |
|----------|---------|
| `getDashboardSummary(waTasks, waMappings)` | Returns `{ total, aligned, partial, gap, alignedPct, partialPct, gapPct }` |
| `getAlignedTaskRows(waTasks, waMappings)` | Returns array of row objects for aligned table with taskName, triggerDescription, matchedEvents, alignment, badge |
| `getPartialTaskRows(waTasks, waMappings)` | Returns array of row objects with taskName, triggerDescription, matchedEvents, missing, alignment, badge |
| `getGapTaskRows(waTasks, waMappings)` | Returns array of row objects with taskName, triggerDescription, matchedEvents (empty), recommendation, alignment, badge |
| `groupTasksByState(waTasks, waMappings, events)` | Returns object `{ [stateId]: WaTask[] }` -- tasks deduplicated per state |
| `groupTasksByContext(waTasks)` | Returns object `{ [context]: WaTask[] }` |
| `exportAlignmentCsv(waTasks, waMappings)` | Returns CSV string with header: Task Name,Trigger,Alignment,Matched Events,Alignment Notes |

Create `src/ui-wa-tasks/dashboard-helpers.js` bridge file re-exporting from `.ts`.

## Key contract notes

- Delegate to `getAlignmentSummary` from wa-task-engine for counts; compute percentages locally.
- Badge data from `getWaTaskBadge` in ui-wa-tasks/index.ts.
- Matched events come from `WaTaskMapping.eventIds` for each task.
- CSV: semicolons separate multiple events; fields with commas are double-quote-wrapped per RFC 4180.
- `groupTasksByState` accepts events as `Array<{ state: string; name: string }>` and must deduplicate tasks per state.
- `groupTasksByContext` returns empty object for empty input (not an object with empty arrays).
- 27 tests covering all 3 stories and 17 ACs.

## Run tests

```bash
node --test test/feature_react-wa-dashboard.test.js
```
