# Implementation Plan: UI Event Matrix

## Files to Create
1. `src/ui-event-matrix/index.ts` -- 7 exported functions
2. `src/ui-event-matrix/index.js` -- bridge file

## Implementation Details

### index.ts
- Import `filterEvents`, `searchEvents`, `eventsToActorGrid`, `eventsToCsv` from `../event-matrix/index.js`
- Import `getEventIndicator` from `../uncertainty-display/index.js`
- Use the `Event` interface locally (same shape as event-matrix)
- Each function is pure, composes existing lower-level functions

### Functions
1. **getFilterOptions**: Set-based extraction of unique claimType, state, and actor keys; sort each
2. **applyFiltersAndSearch**: filterEvents(events, filters) then searchEvents(result, query)
3. **prepareTableData**: eventsToActorGrid then map rows adding getEventIndicator(row.event)
4. **prepareCsvDownload**: eventsToCsv wrapped with { filename: 'event-matrix.csv', mimeType: 'text/csv' }
5. **getEventMatrixSummary**: count total, filtered length, openQuestions from filtered, systemEvents from filtered
6. **getUniqueStates**: Array.from(new Set(events.map(e => e.state))).sort()
7. **getUniqueClaimTypes**: Array.from(new Set(events.map(e => e.claimType))).sort()

## Verification
```bash
node --experimental-strip-types --test test/feature_ui-event-matrix.test.js
```
