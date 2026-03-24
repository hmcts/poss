# Test Spec: UI Event Matrix (ui-event-matrix)

## Test ID Prefix: UEM-

## Fixtures
Reuse inline event objects matching the Event schema (id, name, claimType, state, isSystemEvent, notes, hasOpenQuestions, actors).

## Test Plan

### 1. getFilterOptions (3 tests)
- UEM-01: Extracts sorted unique claim types
- UEM-02: Extracts sorted unique states
- UEM-03: Extracts sorted unique roles from actor keys

### 2. applyFiltersAndSearch (4 tests)
- UEM-04: No filters + empty query returns all events
- UEM-05: Applies filter then search in sequence
- UEM-06: Filter narrows before search applies
- UEM-07: Search with no filter matches returns empty

### 3. prepareTableData (3 tests)
- UEM-08: Returns correct headers and row count
- UEM-09: Each row has an indicator object
- UEM-10: Open-question event gets warning indicator

### 4. prepareCsvDownload (2 tests)
- UEM-11: Returns correct filename and mimeType
- UEM-12: Content matches eventsToCsv output

### 5. getEventMatrixSummary (3 tests)
- UEM-13: Returns correct total and filtered counts
- UEM-14: Counts open questions from filtered events
- UEM-15: Counts system events from filtered events

### 6. getUniqueStates / getUniqueClaimTypes (2 tests)
- UEM-16: getUniqueStates returns sorted unique states
- UEM-17: getUniqueClaimTypes returns sorted unique claim types

### 7. Edge Cases (1 test)
- UEM-18: All functions handle empty arrays

## Total: 18 tests
