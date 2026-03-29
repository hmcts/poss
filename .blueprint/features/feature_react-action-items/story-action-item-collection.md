# Story: action-item-collection

**Feature:** react-action-items
**Story:** Core logic -- collect action items from both sources, assign priorities, generate suggestions
**Effort:** M
**Module:** `src/action-items/index.ts`

---

## Overview

Implement the `getActionItems()` pure function that iterates model-health and wa-task-engine sources, produces a flat `ActionItem[]` with deterministic IDs, priorities, and resolution suggestion strings. Also implement `getActionItemSummary()` for summary counts.

## Key Function Signatures

```ts
getActionItems(states, transitions, events, waTasks, waMappings): ActionItem[]
getActionItemSummary(items): { total, high, medium, low }
```

## Dependencies

| Module | Functions consumed |
|--------|-------------------|
| `model-health` | `getLowCompletenessStates`, `getUnreachableStates`, `canReachEndState` |
| `ui-model-health` | `getOpenQuestionsList` |
| `wa-task-engine` | `getUnmappedTasks`, `getPartialTasks` |

## ActionItem Type

```ts
interface ActionItem {
  id: string;              // "{category}-{type}-{sourceId}"
  priority: 'high' | 'medium' | 'low';
  category: 'Model Completeness' | 'WA Task Alignment';
  type: string;            // one of 7 types below
  title: string;
  detail: string;
  suggestion: string;
  state: string | null;
  claimType: string | null;
  linkPath: string | null;
}
```

---

## Acceptance Criteria

### AC-1-1: Open questions produce medium-priority items with correct suggestion text

**Given** an events array containing two events where `hasOpenQuestions === true` (one with notes "Budget unclear for hearing fees" and one that is a system event with open questions)
**When** `getActionItems(states, transitions, events, waTasks, waMappings)` is called
**Then** the result contains one item per open-question event (including system events -- the system-event exclusion only applies to the "no WA task" type), each with:
- `priority` === `'medium'`
- `category` === `'Model Completeness'`
- `type` === `'open-question'`
- `title` matching `"Open question: {event.name} at {event.state}"`
- `suggestion` matching `"Clarify {event.name} at {state}: {first 100 chars of notes}. Review in Event Matrix to resolve."`
- `linkPath` === `'/event-matrix?search={eventName}'`
- `id` === `'Model Completeness-open-question-{event.id}'`

**Test approach:** Construct minimal events array with `hasOpenQuestions: true`, verify each returned item field.

---

### AC-1-2: Unreachable states and no-end-path produce high-priority items

**Given** a states array with three states: one initial (`isDraftLike: true`), one live non-end state with no incoming transitions, and one end state -- plus a transitions array that does NOT connect initial to the end state
**When** `getActionItems(states, transitions, events, [], [])` is called
**Then** the result contains:
1. One item with `type === 'unreachable'`, `priority === 'high'`, `title` matching `"Unreachable state: {state.uiLabel}"`, `suggestion` matching `"Add an incoming transition to '{state.uiLabel}' from another live state, or remove it if obsolete."`, and `linkPath === '/state-explorer?highlight={stateId}'`
2. One item with `type === 'no-end-path'`, `priority === 'high'`, `title` matching `"No path to end state: {claimTypeName}"`, `suggestion` containing `"Review {claimTypeName} state model"`, and `linkPath === '/state-explorer'`

**Test approach:** Build minimal states/transitions that trigger both conditions. Assert item count and field values.

---

### AC-1-3: Low-completeness states produce medium-priority items

**Given** a states array containing one state with `completeness: 30` and `uiLabel: 'Hearing Listed'`, and one state with `completeness: 80`
**When** `getActionItems(states, transitions, events, [], [])` is called
**Then** exactly one low-completeness item is returned with:
- `priority` === `'medium'`
- `type` === `'low-completeness'`
- `title` === `"Low completeness: Hearing Listed (30%)"`
- `suggestion` === `"Define missing transitions and events for 'Hearing Listed' (currently 30%). Target: above 50%."`
- `linkPath` === `'/state-explorer?highlight={stateId}'`

The state with completeness 80 does not produce a low-completeness item.

**Test approach:** Two-state array, assert only the sub-50% state yields an item.

---

### AC-1-4: WA gap tasks produce high-priority items and partial tasks produce medium-priority items

**Given** the real `wa-tasks.json` (17 tasks) and `wa-mappings.json` (17 mappings) loaded from `data/`
**When** `getActionItems([], [], [], waTasks, waMappings)` is called
**Then** the result contains:
1. Exactly 1 item with `type === 'wa-gap'` and `priority === 'high'` (wa-task-17, "Review Failed Payment"), with `title === "WA gap: Review Failed Payment has no event"` and `suggestion` containing `"Add a 'User makes a payment but it fails' event"` and the mapping's `alignmentNotes`
2. Exactly 9 items with `type === 'wa-partial'` and `priority === 'medium'` (wa-task-04 through wa-task-07, wa-task-09 through wa-task-12, wa-task-16), each with `suggestion` starting with `"Refine event granularity:"` followed by the mapping's `alignmentNotes`
3. All WA items have `category === 'WA Task Alignment'` and `linkPath === '/work-allocation'`

**Test approach:** Load real data files, call function with empty model arrays, count and spot-check WA items.

---

### AC-1-5: Events with no WA task mapping produce low-priority items, excluding system events

**Given** an events array containing three events: `{name: "Submit Claim", isSystemEvent: false}`, `{name: "Case Issued", isSystemEvent: false}`, and `{name: "System Timeout", isSystemEvent: true}`, plus mappings where only "Case Issued" appears in some mapping's `eventIds`
**When** `getActionItems(states, transitions, events, waTasks, waMappings)` is called
**Then** the result contains:
1. One `'no-wa-task'` item for "Submit Claim" (not in any mapping) with `priority === 'low'`, `category === 'WA Task Alignment'`, `title === "No WA task for event: Submit Claim at {state}"`, `suggestion` containing `"Consider whether 'Submit Claim'"`, and `linkPath === '/event-matrix?search=Submit Claim'`
2. No `'no-wa-task'` item for "Case Issued" (it appears in a mapping's eventIds)
3. No `'no-wa-task'` item for "System Timeout" (it is a system event, excluded by Rule 3)

**Test approach:** Build events array and minimal mappings. Filter result to `type === 'no-wa-task'` and verify exactly one item.

---

### AC-1-6: getActionItemSummary returns correct counts and no deduplication occurs

**Given** an `ActionItem[]` containing 2 high, 3 medium, and 1 low items (one state appearing as both `unreachable` and `low-completeness` -- two separate items per Rule 3)
**When** `getActionItemSummary(items)` is called
**Then** it returns `{ total: 6, high: 2, medium: 3, low: 1 }`

Additionally, **given** a state that is both unreachable (no incoming transitions, non-initial) and low-completeness (completeness 20%)
**When** `getActionItems(...)` is called with that state
**Then** the result contains two separate items for the same state: one with `type === 'unreachable'` (high) and one with `type === 'low-completeness'` (medium). They have different `id` values.

**Test approach:** Test `getActionItemSummary` with hand-crafted array. Test deduplication rule by building a state that triggers both conditions and asserting two distinct items.

---

## Default Sort Order (for downstream consumers)

Items returned by `getActionItems()` are sorted:
1. Priority: high > medium > low
2. Category: "Model Completeness" before "WA Task Alignment"
3. Title: alphabetical ascending

---

## Notes

- `canReachEndState` is called once per claim type present in the states array. Group states by `claimType` before calling.
- Open questions use `getOpenQuestionsList(events)` from `ui-model-health`, which returns `{ count, events: OpenQuestionEvent[] }`.
- Suggestion strings are deterministic -- no randomness, no AI generation. Pure template interpolation.
