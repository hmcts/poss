# Implementation Plan: event-matrix

## Approach

Single TypeScript module at `src/event-matrix/index.ts` exporting five pure functions. No dependencies beyond the Event type from the data model.

## Functions

### 1. filterEvents
- Accept events array and optional filter object `{ claimType?, state?, role?, systemOnly? }`
- Apply each present filter sequentially (AND logic)
- For role filter: check `event.actors[role] === true`

### 2. searchEvents
- Trim query; if empty, return all events
- Lowercase both query and fields for case-insensitive match
- Check `event.name` and `event.notes` for substring inclusion

### 3. eventsToActorGrid
- Return `{ headers: roles, rows }` where each row maps event to boolean array
- For each role, check `event.actors[role] ?? false`

### 4. eventsToCsv
- Collect all unique actor keys from all events for column headers
- Build header row: State, Event, System, Notes, ...actor keys
- For each event, build data row with CSV escaping (RFC 4180)
- CSV escape: if field contains comma, quote, or newline, wrap in double quotes and double any internal quotes

### 5. getOpenQuestionCount
- Filter events where `hasOpenQuestions === true`, return length

## Files

| File | Purpose |
|------|---------|
| `src/event-matrix/index.ts` | All five function exports |

## Verification

```bash
node --experimental-strip-types --test test/feature_event-matrix.test.js
```
