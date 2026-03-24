# Handoff: Nigel -> Codey (ui-event-matrix)

## Test Summary
18 tests written in `test/feature_ui-event-matrix.test.js`, prefix UEM-01 through UEM-18.

## What to Implement
Single module: `src/ui-event-matrix/index.ts` with 7 exported functions.

## Key Implementation Notes
1. Import `filterEvents`, `searchEvents`, `eventsToActorGrid`, `eventsToCsv` from `../event-matrix/index.js`
2. Import `getEventIndicator` from `../uncertainty-display/index.js`
3. `applyFiltersAndSearch`: call filterEvents first, then searchEvents on the result
4. `prepareTableData`: call eventsToActorGrid, then map rows to add `indicator` via getEventIndicator
5. `getFilterOptions`: extract unique values from event fields, sort them
6. `prepareCsvDownload`: wrap eventsToCsv with metadata
7. `getEventMatrixSummary`: compute counts from both full and filtered event arrays
8. `getUniqueStates` / `getUniqueClaimTypes`: simple extraction helpers

## Files to Create
- `src/ui-event-matrix/index.ts` -- main module
- `src/ui-event-matrix/index.js` -- bridge file re-exporting from index.ts

## Run Tests
```bash
node --experimental-strip-types --test test/feature_ui-event-matrix.test.js
```
