# Feature Specification — react-wa-state-overlay

## 1. Feature Intent
**Why this feature exists.**

Business analysts exploring state diagrams (State Explorer) and event tables (Event Matrix) currently have no visibility into which Work Allocation (WA) tasks are associated with each state or event. This feature overlays WA task indicators onto both views so analysts can see, at a glance, how many caseworker tasks exist at each state, their alignment quality, and which events trigger specific WA tasks.

This supports the system purpose (System Spec Section 1) by making WA task alignment visible alongside the existing process model. It serves the "uncertainty as first-class content" invariant by surfacing alignment gaps (red), partial alignments (amber), and full alignments (green) directly on graph nodes and table rows.

---

## 2. Scope
### In Scope
- State Explorer: WA task count badge on each graph node (e.g. "3 tasks") coloured by worst alignment
- State Explorer: "Work Allocation Tasks" section in state detail panel listing tasks with alignment badges
- Event Matrix: "WA Task" column showing task name and alignment colour dot (or "--" if no task)
- Event Matrix: "WA Task" filter dropdown to filter by task name, "events with no WA task", "events with WA gaps"
- Pure helper functions in `src/ui-wa-tasks/state-overlay-helpers.ts` to compute all display data
- Bridge file `src/ui-wa-tasks/state-overlay-helpers.js`

### Out of Scope
- Modifying wa-task-engine or wa-data-model
- Adding new routes or pages
- Persistent filter state (filters are local React state)
- WA dashboard (that is react-wa-dashboard)
- Real data integration (uses sample data and static JSON)

---

## 3. Actors Involved

### Business Analyst (primary user)
- **Can do:** See WA task count badges on State Explorer graph nodes; inspect WA tasks in the state detail panel; see WA task column in Event Matrix; filter events by WA task association.
- **Cannot do:** Edit WA task data or mappings.

### The Model (data actor)
- **What it does:** Provides `WaTask[]`, `WaTaskMapping[]`, and `Event[]` arrays consumed by helper functions.
- **Read-only:** Functions query but never mutate.

---

## 4. Behaviour Overview

**State Explorer -- node badges:**
1. For each state node in the graph, compute the WA task count using `getNodeWaBadge(stateId, events, waTasks, waMappings)`.
2. The badge shows "{N} tasks" (or "1 task" for singular). If N is 0, no badge is shown.
3. Badge colour is determined by worst alignment: red if any gap, amber if any partial (no gap), green if all aligned.

**State Explorer -- detail panel:**
1. When a state node is clicked, the detail panel gains a "Work Allocation Tasks" section.
2. Lists each WA task at that state with task name, alignment badge, and tooltip.
3. Uses `getStateDetailWaTasks(stateId, events, waTasks, waMappings)`.

**Event Matrix -- WA Task column:**
1. Each event row shows a "WA Task" column with the task name and a colour dot.
2. Events with no WA task show "--".
3. Uses `getEventMatrixWaColumn(eventName, waTasks, waMappings)`.

**Event Matrix -- WA Task filter:**
1. A dropdown filter lists all WA task names plus special options "No WA Task" and "WA Gaps".
2. Selecting a task name filters to events mapped to that task.
3. Selecting "No WA Task" filters to events with no WA mapping.
4. Selecting "WA Gaps" filters to events mapped to gap-status tasks.
5. Uses `getWaTaskFilterOptions(waTasks)` and `filterEventsByWaTask(events, waTaskFilter, waTasks, waMappings)`.

**Key alternatives:**
- States with no WA-triggering events show no badge on the node and an empty WA tasks section in the detail panel.
- When WA data is unavailable (empty arrays), no WA UI elements render.

---

## 5. State & Lifecycle Interactions

This feature is **state-querying and view-model-producing**. It does not enter, exit, or modify any system states.

- **States entered:** None
- **States exited:** None
- **States modified:** None
- **Feature type:** Pure view-model overlay on existing views

---

## 6. Rules & Decision Logic

### Rule 1: Node badge colour uses worst-alignment
- **Description:** If any WA task at a state has `alignment === 'gap'`, badge is red. Else if any `partial`, badge is amber. Else green.
- **Inputs:** Array of WA tasks for a state
- **Outputs:** `{ label: string, colour: string }`
- **Deterministic:** Yes

### Rule 2: WA Task column shows first matching task
- **Description:** `getEventMatrixWaColumn` returns the first WA task matching the event, or null if none.
- **Inputs:** Event name, tasks, mappings
- **Outputs:** `{ taskName, alignment, colourDot }` or null
- **Deterministic:** Yes

### Rule 3: Filter by WA task uses exact task name match or special tokens
- **Description:** Filter value is either a task name (exact match), `'__none__'` (no WA mapping), or `'__gaps__'` (gap alignment). Empty string means no filter.
- **Deterministic:** Yes

---

## 7. Dependencies

### System components
- **ui-wa-tasks** (`src/ui-wa-tasks/index.ts`): `getWaTaskBadge`, `getStateWaTaskCount`, `prepareWaTaskPanel`, `enrichEventWithWaTask`
- **wa-task-engine** (`src/wa-task-engine/index.ts`): `getTasksForEvent`, `getTasksForState`
- **wa-data-model**: `WaTask`, `WaTaskMapping` types
- **ui-state-explorer** (`src/ui-state-explorer/index.ts`): Existing graph and detail panel functions
- **ui-event-matrix** (`src/ui-event-matrix/index.ts`): Existing table and filter functions
- **app/state-explorer/page.tsx**: React component being extended
- **app/event-matrix/page.tsx**: React component being extended
- **data/wa-tasks.json**, **data/wa-mappings.json**: Static WA data

### External systems
- None

---

## 8. Non-Functional Considerations

- **Performance:** Not a concern. 17 tasks, 17 mappings, small event set. All lookups are O(n) on tiny arrays.
- **Accessibility:** Badge colours always paired with text labels. Colour dots in the table have adjacent text.

---

## 9. Assumptions & Open Questions

### Assumptions
- ASSUMPTION: WA task and mapping data is loaded from static JSON and available in the React components via imports or context.
- ASSUMPTION: The "worst alignment" rule for node badge colour is the correct heuristic for at-a-glance assessment.
- ASSUMPTION: Showing only the first WA task in the Event Matrix column is acceptable; the full list is available in State Explorer detail panel.

### Open Questions
- None blocking implementation.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions:
- Follows the established UI helper layer pattern (pure functions, no DOM).
- Extends existing React components additively.
- Serves the "uncertainty as first-class content" principle by making WA alignment gaps visible on graph nodes and table rows.

**No contradiction** with the current system specification.

---

## 11. Handover to BA (Cass)

### Story themes
1. **State Explorer node badges** -- WA task count badge on graph nodes with worst-alignment colouring
2. **State Explorer detail panel WA section** -- "Work Allocation Tasks" section in the state detail panel
3. **Event Matrix WA column** -- WA Task column with task name and alignment colour dot
4. **Event Matrix WA filter** -- WA Task filter dropdown

### Expected story boundaries
- Node badges and detail panel can be one story (both extend State Explorer)
- WA column and WA filter can be one story (both extend Event Matrix)
- So 2 stories is appropriate for an M-effort feature

### Areas needing careful story framing
- The helper functions that drive both views should be specified clearly so Nigel can write focused tests.
- Filter special tokens (`__none__`, `__gaps__`) must be explicit in ACs.

---

## 12. Change Log (Feature-Level)
| Date | Change | Reason | Raised By |
|-----|------|--------|-----------|
| 2026-03-27 | Initial feature specification created | Feature pipeline kickoff | Alex (System Spec Agent) |
