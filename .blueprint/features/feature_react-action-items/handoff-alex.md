# Handoff -- react-action-items

**From:** Alex (System Spec Agent)
**To:** Cass (BA Agent)
**Date:** 2026-03-27

## What this feature does

Consolidated action items page at `/action-items` that collects every outstanding gap from two sources (model completeness + WA task alignment) into a single prioritised, filterable, exportable list. Each item includes a generated resolution suggestion -- the novel value of this feature.

## Key dependencies

| Module | What it provides |
|--------|-----------------|
| `model-health` | `getModelHealthSummary`, `getLowCompletenessStates`, `getUnreachableStates`, `canReachEndState`, `getOpenQuestionCount` |
| `ui-model-health` | `getHealthSummaryCard`, `getOpenQuestionsList`, `getLowCompletenessPanel`, `getUnreachableStatesPanel` |
| `wa-task-engine` | `getAlignmentSummary`, `getUnmappedTasks`, `getPartialTasks` |
| `ui-wa-tasks` | `getWaTaskBadge` |
| `app-shell` | `ROUTES` (extend), `CLAIM_TYPES` |
| Data files | `data/wa-tasks.json` (17 tasks), `data/wa-mappings.json` (17 mappings) |

## Implementation approach

Follows the 3-layer pattern established by the project:

1. **Logic layer** -- `src/action-items/index.ts`: Pure `getActionItems()` function that iterates both sources, assigns priorities, generates suggestion strings. Also `getActionItemSummary()` and `exportActionItemsCsv()`.
2. **React layer** -- `app/action-items/page.tsx`: Summary cards, filterable table, expandable rows, CSV download button. Follow the patterns in `app/work-allocation/page.tsx`.

### The core function: `getActionItems()`

This is the heart of the feature. It takes `(states, transitions, events, waTasks, waMappings)` and returns `ActionItem[]` by:

1. Calling `getOpenQuestionsList(events)` -- each open-question event becomes a medium-priority item
2. Calling `getLowCompletenessStates(states)` -- each state below 50% becomes a medium-priority item
3. Calling `getUnreachableStates(states, transitions)` -- each unreachable state becomes a high-priority item
4. Calling `canReachEndState(states, transitions)` -- if false, one high-priority item per claim type
5. Calling `getUnmappedTasks(waTasks, waMappings)` -- each gap task becomes a high-priority item
6. Calling `getPartialTasks(waTasks, waMappings)` -- each partial task becomes a medium-priority item
7. Finding events with no WA task mapping -- each becomes a low-priority item (system events excluded)

Each item gets a deterministic suggestion string generated from templates (see FEATURE_SPEC.md Rule 2).

## Suggested stories (3)

| # | Slug | Effort | Focus |
|---|------|--------|-------|
| 1 | action-item-collection | M | `getActionItems()`, `getActionItemSummary()`, suggestion generation, types, tests |
| 2 | action-item-display | L | React page, summary cards, filterable/sortable table, expandable rows, route registration |
| 3 | action-item-export | S | `exportActionItemsCsv()`, CSV download button |

## Watch points for stories

1. **Suggestion generation is the novel value** -- stories must specify the exact template strings per item type. The spec has 7 templates in Rule 2; acceptance criteria should test each.
2. **"Events with no WA task" can be noisy** -- there are likely many events with no mapping. Filter to non-system events and assign low priority so they sort to the bottom. Consider whether a toggle to hide them is needed.
3. **Deep links** use query params: `/state-explorer?highlight={stateId}` and `/event-matrix?search={eventName}`. Verify these are honoured by existing pages or note that receiving pages may need minor updates.
4. **Deduplication** -- a state can appear in multiple item types (e.g., both unreachable and low-completeness). These are separate items, not deduplicated. The spec is explicit about this.
5. **Multi-claim-type** -- `getActionItems()` should accept data for all claim types and produce items tagged with `claimType`. The page filter narrows the view. The `canReachEndState` check produces one item per claim type that fails.
