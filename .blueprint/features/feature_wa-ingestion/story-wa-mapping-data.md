# Story -- WA Event-to-Task Mapping Data Authoring

## User story

As a **downstream feature consumer** (wa-task-engine, ui-wa-tasks), I want each of the 17 WA tasks mapped to their corresponding event model events in `data/wa-mappings.json`, with alignment notes explaining any gaps, so that the relationship between WA tasks and the event model is explicit and queryable.

---

## Context / scope

- This is a data-authoring story, not a UI story. There are no screens, routes, or user interactions.
- The authoritative source is `.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`.
- Each record must conform to `WaTaskMappingSchema` defined in `src/data-model/schemas.ts`.
- `eventIds` contain event names (e.g. "Case Issued", "Respond to Claim"), not generated IDs. Name-to-ID resolution is a downstream concern for wa-task-engine.
- There is a 1:1 relationship between tasks and mappings: each task has exactly one mapping record.
- Full feature spec: `.blueprint/features/feature_wa-ingestion/FEATURE_SPEC.md`

---

## Acceptance criteria

**AC-1 -- All 17 mappings are present with correct task references**
- Given the file `data/wa-mappings.json` exists,
- When its contents are parsed,
- Then it contains exactly 17 mapping objects,
- And each object's `waTaskId` corresponds to a valid task ID (`wa-task-01` through `wa-task-17`) from `data/wa-tasks.json`,
- And every task ID is represented exactly once.

**AC-2 -- Aligned tasks have populated eventIds**
- Given a mapping for an aligned task (tasks 1, 2, 3, 8, 13, 14, 15),
- When inspected,
- Then `eventIds` is a non-empty array of event name strings matching the R1A analysis (e.g. task 1 maps to `["Case Issued"]`, task 3 maps to `["Respond to Claim"]`).

**AC-3 -- Partial tasks have eventIds and explanatory alignment notes**
- Given a mapping for a partial task (tasks 4, 5, 6, 7, 9, 10, 11, 12, 16),
- When inspected,
- Then `eventIds` is a non-empty array containing the coarser-grained event names from the event model (e.g. tasks 6 and 7 map to `["Make an application"]`, tasks 9-12 map to `["Upload your documents"]`),
- And `alignmentNotes` is a non-empty string describing the specific granularity gap (e.g. for task 6: notes explain that the event model uses a generic "Make an application" rather than a sub-typed adjournment event).

**AC-4 -- Gap task has empty eventIds with explanatory note**
- Given the mapping for task 17 (Failed Payment),
- When inspected,
- Then `eventIds` is an empty array `[]`,
- And `alignmentNotes` is a non-empty string explaining that no corresponding event exists in the event model and a new event is needed.

**AC-5 -- Citizen-only footnote captured for tasks 9-12**
- Given the mappings for tasks 9, 10, 11, and 12 (document upload variants),
- When inspected,
- Then each mapping's `alignmentNotes` includes a note that WA tasks for further evidence are only created when documents are uploaded by citizens via the citizen dashboard.

**AC-6 -- JSON is valid and human-readable**
- Given the file `data/wa-mappings.json`,
- When opened,
- Then it is valid JSON,
- And it is formatted with consistent indentation (2 spaces) for human readability.

---

## Out of scope

- Validation against Zod schemas (covered in story-wa-validation)
- WA task definitions (covered in story-wa-task-data)
- Referential integrity checks between eventIds and the event model (downstream concern for wa-task-engine)
- State-level event resolution (which states an event appears in is wa-task-engine's responsibility)
- Runtime loading into the Zustand store
