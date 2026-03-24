# Handoff: Alex -> Nigel

## Feature: event-matrix (Event Matrix Logic Layer)

## Summary

Feature spec created at `.blueprint/features/feature_event-matrix/FEATURE_SPEC.md`. This covers the pure logic layer for the Event Matrix feature -- five functions that handle filtering, searching, grid transformation, CSV export, and open-question counting.

## Key Decisions

1. **Logic-only scope** -- no UI components, no browser dependencies. All functions are pure and testable under Node.js.
2. **AND-logic for filters** -- multiple filter criteria combine with AND, not OR.
3. **Search scope** -- searches event `name` and `notes` fields only, case-insensitive substring matching.
4. **CSV format** -- RFC 4180 compliant with proper escaping. Actor columns use Y/N.
5. **Actor grid** -- the `roles` parameter controls column order and inclusion, allowing the UI layer to toggle columns later.

## For Nigel

Write tests for these five exports from `../src/event-matrix/index.js`:

- `filterEvents(events, { claimType?, state?, role?, systemOnly? })` -> Event[]
- `searchEvents(events, query)` -> Event[]
- `eventsToActorGrid(events, roles)` -> { headers, rows }
- `eventsToCsv(events)` -> string
- `getOpenQuestionCount(events)` -> number

Test fixtures should use realistic Event objects matching the EventSchema from `src/data-model/schemas.ts`. Cover acceptance criteria AC-1 through AC-14 from the feature spec.

Use `node:test` runner. Keep under 200 lines.
