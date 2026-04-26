# Test Spec -- react-caseman-comparison

## Understanding

The react-caseman-comparison feature maps 497 legacy Caseman events to the new service model. The pure logic module `src/caseman-comparison/index.ts` (re-exported via `index.js`) provides six testable functions: `parseCasemanEvents` derives domain from BMS task prefix; `autoMatchEvents` scores string similarity and buckets results into covered/partial/gap; `joinWithMappings` merges curated file overrides with auto-derived results (curated wins); `getCoverageSummary` computes counts and the partial-as-half formula; `filterRows`/`searchRows` subset the joined rows; `exportComparisonCsv` serialises to RFC 4180 CSV in the mandated column order.

All functions are pure -- no DOM, no React, no file I/O at call time. Tests use inline fixture arrays.

## AC to Test ID Mapping

| AC | Test ID | Description |
|----|---------|-------------|
| data-prep AC2 | DP-1 | parseCasemanEvents: JH prefix → Judgments&Hearings domain |
| data-prep AC2 | DP-2 | parseCasemanEvents: EN prefix → Enforcement domain |
| data-prep AC2 | DP-3 | parseCasemanEvents: no task codes → Unclassified domain |
| data-prep AC2 | DP-4 | parseCasemanEvents: all 12 prefix-to-domain mappings |
| data-prep AC3 | DP-5 | autoMatchEvents: score >0.8 → covered, source auto |
| data-prep AC3 | DP-6 | autoMatchEvents: score 0.5–0.8 → partial, source auto |
| data-prep AC3 | DP-7 | autoMatchEvents: score <0.5 → gap, source auto, newEventName null |
| data-prep AC3 | DP-8 | autoMatchEvents: empty candidate list → gap for all |
| data-prep AC4 | DP-9 | joinWithMappings: curated entry overrides auto for same event ID |
| data-prep AC4 | DP-10 | joinWithMappings: events absent from file receive auto mapping |
| data-prep AC4 | DP-11 | joinWithMappings: no duplicate event IDs in output |
| data-prep AC4 | DP-12 | joinWithMappings: empty mappings file → all auto-derived |
| data-prep AC5 | DP-13 | getCoverageSummary: 40 covered / 20 partial / 40 gap → 50% |
| data-prep AC5 | DP-14 | getCoverageSummary: all covered → 100% |
| data-prep AC5 | DP-15 | getCoverageSummary: all gap → 0% |
| data-prep AC5 | DP-16 | getCoverageSummary: empty dataset → 0 counts, 0% |
| data-prep AC6 | DP-17 | filterRows: status + domain filters are both applied (AND) |
| data-prep AC6 | DP-18 | filterRows: status-only filter returns correct subset |
| data-prep AC6 | DP-19 | filterRows: no filters → full dataset returned |
| data-prep AC6 | DP-20 | searchRows: matches event name case-insensitively |
| data-prep AC6 | DP-21 | searchRows: matches notes field |
| data-prep AC6 | DP-22 | searchRows: no match → empty array |
| events-tab AC6 | EX-1 | exportComparisonCsv: column order matches Rule 7 exactly |
| events-tab AC6 | EX-2 | exportComparisonCsv: value containing comma is quoted |
| events-tab AC6 | EX-3 | exportComparisonCsv: value containing newline is quoted |
| events-tab AC6 | EX-4 | exportComparisonCsv: empty array → header row only |
| events-tab AC3 | EX-5 | deep link: covered row with newEventName → /event-matrix?search= |
| events-tab AC3 | EX-6 | deep link: covered row with newStateName → /state-explorer?highlight= |
| events-tab AC3 | EX-7 | deep link: gap row → no link (null) |
| tasks-tab AC1 | TK-1 | block data: block widths sum to 100% of total task count |
| tasks-tab AC1 | TK-2 | block data: each block carries correct domain label and count |
| tasks-tab AC3 | TK-3 | block coverage: no WA tasks covering domain → red |
| tasks-tab AC3 | TK-4 | block coverage: some WA tasks covering domain → amber |
| tasks-tab AC5 | TK-5 | domain summary: "X of 12 domains with partial coverage" count |

## Key Assumptions

- Bridge module `src/caseman-comparison/index.js` re-exports all six functions.
- `parseCasemanEvents(rawEvents)` accepts an array of raw objects and returns `CasemanEvent[]`.
- `autoMatchEvents(casemanEvents, newServiceEvents)` returns `CasemanMapping[]` with `source: "auto"`.
- `joinWithMappings(casemanEvents, autoMappings, curatedMappings)` returns joined rows; curated wins on ID clash.
- `getCoverageSummary(rows)` returns `{ total, covered, partial, gap, coveragePercent }`.
- `filterRows(rows, { status?, domain? })` AND-combines non-null filters.
- `searchRows(rows, query)` searches `name` and `notes` fields case-insensitively.
- `exportComparisonCsv(rows)` returns a string (not a Blob) for testability.
- Deep link logic is a pure helper (not React) that accepts a mapping and returns a URL string or null.
