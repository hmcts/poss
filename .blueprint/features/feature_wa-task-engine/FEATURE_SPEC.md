# Feature Specification — wa-task-engine

## 1. Feature Intent
**Why this feature exists.**

The wa-data-model and wa-ingestion features have established the typed schemas and static JSON data for the 17 R1A Work Allocation tasks and their event mappings. However, no logic exists to query this data -- to answer questions like "which WA tasks fire when this event occurs?" or "how aligned is this set of tasks with the event model?"

wa-task-engine provides a set of pure, stateless TypeScript functions that resolve WA tasks for a given event or state, summarise alignment status, and filter tasks by context. These functions are the query layer that downstream UI features (ui-wa-tasks, react-digital-twin-wa, react-wa-dashboard) consume to present WA task information to analysts.

This supports the system purpose described in `.blueprint/system_specification/SYSTEM_SPEC.md`: enabling analysts to explore and interrogate the possession process model. WA task resolution adds the work allocation dimension -- analysts can see which caseworker tasks are triggered at each step and where the model has alignment gaps. The alignment summary functions directly serve the "uncertainty as first-class content" invariant by making gaps and partial alignments queryable, not hidden.

---

## 2. Scope
### In Scope
- `getTasksForEvent(eventId, mappings, tasks): WaTask[]` -- resolve all WA tasks triggered by a given event
- `getTasksForState(stateId, events, mappings, tasks): WaTask[]` -- find all events at a state, return their associated WA tasks (deduplicated)
- `getAlignmentSummary(tasks, mappings): { aligned: number, partial: number, gap: number }` -- count tasks by alignment status
- `getUnmappedTasks(tasks, mappings): WaTask[]` -- return tasks with no event mapping (gaps)
- `getPartialTasks(tasks, mappings): Array<{ task: WaTask, missing: string }>` -- return partially aligned tasks with explanation
- `getEventWaContext(eventId, mappings, tasks): { task: WaTask, alignment: WaAlignmentStatusValue, notes: string } | null` -- WA context for a single event
- `filterTasksByContext(tasks, context: WaTaskContextValue): WaTask[]` -- filter tasks by context type
- All functions pure, stateless, with no side effects
- Unit tests covering all functions with representative data

### Out of Scope
- UI orchestration or display logic (that is ui-wa-tasks)
- React components (that is react-digital-twin-wa, react-wa-dashboard)
- Modifying the WA task or mapping data (read-only queries only)
- Loading data into the store (that is data-loading)
- Any server-side or API logic (all functions operate on in-memory arrays)
- Extending or modifying the Zod schemas (those belong to wa-data-model)

---

## 3. Actors Involved

### The Model (data actor)
- **What it does:** Provides the `WaTask[]` and `WaTaskMapping[]` arrays (loaded from `data/wa-tasks.json` and `data/wa-mappings.json`) that all engine functions consume as input parameters.
- **What it cannot do:** The model is read-only. Engine functions query but never mutate the data.

### Business Analyst (indirect)
- **What they do:** They do not call these functions directly. They benefit because downstream UI features use these functions to surface WA task information in the State Explorer, Digital Twin, and WA Dashboard.
- **What they cannot do:** Nothing in this feature is user-facing.

---

## 4. Behaviour Overview

**Happy path -- event-level resolution:**
1. Caller passes an event ID (event name string) plus the mappings and tasks arrays.
2. `getTasksForEvent` finds all mappings where `eventIds` contains the given event ID.
3. For each matching mapping, it resolves the `waTaskId` to the full `WaTask` object from the tasks array.
4. Returns the matched `WaTask[]` array (may be empty if no WA task maps to this event).

**Happy path -- state-level resolution:**
1. Caller passes a state ID plus the events array (all events), mappings, and tasks.
2. `getTasksForState` filters events to those at the given state.
3. For each event at that state, it calls the event-level resolution logic.
4. Returns a deduplicated array of `WaTask` objects across all events at that state.

**Happy path -- alignment summary:**
1. Caller passes the full tasks and mappings arrays.
2. `getAlignmentSummary` counts tasks by their `alignment` field: aligned, partial, gap.
3. Returns `{ aligned: 7, partial: 9, gap: 1 }` for the current 17-task dataset.

**Happy path -- gap and partial queries:**
1. `getUnmappedTasks` returns tasks where `alignment === 'gap'` (currently task 17 only).
2. `getPartialTasks` returns tasks where `alignment === 'partial'`, each paired with the `alignmentNotes` from the corresponding mapping as the `missing` explanation.

**Happy path -- single event context:**
1. `getEventWaContext` looks up the mapping for a given event ID, resolves the task, and returns `{ task, alignment, notes }` or `null` if no mapping exists.

**Happy path -- context filter:**
1. `filterTasksByContext` filters the tasks array by `taskContext` field, returning only tasks matching the given context value (e.g. `'gen-app'`).

**Key alternatives:**
- An event with no WA task mapping returns an empty array from `getTasksForEvent` and `null` from `getEventWaContext`. This is normal -- many events do not trigger WA tasks.
- A state with no WA-triggering events returns an empty array from `getTasksForState`.
- An event that maps to multiple WA tasks returns all of them (e.g. if future mappings introduce this).

---

## 5. State & Lifecycle Interactions

This feature is **state-querying**, not state-transitioning. It reads state and event data to resolve WA tasks but does not modify any system state.

- **States entered:** None
- **States exited:** None
- **States modified:** None
- **Feature type:** Pure query logic

The functions accept state IDs and event IDs as parameters to resolve which WA tasks apply at a given point in the possession process lifecycle. They do not alter the lifecycle itself.

---

## 6. Rules & Decision Logic

### Rule 1: Event-to-task resolution uses eventIds array matching
- **Description:** A WA task maps to an event when the mapping's `eventIds` array contains the event's identifier (name string). A single event may match multiple mappings (and thus multiple tasks). A single mapping may reference multiple events.
- **Inputs:** Event ID (string), `WaTaskMapping[]`, `WaTask[]`
- **Outputs:** `WaTask[]` matching the event
- **Deterministic:** Yes -- pure array filtering and lookup

### Rule 2: State-level resolution is the union of event-level resolutions
- **Description:** `getTasksForState` finds all events at a state, resolves WA tasks for each, and returns the deduplicated union. Deduplication is by task ID (`WaTask.id`).
- **Inputs:** State ID, `Event[]`, `WaTaskMapping[]`, `WaTask[]`
- **Outputs:** Deduplicated `WaTask[]`
- **Deterministic:** Yes

### Rule 3: Alignment summary counts by the task's alignment field
- **Description:** The summary counts each task exactly once based on its `alignment` property. It does not recompute alignment -- it trusts the classification set at ingestion time.
- **Inputs:** `WaTask[]`, `WaTaskMapping[]`
- **Outputs:** `{ aligned: number, partial: number, gap: number }`
- **Deterministic:** Yes

### Rule 4: Gap tasks are those with alignment 'gap'
- **Description:** `getUnmappedTasks` filters by `task.alignment === 'gap'`. It does not check whether `eventIds` is empty -- the alignment field is authoritative. (In practice these should be consistent, but the alignment field is the source of truth.)
- **Inputs:** `WaTask[]`, `WaTaskMapping[]`
- **Outputs:** `WaTask[]` with gap alignment
- **Deterministic:** Yes

### Rule 5: Partial task explanation comes from alignmentNotes
- **Description:** `getPartialTasks` filters tasks with `alignment === 'partial'` and pairs each with the `alignmentNotes` from its corresponding mapping. The `missing` field in the return type is the `alignmentNotes` string.
- **Inputs:** `WaTask[]`, `WaTaskMapping[]`
- **Outputs:** `Array<{ task: WaTask, missing: string }>`
- **Deterministic:** Yes

### Rule 6: Context filtering is a simple enum match
- **Description:** `filterTasksByContext` returns tasks where `task.taskContext === context`. No fuzzy matching or hierarchy.
- **Inputs:** `WaTask[]`, `WaTaskContextValue`
- **Outputs:** `WaTask[]` matching the context
- **Deterministic:** Yes

---

## 7. Dependencies

### System components
- **wa-data-model** (upstream, implemented): Provides `WaTask`, `WaTaskMapping`, `WaTaskContextValue`, `WaAlignmentStatusValue` types from `src/data-model/schemas.ts` and `src/data-model/enums.ts`.
- **wa-ingestion** (upstream, implemented): Provides the static JSON data files (`data/wa-tasks.json`, `data/wa-mappings.json`) that are loaded into the arrays these functions consume.
- **data-model** (upstream, implemented): Provides the `Event` type from `src/data-model/schemas.ts`, used by `getTasksForState` to filter events by state.

### External systems
- None

### Policy or legislative dependencies
- None

### Operational dependencies
- The functions depend on correctly ingested WA task and mapping data. If the upstream data is malformed or incomplete, results will be incorrect. However, data validation is wa-ingestion's responsibility, not this feature's.

---

## 8. Non-Functional Considerations

- **Performance:** Not a concern. The dataset is 17 tasks, 17 mappings, and hundreds of events. All operations are simple array filters and lookups -- O(n) at worst, with n in the low hundreds.
- **Audit/logging:** Not applicable. These are pure functions with no side effects.
- **Error tolerance:** Functions should handle edge cases gracefully: unknown event IDs return empty arrays or null, unknown state IDs return empty arrays. No exceptions thrown for missing data.
- **Security:** Not applicable -- no user input, no authentication, internal tool.
- **Testability:** All functions are pure and stateless, making them straightforward to unit test with representative data fixtures. Tests should cover: events with tasks, events without tasks, states with mixed task coverage, all three alignment tiers, each context value, deduplication in state-level resolution, and empty input arrays.

---

## 9. Assumptions & Open Questions

### Assumptions
- **ASSUMPTION:** Event matching uses event name strings (e.g. "Case Issued", "Upload your documents") as stored in `WaTaskMapping.eventIds`. This matches the wa-ingestion design decision documented in the wa-ingestion feature spec.
- **ASSUMPTION:** `getTasksForEvent` matches against event names (`Event.name`), not generated event IDs (`Event.id` which are index-based like "MAIN_CLAIM_ENGLAND:0"). This is because the mapping data uses human-readable event names.
- **ASSUMPTION:** Deduplication in `getTasksForState` is by `WaTask.id`. If the same task is triggered by multiple events at the same state, it appears once in the result.
- **ASSUMPTION:** The `mappings` parameter always contains the full mappings array (all 17 entries). Functions do not need to handle partial mapping arrays or missing mappings for specific tasks.
- **ASSUMPTION:** These functions are consumed by ui-wa-tasks (UI orchestration layer) and not called directly from React components, following the established 3-layer architecture pattern.

### Open Questions
1. **Event name matching precision:** Should `getTasksForEvent` use exact string equality or case-insensitive matching when comparing event names to `eventIds` entries? Recommendation: exact equality, since both the event model and mappings are authored from the same source. Document this choice.
2. **Multiple mappings per task:** The current data has a 1:1 relationship between tasks and mappings. Should the engine handle a future scenario where one task has multiple mapping records? Recommendation: yes -- design for it by allowing multiple mappings per task ID, even though the current data does not require it.
3. **Event ID resolution strategy:** If the codebase later moves to stable event IDs (not index-based), the matching logic may need updating. For now, name-based matching is the pragmatic choice per the wa-ingestion spec.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions:
- Pure, stateless functions with no side effects align with the logic layer pattern (System Spec Section 11, Layer 1).
- Read-only querying of model data respects the read-only invariant (System Spec Section 4).
- Explicit alignment tier querying (gap, partial, aligned) serves the "uncertainty as first-class content" principle (System Spec "Must not be compromised").
- The function signatures follow the same patterns used by existing logic layer modules (state-explorer, event-matrix, case-walk).

**No contradiction** with the current system specification.

**No stretch** -- this feature operates entirely within the established logic layer conventions. It adds no new architectural patterns, no new data formats, and no new runtime dependencies.

---

## 11. Handover to BA (Cass)

### Story themes
1. **Event-level resolution:** `getTasksForEvent` and `getEventWaContext` -- stories around resolving WA tasks for a single event, including the null/empty cases.
2. **State-level resolution:** `getTasksForState` -- stories covering the aggregation and deduplication of tasks across all events at a state.
3. **Alignment queries:** `getAlignmentSummary`, `getUnmappedTasks`, `getPartialTasks` -- stories focused on querying and summarising alignment status across the full task set.
4. **Context filtering:** `filterTasksByContext` -- a small story covering enum-based filtering.
5. **Edge cases and robustness:** Stories ensuring graceful handling of unknown event/state IDs, empty arrays, and the single gap task.

### Expected story boundaries
- Event-level and state-level resolution are natural story boundaries (state builds on event).
- Alignment queries (summary, gaps, partials) can be grouped into one story since they share similar patterns.
- Context filtering is small enough to be a sub-story or part of the alignment story.
- Feature is M effort, so 3-5 stories is appropriate.

### Areas needing careful story framing
- The event name matching strategy (exact string equality against `Event.name`) must be explicit in acceptance criteria. This is the critical integration point between the existing event model and the WA mapping data.
- Deduplication logic in `getTasksForState` needs clear acceptance criteria -- what happens when the same task is triggered by 3 different events at the same state? (Answer: appears once.)
- The `missing` field in `getPartialTasks` return type comes from `alignmentNotes` -- acceptance criteria should verify specific notes content for at least a sample of the 9 partial tasks.

---

## 12. Change Log (Feature-Level)
| Date | Change | Reason | Raised By |
|-----|------|--------|-----------|
| 2026-03-27 | Initial feature specification created | Feature pipeline kickoff for WA task engine query layer | Alex (System Spec Agent) |
