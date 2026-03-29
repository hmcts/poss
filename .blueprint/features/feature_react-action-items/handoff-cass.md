# Handoff -- react-action-items

**From:** Cass (BA Agent)
**To:** Nigel (Test Agent)
**Date:** 2026-03-27

## What was produced

Three user stories with 16 total acceptance criteria, all testable via Node.js test runner (no DOM/React):

| Story | File | ACs | Focus |
|-------|------|-----|-------|
| action-item-collection | `story-action-item-collection.md` | AC-1-1 to AC-1-6 | `getActionItems()` -- all 7 item types, priorities, suggestion templates, deduplication rule, `getActionItemSummary()` |
| action-item-display | `story-action-item-display.md` | AC-2-1 to AC-2-6 | `filterActionItems()` -- category/priority/search/combined filters, `sortActionItems()` -- default and custom sort, deep link validation |
| action-item-export | `story-action-item-export.md` | AC-3-1 to AC-3-4 | `exportActionItemsCsv()` -- headers, escaping, empty array, filtered input |

## Key design decisions

1. **All ACs test pure functions** -- no React rendering, no DOM. Story 2 ACs test `filterActionItems()` and `sortActionItems()`, not UI components.
2. **AC-1-4 uses real data files** (`data/wa-tasks.json`, `data/wa-mappings.json`) to validate against actual WA task counts (1 gap, 9 partial).
3. **Suggestion templates are deterministic** -- each AC specifies the exact expected string so tests can do strict equality checks.
4. **Deduplication explicitly tested** in AC-1-6: a state appearing in both unreachable and low-completeness produces two distinct items.
5. **System event exclusion** only applies to the "no WA task" item type (AC-1-5), not to open questions (AC-1-1).

## Watch points for test implementation

- `canReachEndState` must be called per claim type group. States should be grouped by `claimType` before the call.
- `getPartialTasks` returns `{ task, missing }` pairs. The `missing` field comes from `mapping.alignmentNotes`.
- CSV escaping must handle commas, double quotes, and newlines per RFC 4180 (AC-3-2).
- `filterActionItems` with all-null filters returns items unchanged.
- Default sort order: priority (high > medium > low), then category (Model Completeness first), then title alphabetical.
