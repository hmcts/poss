# Test Spec -- react-digital-twin-wa (Helper Functions)

## Scope

Tests target pure helper functions in `src/ui-wa-tasks/digital-twin-helpers.js` that supply all display logic for the Digital Twin WA overlay. No React/DOM testing.

## AC-to-Test Mapping

| Story | AC | Test ID | Scenario |
|-------|-----|---------|----------|
| toggle-and-task-cards | AC-2 | T-1.1 | `shouldShowWaToggle` returns true when valid data exists |
| toggle-and-task-cards | AC-2 | T-1.2 | `shouldShowWaToggle` returns false for empty arrays |
| toggle-and-task-cards | AC-2 | T-1.3 | `shouldShowWaToggle` returns false for null/undefined |
| toggle-and-task-cards | AC-3,4 | T-2.1 | `getEventTaskCards` returns card objects with collapsed fields for mapped event |
| toggle-and-task-cards | AC-3 | T-2.2 | Card collapsed fields include taskName and alignment badge data |
| toggle-and-task-cards | AC-4 | T-2.3 | Card expanded fields include triggerDescription, notes, context |
| toggle-and-task-cards | AC-5 | T-2.4 | `getEventTaskCards` returns empty array for unmapped event |
| toggle-and-task-cards | AC-3 | T-2.5 | Event mapping to multiple tasks returns multiple cards |
| timeline-chips | AC-1,2 | T-3.1 | `getTimelineChips` returns chip with taskName and alignment colour for mapped event |
| timeline-chips | AC-3 | T-3.2 | `getTimelineChips` returns empty array for unmapped event |
| timeline-chips | AC-2 | T-3.3 | Chip colour matches alignment status (green/amber/red) |
| timeline-chips | AC-6 | T-3.4 | Chip includes text label (taskName is non-empty string) |
| alignment-warnings | AC-1 | T-4.1 | `getAlignmentWarning` returns partial warning for event with partial-aligned task |
| alignment-warnings | AC-2 | T-4.2 | `getAlignmentWarning` returns null for event with aligned task |
| alignment-warnings | AC-3 | T-4.3 | `getAlignmentWarning` returns null for event with no WA task |
| alignment-warnings | AC-3,4 | T-5.1 | `isPaymentRelatedState` returns true for state containing PAYMENT |
| alignment-warnings | AC-3,4 | T-5.2 | `isPaymentRelatedState` returns true for PENDING_CASE_ISSUED |
| alignment-warnings | AC-4 | T-5.3 | `isPaymentRelatedState` returns false for non-payment state |
| alignment-warnings | AC-4 | T-5.4 | `isPaymentRelatedState` is case-insensitive for PAYMENT substring |
| empty-state | AC-1 | T-6.1 | `getEmptyStateMessage` returns message when no events trigger WA tasks |
| empty-state | AC-2 | T-6.2 | `getEmptyStateMessage` returns null when events trigger WA tasks |
| empty-state | AC-4 | T-6.3 | `getEmptyStateMessage` returns null for empty data arrays |

## Assumptions

- Helper functions are pure; they delegate to `ui-wa-tasks` and `wa-task-engine` internally.
- Real data from `wa-tasks.json` and `wa-mappings.json` is used for integration-level confidence.
- React rendering, toggle state, keyboard accessibility (AC-7, timeline AC-4/5) are UI concerns tested separately.

## Data Notes

- "Case Issued" maps to wa-task-01 (aligned).
- "Upload your documents" maps to wa-task-09..12 (all partial).
- "Respond to Claim" maps to wa-task-03 (aligned) + wa-task-04 (partial) -- tests multi-task events.
- wa-task-17 "Review Failed Payment" is the only gap task with empty eventIds.
- "Transfer Case" has no mapping -- tests unmapped path.
