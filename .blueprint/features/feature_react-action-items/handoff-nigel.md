# Handoff -- react-action-items

**From:** Nigel (Tester Agent)
**To:** Codey (Developer)
**Date:** 2026-03-27

## Test artefacts

- **Test spec:** `test/artifacts/feature_react-action-items/test-spec.md`
- **Test file:** `test/feature_react-action-items.test.js`

## What to implement

Create `src/ui-action-items/index.js` re-exporting 5 pure functions (implementation may live in `src/action-items/index.js` or directly in the ui module):

| Function | Signature | Purpose |
|----------|-----------|---------|
| `getActionItems` | `(states, transitions, events, waTasks, waMappings) => ActionItem[]` | Collects items from model-health (unreachable, low-completeness, no-end-path, open-question) and wa-task-engine (wa-gap, wa-partial, no-wa-task). Returns sorted array. |
| `getActionItemSummary` | `(items) => { total, high, medium, low }` | Counts items by priority. |
| `filterActionItems` | `(items, filters) => ActionItem[]` | Filters by category, priority, search text (case-insensitive across title/detail/state), and claimType. Null/missing filter fields mean "no filter". Composes as AND. |
| `sortActionItems` | `(items, sortKey?, sortDir?) => ActionItem[]` | Default sort: priority (high > medium > low), then category (Model Completeness before WA Task Alignment), then title (alphabetical). Custom sort by any field + direction. |
| `exportActionItemsCsv` | `(items) => { content, filename, mimeType }` | RFC 4180 CSV with 8 columns: Priority, Category, Type, Title, Detail, Suggestion, State, Claim Type. Null values become empty strings. filename = `'action-items.csv'`, mimeType = `'text/csv'`. |

## ActionItem shape

```js
{
  id: string,           // "{category}-{type}-{sourceId}"
  type: string,         // 'open-question' | 'low-completeness' | 'unreachable' | 'no-end-path' | 'wa-gap' | 'wa-partial' | 'no-wa-task'
  category: string,     // 'Model Completeness' | 'WA Task Alignment'
  priority: string,     // 'high' | 'medium' | 'low'
  title: string,
  detail: string,
  suggestion: string,
  state: string | null,
  claimType: string | null,
  linkPath: string | null
}
```

## Key contract notes

- **Dependencies:** Delegate to `model-health` (`getLowCompletenessStates`, `getUnreachableStates`, `canReachEndState`), `ui-model-health` (`getOpenQuestionsList`), and `wa-task-engine` (`getUnmappedTasks`, `getPartialTasks`).
- **Priority rules:** high = unreachable, no-end-path, wa-gap; medium = open-question, low-completeness, wa-partial; low = no-wa-task.
- **System event exclusion:** System events (`isSystemEvent: true`) are excluded only from `no-wa-task` items, NOT from `open-question` items.
- **No deduplication:** A state that is both unreachable and low-completeness produces two separate items with different IDs.
- **Real data:** `wa-tasks.json` has 1 gap task (wa-task-17) and 9 partial tasks. Tests verify against real data files.
- **CSV escaping:** Follow the `csvEscape` pattern from `src/event-matrix/index.ts`. Fields with commas, quotes, or newlines must be RFC 4180 compliant.
- **Link paths:** unreachable/low-completeness -> `/state-explorer?highlight={stateId}`; open-question/no-wa-task -> `/event-matrix?search={eventName}`; wa-gap/wa-partial -> `/work-allocation`; no-end-path -> `/state-explorer`.

## Run tests

```bash
node --test test/feature_react-action-items.test.js
```
