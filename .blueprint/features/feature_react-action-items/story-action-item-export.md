# Story: action-item-export

**Feature:** react-action-items
**Story:** CSV export of filtered action items
**Effort:** S
**Module:** `src/action-items/index.ts` (pure function)

---

## Overview

Implement `exportActionItemsCsv()` that takes an `ActionItem[]` and returns a CSV string with headers, filename, and MIME type. Follows the `csvEscape` pattern used in `src/event-matrix/index.ts`.

## Key Function Signature

```ts
exportActionItemsCsv(items: ActionItem[]): { content: string; filename: string; mimeType: string }
```

---

## Acceptance Criteria

### AC-3-1: CSV export produces correct headers and row data

**Given** an `ActionItem[]` containing two items:
- Item 1: `priority: 'high'`, `category: 'Model Completeness'`, `type: 'unreachable'`, `title: 'Unreachable state: Hearing Listed'`, `detail: 'No incoming transitions'`, `suggestion: 'Add an incoming transition...'`, `state: 'HEARING_LISTED'`, `claimType: 'MAIN_CLAIM_ENGLAND'`
- Item 2: `priority: 'medium'`, `category: 'WA Task Alignment'`, `type: 'wa-partial'`, `title: 'WA partial: Review Counterclaim'`, `detail: 'Coarser granularity'`, `suggestion: 'Refine event granularity...'`, `state: null`, `claimType: null`

**When** `exportActionItemsCsv(items)` is called
**Then** `content` is a string where:
- Line 1 (header) is: `Priority,Category,Type,Title,Detail,Suggestion,State,Claim Type`
- Line 2 contains the 8 fields of Item 1, comma-separated
- Line 3 contains the 8 fields of Item 2, comma-separated
- Null values are exported as empty strings (not the literal "null")
- `filename` === `'action-items.csv'`
- `mimeType` === `'text/csv'`

**Test approach:** Call function, split result content by newlines, verify header and each row.

---

### AC-3-2: CSV escaping handles commas, quotes, and newlines in field values

**Given** an `ActionItem[]` containing one item where:
- `title` contains a comma: `"WA gap: Review Failed Payment, urgent"`
- `detail` contains a double quote: `'No "Failed Payment" event exists'`
- `suggestion` contains a newline: `"Add event.\nReview in Event Matrix."`

**When** `exportActionItemsCsv(items)` is called
**Then** the content correctly escapes these values per RFC 4180:
- Fields containing commas are wrapped in double quotes
- Double quotes within fields are escaped by doubling (`""`)
- Fields containing newlines are wrapped in double quotes
- The resulting CSV, when parsed, recovers the original field values

**Test approach:** Call function, verify that the problematic fields are properly quoted/escaped by checking the raw string content.

---

### AC-3-3: CSV export of empty array produces header-only output

**Given** an empty `ActionItem[]`
**When** `exportActionItemsCsv([])` is called
**Then**:
- `content` contains exactly the header line: `"Priority,Category,Type,Title,Detail,Suggestion,State,Claim Type"` followed by a newline
- `filename` === `'action-items.csv'`
- `mimeType` === `'text/csv'`

**Test approach:** Call with empty array, assert content has header only and no data rows.

---

### AC-3-4: CSV export respects the current filter (exports filtered items, not all)

**Given** an `ActionItem[]` of 10 items, filtered via `filterActionItems(items, { priority: 'high' })` to 3 items
**When** `exportActionItemsCsv(filteredItems)` is called with the 3 filtered items
**Then** the content contains exactly 4 lines: 1 header + 3 data rows

This confirms that the export function operates on whatever array it receives -- filtering is the caller's responsibility. The function does not re-filter.

**Test approach:** Filter first, pass result to export, count lines.

---

## React Integration (not tested via ACs, implemented to spec)

- "Export CSV" button in the page header, enabled when items.length > 0
- Button triggers client-side download using the same Blob/URL pattern as work-allocation page
- Export operates on the currently filtered/displayed items, not the unfiltered full set

---

## Notes

- The 8-column order matches Rule 6 from FEATURE_SPEC.md: Priority, Category, Type, Title, Detail, Suggestion, State, Claim Type.
- Follow the `csvEscape` pattern from `src/event-matrix/index.ts` for consistent escaping across the codebase.
