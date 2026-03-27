# Feature Specification — wa-data-model

## 1. Feature Intent
**Why this feature exists.**

The existing data-model module (`src/data-model/`) defines schemas, types, and a Zustand store for the core possession process model (states, transitions, events, claim types). The system now needs to represent Work Allocation (WA) tasks -- the 17 caseworker tasks defined in the R1A Work Allocation Task Names document -- and their relationship to events in the event model.

Without a typed, validated data layer for WA tasks, downstream features (wa-ingestion, wa-task-engine, ui-wa-tasks, and the React WA components) have no foundation to build on. This feature provides that foundation by defining Zod schemas, TypeScript types, enums, and a Zustand store slice for WA task data.

This directly supports the system purpose described in `.blueprint/system_specification/SYSTEM_SPEC.md`: enabling analysts to explore and interrogate the possession process model. WA tasks add a new dimension -- mapping caseworker work allocation to the event model -- which surfaces alignment gaps and informs service design decisions.

---

## 2. Scope
### In Scope
- Zod schema for WA tasks (`WaTaskSchema`) with fields: `id`, `triggerDescription`, `taskName`, `taskContext`, `alignment`
- Zod schema for WA task-to-event mappings (`WaTaskMappingSchema`) with fields: `waTaskId`, `eventIds` (array), `alignmentNotes`
- Enum for task context (`WaTaskContextEnum`): `claim`, `counterclaim`, `gen-app`, `claim-counterclaim`, `general`
- Enum for alignment status (`WaAlignmentStatus`): `aligned`, `partial`, `gap`
- Inferred TypeScript types exported from schemas: `WaTask`, `WaTaskMapping`, `WaTaskContext`, `WaAlignmentStatus`
- Zustand store extension: a `waTask` slice with `tasks: WaTask[]`, `mappings: WaTaskMapping[]`, and actions `setWaTasks`, `setWaMappings`
- Unit tests validating schema acceptance/rejection and store operations

### Out of Scope
- Parsing or ingestion of the R1A source document (that is wa-ingestion)
- Query/resolution logic for tasks per event or state (that is wa-task-engine)
- UI orchestration or display logic (that is ui-wa-tasks)
- Any React components
- Populating the store with real data (wa-ingestion will do this)
- Extending the core Event schema with WA fields (WA data is a separate, linked structure)

---

## 3. Actors Involved

### The Model (data actor)
- **What it does:** Provides the structural definition of WA tasks and their mappings to events. Once populated (by wa-ingestion), serves as the typed data source for all downstream WA features.
- **What it cannot do:** The model is read-only per system invariant -- no editing through the tool.

### Business Analyst (indirect)
- **What they do:** They do not interact with this feature directly. They benefit indirectly because the schemas and types defined here ensure WA data is consistently structured and validated before it reaches the UI.
- **What they cannot do:** Nothing in this feature is user-facing.

---

## 4. Behaviour Overview

**Happy path:**
1. The `WaTaskSchema` validates a WA task object with all required fields. A valid object is parsed without error and produces a typed `WaTask`.
2. The `WaTaskMappingSchema` validates a mapping linking a `waTaskId` to one or more `eventId` strings, with an `alignmentNotes` string explaining partial/gap status.
3. The `WaTaskContextEnum` restricts task context to one of five values reflecting the domain context in which the task operates.
4. The `WaAlignmentStatus` enum restricts alignment to one of three tiers: `aligned` (direct event counterpart), `partial` (event exists at coarser granularity), `gap` (no corresponding event).
5. The Zustand store is created with an empty `waTask` slice. Calling `setWaTasks(tasks)` replaces the tasks array; calling `setWaMappings(mappings)` replaces the mappings array.

**Key alternatives:**
- Schema validation rejects objects missing required fields or with invalid enum values, returning Zod parse errors.
- An empty tasks/mappings array is a valid initial state (store starts empty, populated later by wa-ingestion).

**User-visible outcomes:** None directly. This feature is infrastructure consumed by other features.

---

## 5. State & Lifecycle Interactions

This feature is **state-defining** rather than state-transitioning. It introduces new data structures that represent WA task state but does not modify the core possession process state machine.

- **States entered:** None (no lifecycle states)
- **States exited:** None
- **States modified:** None
- **Store state introduced:** `waTask` slice with `tasks` and `mappings` arrays, initially empty, populated by downstream ingestion

The WA data model sits alongside (not within) the core state/transition/event model. WA tasks reference events by ID but do not alter event behaviour or state transitions.

---

## 6. Rules & Decision Logic

### Rule 1: Task context values are fixed
- **Description:** Every WA task must have a `taskContext` from the closed set: `claim`, `counterclaim`, `gen-app`, `claim-counterclaim`, `general`
- **Inputs:** Raw task data
- **Outputs:** Validated `WaTaskContext` value
- **Deterministic:** Yes -- enum membership check

### Rule 2: Alignment status reflects the R1A analysis tiers
- **Description:** Each WA task has an alignment status: `aligned` (7 tasks with direct event counterparts), `partial` (9 tasks where events exist at coarser granularity), or `gap` (1 task with no event)
- **Inputs:** Raw task data
- **Outputs:** Validated `WaAlignmentStatus` value
- **Deterministic:** Yes -- enum membership check

### Rule 3: Mappings reference tasks and events by ID
- **Description:** A `WaTaskMapping` links one `waTaskId` to an array of `eventIds`. The schema validates the shape but does not enforce referential integrity (IDs are strings). Referential integrity is the responsibility of wa-ingestion and wa-task-engine.
- **Inputs:** Mapping object
- **Outputs:** Validated `WaTaskMapping`
- **Deterministic:** Yes

### Rule 4: Alignment notes are required for partial and gap tasks
- **Description:** The `alignmentNotes` field on `WaTaskMappingSchema` is a required string. For `aligned` tasks this may be empty; for `partial` and `gap` tasks it should explain what is missing. Enforcement of non-empty notes for partial/gap is a downstream concern (wa-ingestion), not a schema constraint.
- **Inputs:** Mapping object
- **Outputs:** Validated string field
- **Deterministic:** Yes

**Interpretation note:** The backlog specifies `alignmentNotes` on the mapping rather than on the task itself. This makes sense because the notes describe the relationship between the task and its mapped events, not the task in isolation. A single task could theoretically have different alignment notes if mapped to different event sets in future, though the current R1A data has one mapping per task.

---

## 7. Dependencies

### System components
- **data-model module** (`src/data-model/`): This feature extends the existing module. It follows the same patterns: Zod schemas in `schemas.ts`, enum objects in `enums.ts`, Zustand vanilla store in `store.ts`. The WA additions may be in new files (e.g. `wa-schemas.ts`) or appended to existing files -- this is an implementation decision for Codey, but existing patterns suggest separate files within the same module directory.
- **Zod** (already a project dependency): Used for schema definition and validation.
- **Zustand/vanilla** (already a project dependency): Used for store creation.

### External systems
- None

### Policy or legislative dependencies
- None. The WA task names and alignment analysis are HMCTS internal working documents, not legislative artefacts.

### Operational dependencies
- The R1A analysis document (`.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`) defines the 17 tasks and their alignment status. The schemas must accommodate all 17 without loss of information.

---

## 8. Non-Functional Considerations

- **Performance:** Not a concern. The dataset is 17 tasks and 17 mappings. Schema validation is near-instant.
- **Audit/logging:** Not applicable at the data model layer.
- **Error tolerance:** Schema validation should produce clear Zod error messages when invalid data is provided. This aids debugging during wa-ingestion development.
- **Security:** Not applicable -- no user input, no authentication, internal tool.
- **Extensibility:** The schemas should accommodate future WA task additions without structural change. The R1A document covers the initial 17 tasks; more may be added as the service design evolves. Using arrays (not fixed-length tuples) and string IDs (not fixed enums for task IDs) supports this.

---

## 9. Assumptions & Open Questions

### Assumptions
- **ASSUMPTION:** The five `WaTaskContext` values (`claim`, `counterclaim`, `gen-app`, `claim-counterclaim`, `general`) are sufficient to classify all 17 current tasks and reasonably extensible for future tasks. This is derived from the R1A analysis groupings.
- **ASSUMPTION:** `eventIds` in `WaTaskMappingSchema` references event IDs from the existing `EventSchema.id` field. Referential integrity is validated at ingestion time, not at schema level.
- **ASSUMPTION:** Each WA task has exactly one mapping record. The schema allows multiple mappings per task (no uniqueness constraint) to support future flexibility, but the current R1A data implies a 1:1 relationship between tasks and mapping records.
- **ASSUMPTION:** The alignment status is set at ingestion time based on the R1A analysis and does not change at runtime. It is a static classification, not a computed property.

### Open Questions
1. **File organisation:** Should WA schemas live in new files within `src/data-model/` (e.g. `wa-schemas.ts`, `wa-enums.ts`) or be appended to the existing `schemas.ts` and `enums.ts`? The existing files are small enough that either approach works. Recommendation: new files prefixed with `wa-` for clear separation, re-exported from an index.
2. **Store composition:** Should the `waTask` slice be added to the existing `PossessionsState` interface and `createPossessionsStore` function, or should it be a separate store? The backlog says "extend the Zustand store with a waTask slice", implying extension of the existing store. This is the recommended approach.
3. **Gap task mappings:** For the single gap task (Failed Payment, task 17), `eventIds` will be an empty array since there is no corresponding event. Should the schema enforce `eventIds` as non-empty for aligned/partial tasks? Recommendation: no -- keep the schema permissive and let wa-ingestion handle validation logic.

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions:
- It follows the established pattern of Zod schemas + TypeScript types + Zustand store that the core data-model module established.
- It respects the read-only model invariant -- WA tasks are static data, not editable through the tool.
- It supports the "uncertainty as first-class content" principle by explicitly modelling alignment status (partial, gap) rather than hiding incomplete mappings.

**No contradiction** with the current system specification.

**Potential stretch:** The system spec (Section 5, Core Domain Concepts) does not currently mention WA tasks. Once the WA feature set is stable, the system spec should be updated to include `WaTask` and `WaTaskMapping` as core domain concepts. This is a **proposed addition**, not a contradiction.

**Proposed system spec change (deferred):** Add a "Work Allocation Tasks" subsection to Section 5 (Core Domain Concepts) describing WA tasks, their relationship to events, and alignment status. This should happen after the WA feature set is proven, not now.

---

## 11. Handover to BA (Cass)

### Story themes
1. **Schema definition stories:** Define each Zod schema (WaTaskSchema, WaTaskMappingSchema) with acceptance criteria covering valid and invalid inputs.
2. **Enum definition stories:** Define WaTaskContextEnum and WaAlignmentStatus with the specified values.
3. **Type export stories:** Ensure TypeScript types are correctly inferred and exported for downstream consumption.
4. **Store extension stories:** Add the waTask slice to the existing Zustand store with setWaTasks and setWaMappings actions.
5. **Validation stories:** Test that schemas reject malformed data with clear error messages.

### Expected story boundaries
- Each schema could be a separate story, or schemas + enums could be grouped into one story if small enough. The feature is medium effort (M), so 2-4 stories is appropriate.
- Store extension is a distinct story because it touches different files and has different acceptance criteria (state management vs validation).

### Areas needing careful story framing
- The relationship between `WaTaskMapping.eventIds` and existing `Event.id` values: stories should clarify that referential integrity is NOT enforced at the schema level but IS expected to be correct when data is loaded.
- The `alignmentNotes` field: stories should specify that it is a required string (not optional) but may be empty for fully aligned tasks. Cass should frame acceptance criteria that make this explicit.
- The `taskContext` assignment for each of the 17 tasks is an ingestion concern, but Cass should ensure the enum values cover all cases when writing wa-data-model stories.

---

## 12. Change Log (Feature-Level)
| Date | Change | Reason | Raised By |
|-----|------|--------|-----------|
| 2026-03-27 | Initial feature specification created | Feature pipeline kickoff for WA data model layer | Alex (System Spec Agent) |
