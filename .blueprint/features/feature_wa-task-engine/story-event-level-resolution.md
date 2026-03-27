# Story — Event-Level WA Task Resolution

## User story

As a downstream UI feature, I want to resolve WA tasks for a given event name and retrieve WA context for a single event so that analysts can see which caseworker tasks are triggered by specific events.

---

## Context / scope

- Layer 1 (pure logic) functions: `getTasksForEvent` and `getEventWaContext`
- Consumed by ui-wa-tasks orchestration layer, not called directly from React components
- Event matching uses `Event.name` (human-readable strings like "Case Issued"), not index-based `Event.id`
- All functions are pure, stateless, no side effects -- arrays in, arrays out

---

## Acceptance criteria

**AC-1 -- Single-mapping event returns the correct task**
- Given the mappings array and tasks array are loaded from `wa-mappings.json` and `wa-tasks.json`,
- When `getTasksForEvent("Case Issued", mappings, tasks)` is called,
- Then it returns an array containing exactly one `WaTask` with `id: "wa-task-01"` and `taskName: "New Claim -- Listing required"`.

**AC-2 -- Event matching multiple mappings returns all matched tasks**
- Given the full mappings and tasks arrays,
- When `getTasksForEvent("Make an application", mappings, tasks)` is called,
- Then it returns an array containing three `WaTask` objects with ids `"wa-task-06"`, `"wa-task-07"`, and `"wa-task-08"`.

**AC-3 -- Unknown event returns empty array**
- Given the full mappings and tasks arrays,
- When `getTasksForEvent("Non-Existent Event", mappings, tasks)` is called,
- Then it returns an empty array `[]`.

**AC-4 -- Event name matching uses exact string equality**
- Given the full mappings and tasks arrays,
- When `getTasksForEvent("case issued", mappings, tasks)` is called (lowercase),
- Then it returns an empty array `[]` because matching is case-sensitive against `Event.name`.

**AC-5 -- getEventWaContext returns task, alignment, and notes for a mapped event**
- Given the full mappings and tasks arrays,
- When `getEventWaContext("Upload your documents", mappings, tasks)` is called,
- Then it returns an object with `task.id` equal to one of `"wa-task-09"` through `"wa-task-12"`, `alignment` being a valid `WaAlignmentStatusValue`, and `notes` being the corresponding `alignmentNotes` string from the mapping.

**AC-6 -- getEventWaContext returns null for unmapped event**
- Given the full mappings and tasks arrays,
- When `getEventWaContext("Some Event With No WA Task", mappings, tasks)` is called,
- Then it returns `null`.

---

## Out of scope

- UI rendering or display formatting of task results
- Loading data from JSON files (that is data-loading / wa-ingestion)
- Modifying or validating the WA task or mapping data
- State-level aggregation (covered in a separate story)
