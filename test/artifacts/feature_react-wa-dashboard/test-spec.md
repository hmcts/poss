# Test Specification -- react-wa-dashboard

## Module Under Test
`src/ui-wa-tasks/dashboard-helpers.ts` (imported via `../src/ui-wa-tasks/dashboard-helpers.js` bridge)

## Data
- `data/wa-tasks.json` -- 17 WA tasks
- `data/wa-mappings.json` -- 17 WA task mappings

## Functions to Test

### 1. getDashboardSummary(waTasks, waMappings)
- Returns `{ total, aligned, partial, gap, alignedPct, partialPct, gapPct }`
- Tests: correct counts (7/9/1), correct percentages, empty data returns zeros

### 2. getAlignedTaskRows(waTasks, waMappings)
- Returns array of row objects for aligned tasks
- Tests: correct count (7), each row has taskName/triggerDescription/matchedEvents/alignment/badge

### 3. getPartialTaskRows(waTasks, waMappings)
- Returns array of row objects for partial tasks
- Tests: correct count (9), each row has non-empty missing field, badge is amber

### 4. getGapTaskRows(waTasks, waMappings)
- Returns array of row objects for gap tasks
- Tests: correct count (1), task is Review Failed Payment, empty matchedEvents, non-empty recommendation

### 5. groupTasksByState(waTasks, waMappings, events)
- Returns object of stateId -> tasks[]
- Tests: mock events, tasks appear under correct states, empty events returns empty object

### 6. groupTasksByContext(waTasks)
- Returns object of context -> tasks[]
- Tests: correct group sizes (claim=3, counterclaim=2, gen-app=4, claim-counterclaim=2, general=6), total = 17

### 7. exportAlignmentCsv(waTasks, waMappings)
- Returns CSV string
- Tests: header row, 18 lines total, semicolon-separated events, empty data returns header only

## Test Count Target
~25 tests across 7 function groups
