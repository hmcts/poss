# Handoff: Nigel -> Codey

## Feature: event-matrix (Event Matrix Logic Layer)

## Summary

Test suite created at `test/feature_event-matrix.test.js` with 17 tests covering all five functions. Test spec at `test/artifacts/feature_event-matrix/test-spec.md`.

## Test Coverage

| Function | Tests | Key scenarios |
|----------|-------|---------------|
| filterEvents | FE-1 to FE-6 | No filters, claimType, role, systemOnly, AND combo, state |
| searchEvents | SE-1 to SE-4 | Empty query, name match, notes match, whitespace query |
| eventsToActorGrid | AG-1 to AG-3 | Headers, boolean array, missing role key |
| eventsToCsv | CS-1 to CS-3 | Header row, escaping, Y/N system column |
| getOpenQuestionCount | OQ-1, OQ-2 | Correct count, zero count |
| Edge cases | EC-1 | All functions with empty arrays |

## For Codey

Implement `src/event-matrix/index.ts` exporting:
- `filterEvents(events, filters)` -- AND-logic filtering by claimType, state, role, systemOnly
- `searchEvents(events, query)` -- case-insensitive substring on name/notes
- `eventsToActorGrid(events, roles)` -- transform to { headers, rows: { event, actors: boolean[] }[] }
- `eventsToCsv(events)` -- RFC 4180 CSV, actor columns from event.actors keys, Y/N values
- `getOpenQuestionCount(events)` -- count where hasOpenQuestions === true

Run: `node --experimental-strip-types --test test/feature_event-matrix.test.js`

Note: The test imports from `../src/event-matrix/index.js` (JS extension for strip-types compatibility). The TypeScript source should be at `src/event-matrix/index.ts`.
