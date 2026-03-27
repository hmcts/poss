# Story — Alignment Summary, Gap, and Partial Task Queries

## User story

As a downstream UI feature, I want to query alignment status across all WA tasks -- counting by tier, listing unmapped tasks, and retrieving partial-alignment explanations -- so that analysts can see where the WA model aligns with the event model and where gaps exist.

---

## Context / scope

- Layer 1 (pure logic) functions: `getAlignmentSummary`, `getUnmappedTasks`, `getPartialTasks`
- These functions operate on the full 17-task dataset and its 17 mappings
- Alignment classification is authoritative from the `alignment` field on each `WaTask` -- these functions do not recompute alignment
- `getUnmappedTasks` filters by `alignment === 'gap'`, not by checking for empty `eventIds`
- `getPartialTasks` uses `alignmentNotes` from `WaTaskMapping` as the `missing` explanation text
- Supports the system invariant: "uncertainty as first-class content"

---

## Acceptance criteria

**AC-1 -- Alignment summary returns correct counts for the current dataset**
- Given the full tasks and mappings arrays (17 tasks),
- When `getAlignmentSummary(tasks, mappings)` is called,
- Then it returns `{ aligned: 7, partial: 9, gap: 1 }`.

**AC-2 -- Alignment summary counts each task exactly once**
- Given the full tasks and mappings arrays,
- When `getAlignmentSummary(tasks, mappings)` is called,
- Then `aligned + partial + gap` equals the total number of tasks (17).

**AC-3 -- getUnmappedTasks returns only gap-alignment tasks**
- Given the full tasks and mappings arrays,
- When `getUnmappedTasks(tasks, mappings)` is called,
- Then it returns an array containing exactly one task: `id: "wa-task-17"`, `taskName: "Review Failed Payment"`, with `alignment: "gap"`.

**AC-4 -- getPartialTasks returns partial tasks with explanation text**
- Given the full tasks and mappings arrays,
- When `getPartialTasks(tasks, mappings)` is called,
- Then it returns an array of 9 objects, each with a `task` property (a `WaTask` with `alignment: "partial"`) and a `missing` property (a non-empty string from the corresponding mapping's `alignmentNotes`).

**AC-5 -- getPartialTasks includes specific alignment notes**
- Given the full tasks and mappings arrays,
- When `getPartialTasks(tasks, mappings)` is called,
- Then the entry for `wa-task-04` has a `missing` value containing "Response and counterclaim are modelled as separate events",
- And the entry for `wa-task-16` has a `missing` value containing "judicial order workflow" and "to be determined".

**AC-6 -- Empty tasks array produces zero counts and empty results**
- Given an empty tasks array `[]` and any mappings array,
- When `getAlignmentSummary`, `getUnmappedTasks`, and `getPartialTasks` are each called,
- Then `getAlignmentSummary` returns `{ aligned: 0, partial: 0, gap: 0 }`,
- And `getUnmappedTasks` returns `[]`,
- And `getPartialTasks` returns `[]`.

---

## Out of scope

- Recomputing or modifying alignment classifications (those are set at ingestion time)
- UI rendering of alignment badges, charts, or dashboards
- Filtering alignment results by context type (that is `filterTasksByContext`, covered separately)
- Explaining why a task is classified as partial vs aligned (the `alignmentNotes` text is the explanation)
