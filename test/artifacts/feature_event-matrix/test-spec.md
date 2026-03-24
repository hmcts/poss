# Test Spec: event-matrix

## Test Strategy

Unit tests for the event-matrix logic layer using Node.js built-in test runner (`node:test`). All tests operate on in-memory Event fixtures -- no file I/O, no browser.

## Test Fixtures

A shared set of Event objects covering:
- Multiple claim types (MAIN_CLAIM_ENGLAND, ENFORCEMENT)
- System and user events
- Events with and without open questions
- Events with various actor combinations
- Events with commas/quotes in notes (CSV edge case)

## Test Groups

| Group | Function | Test IDs | Coverage |
|-------|----------|----------|----------|
| Filter Engine | filterEvents | FE-1 to FE-5 | AC-1 to AC-5 |
| Search | searchEvents | SE-1 to SE-3 | AC-6 to AC-8 |
| Actor Grid | eventsToActorGrid | AG-1, AG-2 | AC-9, AC-10 |
| CSV Export | eventsToCsv | CS-1, CS-2 | AC-11, AC-12 |
| Open Questions | getOpenQuestionCount | OQ-1 | AC-13 |
| Edge Cases | all functions | EC-1 | AC-14 |

## Runner

```bash
node --experimental-strip-types --test test/feature_event-matrix.test.js
```
