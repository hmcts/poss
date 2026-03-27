# Test Spec -- react-wa-state-overlay (Helper Functions)

## Scope

Tests target pure helper functions in `src/ui-wa-tasks/state-overlay-helpers.js` that supply all display logic for the WA State Explorer overlay and Event Matrix overlay. No React/DOM testing.

## Functions under test

| Function | Purpose |
|----------|---------|
| `getNodeWaBadge(stateId, events, waTasks, waMappings)` | Returns `{ label, colour }` for a graph node badge, or null if no WA tasks |
| `getStateDetailWaTasks(stateId, events, waTasks, waMappings)` | Returns array of task detail objects `{ taskName, alignment, badge, tooltip }` for the state detail panel |
| `getEventMatrixWaColumn(eventName, waTasks, waMappings)` | Returns `{ taskName, alignment, colourDot }` for the first matching task, or null |
| `getWaTaskFilterOptions(waTasks)` | Returns array of filter option objects `{ value, label }` including special entries |
| `filterEventsByWaTask(events, waTaskFilter, waTasks, waMappings)` | Filters events by WA task association using filter value |

## AC-to-Test Mapping

| Story | AC | Test ID | Scenario |
|-------|-----|---------|----------|
| state-explorer | AC-1 | T-1.1 | `getNodeWaBadge` returns badge with task count for state with WA tasks |
| state-explorer | AC-1 | T-1.2 | Badge label uses correct plural/singular ("N tasks" / "1 task") |
| state-explorer | AC-2 | T-1.3 | Badge colour is red when any gap task exists |
| state-explorer | AC-2 | T-1.4 | Badge colour is amber when partial but no gap |
| state-explorer | AC-2 | T-1.5 | Badge colour is green when all aligned |
| state-explorer | AC-3 | T-1.6 | `getNodeWaBadge` returns null for state with no WA tasks |
| state-explorer | AC-4 | T-2.1 | `getStateDetailWaTasks` returns task objects with name, alignment, badge for state with tasks |
| state-explorer | AC-4 | T-2.2 | Each task object has a badge with label and colour |
| state-explorer | AC-4 | T-2.3 | Each task object has a tooltip string |
| state-explorer | AC-5 | T-2.4 | `getStateDetailWaTasks` returns empty array for state with no WA tasks |
| event-matrix | AC-1 | T-3.1 | `getEventMatrixWaColumn` returns task name and colour dot for mapped event |
| event-matrix | AC-1 | T-3.2 | Colour dot matches alignment (green/amber/red) |
| event-matrix | AC-2 | T-3.3 | `getEventMatrixWaColumn` returns null for unmapped event |
| event-matrix | AC-3 | T-4.1 | `getWaTaskFilterOptions` returns options including all unique task names |
| event-matrix | AC-3 | T-4.2 | Options include "No WA Task" and "WA Gaps" special entries |
| event-matrix | AC-4 | T-5.1 | `filterEventsByWaTask` with task name returns only events mapped to that task |
| event-matrix | AC-5 | T-5.2 | `filterEventsByWaTask` with `__none__` returns only unmapped events |
| event-matrix | AC-6 | T-5.3 | `filterEventsByWaTask` with `__gaps__` returns only events with gap-aligned tasks |
| event-matrix | AC-4 | T-5.4 | `filterEventsByWaTask` with empty string returns all events (no filter) |

## Data sources

- `data/wa-tasks.json` -- 17 WA tasks with alignment status
- `data/wa-mappings.json` -- 17 mappings linking tasks to event names

## Test runner

```bash
node --test test/feature_react-wa-state-overlay.test.js
```
