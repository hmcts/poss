# Feature Spec: UI Event Matrix (ui-event-matrix)

## 1. Overview

The UI Event Matrix is a pure logic module that composes the lower-level `event-matrix` functions with `uncertainty-display` indicators into a UI-ready API. It provides filter option extraction, combined filter+search, table data preparation with open-question indicators, CSV download preparation, and summary statistics. No DOM or React dependencies -- this is the orchestration layer between raw data functions and a future UI.

## 2. Source References

- System Spec sections 5 (Core Domain Concepts -- Event) and 8 (Cross-Cutting Concerns -- Uncertainty Handling)
- BACKLOG.md: ui-event-matrix entry
- Dependencies: `src/event-matrix/index.ts`, `src/uncertainty-display/index.ts`, `src/data-model/enums.ts`

## 3. Functional Requirements

### 3.1 Get Filter Options

`getFilterOptions(events: Event[]): { claimTypes: string[], states: string[], roles: string[] }`

Extracts all unique, sorted filter option values from the event dataset:
- **claimTypes**: sorted unique `event.claimType` values
- **states**: sorted unique `event.state` values
- **roles**: sorted unique role keys from all `event.actors` records

### 3.2 Apply Filters and Search

`applyFiltersAndSearch(events: Event[], filters: FilterCriteria, searchQuery: string): Event[]`

Combines `filterEvents` and `searchEvents` in a single call. First applies filters, then applies the search query to the filtered results.

### 3.3 Prepare Table Data

`prepareTableData(events: Event[], roles: string[]): TableData`

Wraps `eventsToActorGrid` and enriches each row with an event indicator from `getEventIndicator`:

```typescript
type TableData = {
  headers: string[];
  rows: {
    event: Event;
    actors: boolean[];
    indicator: EventIndicator;
  }[];
};
```

### 3.4 Prepare CSV Download

`prepareCsvDownload(events: Event[]): { content: string, filename: string, mimeType: string }`

Wraps `eventsToCsv` and returns a download-ready object:
- **content**: the CSV string
- **filename**: `"event-matrix.csv"`
- **mimeType**: `"text/csv"`

### 3.5 Get Event Matrix Summary

`getEventMatrixSummary(events: Event[], filteredEvents: Event[]): EventMatrixSummary`

Returns summary statistics:
- **total**: total number of events
- **filtered**: number of filtered events
- **openQuestions**: count of filtered events with open questions
- **systemEvents**: count of filtered system events

### 3.6 Get Unique States

`getUniqueStates(events: Event[]): string[]`

Returns sorted unique state names from the event array.

### 3.7 Get Unique Claim Types

`getUniqueClaimTypes(events: Event[]): string[]`

Returns sorted unique claim type IDs from the event array.

## 4. Non-Functional Requirements

- Pure functions with no side effects
- No browser/DOM dependencies -- must run under Node.js
- All functions must handle empty arrays gracefully
- Composes existing modules; does not duplicate logic

## 5. Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-1 | getFilterOptions extracts sorted unique claim types |
| AC-2 | getFilterOptions extracts sorted unique states |
| AC-3 | getFilterOptions extracts sorted unique roles from actor records |
| AC-4 | applyFiltersAndSearch applies filters then search |
| AC-5 | applyFiltersAndSearch with empty filters and empty query returns all |
| AC-6 | prepareTableData produces actor grid with indicators |
| AC-7 | prepareTableData indicator shows warning for open-question events |
| AC-8 | prepareCsvDownload returns correct filename and mimeType |
| AC-9 | prepareCsvDownload content matches eventsToCsv output |
| AC-10 | getEventMatrixSummary returns correct total and filtered counts |
| AC-11 | getEventMatrixSummary counts open questions from filtered set |
| AC-12 | getEventMatrixSummary counts system events from filtered set |
| AC-13 | getUniqueStates returns sorted unique states |
| AC-14 | getUniqueClaimTypes returns sorted unique claim types |
| AC-15 | All functions handle empty input arrays |

## 6. Dependencies

- `src/event-matrix/index.ts` -- filterEvents, searchEvents, eventsToActorGrid, eventsToCsv, getOpenQuestionCount
- `src/uncertainty-display/index.ts` -- getEventIndicator
- `src/data-model/schemas.ts` -- Event type
- `src/data-model/enums.ts` -- KNOWN_ROLES

## 7. Out of Scope

- React components / UI rendering
- State management (Zustand integration)
- Data ingestion from Excel
