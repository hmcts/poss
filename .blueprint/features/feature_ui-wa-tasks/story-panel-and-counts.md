# Story -- WA Task Panel Preparation and State-Level Counts

## User story

As a downstream React component, I want structured panel data and alignment count summaries for a given state so that I can render the WA task section in state detail views and display per-state task counts without composing the data myself.

---

## Context / scope

- Layer 2 (UI orchestration) functions: `prepareWaTaskPanel` and `getStateWaTaskCount`
- Both operate at the state level, accepting a state ID plus events, mappings, and tasks arrays
- `prepareWaTaskPanel` delegates to `getTasksForState` from wa-task-engine, then enriches each task with badge and tooltip data
- `getStateWaTaskCount` delegates to `getTasksForState` and counts by alignment -- it does not re-implement resolution logic
- Return types are `WaTaskPanelData` and `WaTaskCountSummary` respectively

---

## Acceptance criteria

**AC-1 -- Panel for a state with mixed-alignment tasks returns enriched task list**
- Given a state ID that has events mapping to tasks with alignment values `'aligned'`, `'partial'`, and `'gap'` across its events,
- When `prepareWaTaskPanel(stateId, events, mappings, tasks)` is called,
- Then it returns a `WaTaskPanelData` object containing a `tasks` array where each item has: the `WaTask` object, a `badge` (from `getWaTaskBadge`), and a `tooltip` string (from `getWaTaskTooltip`).

**AC-2 -- Panel includes alignment summary and hasGaps flag**
- Given a state with at least one `'gap'` task among its resolved tasks,
- When `prepareWaTaskPanel` is called for that state,
- Then the returned `WaTaskPanelData` includes an alignment summary object with `aligned`, `partial`, and `gap` counts, and `hasGaps` is `true`.

**AC-3 -- Panel for state with no WA-triggering events returns empty panel**
- Given a state ID whose events have no entries in the mappings array,
- When `prepareWaTaskPanel(stateId, events, mappings, tasks)` is called,
- Then it returns a `WaTaskPanelData` with an empty `tasks` array, counts of `{ aligned: 0, partial: 0, gap: 0 }`, and `hasGaps` equal to `false`.

**AC-4 -- State count returns correct totals by alignment**
- Given a state ID that resolves to 3 tasks: 1 aligned, 1 partial, 1 gap,
- When `getStateWaTaskCount(stateId, events, mappings, tasks)` is called,
- Then it returns `{ total: 3, aligned: 1, partial: 1, gap: 1 }`.

**AC-5 -- State count for state with no tasks returns all zeros**
- Given a state ID with no WA-triggering events,
- When `getStateWaTaskCount(stateId, events, mappings, tasks)` is called,
- Then it returns `{ total: 0, aligned: 0, partial: 0, gap: 0 }`.

**AC-6 -- Tasks are deduplicated per state**
- Given a state with multiple events that map to the same WA task,
- When `prepareWaTaskPanel` or `getStateWaTaskCount` is called for that state,
- Then each task appears only once in the panel task list and is counted only once in the summary (deduplication is handled by `getTasksForState` from wa-task-engine).

---

## Out of scope

- Rendering the panel in the DOM (that is React component responsibility)
- Re-implementing task-for-state resolution (delegates to wa-task-engine's `getTasksForState`)
- Cross-state aggregation or dashboard-level summaries
- Modifying wa-task-engine or data-model schemas
