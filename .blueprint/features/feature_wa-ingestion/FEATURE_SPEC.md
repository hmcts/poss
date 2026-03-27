# Feature Specification — wa-ingestion

## 1. Feature Intent
**Why this feature exists.**

The R1A Work Allocation Task Names document defines 17 caseworker tasks that must be mapped to the possession event model. This data currently exists only in a Word document and a markdown analysis (`.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`). Downstream features (wa-task-engine, ui-wa-tasks, React WA components) need this data in structured, validated JSON to function.

wa-ingestion transforms the R1A analysis into two static JSON files — one for WA tasks, one for event-to-task mappings — validated against the Zod schemas defined by wa-data-model. This follows the same static-JSON-at-build-time pattern established by the existing data-ingestion module (`src/data-ingestion/index.ts`).

This supports the system purpose in `.blueprint/system_specification/SYSTEM_SPEC.md`: enabling analysts to explore and interrogate the possession process model, now extended to include the work allocation dimension. The alignment tiers (aligned/partial/gap) make uncertainty first-class content, consistent with the system's core invariant.

---

## 2. Scope
### In Scope
- Create `data/wa-tasks.json`: 17 WA task records, each with id, triggerDescription, taskName, taskContext, and alignment status
- Create `data/wa-mappings.json`: 17 event-to-task mapping records, each linking a waTaskId to eventIds with alignmentNotes
- Classify all 17 tasks into three alignment tiers: 7 aligned, 9 partial, 1 gap
- For partial alignments, capture what is missing in alignmentNotes (e.g. "Event model uses generic 'Make an application' — WA expects sub-typed adjournment task")
- For the gap (Failed Payment, task 17), set eventIds to empty array with a note that no corresponding event exists
- Include citizen-only footnote as metadata on document upload tasks (tasks 9-12)
- Validate both JSON files against `WaTaskSchema` and `WaTaskMappingSchema` from `src/data-model/schemas.ts`
- A build/validation script that parses and validates the JSON, following the pattern in `src/data-ingestion/index.ts`

### Out of Scope
- Parsing the original `.docx` file programmatically (the analysis markdown is the authoritative source)
- Query or resolution logic for tasks per event/state (that is wa-task-engine)
- UI orchestration or display (that is ui-wa-tasks)
- Loading data into the Zustand store at runtime (that is data-loading or a future wa-data-loading feature)
- Modifying existing event model data or schemas
- Automated re-ingestion pipeline (data changes infrequently per system spec assumption)

---

## 3. Actors Involved

### The Model (data actor)
- **What it does:** Receives the structured WA task and mapping data as static JSON files. Once created, these files become part of the model data consumed by downstream features.
- **What it cannot do:** The model is read-only — these files are authored at build time, not modified through the tool.

### Business Analyst (indirect)
- **What they do:** They do not interact with this feature directly. They benefit because the structured data enables WA task visibility in the UI.
- **What they cannot do:** Nothing in this feature is user-facing.

---

## 4. Behaviour Overview

**Happy path:**
1. The ingestion script reads the R1A analysis data (hardcoded from `.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`) and produces two JSON files.
2. `data/wa-tasks.json` contains an array of 17 objects, each conforming to `WaTaskSchema`.
3. `data/wa-mappings.json` contains an array of 17 objects, each conforming to `WaTaskMappingSchema`.
4. Each task is assigned a stable string ID (e.g. `wa-task-01` through `wa-task-17`).
5. Each task is assigned a `taskContext` value from `WaTaskContext` enum based on its domain context.
6. Each mapping links a `waTaskId` to zero or more `eventIds` (event names/identifiers from the event model) with `alignmentNotes`.
7. The validation step parses both files through their respective Zod schemas and reports success or failure.

**Key alternatives:**
- If validation fails, the script reports which records failed and why (Zod error messages).
- The gap task (Failed Payment) has an empty `eventIds` array — this is valid, not an error.

**Alignment tier handling:**

| Tier | Count | Tasks | Handling |
|------|-------|-------|----------|
| Aligned | 7 | 1, 2, 3, 8, 13, 14, 15 | `alignment: "aligned"`, eventIds populated, alignmentNotes may be empty or brief |
| Partial | 9 | 4, 5, 6, 7, 9, 10, 11, 12, 16 | `alignment: "partial"`, eventIds populated with coarser-grained events, alignmentNotes explain the granularity gap |
| Gap | 1 | 17 | `alignment: "gap"`, eventIds empty, alignmentNotes explain missing event |

**Task context assignments:**

| Context | Tasks |
|---------|-------|
| `claim` | 1, 2, 10 |
| `counterclaim` | 5, 12 |
| `claim-counterclaim` | 4, 9 |
| `gen-app` | 6, 7, 8, 11 |
| `general` | 3, 13, 14, 15, 16, 17 |

**Interpretation note:** Task context assignments are inferred from the R1A analysis descriptions. Tasks 3 (Review Defendant response) and 13-15 (Case Flags, Welsh, Translated doc) apply across contexts and are classified as `general`. Task 16 (Review judicial order) and 17 (Failed Payment) are also `general` as they are not context-specific. Task 9 (further evidence — claim/counterclaim) is `claim-counterclaim` per its explicit combined scope. Tasks 10-12 are split by their specific context.

**Citizen-only footnote metadata:**
Tasks 9-12 (document upload variants) carry additional context: WA tasks for further evidence are only created when documents are uploaded by citizens via the citizen dashboard. This footnote from the R1A document should be captured in the `alignmentNotes` field for these tasks' mappings.

---

## 5. State & Lifecycle Interactions

This feature is **data-producing**, not state-transitioning. It creates static data files that are consumed by downstream features.

- **States entered:** None
- **States exited:** None
- **States modified:** None
- **Feature type:** Data authoring / build-time artifact

The JSON files produced sit alongside existing data files (states, transitions, events) and follow the same static-at-build-time pattern described in the system spec (Section 9).

---

## 6. Rules & Decision Logic

### Rule 1: Every R1A task must be represented
- **Description:** All 17 tasks from the R1A analysis must appear in `wa-tasks.json`. No tasks may be silently omitted.
- **Inputs:** R1A analysis table (17 rows)
- **Outputs:** 17 `WaTask` records
- **Deterministic:** Yes

### Rule 2: Alignment status follows the R1A analysis
- **Description:** The alignment classification (aligned/partial/gap) is taken directly from the R1A analysis, not recomputed. The analysis document is the authoritative source.
- **Inputs:** R1A analysis "Alignment" column
- **Outputs:** `WaAlignmentStatus` value per task
- **Deterministic:** Yes

### Rule 3: Partial alignment notes must explain the gap
- **Description:** For any task with `alignment: "partial"`, the corresponding mapping's `alignmentNotes` must describe what the event model is missing or why the match is imprecise.
- **Inputs:** R1A analysis alignment descriptions
- **Outputs:** Non-empty `alignmentNotes` string
- **Deterministic:** Yes

### Rule 4: Gap tasks have empty eventIds
- **Description:** Task 17 (Failed Payment) has no event model counterpart. Its mapping must have `eventIds: []` and `alignmentNotes` explaining that a new event is needed.
- **Inputs:** R1A analysis gap identification
- **Outputs:** Empty array for eventIds, explanatory note
- **Deterministic:** Yes

### Rule 5: Event IDs reference event names from the event model
- **Description:** The `eventIds` in mappings reference event names as they appear in the event model (e.g. "Case Issued", "Respond to Claim", "Make an application"). These are string references, not foreign keys validated at schema level. Referential integrity is a downstream concern for wa-task-engine.
- **Inputs:** R1A analysis "Matching Event Model Event(s)" column
- **Outputs:** String array of event names
- **Deterministic:** Yes

**Interpretation note:** The `eventIds` field name suggests IDs, but the R1A analysis references events by name (e.g. "Case Issued", "Respond to Claim"). Since the existing `EventSchema` generates IDs as `{claimType}:{index}`, which are not stable or human-readable, using event names is more practical for this static mapping. Downstream features (wa-task-engine) will need to resolve names to IDs at query time. This is an explicit design decision that should be confirmed during implementation.

---

## 7. Dependencies

### System components
- **wa-data-model** (upstream, implemented): Provides `WaTaskSchema`, `WaTaskMappingSchema`, `WaTaskContext` enum, `WaAlignmentStatus` enum. All defined in `src/data-model/schemas.ts` and `src/data-model/enums.ts`.
- **data-ingestion module** (`src/data-ingestion/index.ts`): Provides the ingestion pattern to follow — Zod validation of parsed data, static file output. wa-ingestion follows this pattern but with hand-authored JSON rather than Excel parsing.

### External systems
- None

### Policy or legislative dependencies
- None. R1A Work Allocation Task Names is an internal HMCTS working document.

### Operational dependencies
- **R1A analysis document** (`.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`): The authoritative source for task definitions, alignment classifications, and mapping descriptions. Changes to this document require re-running ingestion.

---

## 8. Non-Functional Considerations

- **Performance:** Not a concern. 17 tasks, 17 mappings. Validation is near-instant.
- **Audit/logging:** The validation script should report success/failure clearly for build-time verification.
- **Error tolerance:** Zod validation errors should produce clear messages identifying which task or mapping failed and why.
- **Security:** Not applicable — static data, no user input, internal tool.
- **Maintainability:** The JSON files should be human-readable and hand-editable, since the source data changes infrequently and updates will be manual (per system spec assumption that model data is updated via code/JSON changes and redeployment).

---

## 9. Assumptions & Open Questions

### Assumptions
- **ASSUMPTION:** The R1A analysis markdown (`.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md`) is the authoritative source for task definitions and alignment. The original `.docx` file is not parsed programmatically.
- **ASSUMPTION:** Task IDs are stable sequential strings (`wa-task-01` through `wa-task-17`) matching the row order in the R1A analysis. If new tasks are added later, they receive the next sequential ID.
- **ASSUMPTION:** `eventIds` contain event names (not generated IDs) because event model IDs are index-based and not stable. This is a pragmatic choice; wa-task-engine will resolve names to runtime IDs.
- **ASSUMPTION:** Each task has exactly one mapping record (1:1 relationship between wa-tasks.json entries and wa-mappings.json entries).
- **ASSUMPTION:** The task context assignments listed in Section 4 are correct. These are inferred from the R1A descriptions and may need adjustment if the business team provides different classifications.

### Open Questions
1. **Event ID format:** Should `eventIds` in mappings use event names (e.g. "Case Issued") or the generated IDs from EventSchema (e.g. "MAIN_CLAIM_ENGLAND:0")? Event names are more stable and human-readable but require name-based resolution downstream. Recommendation: use event names, document this choice.
2. **Multi-state events:** Some events appear in multiple states (e.g. "Respond to Claim" appears in CASE_PROGRESSION, JUDICIAL_REFERRAL, and other live states). Should the mapping capture which states, or just the event name? Recommendation: just event names — state-level resolution is wa-task-engine's job.
3. **Citizen-only metadata format:** The citizen-only footnote for tasks 9-12 could be captured as part of `alignmentNotes` or as a separate metadata field. The current `WaTaskMappingSchema` only has `alignmentNotes`. Recommendation: include in `alignmentNotes` text, flagged clearly (e.g. prefix with "Note: citizen uploads only.").

---

## 10. Impact on System Specification

This feature **reinforces** existing system assumptions:
- Follows the static-JSON-at-build-time data pattern (System Spec Section 9)
- Respects the read-only model invariant (System Spec Section 4)
- Makes uncertainty first-class by explicitly modelling alignment tiers rather than hiding incomplete mappings (System Spec "Must not be compromised" principle)
- Follows the established ingestion pattern from `src/data-ingestion/`

**No contradiction** with the current system specification.

**Minor stretch:** The system spec does not mention WA tasks or the `data/` directory as a data location. The existing ingestion module uses `src/data-ingestion/states/` for JSON output. Placing WA data in `data/wa-tasks.json` and `data/wa-mappings.json` (as specified in the backlog) introduces a new data directory convention. This is not a contradiction but should be noted — a future system spec update may want to document the `data/` directory as part of the data architecture.

---

## 11. Handover to BA (Cass)

### Story themes
1. **Task data authoring:** Create the `data/wa-tasks.json` file with all 17 tasks, correctly classified by context and alignment.
2. **Mapping data authoring:** Create the `data/wa-mappings.json` file linking tasks to events with alignment notes.
3. **Alignment tier handling:** Ensure aligned, partial, and gap tiers are correctly represented with appropriate notes.
4. **Validation:** Script that validates both JSON files against Zod schemas and reports results.
5. **Metadata capture:** Citizen-only footnote and other contextual notes preserved in mapping data.

### Expected story boundaries
- Task data and mapping data could be separate stories or combined (feature is M effort, so 2-4 stories).
- Validation is a distinct story with clear acceptance criteria (all 17 tasks pass, schema errors reported).
- The three alignment tiers should have explicit acceptance criteria in every story that touches data content.

### Areas needing careful story framing
- The `eventIds` format decision (names vs generated IDs) must be resolved before implementation. Stories should specify which format is used.
- Acceptance criteria for partial alignment notes should require specific, descriptive text — not just "non-empty string". Each partial task's notes should explain the specific granularity gap.
- The citizen-only footnote must appear in tasks 9-12 mapping notes. Cass should write acceptance criteria that verify this metadata is present and accurate.
- Task context assignments (Section 4 table) should be explicitly listed in acceptance criteria so reviewers can verify correctness.

---

## 12. Change Log (Feature-Level)
| Date | Change | Reason | Raised By |
|-----|------|--------|-----------|
| 2026-03-27 | Initial feature specification created | Feature pipeline kickoff for WA ingestion layer | Alex (System Spec Agent) |
