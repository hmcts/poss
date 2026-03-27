# Handoff -- react-wa-dashboard

**From:** Alex (System Spec Agent)
**To:** Cass (BA Agent)
**Date:** 2026-03-27

## What this feature does
Dedicated Work Allocation alignment dashboard at `/work-allocation`. Shows summary cards (17 total: 7 aligned, 9 partial, 1 gap) with a percentage bar, three alignment tables (aligned/partial/gap), "By State" and "By Context" grouping views, cross-links to State Explorer/Event Matrix, and CSV export.

## Key dependencies
- **wa-task-engine** provides `getAlignmentSummary`, `getUnmappedTasks`, `getPartialTasks`, `filterTasksByContext`, `getTasksForState`
- **ui-wa-tasks** provides `getWaTaskBadge`, `getWaTaskTooltip`
- **app-shell** ROUTES array needs extending with `/work-allocation`
- Data: `data/wa-tasks.json` (17 tasks), `data/wa-mappings.json` (17 mappings)

## Implementation approach
Dashboard helper functions live in `src/ui-wa-tasks/dashboard-helpers.ts` as pure TypeScript (no DOM/React). These compose wa-task-engine query results into table row and summary structures. The React page at `app/work-allocation/page.tsx` consumes these helpers.

### Helper functions to implement
| Function | Purpose |
|----------|---------|
| `getDashboardSummary(waTasks, waMappings)` | Returns `{ total, aligned, partial, gap, alignedPct, partialPct, gapPct }` |
| `getAlignedTaskRows(waTasks, waMappings)` | Returns array of row objects for aligned table |
| `getPartialTaskRows(waTasks, waMappings)` | Returns array with task, trigger, matchedEvents, missing |
| `getGapTaskRows(waTasks, waMappings)` | Returns array with task, trigger, recommendation |
| `groupTasksByState(waTasks, waMappings, events)` | Returns object of stateId to tasks array |
| `groupTasksByContext(waTasks)` | Returns object of context to tasks array |
| `exportAlignmentCsv(waTasks, waMappings)` | Returns CSV string |

## Watch points for stories
1. Partial task rows need expandable alignment notes -- the `missing` field from `getPartialTasks`
2. State grouping requires event data (array of `{ state, name }` objects) to resolve which states tasks apply in
3. CSV export is client-side (string generation), browser download is React layer concern
4. Route addition requires extending ROUTES in `src/app-shell/index.ts` and the Sidebar picks it up via `getNavigationItems()`
