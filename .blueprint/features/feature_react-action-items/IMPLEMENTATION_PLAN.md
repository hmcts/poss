# Implementation Plan -- react-action-items

## Summary

Create `src/ui-action-items/index.ts` exposing 5 pure functions that consolidate model-health and wa-task-engine outputs into a prioritised, filterable, exportable action items list. Add a bridge file `src/ui-action-items/index.js`, a React page at `app/action-items/page.tsx`, and a new route in `src/app-shell/index.ts`. All domain logic delegates to existing modules; no duplication.

## Files to Create/Modify

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/ui-action-items/index.ts` | Core module: 5 exported functions + ActionItem type + csvEscape helper |
| Create | `src/ui-action-items/index.js` | Bridge re-export (same pattern as `src/ui-wa-tasks/index.js`) |
| Create | `app/action-items/page.tsx` | React page with summary cards, filterable table, CSV export button |
| Modify | `src/app-shell/index.ts` | Add `/action-items` route to ROUTES array (between Work Allocation and Digital Twin) |

## Function Signatures and Logic

| Function | Signature | Key Logic |
|----------|-----------|-----------|
| `getActionItems` | `(states, transitions, events, waTasks, waMappings) => ActionItem[]` | 1) Call `getOpenQuestionsList(events)` -> open-question items (medium). 2) Call `getLowCompletenessStates(states)` -> low-completeness items (medium). 3) Call `getUnreachableStates(states, transitions)` -> unreachable items (high). 4) Call `canReachEndState` per claim type -> no-end-path items (high). 5) Call `getUnmappedTasks(waTasks, waMappings)` -> wa-gap items (high). 6) Call `getPartialTasks(waTasks, waMappings)` -> wa-partial items (medium). 7) Find events not in any mapping's eventIds, exclude `isSystemEvent` -> no-wa-task items (low). 8) Concat all, apply default sort. |
| `getActionItemSummary` | `(items) => { total, high, medium, low }` | Count items by priority using reduce. |
| `filterActionItems` | `(items, filters) => ActionItem[]` | Filter with AND composition: category (exact), priority (exact), search (case-insensitive substring across title+detail+state), claimType (exact). Null/missing filter fields skip that filter. |
| `sortActionItems` | `(items, sortKey?, sortDir?) => ActionItem[]` | Default: priority rank (high=0, medium=1, low=2), then category rank (Model Completeness=0, WA Task Alignment=1), then title localeCompare. Custom: sort by sortKey + sortDir. Always returns new array. |
| `exportActionItemsCsv` | `(items) => { content, filename, mimeType }` | Header row + data rows. Use csvEscape (copy pattern from event-matrix). Null values become empty strings. Return `{ content, filename: 'action-items.csv', mimeType: 'text/csv' }`. |

## Implementation Steps

1. **Create `src/ui-action-items/index.ts` with ActionItem interface and ID builder.** Define the ActionItem type and a helper `buildId(category, type, sourceId)` returning `"{category}-{type}-{sourceId}"`. *(Scaffolding for all tests)*

2. **Implement `getActionItemSummary`.** Simple reduce over items counting by priority. *(Passes T-1-6)*

3. **Implement `filterActionItems`.** Apply each non-null filter field as AND predicate; search is case-insensitive substring match on title, detail, and state (null state treated as empty string). *(Passes T-2-1, T-2-2, T-2-3, T-2-4)*

4. **Implement `sortActionItems`.** Define priority rank map and category rank map. Default sort uses three-level comparator. Custom sort uses `sortKey` property access with `sortDir` flip. *(Passes T-2-5a, T-2-5b)*

5. **Implement `exportActionItemsCsv` with csvEscape helper.** Copy csvEscape from `src/event-matrix/index.ts`. Build header + rows, convert nulls to empty strings before escaping. *(Passes T-3-1, T-3-2, T-3-3, T-3-4)*

6. **Implement `getActionItems` -- model completeness items.** Call `getOpenQuestionsList(events)` for open-question items (both system and non-system events). Call `getLowCompletenessStates(states)` and `getUnreachableStates(states, transitions)`. Generate title, detail, suggestion per spec templates. Set linkPath per type. *(Passes T-1-1)*

7. **Implement `getActionItems` -- WA alignment items.** Call `getUnmappedTasks` for wa-gap, `getPartialTasks` for wa-partial. Build all mapped eventIds into a Set, then find events not in the set excluding `isSystemEvent === true` for no-wa-task items. *(Passes T-1-3b, T-1-4, T-1-5)*

8. **Create bridge file `src/ui-action-items/index.js`.** Single line: `export { getActionItems, getActionItemSummary, filterActionItems, sortActionItems, exportActionItemsCsv } from './index.ts';` *(Enables test imports)*

9. **Add route to `src/app-shell/index.ts`.** Insert `{ path: '/action-items', label: 'Action Items', icon: 'list' }` at index 3 (after Work Allocation, before Digital Twin).

10. **Create `app/action-items/page.tsx`.** React page following `app/work-allocation/page.tsx` patterns: load data, call getActionItems, render summary cards and table with filter/sort/export controls.

## Risks

| Risk | Mitigation |
|------|------------|
| wa-tasks.json data shape changes break T-1-3b/T-1-4 counts (1 gap, 9 partial) | Pin assertions to current data; read wa-tasks.json to verify before implementing |
| `getOpenQuestionsList` returns UI-shaped objects, not raw events | Use it only for open-question collection; access `.events` array for mapping to ActionItems |
| no-wa-task detection requires building full Set of mapped eventIds across all mappings | Flatten all `mapping.eventIds` into a single Set; test with real data to confirm coverage |
| csvEscape duplication from event-matrix | Acceptable for module isolation; could extract to shared util later |
| `canReachEndState` is per-claim-type but test does not exercise no-end-path | Implement but prioritise items the tests actually verify; no-end-path logic is low risk |
