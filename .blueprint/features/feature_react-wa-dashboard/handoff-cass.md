# Handoff -- react-wa-dashboard

**From:** Cass (BA Agent)
**To:** Nigel (Tester) / Codey (Developer)
**Date:** 2026-03-27

## Stories written

1. **story-dashboard-summary-and-tables** -- Summary cards (total/aligned/partial/gap counts and percentages), aligned table rows, partial table rows with missing explanation, gap table rows with recommendation. 7 ACs covering counts, percentages, row content, badges, and empty data.
2. **story-grouping-views** -- "By Context" grouping (5 context categories) and "By State" grouping (tasks grouped by event states). 5 ACs covering correct grouping, completeness, and edge cases.
3. **story-csv-export** -- CSV export with header row, all 17 tasks, semicolon-separated events, proper quoting, and empty data handling. 5 ACs.

## Key decisions

- Dashboard helper functions are pure TypeScript in `src/ui-wa-tasks/dashboard-helpers.ts` with a `.js` bridge file.
- Helpers delegate to wa-task-engine for alignment queries and compose results into row/summary structures.
- CSV export produces a string; the React layer handles the browser download trigger.
- State grouping requires an events array parameter; context grouping uses only the tasks array.
- Percentages use `Math.round(count / total * 100 * 10) / 10` for one decimal place.

## Watch points for implementation

- The `getDashboardSummary` function must handle total = 0 gracefully (avoid division by zero).
- `getPartialTaskRows` and `getGapTaskRows` pull `missing`/`recommendation` from `WaTaskMapping.alignmentNotes`.
- CSV fields containing commas must be quoted per RFC 4180.
- Context grouping counts: claim=3, counterclaim=2, gen-app=4, claim-counterclaim=2, general=6 (total 17 -- verified against wa-tasks.json).
