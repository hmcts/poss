# Feature Spec: Event Matrix (event-matrix)

## 1. Overview

The Event Matrix replaces the Excel-based event model with a filterable, searchable event table. This feature spec covers the **data/logic layer only** -- the pure functions that power filtering, searching, actor grid transformation, CSV export, and open-question flagging.

## 2. Source References

- System Spec sections 5 (Core Domain Concepts -- Event) and 8 (Cross-Cutting Concerns -- Uncertainty Handling)
- BACKLOG.md: event-matrix entry
- spec.md: Mode 2: Event Matrix
- Data model: `src/data-model/schemas.ts` (EventSchema), `src/data-model/enums.ts` (ClaimTypeId, KNOWN_ROLES)

## 3. Functional Requirements

### 3.1 Filter Engine

`filterEvents(events: Event[], filters: FilterCriteria): Event[]`

Filters the event list by any combination of:
- **claimType** (string) -- exact match on `event.claimType`
- **state** (string) -- exact match on `event.state`
- **role** (string) -- only events where `event.actors[role] === true`
- **systemOnly** (boolean) -- when true, only events where `isSystemEvent === true`

All filters are optional. When multiple filters are provided, they combine with AND logic. When no filters are provided, all events are returned.

### 3.2 Search

`searchEvents(events: Event[], query: string): Event[]`

Case-insensitive substring search across:
- `event.name`
- `event.notes`

Returns events where either field contains the query string. Empty or whitespace-only query returns all events.

### 3.3 Actor Grid Transform

`eventsToActorGrid(events: Event[], roles: string[]): ActorGrid`

Transforms a list of events into a grid structure suitable for table rendering:

```typescript
type ActorGrid = {
  headers: string[];         // role names in order
  rows: {
    event: Event;
    actors: boolean[];       // parallel to headers
  }[];
};
```

Each row maps an event to an ordered boolean array indicating which roles can perform it.

### 3.4 CSV Export

`eventsToCsv(events: Event[]): string`

Generates a CSV string from the event list:
- Header row: `State,Event,System,Notes,[...role columns from event.actors keys]`
- Data rows: corresponding values, with actor columns as `Y` or `N`
- System column: `Y` or `N`
- Fields containing commas or quotes are properly escaped (RFC 4180)
- Uses `\n` line endings

### 3.5 Open Questions Count

`getOpenQuestionCount(events: Event[]): number`

Returns the count of events where `hasOpenQuestions === true`.

## 4. Non-Functional Requirements

- Pure functions with no side effects
- No browser/DOM dependencies -- must run under Node.js
- All functions must handle empty arrays gracefully (return empty results, not errors)

## 5. Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-1 | filterEvents with no filters returns all events |
| AC-2 | filterEvents with claimType returns only matching events |
| AC-3 | filterEvents with role returns only events where that role is true |
| AC-4 | filterEvents with systemOnly=true returns only system events |
| AC-5 | filterEvents combines multiple filters with AND logic |
| AC-6 | searchEvents with empty query returns all events |
| AC-7 | searchEvents matches event name case-insensitively |
| AC-8 | searchEvents matches notes field |
| AC-9 | eventsToActorGrid produces correct headers from roles array |
| AC-10 | eventsToActorGrid produces boolean array parallel to headers |
| AC-11 | eventsToCsv produces valid CSV with header row |
| AC-12 | eventsToCsv escapes fields containing commas |
| AC-13 | getOpenQuestionCount returns correct count |
| AC-14 | All functions handle empty input arrays |

## 6. Dependencies

- `src/data-model/schemas.ts` -- Event type definition
- `src/data-model/enums.ts` -- KNOWN_ROLES for default role list

## 7. Out of Scope

- React components / UI rendering
- State management (Zustand integration)
- Data ingestion from Excel
