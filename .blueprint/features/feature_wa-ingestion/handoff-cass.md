## Handoff Summary
**For:** Nigel
**Feature:** wa-ingestion

### Key Decisions
- Split into 3 stories: task data authoring, mapping data authoring, validation script
- ACs for task data explicitly list all alignment tier assignments (7/9/1) and all task context groupings by task number
- ACs for mappings require specific explanatory text in alignmentNotes for partial/gap tasks, not just "non-empty"
- Citizen-only footnote (tasks 9-12) has a dedicated AC to ensure it is not overlooked
- Validation story includes referential integrity check (waTaskId cross-reference) beyond pure schema validation

### Files Created
- .blueprint/features/feature_wa-ingestion/story-wa-task-data.md
- .blueprint/features/feature_wa-ingestion/story-wa-mapping-data.md
- .blueprint/features/feature_wa-ingestion/story-wa-validation.md

### Open Questions
- Event ID format (names vs generated IDs) -- spec recommends names; stories are written assuming names. Needs final confirmation.
- Task context assignments (Section 4 of feature spec) are inferred from R1A descriptions and may need business team validation.

### Critical Context
This feature is pure data authoring -- no UI, no routes, no state transitions. All 3 stories produce static artifacts (2 JSON files + 1 validation script). Tests should verify data content against the R1A analysis table and schema conformance. The R1A analysis at `.business_context/R1A_WA_Tasks_vs_Event_Model_Analysis.md` is the authoritative source for expected values. Schemas are in `src/data-model/schemas.ts`, enums in `src/data-model/enums.ts`.
