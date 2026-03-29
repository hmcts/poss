# Test Spec -- react-action-items

## Understanding

The react-action-items feature consolidates model completeness gaps and WA task alignment issues into a single prioritised list of action items. It exposes pure functions: `getActionItems()` collects items from model-health and wa-task-engine sources with deterministic priorities and suggestion text; `getActionItemSummary()` counts by priority; `filterActionItems()` and `sortActionItems()` support table interactions; `exportActionItemsCsv()` produces RFC 4180 CSV output. All functions are pure -- no DOM, no React. The bridge module is `src/ui-action-items/index.js`.

There are 7 item types across two categories (Model Completeness: open-question, low-completeness, unreachable, no-end-path; WA Task Alignment: wa-gap, wa-partial, no-wa-task). Priority assignment is deterministic: high for structural gaps, medium for quality issues, low for informational items.

## AC to Test ID Mapping

| AC | Test ID | Description |
|----|---------|-------------|
| AC-1-1 | T-1-1 | Open questions produce medium-priority items with correct suggestion text |
| AC-1-2 | T-1-2 | Unreachable states and no-end-path produce high-priority items |
| AC-1-3 | T-1-3 | Low-completeness states produce medium-priority items |
| AC-1-4 (gap) | T-1-3b | WA gap tasks from real data produce high-priority items |
| AC-1-4 (partial) | T-1-4 | WA partial tasks from real data produce medium-priority items |
| AC-1-5 | T-1-5 | Events with no WA task (excluding system events) produce low-priority items |
| AC-1-6 | T-1-6 | getActionItemSummary counts correctly; no deduplication across types |
| AC-2-1 | T-2-1 | filterActionItems filters by category |
| AC-2-2 | T-2-2 | filterActionItems filters by priority |
| AC-2-3 | T-2-3 | filterActionItems supports text search |
| AC-2-4 | T-2-4 | filterActionItems composes multiple filters |
| AC-2-5 | T-2-5 | sortActionItems applies default and custom sort |
| AC-2-6 | T-2-6 | Deep link paths use correct routes per item type |
| AC-3-1 | T-3-1 | CSV has correct headers and row data |
| AC-3-2 | T-3-2 | CSV escapes commas, quotes, and newlines |
| AC-3-3 | T-3-3 | Empty array returns header-only CSV |
| AC-3-4 | T-3-4 | CSV exports filtered items (caller responsibility) |

## Key Assumptions

- The bridge module at `src/ui-action-items/index.js` re-exports all five functions.
- `getActionItems()` accepts `(states, transitions, events, waTasks, waMappings)` and returns `ActionItem[]`.
- Real `wa-tasks.json` has 1 gap task (wa-task-17) and 9 partial tasks.
- System events are excluded only from the `no-wa-task` item type, not from open questions.
- Default sort: priority (high > medium > low), category (Model Completeness before WA Task Alignment), title (alphabetical).
- CSV columns: Priority, Category, Type, Title, Detail, Suggestion, State, Claim Type.
