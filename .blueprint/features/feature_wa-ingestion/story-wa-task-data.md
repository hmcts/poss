# Story — WA Task Data Authoring

## User story

As a **downstream feature consumer** (wa-task-engine, ui-wa-tasks), I want all 17 R1A work allocation tasks authored as structured JSON in `data/wa-tasks.json` so that the task data is available in a validated, machine-readable format.

---

## Context / scope

- This is a data-authoring story, not a UI story. There are no screens, routes, or user interactions.
- The authoritative source is `.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`.
- Each record must conform to `WaTaskSchema` defined in `src/data-model/schemas.ts`.
- Task IDs are stable sequential strings: `wa-task-01` through `wa-task-17`.
- Full feature spec: `.blueprint/features/feature_wa-ingestion/FEATURE_SPEC.md`

---

## Acceptance criteria

**AC-1 -- All 17 tasks are present**
- Given the file `data/wa-tasks.json` exists,
- When its contents are parsed,
- Then it contains exactly 17 task objects,
- And each object has a unique `id` from `wa-task-01` to `wa-task-17`.

**AC-2 -- Each task has required fields**
- Given any task object in `data/wa-tasks.json`,
- When inspected,
- Then it contains all fields required by `WaTaskSchema`: `id` (string), `triggerDescription` (string), `taskName` (string), `taskContext` (enum value), `alignment` (enum value).

**AC-3 -- Alignment tiers are correctly assigned**
- Given the 17 task objects,
- When grouped by `alignment`,
- Then 7 tasks (1, 2, 3, 8, 13, 14, 15) have `alignment: "aligned"`,
- And 9 tasks (4, 5, 6, 7, 9, 10, 11, 12, 16) have `alignment: "partial"`,
- And 1 task (17) has `alignment: "gap"`.

**AC-4 -- Task context assignments match the specification**
- Given the 17 task objects,
- When grouped by `taskContext`,
- Then tasks 1, 2, 10 have `taskContext: "claim"`,
- And tasks 5, 12 have `taskContext: "counterclaim"`,
- And tasks 4, 9 have `taskContext: "claim-counterclaim"`,
- And tasks 6, 7, 8, 11 have `taskContext: "gen-app"`,
- And tasks 3, 13, 14, 15, 16, 17 have `taskContext: "general"`.

**AC-5 -- Task names and trigger descriptions are populated**
- Given any task object in `data/wa-tasks.json`,
- When inspected,
- Then `taskName` is a non-empty string matching the "WA Task Name" column from the R1A analysis (e.g. task 1 has taskName "New Claim -- Listing required"),
- And `triggerDescription` is a non-empty string matching the "WA Trigger (Action/Event)" column (e.g. task 1 has triggerDescription "New claim received -- system auto-assigns hearing centre").

**AC-6 -- JSON is valid and human-readable**
- Given the file `data/wa-tasks.json`,
- When opened,
- Then it is valid JSON,
- And it is formatted with consistent indentation (2 spaces) for human readability.

---

## Out of scope

- Validation against Zod schemas (covered in story-wa-validation)
- Event-to-task mappings (covered in story-wa-mapping-data)
- Runtime loading into the Zustand store (future wa-data-loading feature)
- Parsing the original .docx file programmatically
- Modifying existing event model data or schemas
