# Handoff -- react-wa-state-overlay

**From:** Alex (System Spec Agent)
**To:** Cass (BA Agent)
**Date:** 2026-03-27

## What this feature does
Adds WA task indicators to two existing views: State Explorer and Event Matrix. State Explorer graph nodes gain a small count badge ("3 tasks") coloured by worst alignment. The state detail panel gains a "Work Allocation Tasks" section listing tasks with badges. Event Matrix gains a "WA Task" column showing task name with colour dot, and a filter dropdown to filter by WA task name or special categories (no task, gaps).

## Key dependencies
- **ui-wa-tasks** provides `getWaTaskBadge`, `getStateWaTaskCount`, `prepareWaTaskPanel`, `enrichEventWithWaTask`
- **wa-task-engine** provides `getTasksForEvent`, `getTasksForState`
- **data/wa-tasks.json** and **data/wa-mappings.json** provide static WA data
- **app/state-explorer/page.tsx** and **app/event-matrix/page.tsx** are the components being extended

## Helper function layer
New file `src/ui-wa-tasks/state-overlay-helpers.ts` with pure functions:
- `getNodeWaBadge(stateId, events, waTasks, waMappings)` -- badge { label, colour } for graph node
- `getStateDetailWaTasks(stateId, events, waTasks, waMappings)` -- array of task detail objects for panel
- `getEventMatrixWaColumn(eventName, waTasks, waMappings)` -- { taskName, alignment, colourDot } or null
- `getWaTaskFilterOptions(waTasks)` -- array of filter option objects
- `filterEventsByWaTask(events, waTaskFilter, waTasks, waMappings)` -- filter events by WA task association

## Watch points for stories
1. Node badge colour uses worst-alignment rule: gap > partial > aligned
2. Filter dropdown has special tokens `__none__` and `__gaps__` for "no WA task" and "gap alignment" categories
3. When WA data is empty, no WA UI elements should render
4. Event Matrix WA column shows first matching task only; full list is in State Explorer detail panel
