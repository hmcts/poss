# Test Specification -- ui-wa-tasks

## Feature Summary

UI orchestration layer that bridges wa-task-engine and React components. Provides badge resolution, tooltip composition, event enrichment, panel preparation, and state-level task counts. All functions are pure and stateless.

## Stories and AC-to-Test Mapping

### Story 1: Badge and Tooltip Display Metadata

| AC   | Test ID | Scenario                                           |
|------|---------|----------------------------------------------------|
| AC-1 | BT-1    | Aligned status returns green badge                 |
| AC-2 | BT-2    | Partial status returns amber badge                 |
| AC-3 | BT-3    | Gap status returns red badge                       |
| AC-4 | BT-4    | Unknown alignment falls back to grey badge         |
| AC-5 | BT-5    | Tooltip for aligned task includes notes suffix     |
| AC-6 | BT-6    | Tooltip with empty notes omits suffix              |
| AC-7 | BT-7    | Tooltip structure is deterministic for any pair    |

### Story 2: WA Event Enrichment

| AC   | Test ID | Scenario                                           |
|------|---------|----------------------------------------------------|
| AC-1 | EE-1    | Mapped event enriched with waTask metadata         |
| AC-2 | EE-2    | Unmapped event has waTask undefined                |
| AC-3 | EE-3    | Original event fields preserved (additive)         |
| AC-4 | EE-4    | Batch enrichment returns correct count             |
| AC-5 | EE-5    | Batch enrichment with empty input returns []       |
| AC-6 | EE-6    | WaEnrichedEvent type check (waTask not indicator)  |

### Story 3: Panel Preparation and State-Level Counts

| AC   | Test ID | Scenario                                           |
|------|---------|----------------------------------------------------|
| AC-1 | PC-1    | Panel for mixed-alignment state has enriched tasks |
| AC-2 | PC-2    | Panel includes alignment summary and hasGaps flag  |
| AC-3 | PC-3    | Panel for no-WA state returns empty panel          |
| AC-4 | PC-4    | State count returns correct totals by alignment    |
| AC-5 | PC-5    | State count for no-task state returns all zeros    |
| AC-6 | PC-6    | Tasks are deduplicated per state                   |

## Assumptions

1. Source module will be at `src/ui-wa-tasks/index.ts` with bridge `index.js`
2. `getWaTaskBadge` accepts any string, returns grey fallback for unknowns
3. `getWaTaskTooltip` template: `"{taskName} -- Triggered by: {triggerDescription}"` with optional `" | Note: {notes}"` suffix
4. `enrichEventWithWaTask` delegates to `getEventWaContext` from wa-task-engine
5. `prepareWaTaskPanel` delegates to `getTasksForState` from wa-task-engine
6. Real data from `data/wa-tasks.json` and `data/wa-mappings.json` is used where possible
7. Mock events use minimal `{ state, name }` shape matching wa-task-engine expectations

## Test Data Strategy

- Badge tests: direct calls with string literals
- Tooltip tests: use real wa-task-01 and wa-task-17 from JSON data
- Enrichment tests: mock Event objects with `name` matching real mappings
- Panel/count tests: mock events at synthetic state IDs with known WA mappings

## Total: 19 tests covering 19 ACs (100% AC coverage)
