# Story — State-Level WA Task Resolution

## User story

As a downstream UI feature, I want to resolve all WA tasks triggered across every event at a given state so that analysts can see the full set of caseworker tasks relevant to a particular point in the possession process.

---

## Context / scope

- Layer 1 (pure logic) function: `getTasksForState`
- Signature: `getTasksForState(stateId, events, mappings, tasks): WaTask[]`
- Depends on event-level resolution logic internally
- Deduplication is by `WaTask.id` -- same task triggered by multiple events at one state appears once
- The `events` parameter is the full `Event[]` array from the data model; events are filtered by state using their state association

---

## Acceptance criteria

**AC-1 -- State with WA-triggering events returns resolved tasks**
- Given the full events, mappings, and tasks arrays,
- When `getTasksForState` is called with a state ID where at least one event has a WA task mapping,
- Then it returns a non-empty `WaTask[]` array containing only tasks mapped to events at that state.

**AC-2 -- Tasks are deduplicated by WaTask.id**
- Given a state where multiple events trigger the same WA task (e.g. two events at the same state both mapping to the same `waTaskId`),
- When `getTasksForState` is called for that state,
- Then each `WaTask` appears exactly once in the result, identified by its `id` field.

**AC-3 -- State with no WA-triggering events returns empty array**
- Given a state where none of the associated events have WA task mappings,
- When `getTasksForState` is called for that state,
- Then it returns an empty array `[]`.

**AC-4 -- Unknown state ID returns empty array**
- Given the full events, mappings, and tasks arrays,
- When `getTasksForState` is called with a state ID that does not exist in the events array,
- Then it returns an empty array `[]` (no exception thrown).

**AC-5 -- Multiple different tasks at one state are all returned**
- Given a state with events that map to different WA tasks,
- When `getTasksForState` is called for that state,
- Then all distinct tasks are present in the returned array.

---

## Out of scope

- UI rendering or display formatting of state-level task lists
- Determining which events belong to a state (the events array already contains state associations)
- Modifying event or state data
- Ordering or sorting of the returned tasks (consumers handle display order)
