# Feature Specification -- react-action-items

| Field | Value |
|-------|-------|
| Slug | `react-action-items` |
| Priority | P1 |
| Effort | XL |
| Status | Ready |

---

## 1. Feature Intent

**Why this feature exists.**

Analysts currently need to visit multiple pages -- Model Health, Work Allocation Dashboard, State Explorer -- to build a picture of where the process model has gaps. There is no single view that answers the question: "What needs to be resolved next, and how?"

react-action-items creates a `/action-items` page that consolidates every outstanding information gap from two sources (model completeness and WA task alignment) into a single prioritised, filterable, exportable list. The novel value is the **resolution suggestion** attached to each item: a generated, human-readable hint explaining what to do to close the gap.

This directly serves the system purpose (System Spec Section 1, "uncertainty as first-class content") by making incompleteness not just visible but actionable.

---

## 2. Scope

### In Scope
- New route `/action-items` added to sidebar navigation (between Work Allocation and Digital Twin)
- Summary cards: total items, high/medium/low counts, model health score, WA alignment percentage
- Filterable, sortable table of action items: filter by category, priority, state, claim type
- Expandable rows showing full detail, resolution suggestion, and deep links
- CSV export of the full action items list
- New pure functions: `getActionItems()`, `getActionItemSummary()`, `exportActionItemsCsv()`
- Resolution suggestion generation logic (the core novel contribution)

### Out of Scope
- Editing or resolving action items through the UI (the tool is read-only)
- Persisting resolution status (no database)
- Modifying existing model-health or wa-task-engine modules
- Adding new data sources beyond the two already defined

---

## 3. Actors Involved

### Business Analyst (primary user)
- **Can do:** View all action items, filter by category/priority/state/claim type, sort columns, expand rows for detail and suggestions, export CSV, click through to State Explorer or Event Matrix
- **Cannot do:** Mark items as resolved, edit suggestions, modify source data

### The Model (data actor)
- **What it does:** Provides states, transitions, events, WA tasks, and WA mappings consumed by the `getActionItems()` function
- **What it cannot do:** Model is read-only

---

## 4. Behaviour Overview

### Action Item Types

**Source 1 -- Model Completeness (from model-health module):**

| Type | Derived From | Priority | Title Pattern |
|------|-------------|----------|---------------|
| Open question | Events where `hasOpenQuestions === true` | Medium | "Open question: {event.name} at {event.state}" |
| Low completeness | States where `completeness < 50` | Medium | "Low completeness: {state.uiLabel} ({completeness}%)" |
| Unreachable state | States with no incoming transitions (non-initial) | High | "Unreachable state: {state.uiLabel}" |
| No end-state path | Claim type cannot reach a terminal state from initial | High | "No path to end state: {claimTypeName}" |

**Source 2 -- WA Task Alignment (from wa-task-engine module):**

| Type | Derived From | Priority | Title Pattern |
|------|-------------|----------|---------------|
| Gap task | `alignment === 'gap'`, no mapped events | High | "WA gap: {task.taskName} has no event" |
| Partial task | `alignment === 'partial'`, coarser granularity | Medium | "WA partial: {task.taskName} -- {missing}" |
| Event with no WA task | Events that appear in no mapping's `eventIds` | Low | "No WA task for event: {event.name} at {event.state}" |

### Priority Rules

| Priority | Criteria | Colour |
|----------|----------|--------|
| High | Unreachable states, no end-state path, WA gap tasks | Red (`#EF4444`) |
| Medium | Open questions, low-completeness states, WA partial tasks | Amber (`#F59E0B`) |
| Low | Events with no WA task (informational) | Slate (`#6B7280`) |

### Happy path -- page landing
1. Analyst clicks "Action Items" in the sidebar
2. Summary cards render: total count, high/medium/low counts, model health score (good/fair/poor), WA alignment percentage
3. Table renders all action items sorted by priority (high first), then alphabetically within priority

### Happy path -- filtering
1. Analyst selects "Model Completeness" from the category filter
2. Table shows only model-derived items; summary cards update to reflect filtered counts
3. Analyst adds "High" priority filter; table narrows further
4. Analyst types a state name in the search box; table filters to matching items

### Happy path -- expand row
1. Analyst clicks a row to expand it
2. Detail panel shows: full notes/alignment notes, resolution suggestion text, and deep links (State Explorer link for state-related items, Event Matrix link for event-related items)

### Happy path -- CSV export
1. Analyst clicks "Export CSV"
2. Browser downloads `action-items.csv` with columns: Priority, Category, Title, Detail, Suggestion, State, Claim Type

---

## 5. State & Lifecycle Interactions

This feature is **state-querying**. It reads model and WA data to compose a consolidated view but does not modify any system state.

- **States entered:** None
- **States exited:** None
- **States modified:** None
- **Feature type:** Pure query, aggregation, and display

---

## 6. Rules & Decision Logic

### Rule 1: ActionItem shape

Each action item is a flat object:

```
ActionItem {
  id: string            // deterministic: "{category}-{type}-{sourceId}"
  priority: 'high' | 'medium' | 'low'
  category: 'Model Completeness' | 'WA Task Alignment'
  type: string          // 'open-question' | 'low-completeness' | 'unreachable' | 'no-end-path' | 'wa-gap' | 'wa-partial' | 'no-wa-task'
  title: string
  detail: string
  suggestion: string
  state: string | null  // state technical name, if applicable
  claimType: string | null
  linkPath: string | null  // deep link to State Explorer or Event Matrix
}
```

### Rule 2: Resolution suggestion generation

The suggestions are the novel value. Each type has a deterministic suggestion template:

| Type | Suggestion Template |
|------|-------------------|
| `open-question` | "Clarify {event.name} at {state}: {first 100 chars of notes}. Review in Event Matrix to resolve." |
| `low-completeness` | "Define missing transitions and events for '{state.uiLabel}' (currently {completeness}%). Target: above 50%." |
| `unreachable` | "Add an incoming transition to '{state.uiLabel}' from another live state, or remove it if obsolete." |
| `no-end-path` | "Review {claimTypeName} state model: no valid path from initial to CLOSED/DRAFT_DISCARDED. Add missing transitions." |
| `wa-gap` | "Add a '{task.triggerDescription}' event to the model to cover WA task '{task.taskName}'. {mapping.alignmentNotes}" |
| `wa-partial` | "Refine event granularity: {mapping.alignmentNotes}" |
| `no-wa-task` | "Consider whether '{event.name}' at {state} should trigger a caseworker task. If so, add a WA task mapping." |

### Rule 3: Deduplication

- Each source item produces exactly one ActionItem. No deduplication across sources (a state can appear as both "low completeness" and "unreachable" -- these are separate items).
- "Events with no WA task" excludes system events (`isSystemEvent === true`), since system events do not trigger caseworker tasks.

### Rule 4: Summary calculation

`getActionItemSummary(items)` returns:
- `total`: items.length
- `high`: count where priority === 'high'
- `medium`: count where priority === 'medium'
- `low`: count where priority === 'low'
- `modelScore`: the `overallScore` from `getModelHealthSummary()` ('good'/'fair'/'poor')
- `waAlignmentPct`: `aligned / totalWaTasks * 100` from `getAlignmentSummary()`

### Rule 5: Deep link generation

| Item type | Link |
|-----------|------|
| State-related (low-completeness, unreachable) | `/state-explorer?highlight={stateId}` |
| Event-related (open-question, no-wa-task) | `/event-matrix?search={eventName}` |
| WA gap/partial | `/work-allocation` (dashboard shows full context) |
| No end-state path | `/state-explorer` (claim type view) |

### Rule 6: CSV export format

Columns: `Priority, Category, Type, Title, Detail, Suggestion, State, Claim Type`

Uses the same `csvEscape` pattern as `event-matrix/index.ts`.

### Rule 7: Default sort order

Primary: priority (high > medium > low). Secondary: category (Model Completeness before WA Task Alignment). Tertiary: title alphabetical.

---

## 7. Dependencies

### System components consumed
| Module | Functions Used |
|--------|--------------|
| `model-health` (`src/model-health/index.ts`) | `getModelHealthSummary`, `getLowCompletenessStates`, `getUnreachableStates`, `canReachEndState`, `getOpenQuestionCount` |
| `ui-model-health` (`src/ui-model-health/index.ts`) | `getHealthSummaryCard`, `getOpenQuestionsList`, `getLowCompletenessPanel`, `getUnreachableStatesPanel` |
| `wa-task-engine` (`src/wa-task-engine/index.ts`) | `getAlignmentSummary`, `getUnmappedTasks`, `getPartialTasks` |
| `ui-wa-tasks` (`src/ui-wa-tasks/index.ts`) | `getWaTaskBadge` |
| `event-matrix` (`src/event-matrix/index.ts`) | CSV escape pattern (reference for export) |
| `app-shell` (`src/app-shell/index.ts`) | `ROUTES` (extend with `/action-items`), `CLAIM_TYPES` |

### Data files
- `data/wa-tasks.json` (17 WA tasks)
- `data/wa-mappings.json` (17 event-to-task mappings)

### External systems
- None

---

## 8. Non-Functional Considerations

- **Performance:** Not a concern. Action items are derived from small datasets (hundreds of events/states, 17 WA tasks). All computation is client-side at render time.
- **Accessibility:** Priority colours always accompanied by text labels. Expandable rows use accessible disclosure patterns.
- **Error tolerance:** Page renders with zero items if data is unavailable. Summary cards show zeroes rather than failing.

---

## 9. Assumptions & Open Questions

### Assumptions
- ASSUMPTION: Action item helper functions are pure TypeScript in `src/action-items/index.ts`, following the logic layer pattern. A UI orchestration file may be added at `src/ui-action-items/index.ts` if needed.
- ASSUMPTION: The React page lives at `app/action-items/page.tsx`, following the existing page pattern in `app/work-allocation/page.tsx`.
- ASSUMPTION: "Events with no WA task" is scoped to events within the active claim type (or all claim types if no filter is applied). System events are excluded.
- ASSUMPTION: CSV export is client-side browser download, same as work-allocation and event-matrix pages.

### Open Questions
1. Should "events with no WA task" items be included by default or hidden behind a toggle? They could be noisy. Recommendation: include but default to low priority so they sort to the bottom.
2. Should the page support a "claim type" filter or show all claim types at once? Recommendation: show all claim types by default with a claim type filter dropdown to narrow down.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions:
- Pure helper functions follow the logic/UI helper layer pattern (System Spec Section 11, Layers 1-2)
- Read-only querying respects the read-only invariant
- Resolution suggestions serve the "uncertainty as first-class content" principle by making gaps actionable
- Route addition extends the existing ROUTES pattern in app-shell

**No contradiction** with the current system specification.

---

## 11. Story Candidates

### Story 1: action-item-collection (M)
Implement the `getActionItems()` pure function that collects items from both model-health and wa-task-engine sources, assigns priorities, and generates resolution suggestion text.

**Key deliverables:**
- `ActionItem` type definition
- `getActionItems(states, transitions, events, waTasks, waMappings)` function
- `getActionItemSummary(items)` function
- Resolution suggestion generation logic (the templates in Rule 2)
- Unit tests covering all 7 item types, priority assignment, and suggestion text

### Story 2: action-item-display (L)
Build the React page at `/action-items` with summary cards, filterable/sortable table, and expandable rows.

**Key deliverables:**
- Route `/action-items` added to ROUTES in app-shell
- Summary cards (total, high/medium/low, model score, WA alignment %)
- Filterable table: category, priority, state, claim type filters
- Sortable columns: priority, category, title
- Expandable rows showing detail, suggestion, and deep links
- Follows the React patterns in `app/work-allocation/page.tsx`

### Story 3: action-item-export (S)
Add CSV export capability.

**Key deliverables:**
- `exportActionItemsCsv(items)` function returning `{ content, filename, mimeType }`
- "Export CSV" button in the page header
- Client-side download trigger (same pattern as work-allocation page)

---

## 12. Change Log (Feature-Level)

| Date | Change | Reason | Raised By |
|------|--------|--------|-----------|
| 2026-03-27 | Initial feature specification created | Feature pipeline kickoff for consolidated action items page | Alex (System Spec Agent) |
