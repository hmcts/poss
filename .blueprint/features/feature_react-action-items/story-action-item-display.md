# Story: action-item-display

**Feature:** react-action-items
**Story:** Summary cards, filterable/sortable table, expandable rows, deep links
**Effort:** L
**Module:** `src/ui-action-items/index.ts` (pure helpers), `app/action-items/page.tsx` (React page)

---

## Overview

Build the UI orchestration layer and React page for the action items view. The pure helper functions `getActionItemSummary()`, `filterActionItems()`, and sort logic live in `src/ui-action-items/index.ts` and are testable without a DOM. The React page at `/action-items` consumes these helpers.

Note: `getActionItemSummary()` may live in `src/action-items/index.ts` (Story 1) or `src/ui-action-items/index.ts`. ACs below test the function regardless of location.

## Key Function Signatures

```ts
filterActionItems(items: ActionItem[], filters: ActionItemFilters): ActionItem[]
sortActionItems(items: ActionItem[], sortKey?: string, sortDir?: 'asc' | 'desc'): ActionItem[]
```

```ts
interface ActionItemFilters {
  category?: 'Model Completeness' | 'WA Task Alignment' | null;
  priority?: 'high' | 'medium' | 'low' | null;
  search?: string;
  claimType?: string | null;
}
```

---

## Acceptance Criteria

### AC-2-1: filterActionItems filters by category

**Given** an `ActionItem[]` of 10 items: 4 with `category === 'Model Completeness'` and 6 with `category === 'WA Task Alignment'`
**When** `filterActionItems(items, { category: 'Model Completeness' })` is called
**Then** the result contains exactly 4 items, all with `category === 'Model Completeness'`

**When** `filterActionItems(items, { category: null })` is called
**Then** the result contains all 10 items (no category filter applied)

**Test approach:** Build array of ActionItem objects with mixed categories, assert filtered length and field values.

---

### AC-2-2: filterActionItems filters by priority

**Given** an `ActionItem[]` containing 2 high, 5 medium, and 3 low items
**When** `filterActionItems(items, { priority: 'high' })` is called
**Then** the result contains exactly 2 items, all with `priority === 'high'`

**Test approach:** Build array, filter by priority, assert count.

---

### AC-2-3: filterActionItems supports text search across title, detail, and state fields

**Given** an `ActionItem[]` containing:
- Item A: `title: "Unreachable state: Hearing Listed"`, `detail: "No incoming transitions"`, `state: "HEARING_LISTED"`
- Item B: `title: "WA gap: Review Failed Payment"`, `detail: "No event"`, `state: null`
- Item C: `title: "Low completeness: Draft (20%)"`, `detail: "Missing transitions"`, `state: "DRAFT"`

**When** `filterActionItems(items, { search: 'hearing' })` is called (case-insensitive)
**Then** the result contains exactly 1 item (Item A), because "hearing" matches its title

**When** `filterActionItems(items, { search: 'transitions' })` is called
**Then** the result contains 2 items (A and C), because "transitions" appears in their detail fields

**Test approach:** Three-item array, verify search matches across title, detail, and state. Confirm case-insensitivity.

---

### AC-2-4: filterActionItems composes multiple filters together

**Given** an `ActionItem[]` containing:
- Item 1: category "Model Completeness", priority "high", title contains "unreachable"
- Item 2: category "Model Completeness", priority "medium", title contains "low completeness"
- Item 3: category "WA Task Alignment", priority "high", title contains "gap"

**When** `filterActionItems(items, { category: 'Model Completeness', priority: 'high' })` is called
**Then** the result contains exactly 1 item (Item 1)

**When** `filterActionItems(items, { category: 'Model Completeness', priority: 'high', search: 'gap' })` is called
**Then** the result contains 0 items (Item 1 matches category+priority but not search)

**Test approach:** Three-item array, apply combined filters, assert intersection logic.

---

### AC-2-5: sortActionItems applies default sort order and custom sort keys

**Given** an `ActionItem[]` in random order:
- Item A: priority "low", category "WA Task Alignment", title "Zebra"
- Item B: priority "high", category "Model Completeness", title "Alpha"
- Item C: priority "high", category "WA Task Alignment", title "Beta"
- Item D: priority "medium", category "Model Completeness", title "Gamma"

**When** `sortActionItems(items)` is called with no arguments (default sort)
**Then** the result order is: B, C, D, A (high before medium before low; within high, Model Completeness before WA Task Alignment; within same priority+category, alphabetical by title)

**When** `sortActionItems(items, 'title', 'asc')` is called
**Then** the result order is: B (Alpha), C (Beta), D (Gamma), A (Zebra)

**Test approach:** Four-item array in shuffled order, assert exact ordering for both default and custom sort.

---

### AC-2-6: Deep link paths are correctly set per item type

**Given** an `ActionItem[]` with one item of each type:
- `type: 'low-completeness'`, `state: 'HEARING_LISTED'`
- `type: 'unreachable'`, `state: 'STRUCK_OUT'`
- `type: 'open-question'` with event name `"Submit Claim"`
- `type: 'no-wa-task'` with event name `"Adjourn Hearing"`
- `type: 'wa-gap'`
- `type: 'wa-partial'`
- `type: 'no-end-path'`

**When** each item's `linkPath` is examined
**Then**:
- low-completeness: `'/state-explorer?highlight=HEARING_LISTED'`
- unreachable: `'/state-explorer?highlight=STRUCK_OUT'`
- open-question: `'/event-matrix?search=Submit Claim'`
- no-wa-task: `'/event-matrix?search=Adjourn Hearing'`
- wa-gap: `'/work-allocation'`
- wa-partial: `'/work-allocation'`
- no-end-path: `'/state-explorer'`

**Test approach:** This validates `getActionItems()` output from Story 1, or a dedicated `getDeepLink(type, state, eventName)` helper. Verify each linkPath string exactly.

---

## React Page Behaviour (not tested via ACs, implemented to spec)

- Route `/action-items` added to `ROUTES` in `app-shell`
- Summary cards display: total, high (red), medium (amber), low (slate) counts
- Table columns: Priority, Category, Title, State, Claim Type
- Expandable rows show: detail, suggestion text, deep link button
- Filter dropdowns for category, priority, claim type; text search box
- Default sort: priority desc, category, title asc

---

## Notes

- All ACs test pure functions callable from Node.js -- no DOM or React dependencies.
- The React page wires these helpers to UI components following the pattern in `app/work-allocation/page.tsx`.
- `filterActionItems` with an empty/all-null filters object returns all items unchanged.
